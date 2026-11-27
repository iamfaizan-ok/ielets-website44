"""Cloudflare R2 presigned uploads, media helpers, Redis test caching, and exam timer checks."""

from datetime import datetime, timedelta, timezone as dt_timezone
import time
import uuid

import boto3
from botocore.config import Config
from django.conf import settings
from django.core.cache import cache

ALLOWED_UPLOAD_MIME_EXT = {
    "audio/webm": "webm",
    "audio/mp3": "mp3",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
}
MAX_UPLOAD_BYTES = 15 * 1024 * 1024  # 15 MB
EXAM_TIMER_GRACE_SECONDS = 120  # 2-minute network grace buffer


def get_r2_client():
    if not all([settings.R2_ACCOUNT_ID, settings.R2_ACCESS_KEY_ID, settings.R2_SECRET_ACCESS_KEY]):
        raise RuntimeError("Cloudflare R2 credentials are not configured.")

    return boto3.client(
        "s3",
        endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )


def upload_media_to_r2(
    file_bytes: bytes,
    folder: str,
    extension: str,
    content_type: str,
    expire_days: int | None = None,
) -> tuple[str, str]:
    """Server-side upload helper (used by seed_ai_tests TTS)."""
    client = get_r2_client()
    key = f"{folder.strip('/')}/{uuid.uuid4().hex}.{extension.lstrip('.')}"
    extra_args: dict = {"ContentType": content_type}
    if expire_days:
        extra_args["Metadata"] = {"retention-days": str(expire_days)}
        extra_args["Expires"] = datetime.now(dt_timezone.utc) + timedelta(days=expire_days)

    client.put_object(Bucket=settings.R2_BUCKET_NAME, Key=key, Body=file_bytes, **extra_args)
    base = settings.R2_PUBLIC_BASE_URL.rstrip("/")
    return key, f"{base}/{key}" if base else key


def generate_r2_presigned_upload_url(
    user_id: int, content_type: str, file_size: int
) -> dict:
    """Generates a 5-minute user-scoped R2 Presigned PUT URL for direct browser audio upload."""
    ext = ALLOWED_UPLOAD_MIME_EXT.get(content_type)
    if not ext:
        raise ValueError("Unsupported audio MIME type. Allowed: audio/webm, audio/mp3, audio/wav.")
    if file_size <= 0 or file_size > MAX_UPLOAD_BYTES:
        raise ValueError("File size must be between 1 byte and 15 MB.")

    client = get_r2_client()
    key = f"speaking/{user_id}/{uuid.uuid4().hex}.{ext}"
    upload_url = client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": settings.R2_BUCKET_NAME,
            "Key": key,
            "ContentType": content_type,
            "ContentLength": file_size,
        },
        ExpiresIn=300,
    )
    base = settings.R2_PUBLIC_BASE_URL.rstrip("/")
    return {
        "upload_url": upload_url,
        "object_key": key,
        "public_url": f"{base}/{key}" if base else key,
        "expires_in": 300,
    }


def fetch_r2_object_bytes(object_key: str) -> bytes:
    """Fetches audio bytes directly inside Celery worker without touching Django web RAM."""
    client = get_r2_client()
    obj = client.get_object(Bucket=settings.R2_BUCKET_NAME, Key=object_key)
    return obj["Body"].read()


def record_exam_start(user_id: int, test_id: int, duration_minutes: int) -> float:
    started_at = time.time()
    cache.set(
        f"exam_timer:{user_id}:{test_id}",
        started_at,
        timeout=duration_minutes * 60 + EXAM_TIMER_GRACE_SECONDS + 300,
    )
    return started_at


def validate_exam_timer(user_id: int, test_id: int, duration_minutes: int) -> bool:
    """Returns False if an active exam session exceeded duration + 2-min network grace buffer."""
    started_at = cache.get(f"exam_timer:{user_id}:{test_id}")
    if started_at is None:
        return True
    max_allowed = duration_minutes * 60 + EXAM_TIMER_GRACE_SECONDS
    return (time.time() - float(started_at)) <= max_allowed
