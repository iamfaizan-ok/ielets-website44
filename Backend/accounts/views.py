"""API views for accounts: OTP signup, email/username login, Google OAuth 2.0 PKCE, password reset."""

import base64
import hashlib
import secrets
from urllib.parse import urlencode

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import update_last_login
from django.contrib.auth.password_validation import validate_password
from django.core.cache import cache
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
import requests as http_requests
from rest_framework import generics, serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .models import EmailOTP, UserActivityLog, log_user_activity
from .permissions import AuthIPRateThrottle
from .serializers import RegisterSerializer, UserActivityLogSerializer, UserProfileSerializer
from .services import issue_and_send_email_otp

User = get_user_model()
OTP_MAX_ATTEMPTS = 5
OTP_RESEND_COOLDOWN_SECONDS = 60
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_ISSUERS = {"accounts.google.com", "https://accounts.google.com"}


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.RegexField(regex=r"^\d{4}$")


class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.RegexField(regex=r"^\d{4}$")
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)


class GoogleCallbackSerializer(serializers.Serializer):
    code = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    error = serializers.CharField(required=False, allow_blank=True)


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
            confirm = request.data.get("confirm_password")
            if confirm is not None and confirm != password:
                return Response(
                    {"confirm_password": ["Passwords do not match."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            try:
                validate_password(password, existing)
            except DjangoValidationError as exc:
                return Response({"password": list(exc.messages)}, status=status.HTTP_400_BAD_REQUEST)
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
            {"email": user.email, "message": "4-digit verification code sent to your Gmail."},
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
        update_last_login(None, user)
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
    permission_classes = [AllowAny]
    throttle_classes = [AuthIPRateThrottle]

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "Account not found."}, status=status.HTTP_404_NOT_FOUND)
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


class AuditedTokenObtainPairView(APIView):
    """Secure login supporting email or username via Django authenticate() + rate limiting."""

    permission_classes = [AllowAny]
    throttle_classes = [AuthIPRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = str(serializer.validated_data.get("email", "")).strip().lower()
        username = str(serializer.validated_data.get("username", "")).strip()
        password = serializer.validated_data["password"]

        lookup_user = (
            User.objects.filter(email=email).first()
            if email
            else User.objects.filter(username=username).first()
        )
        auth_username = lookup_user.username if lookup_user else (username or email)
        user = authenticate(request=request, username=auth_username, password=password)

        if user is None:
            # Generic message prevents account enumeration; also rejects inactive users
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_verified:
            return Response(
                {
                    "detail": "Email not verified. Please verify your 4-digit code.",
                    "needs_verification": True,
                    "email": user.email,
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        update_last_login(None, user)
        log_user_activity(user, UserActivityLog.Action.LOGIN, request)
        refresh = RefreshToken.for_user(user)
        return Response(
            {"access": str(refresh.access_token), "refresh": str(refresh)},
            status=status.HTTP_200_OK,
        )


class PasswordResetRequestView(APIView):
    """Anti-enumeration password reset: always returns generic 200 OK."""

    permission_classes = [AllowAny]
    throttle_classes = [AuthIPRateThrottle]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        user = User.objects.filter(email=email, is_active=True).first()
        if user:
            issue_and_send_email_otp(email)
        return Response(
            {"detail": "If an account exists for this email, a 4-digit reset code has been sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthIPRateThrottle]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()
        otp = serializer.validated_data["otp"]
        password = serializer.validated_data["password"]
        confirm = serializer.validated_data["confirm_password"]

        if password != confirm:
            return Response(
                {"confirm_password": ["Passwords do not match."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        record = EmailOTP.objects.filter(email=email).first()
        if not record or record.attempts >= OTP_MAX_ATTEMPTS or timezone.now() > record.expires_at:
            if record:
                record.delete()
            return Response(
                {"detail": "Reset code expired or too many attempts."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not check_password(otp, record.otp_hash):
            record.attempts += 1
            record.save(update_fields=["attempts"])
            return Response({"detail": "Invalid reset code."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email, is_active=True).first()
        if not user:
            return Response({"detail": "Invalid reset request."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password, user)
        except DjangoValidationError as exc:
            return Response({"password": list(exc.messages)}, status=status.HTTP_400_BAD_REQUEST)

        record.delete()
        user.set_password(password)
        user.save(update_fields=["password"])
        log_user_activity(user, UserActivityLog.Action.PASSWORD_RESET, request)
        return Response({"detail": "Password reset successful. Please log in."}, status=status.HTTP_200_OK)


class GoogleAuthInitView(APIView):
    """Generates OAuth 2.0 Authorization URL with CSRF state and PKCE S256 challenge."""

    permission_classes = [AllowAny]
    throttle_classes = [AuthIPRateThrottle]

    def get(self, _request):
        if not settings.GOOGLE_OAUTH_CLIENT_ID:
            return Response(
                {"detail": "Google OAuth is not configured on the server."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        state = secrets.token_urlsafe(32)
        code_verifier = secrets.token_urlsafe(48)
        digest = hashlib.sha256(code_verifier.encode("ascii")).digest()
        code_challenge = base64.urlsafe_b64encode(digest).decode("ascii").rstrip("=")

        cache.set(f"google_oauth_state:{state}", code_verifier, timeout=300)
        params = {
            "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
            "redirect_uri": settings.GOOGLE_OAUTH_REDIRECT_URI,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
            "access_type": "offline",
            "prompt": "select_account",
        }
        return Response({"auth_url": f"{GOOGLE_AUTH_URL}?{urlencode(params)}"})


class GoogleAuthCallbackView(APIView):
    """Validates state + PKCE code exchange + Google ID token signature, iss, aud, exp, and email_verified."""

    permission_classes = [AllowAny]
    throttle_classes = [AuthIPRateThrottle]

    def post(self, request):
        serializer = GoogleCallbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        oauth_error = serializer.validated_data.get("error")
        if oauth_error:
            return Response(
                {"detail": "Google sign-in was cancelled or denied."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        code = serializer.validated_data.get("code", "")
        state = serializer.validated_data.get("state", "")
        code_verifier = cache.get(f"google_oauth_state:{state}") if state else None
        if not code or not code_verifier:
            return Response(
                {"detail": "Invalid or expired OAuth state."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        cache.delete(f"google_oauth_state:{state}")

        try:
            token_res = http_requests.post(
                GOOGLE_TOKEN_URL,
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_OAUTH_REDIRECT_URI,
                    "grant_type": "authorization_code",
                    "code_verifier": code_verifier,
                },
                timeout=10,
            )
            token_data = token_res.json()
            raw_id_token = token_data.get("id_token")
            if not token_res.ok or not raw_id_token:
                return Response(
                    {"detail": "Failed to exchange Google authorization code."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            id_info = google_id_token.verify_oauth2_token(
                raw_id_token,
                google_requests.Request(),
                settings.GOOGLE_OAUTH_CLIENT_ID,
            )
        except Exception:
            return Response(
                {"detail": "Invalid or expired Google ID token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if id_info.get("iss") not in GOOGLE_ISSUERS or not id_info.get("email_verified"):
            return Response(
                {"detail": "Google email is not verified."},
                status=status.HTTP_403_FORBIDDEN,
            )

        google_sub = id_info["sub"]
        email = id_info["email"].strip().lower()
        first_name = id_info.get("given_name", "")[:150]
        last_name = id_info.get("family_name", "")[:150]

        user = User.objects.filter(google_sub=google_sub).first()
        if user is None:
            # Link only to existing account with verified email; never store Google password
            user = User.objects.filter(email=email).first()
            if user is not None:
                if not user.is_verified:
                    user.is_verified = True
                user.google_sub = google_sub
                user.save(update_fields=["google_sub", "is_verified"])
            else:
                base = email.split("@")[0][:120]
                username = base
                idx = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base}_{idx}"
                    idx += 1
                user = User(
                    username=username,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    google_sub=google_sub,
                    is_verified=True,
                    is_active=True,
                )
                user.set_unusable_password()
                user.save()

        if not user.is_active:
            return Response({"detail": "Account is disabled."}, status=status.HTTP_403_FORBIDDEN)

        update_last_login(None, user)
        log_user_activity(user, UserActivityLog.Action.GOOGLE_AUTH, request)
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserProfileSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
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
    "PasswordResetRequestView",
    "PasswordResetConfirmView",
    "GoogleAuthInitView",
    "GoogleAuthCallbackView",
    "TokenRefreshView",
    "LogoutView",
    "ProfileView",
    "ActivityLogListView",
]
