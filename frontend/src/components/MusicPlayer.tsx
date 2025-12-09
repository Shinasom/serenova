"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { title: "Gentle Rain", url: "https://cdn.pixabay.com/download/audio/2022/05/17/audio_36cb87b82f.mp3" },
  { title: "Forest Birds", url: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc58463769.mp3" },
  { title: "Ocean Waves", url: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_8228302e75.mp3" },
  { title: "Deep Focus", url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3" },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Minimized by default
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-16'}`}>
      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={nextTrack}
        loop={false}
      />

      <div className="bg-white/90 backdrop-blur-md border border-serenova-secondary shadow-xl rounded-2xl overflow-hidden">
        
        {/* Minimized View (Just Icon) */}
        {!isExpanded && (
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 flex items-center justify-center text-serenova-dark hover:bg-serenova-bg transition-colors"
          >
            <Volume2 size={24} />
          </button>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-sm font-bold text-serenova-dark">{TRACKS[currentTrack].title}</h3>
                    <p className="text-xs text-gray-500">Relaxation Mix</p>
                </div>
                <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-600">
                    ✕
                </button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button onClick={toggleMute} className="text-gray-500 hover:text-serenova-primary">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <button 
                onClick={togglePlay} 
                className="w-10 h-10 bg-serenova-primary text-white rounded-full flex items-center justify-center hover:bg-serenova-dark transition-transform hover:scale-105"
              >
                {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-1"/>}
              </button>

              <button onClick={nextTrack} className="text-gray-500 hover:text-serenova-primary">
                <SkipForward size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}