"use client";

import { useState, useEffect } from 'react';
import { Save, Shield, Loader2 } from 'lucide-react';
// OLD: import api from '@/lib/api';
import { api } from '@/lib/api'; // <--- NEW// <--- Using our new Axios client

export default function SafetyPlanForm() {
  const [formData, setFormData] = useState({
    warning_signs: '',
    coping_strategies: '',
    distractions: '',
    emergency_contacts: '',
    professional_support: '',
    environment_safety: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load data on mount
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get('/safety-plan/');
        setFormData(res.data);
      } catch (error) {
        console.error("Could not load plan", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await api.patch('/safety-plan/', formData);
      setMessage('Plan saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving plan.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-serenova-primary" /></div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="bg-red-50 p-6 border-b border-red-100 flex items-center gap-4">
        <div className="bg-red-100 p-3 rounded-full text-red-500">
            <Shield size={24} />
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-800">My Safety Plan</h2>
            <p className="text-sm text-gray-500">Fill this out when you are calm so you have it during a crisis.</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Form Fields */}
        {[
          { name: 'warning_signs', label: '1. Warning Signs', desc: 'What thoughts, images, moods, situations, or behaviors indicate a crisis might be developing?' },
          { name: 'coping_strategies', label: '2. Internal Coping Strategies', desc: 'Things I can do to take my mind off my problems without contacting another person.' },
          { name: 'distractions', label: '3. People & Social Settings', desc: 'People and places that provide distraction.' },
          { name: 'emergency_contacts', label: '4. People I Can Ask for Help', desc: 'List names and phone numbers.' },
          { name: 'professional_support', label: '5. Professionals or Agencies', desc: 'Clinician, local urgent care services, suicide prevention lifeline (988).' },
          { name: 'environment_safety', label: '6. Making the Environment Safe', desc: 'How can I limit access to means of harming myself?' },
        ].map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="block font-bold text-gray-700">{field.label}</label>
            <p className="text-xs text-gray-400 mb-1">{field.desc}</p>
            <textarea
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-100 focus:border-red-300 outline-none transition-all min-h-[100px]"
              placeholder="Type here..."
            />
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className={`text-sm font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
        </span>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-serenova-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Plan
        </button>
      </div>
    </div>
  );
}