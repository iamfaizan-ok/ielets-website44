"""Exams API views: test bank listing and smart random unattempted delivery."""

from django.db.models import OuterRef, Subquery
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from evaluations.models import TestAttempt

from .models import IELTSTest
from .serializers import IELTSTestSummarySerializer, IELTSTestTakeSerializer


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
    """Returns a random unattempted test for the requested module (falls back to oldest attempted)."""

    permission_classes = [IsAuthenticated]

    def get(self, request, module: str):
        module = module.lower()
        if module not in IELTSTest.Module.values:
            return Response(
                {"detail": f"Invalid module '{module}'. Choose reading, listening, writing, or speaking."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        attempted_ids = TestAttempt.objects.filter(
            user=request.user, module=module
        ).values_list("test_id", flat=True)

        unattempted = (
            IELTSTest.objects.filter(module=module, is_active=True)
            .exclude(id__in=attempted_ids)
            .prefetch_related("questions")
            .order_by("?")
            .first()
        )
        if unattempted:
            return Response(IELTSTestTakeSerializer(unattempted).data)

        # Fallback: oldest attempted test by this user in this module
        latest_user_attempt = (
            TestAttempt.objects.filter(user=request.user, test=OuterRef("pk"))
            .order_by("-created_at")
            .values("created_at")[:1]
        )
        fallback = (
            IELTSTest.objects.filter(module=module, is_active=True)
            .annotate(last_attempted=Subquery(latest_user_attempt))
            .prefetch_related("questions")
            .order_by("last_attempted")
            .first()
        )
        if not fallback:
            return Response(
                {"detail": f"No active tests available for module '{module}'."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(IELTSTestTakeSerializer(fallback).data)
