'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';
import { Calendar, Clock, MapPin, ChevronDown, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToInvitation = () => {
    const el = document.getElementById('invitation-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-between pt-16 pb-8 px-4 overflow-hidden">
      {/* Background Soft Parallax & Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Top Crest */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex flex-col items-center gap-2 z-10"
      >
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-400/60" />
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="font-serif text-sm tracking-[0.3em] uppercase text-gold-300">
            Düğün Davetiyesi
          </span>
          <Sparkles className="w-4 h-4 text-gold-400" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-400/60" />
        </div>
      </motion.div>

      {/* Center Main Titles */}
      <div className="flex flex-col items-center text-center my-auto py-8 z-10 max-w-xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xs uppercase tracking-[0.25em] text-neutral-400 mb-4"
        >
          Evleniyoruz
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative px-4"
        >
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light text-gold-gradient tracking-tight leading-tight">
            {weddingConfig.groomName}
          </h1>
          <div className="my-2 flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <span className="font-script text-4xl sm:text-5xl text-gold-300">&</span>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          </div>
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light text-gold-gradient tracking-tight leading-tight">
            {weddingConfig.brideName}
          </h1>
        </motion.div>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-serif italic text-base sm:text-xl text-neutral-300 mt-6 max-w-md px-4 leading-relaxed"
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
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs sm:text-sm text-neutral-200 border-gold-glow">
            <Calendar className="w-4 h-4 text-gold-400" />
            <span>{weddingConfig.displayDate}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs sm:text-sm text-neutral-200 border-gold-glow">
            <Clock className="w-4 h-4 text-gold-400" />
            <span>{weddingConfig.displayTime}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs sm:text-sm text-neutral-200 border-gold-glow">
            <MapPin className="w-4 h-4 text-gold-400" />
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
        <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 group-hover:text-gold-300 transition-colors">
          Aşağı Kaydır
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="p-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 group-hover:bg-gold-500/20 transition-all"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
};
