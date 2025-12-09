"use client";

import { useState } from 'react';
import { Gamepad2, Brain, PenTool, Grid3X3 } from 'lucide-react'; // Added Grid3X3 icon
import BubbleGame from '@/components/BubbleGame';
import MemoryGame from '@/components/MemoryGame';
import ZenCanvas from '@/components/ZenCanvas';
import Game2048 from '@/components/Game2048'; // <--- Import

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<'bubble' | 'memory' | 'zen' | '2048'>('bubble');

  return (
    <div className="min-h-screen bg-serenova-bg p-4 pt-8 md:pt-24 pb-24 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-serenova-dark mb-2">Relaxation Arcade</h1>
            <p className="text-serenova-primary">Focus on one thing at a time.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 inline-flex whitespace-nowrap">
                <button
                    onClick={() => setActiveTab('bubble')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
                        activeTab === 'bubble' ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <Gamepad2 size={18} /> Bubble Pop
                </button>
                <button
                    onClick={() => setActiveTab('memory')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
                        activeTab === 'memory' ? 'bg-green-100 text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <Brain size={18} /> Focus Match
                </button>
                <button
                    onClick={() => setActiveTab('2048')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
                        activeTab === '2048' ? 'bg-orange-100 text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <Grid3X3 size={18} /> 2048
                </button>
                <button
                    onClick={() => setActiveTab('zen')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
                        activeTab === 'zen' ? 'bg-yellow-100 text-yellow-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <PenTool size={18} /> Creative Flow
                </button>
            </div>
        </div>
        
        {/* Game Area */}
        <div className="animate-in fade-in zoom-in-95 duration-300">
            {activeTab === 'bubble' && (
                <div className="max-w-lg mx-auto">
                    <div className="bg-blue-50 p-6 rounded-3xl mb-4 text-center">
                        <h2 className="text-xl font-bold text-blue-500 mb-1">Bubble Pop</h2>
                        <p className="text-blue-400 text-sm">Pop the bubbles before they reach the top.</p>
                    </div>
                    <BubbleGame />
                </div>
            )}

            {activeTab === 'memory' && (
                <div className="max-w-md mx-auto">
                    <div className="bg-green-50 p-6 rounded-3xl mb-4 text-center">
                        <h2 className="text-xl font-bold text-green-500 mb-1">Mindful Memory</h2>
                        <p className="text-green-400 text-sm">Find the matching pairs to clear your mind.</p>
                    </div>
                    <MemoryGame />
                </div>
            )}

            {activeTab === '2048' && (
                <div className="max-w-md mx-auto">
                    <div className="bg-orange-50 p-6 rounded-3xl mb-4 text-center">
                        <h2 className="text-xl font-bold text-orange-500 mb-1">2048 Logic</h2>
                        <p className="text-orange-400 text-sm">Use arrow keys to merge the numbers.</p>
                    </div>
                    <Game2048 />
                </div>
            )}

            {activeTab === 'zen' && (
                <div className="max-w-md mx-auto">
                     <div className="bg-yellow-50 p-6 rounded-3xl mb-4 text-center">
                        <h2 className="text-xl font-bold text-yellow-500 mb-1">Zen Sand Garden</h2>
                        <p className="text-yellow-500/70 text-sm">Drag to rake the sand.</p>
                    </div>
                    <ZenCanvas />
                </div>
            )}
        </div>

      </div>
    </div>
  );
}