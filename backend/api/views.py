from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .services import GroqService

# Corrected Imports:
from .models import MoodEntry, SafetyPlan, JournalEntry
from .serializers import (
    MoodEntrySerializer, 
    SafetyPlanSerializer, 
    JournalEntrySerializer # <--- Moved here (Correct)
)

# 1. Registration Logic (Sign Up)
class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

# 2. Chatbot Logic
class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message')
        history = request.data.get('history', []) 
        
        if not user_message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        bot = GroqService()
        ai_reply = bot.get_response(user_message, history)

        return Response({"reply": ai_reply})

# 3. Mood Tracker Logic
class MoodEntryViewSet(viewsets.ModelViewSet):
    serializer_class = MoodEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# 4. Safety Plan Logic
class SafetyPlanView(generics.RetrieveUpdateAPIView):
    serializer_class = SafetyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj, created = SafetyPlan.objects.get_or_create(user=self.request.user)
        return obj

# 5. Journal Logic
class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)