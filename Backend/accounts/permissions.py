"""Object-level ownership, AI credit/plan permissions, and tiered rate throttles."""

from rest_framework.permissions import BasePermission
from rest_framework.throttling import SimpleRateThrottle, UserRateThrottle


class IsOwnerOnly(BasePermission):
    """Strict IDOR protection: only the resource owner may access or modify it."""

    message = "You do not have permission to access this resource."

    def has_object_permission(self, request, view, obj) -> bool:
        return getattr(obj, "user_id", None) == getattr(request.user, "id", None)


class HasAICreditsOrProPlan(BasePermission):
    """Verifies active account + active PRO subscription (not expired) or remaining AI credits."""

    message = "Insufficient AI credits or expired Pro plan."

    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(user and user.is_authenticated and user.has_ai_access())


class AuthIPRateThrottle(SimpleRateThrottle):
    """Brute-force protection on auth endpoints (10/minute per IP)."""

    scope = "auth_burst"

    def get_cache_key(self, request, view):
        return self.cache_format % {
            "scope": self.scope,
            "ident": self.get_ident(request),
        }


class AIMinuteThrottle(UserRateThrottle):
    scope = "ai_eval_min"


class AIHourThrottle(UserRateThrottle):
    scope = "ai_eval_hour"
