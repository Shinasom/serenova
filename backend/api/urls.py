from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ChatAPIView, 
    MoodEntryViewSet, 
    RegisterView, 
    SafetyPlanView, 
    JournalEntryViewSet # <--- Ensure this is imported
)

router = DefaultRouter()
router.register(r'moods', MoodEntryViewSet, basename='mood')
router.register(r'journal', JournalEntryViewSet, basename='journal') # <--- ADDED THIS

urlpatterns = [
    path('', include(router.urls)),
    path('chat/', ChatAPIView.as_view(), name='chat'),
    path('safety-plan/', SafetyPlanView.as_view(), name='safety-plan'),
    
    # Auth Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]