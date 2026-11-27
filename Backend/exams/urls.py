"""URL routing for exams app."""

from django.urls import path

from .views import ExamListView, NextUnattemptedExamView

app_name = "exams"

urlpatterns = [
    path("", ExamListView.as_view(), name="exam-list"),
    path("next/<str:module>/", NextUnattemptedExamView.as_view(), name="next-exam"),
]
