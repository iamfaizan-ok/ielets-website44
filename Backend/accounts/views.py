"""API views for accounts: registration, JWT login, logout token blacklisting, profile, and audit logs."""

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import UserActivityLog, log_user_activity
from .permissions import AuthIPRateThrottle
from .serializers import RegisterSerializer, UserActivityLogSerializer, UserProfileSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_classes = [AuthIPRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        log_user_activity(user, UserActivityLog.Action.REGISTER, request)
        return Response(UserProfileSerializer(user).data, status=status.HTTP_201_CREATED)


class AuditedTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [AuthIPRateThrottle]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            from django.contrib.auth import get_user_model

            User = get_user_model()
            username = request.data.get("username", "")
            user = User.objects.filter(username=username).first()
            if user:
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
                return Response({"detail": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)
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
    "RegisterView",
    "AuditedTokenObtainPairView",
    "TokenRefreshView",
    "LogoutView",
    "ProfileView",
    "ActivityLogListView",
]
