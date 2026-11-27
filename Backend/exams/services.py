"""Cloudflare R2 S3-compatible media storage service."""

from datetime import datetime, timedelta, timezone
import uuid

import boto3
from botocore.config import Config
from django.conf import settings


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
    """Uploads heavy media (MP3/images/speaking audio) to Cloudflare R2 and returns (key, url)."""
    client = get_r2_client()
    key = f"{folder.strip('/')}/{uuid.uuid4().hex}.{extension.lstrip('.')}"
    extra_args: dict = {"ContentType": content_type}
    if expire_days:
        expires_at = datetime.now(timezone.utc) + timedelta(days=expire_days)
        extra_args["Metadata"] = {"retention-days": str(expire_days)}
        extra_args["Expires"] = expires_at

    client.put_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=key,
        Body=file_bytes,
        **extra_args,
    )

    base = settings.R2_PUBLIC_BASE_URL.rstrip("/")
    url = f"{base}/{key}" if base else key
    return key, url
