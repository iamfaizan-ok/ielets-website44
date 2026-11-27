"""Exams API views: Redis-cached test delivery, anti-cheat defer, and R2 presigned uploads."""

from django.core.cache import cache
from django.db.models import OuterRef, Prefetch, Subquery
from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from evaluations.models import TestAttempt

from .lessons import PROTECTED_LESSONS, PROTECTED_TEACHER_URLS
from .models import IELTSTest, Question
from .serializers import IELTSTestSummarySerializer, IELTSTestTakeSerializer
from .services import (
    ALLOWED_UPLOAD_MIME_EXT,
    MAX_UPLOAD_BYTES,
    generate_r2_presigned_upload_url,
    record_exam_start,
)


class PresignedUploadRequestSerializer(serializers.Serializer):
    content_type = serializers.ChoiceField(choices=list(ALLOWED_UPLOAD_MIME_EXT.keys()))
    file_size = serializers.IntegerField(min_value=1, max_value=MAX_UPLOAD_BYTES)


class ExamListView(generics.ListAPIView):
    serializer_class = IELTSTestSummarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = IELTSTest.objects.filter(is_active=True)
        module = self.request.query_params.get("module")
        book = self.request.query_params.get("book")
        if module:
            qs = qs.filter(module=module.lower())
        if book:
            qs = qs.filter(book_series__icontains=book)
        return qs


class NextUnattemptedExamView(APIView):
    """Returns a random unattempted test (cached payload + deferred answer keys + server timer)."""

    permission_classes = [IsAuthenticated]

    def get(self, request, module: str):
        module = module.lower()
        if module not in IELTSTest.Module.values:
            return Response(
                {"detail": f"Invalid module '{module}'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        attempted_ids = TestAttempt.objects.filter(
            user=request.user, module=module
        ).values_list("test_id", flat=True)

        safe_questions = Prefetch(
            "questions",
            queryset=Question.objects.defer("correct_answer", "explanation"),
        )

        selected = (
            IELTSTest.objects.filter(module=module, is_active=True)
            .exclude(id__in=attempted_ids)
            .prefetch_related(safe_questions)
            .order_by("?")
            .first()
        )
        if not selected:
            latest_attempt = (
                TestAttempt.objects.filter(user=request.user, test=OuterRef("pk"))
                .order_by("-created_at")
                .values("created_at")[:1]
            )
            selected = (
                IELTSTest.objects.filter(module=module, is_active=True)
                .annotate(last_attempted=Subquery(latest_attempt))
                .prefetch_related(safe_questions)
                .order_by("last_attempted")
                .first()
            )

        if not selected:
            return Response(
                {"detail": f"No active tests available for module '{module}'."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cache_key = f"exam_take_payload:{selected.id}"
        payload = cache.get(cache_key)
        if payload is None:
            payload = IELTSTestTakeSerializer(selected).data
            cache.set(cache_key, payload, timeout=300)

        started_at = record_exam_start(
            request.user.id, selected.id, selected.duration_minutes
        )
        return Response(
            {
                **payload,
                "duration_minutes": selected.duration_minutes,
                "started_at": started_at,
            }
        )


class PresignedUploadUrlView(APIView):
    """Generates a 5-minute user-scoped R2 Presigned PUT URL for Speaking audio."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PresignedUploadRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            data = generate_r2_presigned_upload_url(
                user_id=request.user.id,
                content_type=serializer.validated_data["content_type"],
                file_size=serializer.validated_data["file_size"],
            )
        except (RuntimeError, ValueError) as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(data, status=status.HTTP_200_OK)


class ProtectedLessonDetailView(APIView):
    """Returns protected YouTube video URLs ONLY to authenticated users (401 for guests)."""

    permission_classes = [IsAuthenticated]

    def get(self, _request, slug: str):
        lesson = PROTECTED_LESSONS.get(slug)
        if not lesson:
            return Response({"detail": "Lesson not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"slug": slug, **lesson})


class ProtectedTeacherLinksView(APIView):
    """Returns protected YouTube channel URLs ONLY to authenticated users (401 for guests)."""

    permission_classes = [IsAuthenticated]

    def get(self, _request):
        return Response({"teachers": PROTECTED_TEACHER_URLS})
