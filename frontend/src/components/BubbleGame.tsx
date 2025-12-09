"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
};

export default function BubbleGame() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);

  // Spawn bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble: Bubble = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // Random position 10-90%
        y: 100, // Start at bottom
        size: Math.random() * 40 + 30,
        speed: Math.random() * 0.5 + 0.2,
        color: ['bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-yellow-200'][Math.floor(Math.random() * 4)]
      };
      setBubbles(prev => [...prev, newBubble]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Move bubbles up
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev => 
        prev
          .map(b => ({ ...b, y: b.y - b.speed })) // Move up
          .filter(b => b.y > -20) // Remove if off screen
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
  };

  return (
    <div className="relative h-[400px] bg-gradient-to-b from-blue-50 to-white rounded-3xl overflow-hidden border border-blue-100 shadow-inner">
      <div className="absolute top-4 left-6 text-2xl font-bold text-blue-300 pointer-events-none">
        Score: {score}
      </div>
      
      {bubbles.map(bubble => (
        <button
          key={bubble.id}
          onClick={() => popBubble(bubble.id)}
          className={`absolute rounded-full ${bubble.color} opacity-70 hover:scale-110 transition-transform cursor-pointer shadow-sm backdrop-blur-sm`}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
          }}
        />
      ))}
      
      <div className="absolute bottom-4 left-0 w-full text-center text-gray-400 text-sm pointer-events-none">
        Pop the bubbles to clear your mind...
      </div>
    </div>
  );
}