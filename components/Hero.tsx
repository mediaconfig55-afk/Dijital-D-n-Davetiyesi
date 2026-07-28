'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';
import { Calendar, Clock, MapPin, ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToInvitation = () => {
    const el = document.getElementById('invitation-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-between pt-16 pb-8 px-4 overflow-hidden">
      {/* Background Soft Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-300/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-sage-300/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-gold-400/6 rounded-full blur-[80px] pointer-events-none" />

      {/* Floating Decorative Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 0.3, 0.15],
              y: ['-5%', '105%'],
              x: [0, (i % 2 === 0 ? 30 : -30)],
              rotate: [0, 360],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              delay: i * 3,
              ease: 'linear',
            }}
            className="absolute text-xl"
            style={{
              left: `${15 + i * 14}%`,
              color: i % 3 === 0 ? '#D4A0A0' : i % 3 === 1 ? '#C9A96E' : '#7A9E7E',
              opacity: 0.25,
            }}
          >
            {i % 2 === 0 ? '✿' : '❀'}
          </motion.div>
        ))}
      </div>

      {/* Decorative Top Crest */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex flex-col items-center gap-2 z-10"
      >
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-400/60" />
          <span className="text-xl text-rose-300">✿</span>
          <span className="font-serif text-sm tracking-[0.3em] uppercase text-gold-500 font-medium">
            Düğün Davetiyesi
          </span>
          <span className="text-xl text-rose-300">✿</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-400/60" />
        </div>
      </motion.div>

      {/* Center Main Titles */}
      <div className="flex flex-col items-center text-center my-auto py-8 z-10 max-w-xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xs uppercase tracking-[0.25em] text-warm-600 mb-4 font-semibold"
        >
          Evleniyoruz
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative px-4"
        >
          <h1 className="font-script text-6xl sm:text-7xl md:text-8xl font-semibold text-warm-800 tracking-tight leading-tight">
            {weddingConfig.groomName}
          </h1>
          <div className="my-3 flex items-center justify-center gap-4">
            <div className="h-[1.5px] w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
            <span className="font-script text-4xl sm:text-5xl text-gold-600 font-bold">&</span>
            <div className="h-[1.5px] w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>
          <h1 className="font-script text-6xl sm:text-7xl md:text-8xl font-semibold text-warm-800 tracking-tight leading-tight">
            {weddingConfig.brideName}
          </h1>
        </motion.div>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-serif italic text-base sm:text-xl text-warm-700 font-medium mt-6 max-w-md px-4 leading-relaxed"
        >
          &quot;{weddingConfig.slogan}&quot;
        </motion.p>

        {/* Quick Date & Venue Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-xs sm:text-sm text-warm-800 font-semibold border border-gold-300 shadow-soft backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-gold-600" />
            <span>{weddingConfig.displayDate}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-xs sm:text-sm text-warm-800 font-semibold border border-gold-300 shadow-soft backdrop-blur-sm">
            <Clock className="w-4 h-4 text-gold-600" />
            <span>{weddingConfig.displayTime}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-xs sm:text-sm text-warm-800 font-semibold border border-gold-300 shadow-soft backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-gold-600" />
            <span>{weddingConfig.venue.city}</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Prompt */}
      <motion.button
        onClick={scrollToInvitation}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="flex flex-col items-center gap-2 cursor-pointer z-10 group"
      >
        <span className="text-[11px] uppercase tracking-[0.2em] text-warm-400 group-hover:text-gold-500 transition-colors">
          Aşağı Kaydır
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="p-2 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-500 group-hover:bg-gold-400/20 transition-all"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
};
