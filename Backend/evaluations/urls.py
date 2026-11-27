"""URL routing for evaluations app."""

from django.urls import path

from .views import (
    AttemptHistoryDetailView,
    AttemptHistoryListView,
    EvaluationStatusView,
    ExplainAnswerView,
    SubmitObjectiveView,
    SubmitSpeakingView,
    SubmitWritingView,
    UserAnalyticsView,
)

app_name = "evaluations"

urlpatterns = [
    path("submit-objective/", SubmitObjectiveView.as_view(), name="submit-objective"),
    path("explain-answer/", ExplainAnswerView.as_view(), name="explain-answer"),
    path("submit-writing/", SubmitWritingView.as_view(), name="submit-writing"),
    path("submit-speaking/", SubmitSpeakingView.as_view(), name="submit-speaking"),
    path("status/<int:pk>/", EvaluationStatusView.as_view(), name="eval-status"),
    path("history/", AttemptHistoryListView.as_view(), name="history-list"),
    path("history/<int:pk>/", AttemptHistoryDetailView.as_view(), name="history-detail"),
    path("analytics/", UserAnalyticsView.as_view(), name="analytics"),
]
