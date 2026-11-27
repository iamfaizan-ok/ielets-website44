"""Serializers for objective, writing, speaking submissions and user attempt history."""

from rest_framework import serializers

from exams.services import ALLOWED_UPLOAD_MIME_EXT

from .models import TestAttempt
from .services import sanitize_essay_text


class ObjectiveSubmitSerializer(serializers.Serializer):
    test_id = serializers.IntegerField(min_value=1)
    answers = serializers.DictField(child=serializers.CharField(allow_blank=True, max_length=255))


class ExplainAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField(min_value=1)
    user_answer = serializers.CharField(allow_blank=True, required=False, default="", max_length=255)


class WritingSubmitSerializer(serializers.Serializer):
    test_id = serializers.IntegerField(min_value=1)
    task1_response = serializers.CharField(allow_blank=True, required=False, default="")
    task2_response = serializers.CharField(min_length=20)

    def validate_task1_response(self, value: str) -> str:
        if not value.strip():
            return ""
        try:
            return sanitize_essay_text(value)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc)) from exc

    def validate_task2_response(self, value: str) -> str:
        try:
            return sanitize_essay_text(value)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc)) from exc


class SpeakingSubmitSerializer(serializers.Serializer):
    test_id = serializers.IntegerField(min_value=1)
    speaking_audio_key = serializers.CharField(max_length=512)
    mime_type = serializers.ChoiceField(
        choices=list(ALLOWED_UPLOAD_MIME_EXT.keys()), default="audio/webm"
    )


class TestAttemptListSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source="test.title", read_only=True)

    class Meta:
        model = TestAttempt
        fields = ("id", "test_id", "test_title", "module", "status", "band_score", "created_at")


class TestAttemptDetailSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source="test.title", read_only=True)

    class Meta:
        model = TestAttempt
        fields = (
            "id",
            "test_id",
            "test_title",
            "module",
            "status",
            "task_id",
            "user_answers",
            "speaking_audio_url",
            "band_score",
            "criteria_scores",
            "ai_feedback",
            "created_at",
        )
