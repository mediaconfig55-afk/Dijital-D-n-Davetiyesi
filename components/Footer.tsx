'use client';

import React from 'react';
import { weddingConfig } from '@/config/weddingConfig';
import { Heart, QrCode } from 'lucide-react';

interface FooterProps {
  onOpenQR?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQR }) => {
  return (
    <footer className="py-16 px-4 text-center relative z-10 border-t border-neutral-900 bg-black/80">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="gold-divider mx-auto w-32" />

        <div className="flex items-center justify-center gap-2">
          <span className="font-serif text-3xl text-gold-gradient tracking-wider font-light">
            {weddingConfig.groomName}
          </span>
          <Heart className="w-5 h-5 text-gold-400 fill-gold-400/40 animate-pulse" />
          <span className="font-serif text-3xl text-gold-gradient tracking-wider font-light">
            {weddingConfig.brideName}
          </span>
        </div>

        <p className="font-serif italic text-base text-neutral-300 font-light">
          &quot;Bu güzel günümüzde bizimle olduğunuz için yürekten teşekkür ederiz.&quot;
        </p>

        {onOpenQR && (
          <div className="pt-2">
            <button
              onClick={onOpenQR}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-xs text-gold-300 border-gold-glow hover:scale-105 transition-all"
            >
              <QrCode className="w-4 h-4 text-gold-400" />
              <span>Davetiye QR Kodunu Oluştur &amp; İndir</span>
            </button>
          </div>
        )}

        <p className="text-xs font-mono text-neutral-500 tracking-widest uppercase pt-2">
          {weddingConfig.displayDate} • {weddingConfig.venue.city}
        </p>
      </div>
    </footer>
  );
};
