"""Serializers for user registration, profile, and activity logs."""

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import UserActivityLog

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "password", "target_band")
        read_only_fields = ("id",)

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value

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
        # Never allow client-side tampering of plan_tier, ai_credits, or verification flags
        read_only_fields = ("id", "username", "email", "plan_tier", "ai_credits", "is_verified", "date_joined")


class UserActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivityLog
        fields = ("id", "action", "ip_address", "metadata", "created_at")
