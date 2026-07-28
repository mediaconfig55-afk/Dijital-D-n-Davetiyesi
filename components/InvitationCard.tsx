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
      {/* Decorative Background */}
      <div className="absolute top-20 right-0 w-48 h-48 bg-rose-300/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-48 h-48 bg-sage-300/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl glass-card-gold p-6 sm:p-10 relative overflow-hidden shimmer-effect"
      >
        {/* Floral Corner Ornaments */}
        <div className="absolute top-3 left-3 text-rose-300/30 text-lg">✿</div>
        <div className="absolute top-3 right-3 text-rose-300/30 text-lg">✿</div>
        <div className="absolute bottom-3 left-3 text-rose-300/30 text-lg">❀</div>
        <div className="absolute bottom-3 right-3 text-rose-300/30 text-lg">❀</div>

        {/* Corner Lines */}
        <div className="absolute top-3 left-8 w-8 h-[1px] bg-gold-400/25" />
        <div className="absolute top-8 left-3 w-[1px] h-8 bg-gold-400/25" />
        <div className="absolute top-3 right-8 w-8 h-[1px] bg-gold-400/25" />
        <div className="absolute top-8 right-3 w-[1px] h-8 bg-gold-400/25" />
        <div className="absolute bottom-3 left-8 w-8 h-[1px] bg-gold-400/25" />
        <div className="absolute bottom-8 left-3 w-[1px] h-8 bg-gold-400/25" />
        <div className="absolute bottom-3 right-8 w-8 h-[1px] bg-gold-400/25" />
        <div className="absolute bottom-8 right-3 w-[1px] h-8 bg-gold-400/25" />

        {/* Card Header Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col items-center text-center mb-6"
        >
          <div className="w-14 h-14 rounded-full border border-gold-400/30 flex items-center justify-center bg-cream-50/80 mb-3 shadow-gold-soft">
            <span className="font-serif text-gold-gradient font-bold text-lg">
              {weddingConfig.coupleInitials}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500/80 font-medium">
            Düğün Davetiyesi
          </span>
        </motion.div>

        {/* Invitation Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-6"
        >
          <p className="font-serif text-lg sm:text-2xl text-warm-600 leading-relaxed font-light px-2">
            &quot;{weddingConfig.invitationText}&quot;
          </p>
        </motion.div>

        {/* Golden Divider */}
        <div className="gold-divider my-6" />

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center my-6"
        >
          <h2 className="font-script text-4xl sm:text-5xl text-warm-700 font-normal">
            {weddingConfig.groomName} <span className="text-gold-400">&</span> {weddingConfig.brideName}
          </h2>
        </motion.div>

        {/* ═══════════════════════════════════════
           ANNE-BABA KARTLARI
           ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="grid grid-cols-2 gap-3 sm:gap-4 my-6"
        >
          {/* Damadın Ailesi */}
          <div className="bg-cream-50/80 border border-gold-200/40 rounded-xl p-4 text-center relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-1 right-1 text-rose-200/30 text-sm">✿</div>
            <div className="text-2xl mb-2">🤵</div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gold-500/70 font-medium mb-2">
              Damadın Ailesi
            </p>
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent mx-auto mb-2" />
            <p className="font-serif text-sm sm:text-base text-warm-700 font-medium leading-relaxed">
              {weddingConfig.parents.groom.father}
            </p>
            <p className="text-[10px] text-warm-400 my-0.5">&</p>
            <p className="font-serif text-sm sm:text-base text-warm-700 font-medium leading-relaxed">
              {weddingConfig.parents.groom.mother}
            </p>
          </div>

          {/* Gelinin Ailesi */}
          <div className="bg-cream-50/80 border border-gold-200/40 rounded-xl p-4 text-center relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-1 right-1 text-rose-200/30 text-sm">✿</div>
            <div className="text-2xl mb-2">👰</div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gold-500/70 font-medium mb-2">
              Gelinin Ailesi
            </p>
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent mx-auto mb-2" />
            <p className="font-serif text-sm sm:text-base text-warm-700 font-medium leading-relaxed">
              {weddingConfig.parents.bride.father}
            </p>
            <p className="text-[10px] text-warm-400 my-0.5">&</p>
            <p className="font-serif text-sm sm:text-base text-warm-700 font-medium leading-relaxed">
              {weddingConfig.parents.bride.mother}
            </p>
          </div>
        </motion.div>

        {/* Golden Divider */}
        <div className="gold-divider my-4" />

        {/* Details Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-3 my-6 bg-cream-50/60 p-5 rounded-xl border border-gold-200/20"
        >
          {/* Date & Time */}
          <div className="flex items-start gap-3 text-warm-600">
            <div className="p-2 rounded-lg bg-gold-400/10 text-gold-500 mt-0.5">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-warm-400 uppercase tracking-wider font-medium">Tarih & Saat</p>
              <p className="text-sm sm:text-base text-warm-700 font-medium">
                {weddingConfig.displayDate} - {weddingConfig.displayTime}
              </p>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-start gap-3 text-warm-600">
            <div className="p-2 rounded-lg bg-gold-400/10 text-gold-500 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-warm-400 uppercase tracking-wider font-medium">Mekan</p>
              <p className="text-sm sm:text-base text-warm-700 font-medium">
                {weddingConfig.venue.name}
              </p>
              <p className="text-xs text-warm-400 mt-0.5">
                {weddingConfig.venue.address}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Schedule Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs text-gold-500/80 uppercase tracking-widest text-center mb-4 flex items-center justify-center gap-2 font-medium">
            <Clock className="w-3.5 h-3.5" /> Program Akışı
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {weddingConfig.schedule.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx, duration: 0.4 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/70 border border-gold-200/20 text-xs sm:text-sm hover:shadow-soft transition-shadow"
              >
                <span className="text-gold-500 font-mono font-semibold">{item.time}</span>
                <span className="text-warm-600 font-medium">{item.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RSVP Call To Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
          <button
            onClick={onOpenRSVP}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gold-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            Katılım Durumunu Bildir (RSVP)
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
