'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';
import { Sparkles, Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'question' | 'curtain' | 'completed'>('question');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas Golden Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.3,
      pulse: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.01;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0.1, Math.min(0.8, p.alpha))})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Intro Sequence Timings:
  // 0s - 2.5s: Question text
  // 2.5s: Question fades out & curtain animation begins
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStep('curtain');
    }, 2500);

    const timer2 = setTimeout(() => {
      setStep('completed');
      onComplete();
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (step === 'completed') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black select-none pointer-events-auto">
      {/* Background Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Step 1: Initial Question Text */}
      <AnimatePresence mode="wait">
        {step === 'question' && (
          <motion.div
            key="question-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: 'easeInOut' } }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="flex items-center gap-2 text-gold-400 mb-6 tracking-widest text-xs uppercase"
            >
              <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
              <span>Özel Bir Davet</span>
              <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            </motion.div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-gold-gradient font-light leading-relaxed max-w-2xl">
              Bir Hikayeye Tanıklık Etmeye Hazır mısınız?
            </h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mt-8"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Elegant Dual Curtain Opening Animation */}
      <div className="absolute inset-0 z-10 flex pointer-events-none">
        {/* Left Curtain */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: step === 'curtain' ? '-100%' : '0%' }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="w-1/2 h-full bg-gradient-to-r from-[#070707] via-[#0d0c0a] to-[#17140e] border-r border-gold-500/20 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gold-glow opacity-30 pointer-events-none" />
        </motion.div>

        {/* Right Curtain */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: step === 'curtain' ? '100%' : '0%' }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="w-1/2 h-full bg-gradient-to-l from-[#070707] via-[#0d0c0a] to-[#17140e] border-l border-gold-500/20 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gold-glow opacity-30 pointer-events-none" />
        </motion.div>
      </div>

      {/* Names Revealed in Center when Curtain Splits */}
      {step === 'curtain' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 pointer-events-none"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="font-serif text-3xl sm:text-5xl text-gold-gradient tracking-wide">
              {weddingConfig.groomName}
            </span>
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400 fill-gold-400/30 animate-bounce" />
            <span className="font-serif text-3xl sm:text-5xl text-gold-gradient tracking-wide">
              {weddingConfig.brideName}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
