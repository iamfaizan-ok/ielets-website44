"""Admin registration for exams app."""

from django.contrib import admin

from .models import IELTSTest, Question


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1


@admin.register(IELTSTest)
class IELTSTestAdmin(admin.ModelAdmin):
    list_display = ("id", "module", "title", "book_series", "category", "is_active", "created_at")
    list_filter = ("module", "category", "is_active")
    search_fields = ("title", "book_series")
    inlines = [QuestionInline]
