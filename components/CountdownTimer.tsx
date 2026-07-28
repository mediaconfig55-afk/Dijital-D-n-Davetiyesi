'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';
import { Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const targetDate = new Date(weddingConfig.weddingDate).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerItems = [
    { label: 'Gün', value: timeLeft.days },
    { label: 'Saat', value: timeLeft.hours },
    { label: 'Dakika', value: timeLeft.minutes },
    { label: 'Saniye', value: timeLeft.seconds },
  ];

  return (
    <section className="py-16 px-4 relative z-10 max-w-4xl mx-auto text-center">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-300/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card-gold p-8 sm:p-12 relative overflow-hidden"
      >
        {/* Floral accents */}
        <div className="absolute top-2 left-4 text-rose-300/20 text-lg">❀</div>
        <div className="absolute top-2 right-4 text-rose-300/20 text-lg">❀</div>

        <div className="flex items-center justify-center gap-2 text-gold-500 text-xs uppercase tracking-[0.25em] mb-2 font-medium">
          <Clock className="w-4 h-4" />
          <span>Büyük Günü Beklerken</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl text-warm-700 font-light mb-8">
          Geri Sayım
        </h2>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {timerItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 border border-gold-200/30 shadow-card backdrop-blur-sm"
            >
              <span className="font-mono text-3xl sm:text-5xl font-bold text-gold-gradient tracking-tight">
                {isClient ? String(item.value).padStart(2, '0') : '00'}
              </span>
              <span className="text-xs uppercase tracking-widest text-warm-400 mt-2 font-medium">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
