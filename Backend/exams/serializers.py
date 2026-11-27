"""Anti-cheat serializers: never expose correct_answer or explanation during test delivery."""

from rest_framework import serializers

from .models import IELTSTest, Question


class QuestionTakeSerializer(serializers.ModelSerializer):
    """Public test-taking question payload (strictly omits answers & explanations)."""

    class Meta:
        model = Question
        fields = ("id", "order", "question_type", "prompt", "options")


class IELTSTestTakeSerializer(serializers.ModelSerializer):
    questions = QuestionTakeSerializer(many=True, read_only=True)

    class Meta:
        model = IELTSTest
        fields = (
            "id",
            "module",
            "title",
            "book_series",
            "category",
            "content",
            "media_url",
            "questions",
        )


class IELTSTestSummarySerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(source="questions.count", read_only=True)

    class Meta:
        model = IELTSTest
        fields = ("id", "module", "title", "book_series", "category", "question_count", "created_at")
