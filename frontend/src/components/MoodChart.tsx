"use client";

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

type MoodData = {
  created_at: string;
  mood_score: number;
  emotion_tag: string;
};

export default function MoodChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/moods/');
        // Transform data for the chart (take last 7 entries and reverse to show oldest -> newest)
        const formatted = res.data.slice(0, 7).reverse().map((item: MoodData) => ({
          date: new Date(item.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
          score: item.mood_score,
          tag: item.emotion_tag
        }));
        setData(formatted);
      } catch (error) {
        console.error("Failed to load mood history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-serenova-primary" /></div>;
  if (data.length < 2) return null; // Don't show chart if not enough data

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Your Mood Trends</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B9080" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6B9080" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#6B9080" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}