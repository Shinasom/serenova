# backend/api/serializers.py

from rest_framework import serializers
from .models import SafetyPlan, MoodEntry
from .models import SafetyPlan, MoodEntry, JournalEntry


class SafetyPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyPlan
        fields = '__all__'
        read_only_fields = ['user'] # User is set automatically

class MoodEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class SafetyPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyPlan
        fields = ['warning_signs', 'coping_strategies', 'distractions', 'emergency_contacts', 'professional_support', 'environment_safety']


class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'title', 'content', 'mood_tag', 'created_at']
        read_only_fields = ['created_at']