"""Evaluations API views: objective grading, AI writing/speaking, history, and analytics."""

from collections import defaultdict
from decimal import Decimal

from django.db.models import Avg
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from accounts.models import UserActivityLog, log_user_activity
from accounts.permissions import HasAICreditsOrProPlan, IsOwnerOnly
from exams.models import IELTSTest, Question
from exams.services import upload_media_to_r2

from .models import TestAttempt
from .serializers import (
    ExplainAnswerSerializer,
    ObjectiveSubmitSerializer,
    SpeakingSubmitSerializer,
    TestAttemptDetailSerializer,
    TestAttemptListSerializer,
    WritingSubmitSerializer,
)
from .services import (
    calculate_ielts_band,
    deduct_ai_credit,
    evaluate_speaking_with_gemini,
    evaluate_writing_with_openai,
    explain_answer_with_ai,
)


class SubmitObjectiveView(APIView):
    """Grades Reading & Listening answers against hidden DB answers."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ObjectiveSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        test = get_object_or_404(
            IELTSTest.objects.prefetch_related("questions"),
            pk=serializer.validated_data["test_id"],
            module__in=[IELTSTest.Module.READING, IELTSTest.Module.LISTENING],
            is_active=True,
        )
        questions = list(test.questions.all())
        if not questions:
            return Response(
                {"detail": "This test has no questions."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        submitted = serializer.validated_data["answers"]
        correct_count = 0
        review = []
        type_breakdown: dict[str, dict[str, int]] = defaultdict(lambda: {"correct": 0, "total": 0})

        for q in questions:
            user_ans = str(submitted.get(str(q.id), "")).strip()
            is_correct = user_ans.lower() == q.correct_answer.strip().lower()
            type_breakdown[q.question_type]["total"] += 1
            if is_correct:
                correct_count += 1
                type_breakdown[q.question_type]["correct"] += 1

            review.append(
                {
                    "question_id": q.id,
                    "order": q.order,
                    "question_type": q.question_type,
                    "user_answer": user_ans,
                    "correct_answer": q.correct_answer,
                    "is_correct": is_correct,
                    "explanation": q.explanation,
                }
            )

        band = calculate_ielts_band(correct_count, len(questions))
        attempt = TestAttempt.objects.create(
            user=request.user,
            test=test,
            module=test.module,
            user_answers=submitted,
            band_score=band,
            criteria_scores={"question_types": dict(type_breakdown)},
            ai_feedback={"review": review},
        )
        log_user_activity(
            request.user,
            UserActivityLog.Action.SUBMIT_TEST,
            request,
            {"attempt_id": attempt.id, "module": test.module, "band": str(band)},
        )

        return Response(
            {
                "attempt_id": attempt.id,
                "correct": correct_count,
                "total": len(questions),
                "band_score": str(band),
                "review": review,
            },
            status=status.HTTP_201_CREATED,
        )


class ExplainAnswerView(APIView):
    """On-demand AI explanation for a specific Reading/Listening question."""

    permission_classes = [IsAuthenticated, HasAICreditsOrProPlan]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "ai_eval"

    def post(self, request):
        serializer = ExplainAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = get_object_or_404(
            Question.objects.select_related("test"),
            pk=serializer.validated_data["question_id"],
        )
        context_text = str(question.test.content)
        explanation = explain_answer_with_ai(
            question.prompt,
            question.correct_answer,
            serializer.validated_data["user_answer"],
            context_text,
        )
        return Response({"question_id": question.id, "ai_explanation": explanation})


class SubmitWritingView(APIView):
    """Evaluates Writing Task 1 & 2 with OpenAI gpt-4o-mini Structured Outputs."""

    permission_classes = [IsAuthenticated, HasAICreditsOrProPlan]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "ai_eval"

    def post(self, request):
        serializer = WritingSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        test = get_object_or_404(
            IELTSTest,
            pk=serializer.validated_data["test_id"],
            module=IELTSTest.Module.WRITING,
            is_active=True,
        )
        t1 = serializer.validated_data["task1_response"]
        t2 = serializer.validated_data["task2_response"]

        result = evaluate_writing_with_openai(test.content, t1, t2)
        deduct_ai_credit(request.user, request, {"test_id": test.id, "module": "writing"})

        band = Decimal(f"{round(result['band_score'] * 2) / 2:.1f}")
        attempt = TestAttempt.objects.create(
            user=request.user,
            test=test,
            module=IELTSTest.Module.WRITING,
            user_answers={"task1": t1, "task2": t2},
            band_score=band,
            criteria_scores={
                "task_achievement": result["task_achievement"],
                "coherence_cohesion": result["coherence_cohesion"],
                "lexical_resource": result["lexical_resource"],
                "grammatical_range": result["grammatical_range"],
            },
            ai_feedback={
                "sentence_corrections": result["sentence_corrections"],
                "upgraded_vocabulary": result["upgraded_vocabulary"],
                "model_sample_band_8_5": result["model_sample_band_8_5"],
                "summary": result["summary"],
            },
        )
        log_user_activity(
            request.user,
            UserActivityLog.Action.SUBMIT_TEST,
            request,
            {"attempt_id": attempt.id, "module": "writing", "band": str(band)},
        )

        return Response(
            {
                **TestAttemptDetailSerializer(attempt).data,
                "remaining_credits": request.user.ai_credits,
            },
            status=status.HTTP_201_CREATED,
        )


class SubmitSpeakingView(APIView):
    """Uploads user audio to Cloudflare R2 (30-day retention) and evaluates via Gemini 2.5 Flash."""

    permission_classes = [IsAuthenticated, HasAICreditsOrProPlan]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "ai_eval"
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = SpeakingSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        test = get_object_or_404(
            IELTSTest,
            pk=serializer.validated_data["test_id"],
            module=IELTSTest.Module.SPEAKING,
            is_active=True,
        )
        audio_file = serializer.validated_data["audio"]
        audio_bytes = audio_file.read()
        ext = (audio_file.name.rsplit(".", 1)[-1] if "." in audio_file.name else "webm")[:10]
        mime_type = audio_file.content_type or "audio/webm"

        _, audio_url = upload_media_to_r2(
            audio_bytes,
            folder=f"speaking/{request.user.id}",
            extension=ext,
            content_type=mime_type,
            expire_days=30,
        )
        result = evaluate_speaking_with_gemini(test.content, audio_bytes, mime_type)
        deduct_ai_credit(request.user, request, {"test_id": test.id, "module": "speaking"})

        band = Decimal(f"{round(result['band_score'] * 2) / 2:.1f}")
        attempt = TestAttempt.objects.create(
            user=request.user,
            test=test,
            module=IELTSTest.Module.SPEAKING,
            user_answers={"transcript": result.get("transcript", "")},
            speaking_audio_url=audio_url,
            band_score=band,
            criteria_scores={
                "fluency_coherence": result["fluency_coherence"],
                "lexical_resource": result["lexical_resource"],
                "grammatical_range": result["grammatical_range"],
                "pronunciation": result["pronunciation"],
            },
            ai_feedback={
                "sentence_corrections": result["sentence_corrections"],
                "upgraded_vocabulary": result["upgraded_vocabulary"],
                "model_sample_band_8_5": result["model_sample_band_8_5"],
                "summary": result["summary"],
            },
        )
        log_user_activity(
            request.user,
            UserActivityLog.Action.SUBMIT_TEST,
            request,
            {"attempt_id": attempt.id, "module": "speaking", "band": str(band)},
        )

        return Response(
            {
                **TestAttemptDetailSerializer(attempt).data,
                "remaining_credits": request.user.ai_credits,
            },
            status=status.HTTP_201_CREATED,
        )


class AttemptHistoryListView(generics.ListAPIView):
    """Strictly returns only the authenticated user's past attempts."""

    serializer_class = TestAttemptListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = TestAttempt.objects.filter(user=self.request.user).select_related("test")
        module = self.request.query_params.get("module")
        if module:
            qs = qs.filter(module=module.lower())
        return qs


