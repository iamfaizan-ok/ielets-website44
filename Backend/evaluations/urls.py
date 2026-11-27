"""URL routing for evaluations app."""

from django.urls import path

from .views import (
    AttemptHistoryDetailView,
    AttemptHistoryListView,
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
    path("history/", AttemptHistoryListView.as_view(), name="history-list"),
    path("history/<int:pk>/", AttemptHistoryDetailView.as_view(), name="history-detail"),
    path("analytics/", UserAnalyticsView.as_view(), name="analytics"),
]
