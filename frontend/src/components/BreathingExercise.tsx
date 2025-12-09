"use client";

import { useState, useEffect } from 'react';
import { Play, Square, Wind } from 'lucide-react';

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Ready'>('Ready');
  const [timer, setTimer] = useState(0);

  // Box Breathing: 4s Inhale, 4s Hold, 4s Exhale, 4s Hold
  useEffect(() => {
    if (!isActive) {
      setPhase('Ready');
      return;
    }

    const loopDuration = 16000; // 16 seconds total cycle
    
    const runCycle = () => {
      const now = Date.now();
      const cycleTime = (now - startTime) % loopDuration;

      if (cycleTime < 4000) setPhase('Inhale');
      else if (cycleTime < 8000) setPhase('Hold');
      else if (cycleTime < 12000) setPhase('Exhale');
      else setPhase('Hold');
    };

    let startTime = Date.now();
    const interval = setInterval(runCycle, 100); // Check every 100ms for responsiveness

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-8 text-serenova-dark">
        <Wind className="text-serenova-primary" />
        <h2 className="text-xl font-bold font-poppins">Box Breathing</h2>
      </div>

      {/* The Visual Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background Rings */}
        <div className={`absolute w-full h-full rounded-full border-4 border-serenova-bg transition-all duration-[4000ms] ease-linear ${
            phase === 'Inhale' || (phase === 'Hold' && timer < 8000) ? 'scale-100' : 'scale-90'
        }`}></div>

        {/* Animated Core */}
        <div 
            className={`w-32 h-32 rounded-full bg-serenova-primary/20 backdrop-blur-sm flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
                phase === 'Inhale' ? 'scale-[2.0] bg-serenova-primary/40' : 
                phase === 'Exhale' ? 'scale-100 bg-serenova-primary/20' : 
                'scale-[2.0]' // Hold state keeps previous size roughly (simplified logic)
            }`}
        >
            <div className={`w-24 h-24 rounded-full bg-serenova-primary text-white flex items-center justify-center text-xl font-bold shadow-lg transition-all duration-300`}>
                {phase}
            </div>
        </div>
        
        {/* Guiding Text */}
        <div className="absolute -bottom-8 text-gray-400 text-sm">
            {isActive ? "Follow the rhythm..." : "4s Inhale • 4s Hold • 4s Exhale"}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={() => setIsActive(!isActive)}
        className={`mt-12 px-8 py-3 rounded-full flex items-center gap-2 font-semibold transition-all hover:scale-105 ${
            isActive 
            ? 'bg-serenova-warning/10 text-serenova-warning border border-serenova-warning' 
            : 'bg-serenova-primary text-white shadow-md hover:bg-serenova-dark'
        }`}
      >
        {isActive ? (
            <> <Square size={18} fill="currentColor" /> Stop </>
        ) : (
            <> <Play size={18} fill="currentColor" /> Start Session </>
        )}
      </button>

    </div>
  );
}