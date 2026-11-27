"""Root URL configuration for Bandora IELTS Backend."""

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health-check"),
    path("api/accounts/", include("accounts.urls")),
    path("api/exams/", include("exams.urls")),
    path("api/evaluations/", include("evaluations.urls")),
]
