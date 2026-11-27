"""Serializers for user registration, login, password reset, profile, and activity logs."""

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import UserActivityLog

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=False)
    username = serializers.CharField(required=False, allow_blank=True, max_length=150)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
            "target_band",
        )
        read_only_fields = ("id",)

    def validate_email(self, value: str) -> str:
        return value.strip().lower()

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value

    def validate(self, attrs: dict) -> dict:
        confirm = attrs.pop("confirm_password", None)
        if confirm is not None and confirm != attrs.get("password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        email = attrs.get("email", "")
        raw_username = (attrs.get("username") or "").strip()
        if not raw_username and email:
            base = email.split("@")[0][:120]
            candidate = base
            idx = 1
            while User.objects.filter(username=candidate).exists():
                candidate = f"{base}_{idx}"
                idx += 1
            attrs["username"] = candidate
        elif User.objects.filter(username=raw_username).exists():
            raise serializers.ValidationError({"username": "A user with that username already exists."})
        else:
            attrs["username"] = raw_username
        return attrs

    def create(self, validated_data: dict) -> User:
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "plan_tier",
            "ai_credits",
            "target_band",
            "is_verified",
            "date_joined",
        )
        read_only_fields = (
            "id",
            "username",
            "email",
            "plan_tier",
            "ai_credits",
            "is_verified",
            "date_joined",
        )


class UserActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivityLog
        fields = ("id", "action", "ip_address", "metadata", "created_at")
