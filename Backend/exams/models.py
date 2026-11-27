"""Exams models: structured IELTS tests (PostgreSQL) + R2 media references."""

from django.db import models


class IELTSTest(models.Model):
    class Module(models.TextChoices):
        READING = "reading", "Reading"
        LISTENING = "listening", "Listening"
        WRITING = "writing", "Writing"
        SPEAKING = "speaking", "Speaking"

    class Category(models.TextChoices):
        ACADEMIC = "ACADEMIC", "Academic"
        GENERAL = "GENERAL", "General Training"

    module = models.CharField(max_length=16, choices=Module.choices, db_index=True)
    title = models.CharField(max_length=255)
    book_series = models.CharField(max_length=120, default="Bandora Original", db_index=True)
    category = models.CharField(
        max_length=16, choices=Category.choices, default=Category.ACADEMIC
    )
    # Structured text payload: passages, writing prompts, listening transcript, or speaking parts
    content = models.JSONField(default=dict)
    # Cloudflare R2 key/URL for Listening MP3 or Writing Task 1 chart image (never stores raw blobs in DB)
    media_key = models.CharField(max_length=512, blank=True, default="")
    media_url = models.URLField(max_length=1024, blank=True, default="")
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["module", "is_active"])]

    def __str__(self) -> str:
        return f"[{self.module}] {self.title}"


class Question(models.Model):
    class QuestionType(models.TextChoices):
        TFNG = "TFNG", "True / False / Not Given"
        MCQ = "MCQ", "Multiple Choice"
        FILL = "FILL", "Summary / Sentence Completion"
        MATCHING = "MATCHING", "Matching Headings / Information"

    test = models.ForeignKey(
        IELTSTest, on_delete=models.CASCADE, related_name="questions"
    )
    order = models.PositiveIntegerField(default=1)
    question_type = models.CharField(max_length=16, choices=QuestionType.choices)
    prompt = models.TextField()
    options = models.JSONField(default=list, blank=True)
    # Anti-cheat: hidden from exam delivery serializers; only revealed after submission
    correct_answer = models.CharField(max_length=255)
    explanation = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["order", "id"]
        unique_together = ("test", "order")

    def __str__(self) -> str:
        return f"Q{self.order} ({self.question_type}) · Test {self.test_id}"
