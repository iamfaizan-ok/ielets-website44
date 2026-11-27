"""Evaluations API views: async Celery AI grading, timer enforcement, IDOR-safe history & analytics."""

from collections import defaultdict

from django.conf import settings
from django.db.models import Avg
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import UserActivityLog, log_user_activity
from accounts.permissions import (
    AIHourThrottle,
    AIMinuteThrottle,
    HasAICreditsOrProPlan,
    IsOwnerOnly,
)
from accounts.services import verify_and_deduct_ai_credit
from exams.models import IELTSTest, Question
from exams.services import validate_exam_timer

from .models import TestAttempt
from .serializers import (
    ExplainAnswerSerializer,
    ObjectiveSubmitSerializer,
    SpeakingSubmitSerializer,
    TestAttemptDetailSerializer,
    TestAttemptListSerializer,
    WritingSubmitSerializer,
)
from .services import calculate_ielts_band, explain_answer_with_ai
from .tasks import process_speaking_evaluation, process_writing_evaluation


class SubmitObjectiveView(APIView):
    """Grades Reading & Listening answers against hidden DB answers with timer validation."""

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
        if not validate_exam_timer(request.user.id, test.id, test.duration_minutes):
            return Response(
                {"detail": "Exam time limit exceeded (including 2-minute grace buffer)."},
                status=status.HTTP_400_BAD_REQUEST,
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
            status=TestAttempt.Status.COMPLETED,
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
    permission_classes = [IsAuthenticated, HasAICreditsOrProPlan]
    throttle_classes = [AIMinuteThrottle, AIHourThrottle]

    def post(self, request):
        serializer = ExplainAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = get_object_or_404(
            Question.objects.select_related("test"),
            pk=serializer.validated_data["question_id"],
        )
        explanation = explain_answer_with_ai(
            question.prompt,
            question.correct_answer,
            serializer.validated_data["user_answer"],
            str(question.test.content),
        )
        return Response({"question_id": question.id, "ai_explanation": explanation})


class SubmitWritingView(APIView):
    """Atomically locks credit, validates timer, and queues async Celery Writing evaluation."""

    permission_classes = [IsAuthenticated, HasAICreditsOrProPlan]
    throttle_classes = [AIMinuteThrottle, AIHourThrottle]

    def post(self, request):
        serializer = WritingSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        test = get_object_or_404(
            IELTSTest,
            pk=serializer.validated_data["test_id"],
            module=IELTSTest.Module.WRITING,
            is_active=True,
        )
        if not validate_exam_timer(request.user.id, test.id, test.duration_minutes):
            return Response(
                {"detail": "Exam time limit exceeded (including 2-minute grace buffer)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deducted = verify_and_deduct_ai_credit(
            request.user, request, {"test_id": test.id, "module": "writing"}
        )

        attempt = TestAttempt.objects.create(
            user=request.user,
            test=test,
            module=IELTSTest.Module.WRITING,
            status=TestAttempt.Status.PROCESSING,
            user_answers={
                "task1": serializer.validated_data["task1_response"],
                "task2": serializer.validated_data["task2_response"],
            },
        )
        task = process_writing_evaluation.delay(attempt.id, deducted)
        attempt.task_id = str(task.id)
        attempt.save(update_fields=["task_id"])

        log_user_activity(
            request.user,
            UserActivityLog.Action.SUBMIT_TEST,
            request,
            {"attempt_id": attempt.id, "module": "writing", "task_id": attempt.task_id},
        )

        return Response(
            {
                "attempt_id": attempt.id,
                "task_id": attempt.task_id,
                "status": attempt.status,
                "remaining_credits": request.user.ai_credits,
            },
            status=status.HTTP_202_ACCEPTED,
        )


class SubmitSpeakingView(APIView):
    """Accepts R2 presigned audio key (user-scoped) and queues async Gemini evaluation."""

    permission_classes = [IsAuthenticated, HasAICreditsOrProPlan]
    throttle_classes = [AIMinuteThrottle, AIHourThrottle]

    def post(self, request):
        serializer = SpeakingSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        audio_key = serializer.validated_data["speaking_audio_key"]
        expected_prefix = f"speaking/{request.user.id}/"
        if not audio_key.startswith(expected_prefix):
            return Response(
                {"detail": "Invalid audio object key for current user."},
                status=status.HTTP_403_FORBIDDEN,
            )

        test = get_object_or_404(
            IELTSTest,
            pk=serializer.validated_data["test_id"],
            module=IELTSTest.Module.SPEAKING,
            is_active=True,
        )
        deducted = verify_and_deduct_ai_credit(
            request.user, request, {"test_id": test.id, "module": "speaking"}
        )

        base = settings.R2_PUBLIC_BASE_URL.rstrip("/")
        audio_url = f"{base}/{audio_key}" if base else audio_key
        attempt = TestAttempt.objects.create(
            user=request.user,
            test=test,
            module=IELTSTest.Module.SPEAKING,
            status=TestAttempt.Status.PROCESSING,
            speaking_audio_url=audio_url,
            user_answers={"audio_key": audio_key},
        )
        task = process_speaking_evaluation.delay(
            attempt.id,
            audio_key,
            serializer.validated_data["mime_type"],
            deducted,
        )
        attempt.task_id = str(task.id)
        attempt.save(update_fields=["task_id"])

        log_user_activity(
            request.user,
            UserActivityLog.Action.SUBMIT_TEST,
            request,
            {"attempt_id": attempt.id, "module": "speaking", "task_id": attempt.task_id},
        )

        return Response(
            {
                "attempt_id": attempt.id,
                "task_id": attempt.task_id,
                "status": attempt.status,
                "remaining_credits": request.user.ai_credits,
            },
            status=status.HTTP_202_ACCEPTED,
        )


class EvaluationStatusView(generics.RetrieveAPIView):
    """Lightweight polling endpoint strictly isolated to request.user (returns 404 for others)."""

    serializer_class = TestAttemptDetailSerializer
    permission_classes = [IsAuthenticated, IsOwnerOnly]

    def get_queryset(self):
        return TestAttempt.objects.filter(user=self.request.user).select_related("test")


class AttemptHistoryListView(generics.ListAPIView):
    serializer_class = TestAttemptListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = TestAttempt.objects.filter(user=self.request.user).select_related("test")
        module = self.request.query_params.get("module")
        if module:
            qs = qs.filter(module=module.lower())
        return qs


class AttemptHistoryDetailView(generics.RetrieveAPIView):
    serializer_class = TestAttemptDetailSerializer
    permission_classes = [IsAuthenticated, IsOwnerOnly]

    def get_queryset(self):
        return TestAttempt.objects.filter(user=self.request.user).select_related("test")


class UserAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = TestAttempt.objects.filter(
            user=request.user, status=TestAttempt.Status.COMPLETED
        ).order_by("created_at")
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

        totals: dict[str, dict[str, int]] = defaultdict(lambda: {"correct": 0, "total": 0})
        for a in attempts:
            for q_type, counts in a.criteria_scores.get("question_types", {}).items():
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
