"""Admin registration for evaluations app."""

from django.contrib import admin

from .models import TestAttempt


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "module", "test", "band_score", "created_at")
    list_filter = ("module",)
    readonly_fields = ("created_at",)
