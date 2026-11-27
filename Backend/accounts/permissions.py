"""Object-level ownership and AI credit/plan permissions."""

from rest_framework.permissions import BasePermission


class IsOwnerOnly(BasePermission):
    """Strict IDOR protection: only the resource owner may access or modify it."""

    message = "You do not have permission to access this resource."

    def has_object_permission(self, request, view, obj) -> bool:
        return getattr(obj, "user_id", None) == getattr(request.user, "id", None)


class HasAICreditsOrProPlan(BasePermission):
    """Requires PRO plan or at least 1 remaining AI credit."""

    message = "Insufficient AI credits. Upgrade to Pro or add credits to continue."

    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(user and user.is_authenticated and user.has_ai_access())
