"""Atomic eligibility, credit-locking, refund, and 4-digit Gmail OTP engine."""

from datetime import timedelta
import secrets

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.db.models import F
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import APIException

from .models import EmailOTP, UserActivityLog, log_user_activity

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


def issue_and_send_email_otp(email: str) -> None:
    """Generates a cryptographically secure 4-digit OTP, stores its hash, and emails it."""
    code = f"{secrets.randbelow(9000) + 1000}"
    EmailOTP.objects.update_or_create(
        email=email,
        defaults={
            "otp_hash": make_password(code),
            "expires_at": timezone.now() + timedelta(minutes=5),
            "attempts": 0,
        },
    )

    subject = "Your Bandora IELTS 4-Digit Verification Code"
    text_body = (
        f"Your Bandora verification code is: {code}\n\n"
        "This code expires in 5 minutes. If you did not request this, ignore this email."
    )
    html_body = (
        "<div style='font-family:sans-serif;max-width:420px;margin:0 auto;padding:24px;"
        "border:1px solid #e6e1d6;border-radius:16px;background:#faf8f4;'>"
        "<h2 style='color:#113b30;margin:0 0 8px;'>Verify your Bandora account</h2>"
        "<p style='color:#5e6b66;font-size:14px;margin:0 0 20px;'>"
        "Enter this 4-digit code to unlock your IELTS practice tests and lessons:</p>"
        f"<div style='font-size:32px;font-weight:700;letter-spacing:10px;color:#113b30;"
        f"background:#ffffff;border:1px solid #e6e1d6;border-radius:12px;padding:14px;"
        f"text-align:center;'>{code}</div>"
        "<p style='color:#5e6b66;font-size:12px;margin:16px 0 0;'>Expires in 5 minutes.</p>"
        "</div>"
    )
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send(fail_silently=False)
