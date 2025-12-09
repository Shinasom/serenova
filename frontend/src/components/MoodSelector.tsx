"use client";

import { useState } from 'react';
import { Smile, Meh, Frown, CloudRain, Zap } from 'lucide-react';
// OLD: import api from '@/lib/api';
import { api } from '@/lib/api'; // <--- NEW (Curly braces)

const MOODS = [
  { level: 1, label: 'Awful', icon: CloudRain, color: 'text-gray-400 bg-gray-100' },
  { level: 3, label: 'Bad', icon: Frown, color: 'text-blue-400 bg-blue-50' },
  { level: 5, label: 'Okay', icon: Meh, color: 'text-yellow-500 bg-yellow-50' },
  { level: 7, label: 'Good', icon: Smile, color: 'text-green-500 bg-green-50' },
  { level: 10, label: 'Great', icon: Zap, color: 'text-orange-400 bg-orange-50' },
];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setIsSubmitting(true);

    try {
      // ✅ UPDATED: Use api.post
      await api.post('/moods/', {
        mood_score: selectedMood,
        emotion_tag: MOODS.find(m => m.level === selectedMood)?.label || 'Unknown',
        note: note
      });

      // If no error thrown, it was successful
      setIsSuccess(true);
      setNote('');
      setTimeout(() => {
          setIsSuccess(false);
          setSelectedMood(null);
      }, 3000);

    } catch (error) {
      console.error("Failed to log mood", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100 text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smile size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Check-in Complete!</h3>
        <p className="text-gray-500">Your mood has been logged.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">How are you feeling?</h3>
      
      {/* Emoji Grid */}
      <div className="flex justify-between mb-6">
        {MOODS.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.level;
          return (
            <button
              key={mood.level}
              onClick={() => setSelectedMood(mood.level)}
              className={`flex flex-col items-center gap-2 transition-transform hover:scale-110 ${isSelected ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                isSelected ? `${mood.color} ring-2 ring-offset-2 ring-serenova-primary` : 'bg-gray-50 text-gray-400'
              }`}>
                <Icon size={24} />
              </div>
              <span className={`text-xs font-medium ${isSelected ? 'text-gray-800' : 'text-gray-400'}`}>
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Note Input (Only shows when mood selected) */}
      {selectedMood && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Want to add a note? (Optional)"
            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-serenova-primary/20 text-sm"
            rows={2}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-serenova-primary text-white rounded-xl font-semibold hover:bg-serenova-dark transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Log Mood'}
          </button>
        </div>
      )}
    </div>
  );
}