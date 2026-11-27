"""URL routing for exams app."""

from django.urls import path

from .views import ExamListView, NextUnattemptedExamView, PresignedUploadUrlView

app_name = "exams"

urlpatterns = [
    path("", ExamListView.as_view(), name="exam-list"),
    path("next/<str:module>/", NextUnattemptedExamView.as_view(), name="next-exam"),
    path("upload-url/", PresignedUploadUrlView.as_view(), name="upload-url"),
]
