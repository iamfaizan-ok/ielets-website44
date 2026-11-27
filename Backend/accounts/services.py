"""Atomic eligibility, credit-locking, and refund engine."""

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import F
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import APIException

from .models import UserActivityLog, log_user_activity

User = get_user_model()
PRO_DAILY_FAIR_USE_CAP = 50


class PaymentRequiredException(APIException):
    status_code = status.HTTP_402_PAYMENT_REQUIRED
    default_detail = "Insufficient AI credits. Upgrade to Pro or add credits to continue."
    default_code = "payment_required"


def verify_and_deduct_ai_credit(user, request=None, metadata: dict | None = None) -> bool:
    """
    Atomically locks the user row (SELECT FOR UPDATE) to prevent concurrent credit race conditions.
    Returns True if an AI credit was deducted (FREE user), False if covered by active PRO plan.
    """
    today = timezone.now().date()

    with transaction.atomic():
        locked = User.objects.select_for_update().get(pk=user.pk)
        if not locked.is_active:
            raise PermissionError("Account is suspended.")

        # Reset daily fair-use counter on new UTC day
        if locked.daily_ai_reset_date != today:
            locked.daily_ai_count = 0
            locked.daily_ai_reset_date = today
            locked.save(update_fields=["daily_ai_count", "daily_ai_reset_date"])

        if locked.has_active_pro():
            if locked.daily_ai_count >= PRO_DAILY_FAIR_USE_CAP:
                raise PaymentRequiredException("Daily fair-use AI evaluation cap reached.")
            locked.daily_ai_count = F("daily_ai_count") + 1
            locked.save(update_fields=["daily_ai_count"])
            return False

        if locked.ai_credits <= 0:
            raise PaymentRequiredException()

        locked.ai_credits = F("ai_credits") - 1
        locked.daily_ai_count = F("daily_ai_count") + 1
        locked.save(update_fields=["ai_credits", "daily_ai_count"])

    user.refresh_from_db(fields=["ai_credits", "daily_ai_count"])
    log_user_activity(user, UserActivityLog.Action.CREDIT_DEDUCTED, request, metadata)
    return True


def refund_ai_credit(user_id: int, metadata: dict | None = None) -> None:
    """Atomically refunds 1 AI credit when an upstream AI evaluation fails."""
    with transaction.atomic():
        locked = User.objects.select_for_update().get(pk=user_id)
        if not locked.has_active_pro():
            locked.ai_credits = F("ai_credits") + 1
            locked.save(update_fields=["ai_credits"])
            log_user_activity(locked, UserActivityLog.Action.CREDIT_REFUNDED, None, metadata)
