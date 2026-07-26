'use client';

import React, { useState, useRef, useEffect } from 'react';
import { weddingConfig } from '@/config/weddingConfig';
import { Volume2, VolumeX } from 'lucide-react';

export const BackgroundAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (weddingConfig.audioUrl) {
      audioRef.current = new Audio(weddingConfig.audioUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        console.log('Autoplay restricted by browser');
      });
    }
  };

  if (!weddingConfig.audioUrl) return null;

  return (
    <button
      onClick={toggleAudio}
      aria-label="Müzik Aç/Kapat"
      className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full glass-card-gold text-gold-400 border border-gold-400/40 shadow-gold-glow hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5 animate-pulse" />
      ) : (
        <VolumeX className="w-5 h-5 text-neutral-400 group-hover:text-gold-400" />
      )}
    </button>
  );
};
