"""Celery background tasks for async AI evaluations with automatic credit refund on failure."""

from decimal import Decimal

from celery import shared_task

from accounts.models import UserActivityLog, log_user_activity
from accounts.services import refund_ai_credit
from exams.services import fetch_r2_object_bytes

from .models import TestAttempt
from .services import evaluate_speaking_with_gemini, evaluate_writing_with_openai


def _handle_ai_failure(attempt: TestAttempt, exc: Exception, deducted_credit: bool) -> None:
    attempt.status = TestAttempt.Status.FAILED
    attempt.ai_feedback = {"error": "AI evaluation failed. Any deducted credit has been refunded."}
    attempt.save(update_fields=["status", "ai_feedback"])
    if deducted_credit:
        refund_ai_credit(attempt.user_id, {"attempt_id": attempt.id, "reason": str(exc)[:200]})
    log_user_activity(
        attempt.user,
        UserActivityLog.Action.AI_EVAL_FAILED,
        None,
        {"attempt_id": attempt.id, "module": attempt.module, "error": str(exc)[:200]},
    )


@shared_task(bind=True, max_retries=0)
def process_writing_evaluation(self, attempt_id: int, deducted_credit: bool) -> None:
    attempt = TestAttempt.objects.select_related("test", "user").get(pk=attempt_id)
    try:
        t1 = attempt.user_answers.get("task1", "")
        t2 = attempt.user_answers.get("task2", "")
        result = evaluate_writing_with_openai(attempt.test.content, t1, t2)

        attempt.status = TestAttempt.Status.COMPLETED
        attempt.band_score = Decimal(f"{round(result['band_score'] * 2) / 2:.1f}")
        attempt.criteria_scores = {
            "task_achievement": result["task_achievement"],
            "coherence_cohesion": result["coherence_cohesion"],
            "lexical_resource": result["lexical_resource"],
            "grammatical_range": result["grammatical_range"],
        }
        attempt.ai_feedback = {
            "sentence_corrections": result["sentence_corrections"],
            "upgraded_vocabulary": result["upgraded_vocabulary"],
            "model_sample_band_8_5": result["model_sample_band_8_5"],
            "summary": result["summary"],
        }
        attempt.save(update_fields=["status", "band_score", "criteria_scores", "ai_feedback"])
    except Exception as exc:
        _handle_ai_failure(attempt, exc, deducted_credit)


@shared_task(bind=True, max_retries=0)
def process_speaking_evaluation(
    self, attempt_id: int, audio_key: str, mime_type: str, deducted_credit: bool
) -> None:
    attempt = TestAttempt.objects.select_related("test", "user").get(pk=attempt_id)
    try:
        audio_bytes = fetch_r2_object_bytes(audio_key)
        result = evaluate_speaking_with_gemini(attempt.test.content, audio_bytes, mime_type)

        attempt.status = TestAttempt.Status.COMPLETED
        attempt.user_answers = {"transcript": result.get("transcript", ""), "audio_key": audio_key}
        attempt.band_score = Decimal(f"{round(result['band_score'] * 2) / 2:.1f}")
        attempt.criteria_scores = {
            "fluency_coherence": result["fluency_coherence"],
            "lexical_resource": result["lexical_resource"],
            "grammatical_range": result["grammatical_range"],
            "pronunciation": result["pronunciation"],
        }
        attempt.ai_feedback = {
            "sentence_corrections": result["sentence_corrections"],
            "upgraded_vocabulary": result["upgraded_vocabulary"],
            "model_sample_band_8_5": result["model_sample_band_8_5"],
            "summary": result["summary"],
        }
        attempt.save(
            update_fields=["status", "user_answers", "band_score", "criteria_scores", "ai_feedback"]
        )
    except Exception as exc:
        _handle_ai_failure(attempt, exc, deducted_credit)
