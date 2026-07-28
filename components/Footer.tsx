'use client';

import React from 'react';
import { weddingConfig } from '@/config/weddingConfig';
import { Heart, QrCode } from 'lucide-react';

interface FooterProps {
  onOpenQR?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQR }) => {
  return (
    <footer className="py-16 px-4 text-center relative z-10 border-t border-gold-200/20 bg-cream-50/50">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="gold-divider mx-auto w-32" />

        <div className="flex items-center justify-center gap-2">
          <span className="font-script text-4xl text-warm-900 tracking-wider font-semibold">
            {weddingConfig.groomName}
          </span>
          <Heart className="w-5 h-5 text-rose-400 fill-rose-300 animate-pulse" />
          <span className="font-script text-4xl text-warm-900 tracking-wider font-semibold">
            {weddingConfig.brideName}
          </span>
        </div>

        <p className="font-serif italic text-base text-warm-800 font-medium">
          &quot;Bu güzel günümüzde bizimle olduğunuz için yürekten teşekkür ederiz.&quot;
        </p>

        {onOpenQR && (
          <div className="pt-2">
            <button
              onClick={onOpenQR}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-xs text-gold-700 font-bold border border-gold-300 shadow-soft hover:scale-105 transition-all"
            >
              <QrCode className="w-4 h-4 text-gold-700" />
              <span>Davetiye QR Kodunu Oluştur &amp; İndir</span>
            </button>
          </div>
        )}

        <p className="text-xs font-mono text-warm-700 font-bold tracking-widest uppercase pt-2">
          {weddingConfig.displayDate} • {weddingConfig.venue.city}
        </p>
      </div>
    </footer>
  );
};
