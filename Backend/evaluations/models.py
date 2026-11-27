"""Evaluations models: async processing status, band scores, criteria, and AI feedback."""

from django.conf import settings
from django.db import models

from exams.models import IELTSTest


class TestAttempt(models.Model):
    class Status(models.TextChoices):
        PROCESSING = "PROCESSING", "Processing"
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="attempts",
        db_index=True,
    )
    test = models.ForeignKey(
        IELTSTest,
        on_delete=models.CASCADE,
        related_name="attempts",
    )
    module = models.CharField(max_length=16, choices=IELTSTest.Module.choices, db_index=True)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.COMPLETED, db_index=True
    )
    task_id = models.CharField(max_length=128, blank=True, default="")
    user_answers = models.JSONField(default=dict)
    speaking_audio_url = models.URLField(max_length=1024, blank=True, default="")
    band_score = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    criteria_scores = models.JSONField(default=dict, blank=True)
    ai_feedback = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["user", "module"]),
        ]

    def __str__(self) -> str:
        return f"User {self.user_id} · {self.module} · {self.status} · Band {self.band_score}"
