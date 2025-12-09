# backend/api/admin.py

from django.contrib import admin
from .models import SafetyPlan, MoodEntry

@admin.register(MoodEntry)
class MoodEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'mood_score', 'emotion_tag', 'created_at')
    list_filter = ('emotion_tag', 'created_at')

@admin.register(SafetyPlan)
class SafetyPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'last_updated')