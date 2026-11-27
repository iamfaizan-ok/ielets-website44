"""URL routing for accounts app."""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ActivityLogListView,
    AuditedTokenObtainPairView,
    GoogleAuthCallbackView,
    GoogleAuthInitView,
    LogoutView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    ProfileView,
    ResendOTPView,
    SignupView,
    VerifyOTPView,
)

app_name = "accounts"

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("register/", SignupView.as_view(), name="register"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("resend-otp/", ResendOTPView.as_view(), name="resend-otp"),
    path("login/", AuditedTokenObtainPairView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path("password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("google/url/", GoogleAuthInitView.as_view(), name="google-url"),
    path("google/callback/", GoogleAuthCallbackView.as_view(), name="google-callback"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("me/", ProfileView.as_view(), name="profile"),
    path("activity/", ActivityLogListView.as_view(), name="activity"),
]
