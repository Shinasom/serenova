"use client";

import Link from 'next/link';
import { MessageCircle, Wind, ShieldAlert, BookHeart, Gamepad2 } from 'lucide-react'; // <--- Added Gamepad2
import MoodSelector from '@/components/MoodSelector';
import MoodChart from '@/components/MoodChart'; // <--- Added MoodChart back

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-serenova-bg p-6 pt-8 md:pt-24 pb-24 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* 1. Welcome Header */}
        <header>
          <h1 className="text-3xl font-bold text-serenova-dark mb-2">
            Hello, Friend.
          </h1>
          <p className="text-serenova-primary">
            Welcome to your safe space.
          </p>
        </header>

        {/* 2. MOOD TRACKER */}
        <div className="space-y-6">
          <MoodSelector />
          <MoodChart /> {/* <--- Your History Chart shows here */}
        </div>

        {/* 3. Daily Affirmation Card */}
        <div className="bg-gradient-to-r from-serenova-primary to-serenova-secondary rounded-3xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-2">✨ Daily Affirmation</p>
          <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
            "I am capable of handling whatever this day brings. I am safe."
          </h2>
        </div>

        {/* 4. Quick Actions Grid */}
        <h3 className="text-lg font-bold text-serenova-dark mt-8">Your Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          
          {/* Chat Card */}
          <Link href="/chat" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="text-blue-500" />
            </div>
            <h4 className="font-bold text-gray-800">AI Companion</h4>
            <p className="text-xs text-gray-500 mt-1">Talk through your thoughts</p>
          </Link>

          {/* Breathe Card */}
          <Link href="/breathe" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wind className="text-green-500" />
            </div>
            <h4 className="font-bold text-gray-800">Breathe</h4>
            <p className="text-xs text-gray-500 mt-1">Calm your body instantly</p>
          </Link>

          {/* Safety Plan */}
          <Link href="/safety" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="text-red-500" />
            </div>
            <h4 className="font-bold text-gray-800">Safety Plan</h4>
            <p className="text-xs text-gray-500 mt-1">Crisis Prevention</p>
          </Link>

           {/* Journal */}
           <Link href="/journal" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
             <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookHeart className="text-purple-500" />
            </div>
            <h4 className="font-bold text-gray-800">Journal</h4>
            <p className="text-xs text-gray-500 mt-1">Reflect & Unwind</p>
          </Link>

          {/* Games Card (Fixed) */}
          <Link href="/games" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Gamepad2 className="text-orange-500" />
            </div>
            <h4 className="font-bold text-gray-800">Relax</h4>
            <p className="text-xs text-gray-500 mt-1">Calming Games</p>
          </Link>

        </div>

      </div>
    </main>
  );
}