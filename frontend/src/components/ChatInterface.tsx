"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Bot } from 'lucide-react';
// OLD: import api from '@/lib/api';
import { api } from '@/lib/api'; // <--- NEW (Curly braces)

type Message = {
  role: 'user' | 'bot';
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! I am Serene. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // ✅ UPDATED: Use api.post instead of fetch
      // The Interceptor handles the Token automatically
      const response = await api.post('/chat/', { 
        message: userMessage, 
        history: messages 
      });

      setMessages(prev => [...prev, { role: 'bot', content: response.data.reply }]);
      
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "I'm having trouble connecting. Please check your internet." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* Header */}
      <div className="bg-serenova-primary p-4 text-white flex items-center shadow-sm">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <Bot size={20} />
        </div>
        <div>
            <h2 className="font-semibold text-lg">Serene</h2>
            <p className="text-xs text-serenova-accent opacity-90">AI Wellness Companion</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-serenova-dark ml-2' : 'bg-serenova-secondary mr-2'
                }`}>
                    {msg.role === 'user' ? <User size={14} color="white" /> : <Bot size={14} color="white" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-serenova-primary text-white rounded-tr-none'
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start ml-10">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
              <Loader2 className="animate-spin text-serenova-primary" size={16} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type how you feel..."
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-serenova-primary/50 text-gray-700 placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-serenova-primary hover:bg-serenova-dark text-white px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}