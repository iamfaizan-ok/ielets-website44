"""API views for accounts: OTP signup, OTP verification, resend, JWT login/logout, and audit logs."""

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.core.cache import cache
from django.utils import timezone
from rest_framework import generics, serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import EmailOTP, UserActivityLog, log_user_activity
from .permissions import AuthIPRateThrottle
from .serializers import RegisterSerializer, UserActivityLogSerializer, UserProfileSerializer
from .services import issue_and_send_email_otp

User = get_user_model()
OTP_MAX_ATTEMPTS = 5
OTP_RESEND_COOLDOWN_SECONDS = 60


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.RegexField(regex=r"^\d{4}$")


class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()


class SignupView(APIView):
    """Registers an unverified user (or refreshes unverified account) and emails a 4-digit OTP."""

    permission_classes = [AllowAny]
    throttle_classes = [AuthIPRateThrottle]

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        existing = User.objects.filter(email=email).first() if email else None

        if existing and existing.is_verified:
            return Response(
                {"detail": "Email already registered. Please log in."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if existing and not existing.is_verified:
            password = str(request.data.get("password", ""))
            if len(password) < 8:
                return Response(
                    {"detail": "Password must be at least 8 characters."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            existing.first_name = str(request.data.get("first_name", existing.first_name))
            existing.last_name = str(request.data.get("last_name", existing.last_name))
            existing.set_password(password)
            existing.save(update_fields=["first_name", "last_name", "password"])
            user = existing
        else:
            serializer = RegisterSerializer(data={**request.data, "email": email})
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

        issue_and_send_email_otp(user.email)
        log_user_activity(user, UserActivityLog.Action.REGISTER, request)
        return Response(
            {
                "email": user.email,
                "message": "4-digit verification code sent to your Gmail.",
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyOTPView(APIView):
    """Verifies the 4-digit OTP hash, marks user verified, and issues JWT tokens."""

    permission_classes = [AllowAny]
    throttle_classes = [AuthIPRateThrottle]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()
        submitted_otp = serializer.validated_data["otp"]

        record = EmailOTP.objects.filter(email=email).first()
        if not record or record.attempts >= OTP_MAX_ATTEMPTS or timezone.now() > record.expires_at:
            if record:
                record.delete()
            return Response(
                {
                    "valid": False,
                    "message": "Code expired or too many attempts. Please request a new code.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not check_password(submitted_otp, record.otp_hash):
            record.attempts += 1
            record.save(update_fields=["attempts"])
            return Response(
                {
                    "valid": False,
                    "message": "Invalid 4-digit code. Please check your Gmail and try again.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {"valid": False, "message": "Account not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        record.delete()
        user.is_verified = True
        user.is_active = True
        user.save(update_fields=["is_verified", "is_active"])
        log_user_activity(user, UserActivityLog.Action.EMAIL_VERIFIED, request)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "valid": True,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserProfileSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


class ResendOTPView(APIView):
    """Resends a fresh 4-digit OTP with a 60-second cooldown per email."""

    permission_classes = [AllowAny]
    throttle_classes = [AuthIPRateThrottle]

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()

        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {"detail": "Account not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        if user.is_verified:
            return Response(
                {"detail": "Email is already verified. Please log in."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cooldown_key = f"otp_cooldown:{email}"
        if cache.get(cooldown_key):
            return Response(
                {"detail": "Please wait 60 seconds before requesting another code."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        issue_and_send_email_otp(email)
        cache.set(cooldown_key, 1, timeout=OTP_RESEND_COOLDOWN_SECONDS)
        return Response(
            {"email": email, "message": "A new 4-digit code has been sent to your Gmail."},
            status=status.HTTP_200_OK,
        )


class AuditedTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [AuthIPRateThrottle]

    def post(self, request, *args, **kwargs):
        username = str(request.data.get("username", "")).strip()
        user = User.objects.filter(username=username).first()
        if user and not user.is_verified:
            return Response(
                {
                    "detail": "Email not verified. Please verify your 4-digit code.",
                    "needs_verification": True,
                    "email": user.email,
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        response = super().post(request, *args, **kwargs)
        if response.status_code == 200 and user:
            log_user_activity(user, UserActivityLog.Action.LOGIN, request)
        return response


class LogoutView(APIView):
    """Blacklists the refresh token on logout to prevent token replay."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh = request.data.get("refresh")
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except TokenError:
                return Response(
                    {"detail": "Invalid refresh token."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        log_user_activity(request.user, UserActivityLog.Action.LOGOUT, request)
        return Response({"detail": "Logged out."}, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ActivityLogListView(generics.ListAPIView):
    serializer_class = UserActivityLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserActivityLog.objects.filter(user=self.request.user)


__all__ = [
    "SignupView",
    "VerifyOTPView",
    "ResendOTPView",
    "AuditedTokenObtainPairView",
    "TokenRefreshView",
    "LogoutView",
    "ProfileView",
    "ActivityLogListView",
]
