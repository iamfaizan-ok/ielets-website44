"""Serializers for objective, writing, speaking submissions and user attempt history."""

from rest_framework import serializers

from .models import TestAttempt

ALLOWED_AUDIO_TYPES = {"audio/mpeg", "audio/mp3", "audio/wav", "audio/webm", "audio/mp4", "audio/ogg"}
MAX_AUDIO_BYTES = 15 * 1024 * 1024  # 15 MB


class ObjectiveSubmitSerializer(serializers.Serializer):
    test_id = serializers.IntegerField(min_value=1)
    answers = serializers.DictField(child=serializers.CharField(allow_blank=True))


class ExplainAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField(min_value=1)
    user_answer = serializers.CharField(allow_blank=True, required=False, default="")


class WritingSubmitSerializer(serializers.Serializer):
    test_id = serializers.IntegerField(min_value=1)
    task1_response = serializers.CharField(allow_blank=True, required=False, default="")
    task2_response = serializers.CharField(min_length=20)


class SpeakingSubmitSerializer(serializers.Serializer):
    test_id = serializers.IntegerField(min_value=1)
    audio = serializers.FileField()

    def validate_audio(self, file_obj):
        if file_obj.size > MAX_AUDIO_BYTES:
            raise serializers.ValidationError("Audio file exceeds 15 MB limit.")
        content_type = getattr(file_obj, "content_type", "")
        if content_type and content_type not in ALLOWED_AUDIO_TYPES:
            raise serializers.ValidationError("Unsupported audio format.")
        return file_obj


class TestAttemptListSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source="test.title", read_only=True)

    class Meta:
        model = TestAttempt
        fields = ("id", "test_id", "test_title", "module", "band_score", "created_at")


class TestAttemptDetailSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source="test.title", read_only=True)

    class Meta:
        model = TestAttempt
        fields = (
            "id",
            "test_id",
            "test_title",
            "module",
            "user_answers",
            "speaking_audio_url",
            "band_score",
            "criteria_scores",
            "ai_feedback",
            "created_at",
        )
