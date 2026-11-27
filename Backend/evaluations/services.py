"""Evaluation services: band scoring, atomic credit deduction, OpenAI Writing, and Gemini Speaking."""

from decimal import Decimal
import json

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import F
from google import genai
from google.genai import types as genai_types
from openai import OpenAI
from pydantic import BaseModel, Field

from accounts.models import UserActivityLog, log_user_activity

User = get_user_model()


class WritingEvaluationSchema(BaseModel):
    band_score: float = Field(ge=0.0, le=9.0)
    task_achievement: float = Field(ge=0.0, le=9.0)
    coherence_cohesion: float = Field(ge=0.0, le=9.0)
    lexical_resource: float = Field(ge=0.0, le=9.0)
    grammatical_range: float = Field(ge=0.0, le=9.0)
    sentence_corrections: list[str]
    upgraded_vocabulary: list[str]
    model_sample_band_8_5: str
    summary: str


class SpeakingEvaluationSchema(BaseModel):
    transcript: str
    band_score: float = Field(ge=0.0, le=9.0)
    fluency_coherence: float = Field(ge=0.0, le=9.0)
    lexical_resource: float = Field(ge=0.0, le=9.0)
    grammatical_range: float = Field(ge=0.0, le=9.0)
    pronunciation: float = Field(ge=0.0, le=9.0)
    sentence_corrections: list[str]
    upgraded_vocabulary: list[str]
    model_sample_band_8_5: str
    summary: str


def calculate_ielts_band(correct: int, total: int) -> Decimal:
    """Converts raw objective accuracy into nearest 0.5 IELTS band (0.0–9.0)."""
    if total <= 0:
        return Decimal("0.0")
    ratio = correct / total
    raw_band = ratio * 9.0
    rounded = round(raw_band * 2) / 2
    return Decimal(f"{min(9.0, max(0.0, rounded)):.1f}")


def deduct_ai_credit(user, request=None, metadata: dict | None = None) -> None:
    """Atomically deducts 1 AI credit for FREE users; PRO users are unlimited."""
    if user.plan_tier == User.PlanTier.PRO:
        return

    with transaction.atomic():
        locked = User.objects.select_for_update().get(pk=user.pk)
        if locked.ai_credits <= 0:
            raise PermissionError("Insufficient AI credits.")
        locked.ai_credits = F("ai_credits") - 1
        locked.save(update_fields=["ai_credits"])

    user.refresh_from_db(fields=["ai_credits"])
    log_user_activity(user, UserActivityLog.Action.CREDIT_DEDUCTED, request, metadata)


def evaluate_writing_with_openai(prompt_payload: dict, task1_text: str, task2_text: str) -> dict:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not configured.")

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        temperature=0.1,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an official IELTS Writing Examiner. Grade strictly using IELTS "
                    "Writing Band Descriptors (0.0–9.0 in 0.5 increments). Return concise "
                    "sentence-level corrections, upgraded Band 8+ vocabulary, and a Band 8.5+ model sample."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "prompts": prompt_payload,
                        "task1_response": task1_text,
                        "task2_response": task2_text,
                    }
                ),
            },
        ],
        response_format=WritingEvaluationSchema,
    )
    parsed = completion.choices[0].message.parsed
    return parsed.model_dump()


def explain_answer_with_ai(
    question_prompt: str,
    correct_answer: str,
    user_answer: str,
    context_text: str,
) -> str:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not configured.")

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.1,
        messages=[
            {
                "role": "system",
                "content": "You are an IELTS tutor. Explain concisely in 2-3 sentences why the correct answer is right.",
            },
            {
                "role": "user",
                "content": (
                    f"Context: {context_text[:2000]}\n"
                    f"Question: {question_prompt}\n"
                    f"Student Answer: {user_answer}\n"
                    f"Correct Answer: {correct_answer}"
                ),
            },
        ],
    )
    return resp.choices[0].message.content or ""


def evaluate_speaking_with_gemini(prompts: dict, audio_bytes: bytes, mime_type: str) -> dict:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            genai_types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
            (
                "You are an official IELTS Speaking Examiner. Transcribe the candidate's audio, "
                "grade Fluency & Coherence, Lexical Resource, Grammatical Range, and Pronunciation "
                f"(0.0-9.0). Prompts: {json.dumps(prompts)}"
            ),
        ],
        config=genai_types.GenerateContentConfig(
            temperature=0.1,
            response_mime_type="application/json",
            response_schema=SpeakingEvaluationSchema,
        ),
    )
    return json.loads(response.text)
