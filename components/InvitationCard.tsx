'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';
import { Heart, CalendarCheck, Clock, MapPin, Sparkles } from 'lucide-react';

interface InvitationCardProps {
  onOpenRSVP: () => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({ onOpenRSVP }) => {
  return (
    <section id="invitation-card" className="py-16 px-4 flex flex-col items-center justify-center relative z-10">
      {/* Container with max width for Mobile First & Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl glass-card-gold p-6 sm:p-10 relative overflow-hidden shimmer-effect"
      >
        {/* Subtle Decorative Golden Corner Ornaments */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-400/40 rounded-tl-md" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold-400/40 rounded-tr-md" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold-400/40 rounded-bl-md" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-400/40 rounded-br-md" />

        {/* Card Header Crest */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-gold-400/30 flex items-center justify-center bg-black/40 mb-3 shadow-gold-soft">
            <span className="font-serif text-gold-gradient font-bold text-lg">
              {weddingConfig.coupleInitials}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-400/80">
            Düğün Davetiyesi
          </span>
        </div>

        {/* Invitation Text */}
        <div className="text-center mb-8">
          <p className="font-serif text-lg sm:text-2xl text-neutral-200 leading-relaxed font-light px-2">
            &quot;{weddingConfig.invitationText}&quot;
          </p>
        </div>

        {/* Golden Divider */}
        <div className="gold-divider my-6" />

        {/* Names */}
        <div className="text-center my-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-gold-gradient font-normal">
            {weddingConfig.groomName} &amp; {weddingConfig.brideName}
          </h2>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 my-8 bg-black/30 p-5 rounded-xl border border-gold-500/10">
          {/* Date & Time */}
          <div className="flex items-start gap-3 text-neutral-300">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400 mt-0.5">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider">Tarih & Saat</p>
              <p className="text-sm sm:text-base text-neutral-200 font-medium">
                {weddingConfig.displayDate} - {weddingConfig.displayTime}
              </p>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-start gap-3 text-neutral-300">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider">Mekan</p>
              <p className="text-sm sm:text-base text-neutral-200 font-medium">
                {weddingConfig.venue.name}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {weddingConfig.venue.address}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Highlights */}
        <div className="mb-8">
          <p className="text-xs text-gold-300/80 uppercase tracking-widest text-center mb-4 flex items-center justify-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Program Akışı
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {weddingConfig.schedule.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 text-xs sm:text-sm"
              >
                <span className="text-gold-400 font-mono font-medium">{item.time}</span>
                <span className="text-neutral-200 font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RSVP Call To Action Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={onOpenRSVP}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gold-gradient text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            Katılım Durumunu Bildir (RSVP)
          </button>
        </div>
      </motion.div>
    </section>
  );
};
