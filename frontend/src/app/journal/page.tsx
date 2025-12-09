"use client";

import { useState, useEffect } from 'react';
import { Plus, Book, Calendar, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

type Entry = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await api.get('/journal/');
      setEntries(res.data);
    } catch (error) {
      console.error("Failed to load journal", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newContent.trim()) return;
    try {
      await api.post('/journal/', {
        title: newTitle || 'Untitled Entry',
        content: newContent
      });
      setIsCreating(false);
      setNewTitle('');
      setNewContent('');
      fetchEntries(); // Refresh list
    } catch (error) {
      alert("Failed to save entry");
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await api.delete(`/journal/${id}/`);
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  }

  return (
    <div className="min-h-screen bg-serenova-bg p-4 pt-8 md:pt-24 pb-24 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-serenova-dark">Journal</h1>
            <p className="text-serenova-primary">Clear your mind, one thought at a time.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-serenova-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-opacity-90 transition"
          >
            <Plus size={20} /> New Entry
          </button>
        </div>

        {/* Create Mode */}
        {isCreating && (
          <div className="bg-white rounded-3xl p-6 shadow-lg mb-8 border border-gray-100 animate-in fade-in slide-in-from-top-4">
            <input 
              type="text" 
              placeholder="Title (Optional)" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xl font-bold mb-4 outline-none placeholder-gray-300"
            />
            <textarea 
              placeholder="What's on your mind?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full h-40 p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-serenova-primary/20 outline-none resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 bg-serenova-primary text-white rounded-lg hover:bg-serenova-dark">Save Entry</button>
            </div>
          </div>
        )}

        {/* Entries Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {isLoading ? (
             <p className="text-gray-400">Loading your thoughts...</p>
          ) : entries.length === 0 && !isCreating ? (
            <div className="col-span-2 text-center py-12 text-gray-400 bg-white/50 rounded-3xl border border-dashed border-gray-200">
              <Book size={48} className="mx-auto mb-4 opacity-50" />
              <p>No entries yet. Start writing today.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 text-lg truncate pr-8">{entry.title}</h3>
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 h-16">{entry.content}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={14} />
                  {new Date(entry.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}