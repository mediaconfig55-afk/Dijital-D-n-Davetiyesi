'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

// Petal shapes for canvas
interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  swayAmplitude: number;
  swaySpeed: number;
  startTime: number;
}

const PETAL_COLORS = [
  'rgba(212, 160, 160, 0.6)',  // Rose pink
  'rgba(232, 195, 195, 0.5)',  // Light pink
  'rgba(201, 169, 110, 0.4)',  // Warm gold
  'rgba(122, 158, 126, 0.35)', // Sage green
  'rgba(245, 224, 224, 0.5)',  // Blush
  'rgba(180, 140, 140, 0.4)',  // Dusty rose
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'entrance' | 'names' | 'curtain' | 'completed'>('entrance');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas Petal Animation
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

    const petalCount = 35;
    const petals: Petal[] = Array.from({ length: petalCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height * -1,
      size: Math.random() * 12 + 6,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      speedY: Math.random() * 1.2 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      swayAmplitude: Math.random() * 30 + 10,
      swaySpeed: Math.random() * 0.02 + 0.005,
      startTime: Math.random() * 1000,
    }));

    const drawPetal = (p: Petal) => {
      ctx.save();
      const swayX = Math.sin(Date.now() * p.swaySpeed + p.startTime) * p.swayAmplitude;
      ctx.translate(p.x + swayX, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      // Draw petal shape
      ctx.beginPath();
      ctx.moveTo(0, -p.size / 2);
      ctx.bezierCurveTo(
        p.size / 2, -p.size / 3,
        p.size / 2, p.size / 3,
        0, p.size / 2
      );
      ctx.bezierCurveTo(
        -p.size / 2, p.size / 3,
        -p.size / 2, -p.size / 3,
        0, -p.size / 2
      );
      ctx.fillStyle = p.color;
      ctx.fill();

      // Subtle vein
      ctx.beginPath();
      ctx.moveTo(0, -p.size / 2.5);
      ctx.lineTo(0, p.size / 2.5);
      ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Intro Sequence Timings
  useEffect(() => {
    const timer1 = setTimeout(() => setStep('names'), 2800);
    const timer2 = setTimeout(() => setStep('curtain'), 5000);
    const timer3 = setTimeout(() => {
      setStep('completed');
      onComplete();
    }, 6500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (step === 'completed') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#FFFDF8] select-none pointer-events-auto">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A96E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Falling Petal Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Soft Gradient Overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-sage-300/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 left-10 w-56 h-56 bg-gold-400/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Step 1: Entrance - Beautiful Question */}
      <AnimatePresence mode="wait">
        {step === 'entrance' && (
          <motion.div
            key="entrance-box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Decorative Line Top */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1.2, ease: 'easeOut' }}
              className="w-32 h-[1px] bg-gradient-to-r from-transparent via-gold-400/60 to-transparent mb-8"
            />

            {/* Floral Ornament */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-3xl mb-6 text-rose-300"
            >
              ✿
            </motion.div>

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex items-center gap-3 text-gold-700 mb-6 tracking-[0.3em] text-xs uppercase font-bold"
            >
              <span className="w-6 h-[1px] bg-gold-500" />
              <span>Özel Bir Davet</span>
              <span className="w-6 h-[1px] bg-gold-500" />
            </motion.div>

            {/* Main Question */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.2, ease: 'easeOut' }}
              className="font-serif text-3xl sm:text-5xl md:text-6xl text-warm-900 font-normal leading-relaxed max-w-2xl"
            >
              Bir Hikayeye Tanıklık Etmeye
              <br />
              <span className="text-gold-gradient font-bold">Hazır mısınız?</span>
            </motion.h1>

            {/* Bottom Ornament */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="w-24 h-[1px] bg-gradient-to-r from-transparent via-rose-400 to-transparent mt-8"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="text-2xl mt-4 text-gold-600"
            >
              ❀
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Names Reveal with Floral Frame */}
      <AnimatePresence>
        {step === 'names' && (
          <motion.div
            key="names-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 pointer-events-none"
          >
            {/* Floral Frame Container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="relative flex flex-col items-center"
            >
              {/* Top Ornament */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl text-rose-400 mb-4"
              >
                ❀ ✿ ❀
              </motion.div>

              {/* Gold Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="w-40 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-6"
              />

              {/* Names */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="font-script text-6xl sm:text-7xl text-warm-900 font-semibold tracking-wide">
                  {weddingConfig.groomName}
                </span>
                <div className="flex items-center gap-4 my-2">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500" />
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 fill-rose-300" />
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500" />
                </div>
                <span className="font-script text-6xl sm:text-7xl text-warm-900 font-semibold tracking-wide">
                  {weddingConfig.brideName}
                </span>
              </motion.div>

              {/* Date */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="mt-6 text-sm tracking-[0.25em] uppercase text-gold-700 font-bold"
              >
                {weddingConfig.displayDate}
              </motion.p>

              {/* Bottom ornament */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="w-40 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-6"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="text-3xl sm:text-4xl text-rose-300/50 mt-4"
              >
                ✿
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 3: Elegant Dual Curtain Opening */}
      <div className="absolute inset-0 z-10 flex pointer-events-none">
        {/* Left Curtain */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: step === 'curtain' ? '-100%' : '0%' }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="w-1/2 h-full relative"
          style={{
            background: 'linear-gradient(to right, #FFFDF8, #FFF9F0, #F5F0E8)',
            borderRight: '1px solid rgba(201, 169, 110, 0.15)',
          }}
        >
          <div className="absolute inset-0 bg-rose-glow opacity-20 pointer-events-none" />
        </motion.div>

        {/* Right Curtain */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: step === 'curtain' ? '100%' : '0%' }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="w-1/2 h-full relative"
          style={{
            background: 'linear-gradient(to left, #FFFDF8, #FFF9F0, #F5F0E8)',
            borderLeft: '1px solid rgba(201, 169, 110, 0.15)',
          }}
        >
          <div className="absolute inset-0 bg-rose-glow opacity-20 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
};
