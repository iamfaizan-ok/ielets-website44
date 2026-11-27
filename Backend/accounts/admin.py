"""Admin registration for accounts app."""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, UserActivityLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "plan_tier", "ai_credits", "is_verified", "is_staff")
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Bandora Profile", {"fields": ("supabase_uid", "plan_tier", "ai_credits", "target_band", "is_verified")}),
    )


@admin.register(UserActivityLog)
class UserActivityLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "ip_address", "created_at")
    list_filter = ("action",)
    readonly_fields = ("user", "action", "ip_address", "metadata", "created_at")
