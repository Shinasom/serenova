# backend/api/services.py
import os
import re
from groq import Groq
from datetime import datetime

class GroqService:
    def __init__(self):
        self.client = Groq(api_key="paste key here")  # Ideally, load from env variable
        
        # Crisis keywords for detection
        self.crisis_keywords = [
            r'\bsuicide\b', r'\bkill myself\b', r'\bend it all\b',
            r'\bwant to die\b', r'\bno reason to live\b', r'\bhurt myself\b',
            r'\bcut myself\b', r'\boverdose\b', r'\bshoot myself\b'
        ]
        
        self.system_prompt = """
        You are "Serene," a compassionate, trauma-informed AI mental health companion.
        
        CORE DIRECTIVES:
        1. You are NOT a therapist or doctor. Never diagnose mental health conditions.
        2. CRISIS PROTOCOL: If user expresses suicidal ideation or intent to harm, respond with:
           "I'm deeply concerned about what you're sharing. Please reach out for immediate support:
           - Call 988 (Suicide & Crisis Lifeline)
           - Text 'HELLO' to 741741 (Crisis Text Line)
           - Go to your nearest emergency room
           Your life matters, and there are people who want to help right now."
        
        3. THERAPEUTIC APPROACH:
           - Use active listening and reflection
           - Validate emotions without judgment
           - Apply CBT techniques (thought challenging, behavioral activation)
           - Use motivational interviewing when appropriate
           - Teach grounding techniques (5-4-3-2-1, box breathing)
        
        4. STYLE:
           - Warm, empathetic, and genuine
           - Concise (3-5 sentences per response)
           - Ask open-ended questions occasionally
           - Use "I" statements (e.g., "I hear that you're feeling...")
        
        5. BOUNDARIES:
           - Don't make promises you can't keep
           - Don't provide medical advice or medication suggestions
           - Refer to professionals for diagnosis/treatment
           - Don't express personal opinions on serious life decisions
        
        6. MEMORY: Reference previous conversation context when relevant.
        """

    def detect_crisis(self, message: str) -> bool:
        """Check if message contains crisis language"""
        message_lower = message.lower()
        return any(re.search(pattern, message_lower) for pattern in self.crisis_keywords)

    def get_response(self, user_message, chat_history=None, mood_context=None):
        """
        Enhanced response generation with context awareness
        
        Args:
            user_message: Current user input
            chat_history: List of previous messages
            mood_context: Optional dict with recent mood data
        """
        if not chat_history:
            chat_history = []

        # Crisis Detection
        if self.detect_crisis(user_message):
            return self._get_crisis_response()

        # Build context-aware system prompt
        enhanced_prompt = self.system_prompt
        
        if mood_context:
            enhanced_prompt += f"\n\nCONTEXT: User's recent mood has been {mood_context.get('trend', 'variable')}. "
            enhanced_prompt += f"Average score: {mood_context.get('avg_score', 'N/A')}/10."

        # Construct message chain
        messages = [{"role": "system", "content": enhanced_prompt}]
        
        # Add conversation history (limit to last 10 exchanges)
        for msg in chat_history[-20:]:
            messages.append(msg)
            
        messages.append({"role": "user", "content": user_message})

        try:
            completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.7,
                max_tokens=400,
                top_p=0.9,
            )
            
            response = completion.choices[0].message.content
            
            # Log concerning patterns (implement your own logging)
            self._log_if_concerning(user_message, response)
            
            return response
            
        except Exception as e:
            print(f"Error calling Groq: {e}")
            return "I'm having trouble connecting right now. If you're in crisis, please call 988 immediately."

    def _get_crisis_response(self):
        """Dedicated crisis response"""
        return """I'm deeply concerned about what you're sharing. Your safety is the top priority right now.

**Please reach out for immediate help:**
• Call or text **988** (Suicide & Crisis Lifeline) - Available 24/7
• Text **HELLO to 741741** (Crisis Text Line)
• Go to your nearest emergency room
• Call 911 if you're in immediate danger

You don't have to face this alone. These services are confidential, free, and staffed by people who care."""

    def _log_if_concerning(self, user_msg, bot_response):
        """Log conversations that may need review (implement with your logging system)"""
        concerning_patterns = ['hopeless', 'no point', 'give up', 'nobody cares']
        
        if any(pattern in user_msg.lower() for pattern in concerning_patterns):
            # TODO: Implement secure logging system
            # Example: Store in database with timestamp, flag for review
            print(f"[{datetime.now()}] FLAGGED: Concerning message detected")

    def get_therapeutic_prompt(self, technique: str):
        """Generate prompts for specific therapeutic techniques"""
        prompts = {
            "grounding": "Let's try a grounding exercise. Can you tell me: 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste?",
            
            "thought_challenge": "I notice you said [thought]. Let's examine that together. What evidence supports this thought? What evidence contradicts it?",
            
            "behavioral_activation": "When we're struggling, small actions can help. What's one tiny thing you could do today that might bring a bit of relief or accomplishment?",
            
            "emotion_labeling": "It sounds like you're experiencing several emotions at once. Can you help me understand which feeling is strongest right now?",
        }
        return prompts.get(technique, "")