class AttemptHistoryDetailView(generics.RetrieveAPIView):
    """Enforces IsOwnerOnly + user filter to prevent IDOR."""

    serializer_class = TestAttemptDetailSerializer
    permission_classes = [IsAuthenticated, IsOwnerOnly]

    def get_queryset(self):
        return TestAttempt.objects.filter(user=self.request.user).select_related("test")


class UserAnalyticsView(APIView):
    """Personal band progression and weakest question-type analytics for request.user."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = TestAttempt.objects.filter(user=request.user).order_by("created_at")
        overall_avg = attempts.aggregate(avg=Avg("band_score"))["avg"]

        by_module = {}
        for mod in IELTSTest.Module.values:
            mod_avg = attempts.filter(module=mod).aggregate(avg=Avg("band_score"))["avg"]
            if mod_avg is not None:
                by_module[mod] = round(float(mod_avg), 1)

        progression = [
            {
                "date": a.created_at.strftime("%Y-%m-%d"),
                "module": a.module,
                "band_score": float(a.band_score),
            }
            for a in attempts[:30]
        ]

        # Detect weakest objective question type across user's attempts
        totals: dict[str, dict[str, int]] = defaultdict(lambda: {"correct": 0, "total": 0})
        for a in attempts:
            q_types = a.criteria_scores.get("question_types", {})
            for q_type, counts in q_types.items():
                totals[q_type]["correct"] += counts.get("correct", 0)
                totals[q_type]["total"] += counts.get("total", 0)

        weakest_type = None
        lowest_acc = 1.01
        for q_type, counts in totals.items():
            if counts["total"] > 0:
                acc = counts["correct"] / counts["total"]
                if acc < lowest_acc:
                    lowest_acc = acc
                    weakest_type = {"question_type": q_type, "accuracy": round(acc * 100, 1)}

        return Response(
            {
                "total_attempts": attempts.count(),
                "overall_average_band": round(float(overall_avg), 1) if overall_avg else None,
                "module_averages": by_module,
                "weakest_question_type": weakest_type,
                "progression": progression,
            }
        )
