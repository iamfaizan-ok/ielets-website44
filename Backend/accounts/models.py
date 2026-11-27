"""Accounts models: custom User, plan tiers, AI credits, and activity audit log."""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class PlanTier(models.TextChoices):
        FREE = "FREE", "Free"
        PRO = "PRO", "Pro"

    email = models.EmailField(unique=True)
    supabase_uid = models.CharField(
        max_length=64, unique=True, null=True, blank=True, db_index=True
    )
    plan_tier = models.CharField(
        max_length=10, choices=PlanTier.choices, default=PlanTier.FREE
    )
    ai_credits = models.PositiveIntegerField(default=3)
    target_band = models.DecimalField(max_digits=2, decimal_places=1, default=7.5)
    is_verified = models.BooleanField(default=False)

    def has_ai_access(self) -> bool:
        return self.plan_tier == self.PlanTier.PRO or self.ai_credits > 0

    def __str__(self) -> str:
        return f"{self.username} ({self.plan_tier})"


class UserActivityLog(models.Model):
    class Action(models.TextChoices):
        REGISTER = "REGISTER", "Register"
        LOGIN = "LOGIN", "Login"
        SUBMIT_TEST = "SUBMIT_TEST", "Submit Test"
        CREDIT_DEDUCTED = "CREDIT_DEDUCTED", "AI Credit Deducted"
        PLAN_UPGRADED = "PLAN_UPGRADED", "Plan Upgraded"

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="activity_logs"
    )
    action = models.CharField(max_length=32, choices=Action.choices)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "-created_at"])]

    def __str__(self) -> str:
        return f"{self.user_id} · {self.action} @ {self.created_at:%Y-%m-%d %H:%M}"


def get_client_ip(request) -> str | None:
    if request is None:
        return None
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def log_user_activity(user: User, action: str, request=None, metadata: dict | None = None) -> None:
    UserActivityLog.objects.create(
        user=user,
        action=action,
        ip_address=get_client_ip(request),
        metadata=metadata or {},
    )
