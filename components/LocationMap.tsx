'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';
import { MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';

export const LocationMap: React.FC = () => {
  return (
    <section className="py-20 px-4 relative z-10 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card-gold p-6 sm:p-10 border-gold-glow relative overflow-hidden"
      >
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-700 font-bold flex items-center justify-center gap-2">
            <Compass className="w-4 h-4" /> Ulaşım &amp; Konum
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-warm-900 font-semibold mt-2">
            Düğün Alanı
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold-500" />
            <span className="text-rose-400 text-sm">✿</span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold-500" />
          </div>
        </div>

        {/* Venue Info Box */}
        <div className="text-center max-w-md mx-auto mb-8 bg-white p-6 rounded-2xl border border-gold-300 shadow-soft">
          <div className="w-12 h-12 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center text-gold-700 mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-warm-900 font-bold">
            {weddingConfig.venue.name}
          </h3>
          <p className="text-sm text-warm-800 mt-2 leading-relaxed font-medium">
            {weddingConfig.venue.address}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={weddingConfig.venue.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gold-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 transition-all"
          >
            <Navigation className="w-4 h-4" />
            Google Maps Yol Tarifi
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={weddingConfig.venue.appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-button text-warm-600 font-medium text-sm flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <Compass className="w-4 h-4 text-gold-500" />
            Apple Maps Yol Tarifi
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
};
