"""URL routing for exams app."""

from django.urls import path

from .views import (
    ExamListView,
    NextUnattemptedExamView,
    PresignedUploadUrlView,
    ProtectedLessonDetailView,
    ProtectedTeacherLinksView,
)

app_name = "exams"

urlpatterns = [
    path("", ExamListView.as_view(), name="exam-list"),
    path("next/<str:module>/", NextUnattemptedExamView.as_view(), name="next-exam"),
    path("upload-url/", PresignedUploadUrlView.as_view(), name="upload-url"),
    path("lessons/<str:slug>/", ProtectedLessonDetailView.as_view(), name="lesson-detail"),
    path("teachers/", ProtectedTeacherLinksView.as_view(), name="teacher-links"),
]
