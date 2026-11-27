"""URL routing for accounts app."""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ActivityLogListView,
    AuditedTokenObtainPairView,
    LogoutView,
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
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("me/", ProfileView.as_view(), name="profile"),
    path("activity/", ActivityLogListView.as_view(), name="activity"),
]
