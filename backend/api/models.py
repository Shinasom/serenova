# backend/api/models.py

from django.db import models
from django.contrib.auth.models import User

class SafetyPlan(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="safety_plan")
    warning_signs = models.TextField(help_text="What feelings/behaviors happen before a crisis?")
    coping_strategies = models.TextField(help_text="Things I can do on my own (e.g., take a walk)")
    distractions = models.TextField(help_text="People or places that distract me")
    emergency_contacts = models.TextField(help_text="Names and numbers of people I can call")
    professional_support = models.TextField(help_text="Doctors or crisis lines")
    environment_safety = models.TextField(help_text="How can I make my environment safer?")
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Safety Plan for {self.user.username}"

class MoodEntry(models.Model):
    MOOD_CHOICES = [(i, str(i)) for i in range(1, 11)] # Scale 1-10

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mood_entries")
    mood_score = models.IntegerField(choices=MOOD_CHOICES)
    emotion_tag = models.CharField(max_length=50) # e.g. "Anxious", "Calm", "Angry"
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at'] # Newest first

    def __str__(self):
        return f"{self.user.username} - {self.emotion_tag} ({self.mood_score})"
    

class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="journal_entries")
    title = models.CharField(max_length=200, default="Untitled")
    content = models.TextField()
    mood_tag = models.CharField(max_length=50, blank=True, null=True) # Optional: tag logic later
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"