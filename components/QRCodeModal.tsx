'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, Download, Copy, Check, Sparkles } from 'lucide-react';
import { weddingConfig } from '@/config/weddingConfig';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [siteUrl, setSiteUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
  }, []);

  const handleCopyUrl = () => {
    if (!siteUrl) return;
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('wedding-qr-code') as HTMLElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = '#070707';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 100, 100, 800, 800);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${weddingConfig.groomName}_${weddingConfig.brideName}_Davetiye_QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md glass-card-gold p-6 sm:p-8 border-gold-glow text-center overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-gold-400 bg-black/40 border border-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 text-gold-400 mb-2">
            <QrCode className="w-5 h-5" />
            <Sparkles className="w-4 h-4" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-gold-gradient font-light">
            Davetiye QR Kodu
          </h3>
          <p className="text-xs text-neutral-300 mt-1 mb-6">
            Misafirlerinizin kamerasıyla okutarak davetiyeye ulaşabileceği yüksek çözünürlüklü QR kod.
          </p>

          {/* QR Code Container */}
          <div className="p-6 bg-black rounded-2xl border border-gold-400/40 inline-block shadow-gold-glow mb-6 relative group">
            <QRCodeSVG
              id="wedding-qr-code"
              value={siteUrl || 'https://dijital-davetiye.vercel.app'}
              size={220}
              bgColor="#070707"
              fgColor="#D4AF37"
              level="H"
              includeMargin={true}
            />
          </div>

          {/* URL Input / Customizer */}
          <div className="mb-6">
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1 font-mono">
              Davetiye Bağlantı Adresi (URL)
            </label>
            <div className="flex items-center gap-2 bg-black/60 p-2.5 rounded-xl border border-neutral-800">
              <input
                type="text"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://siteniz.com"
                className="w-full bg-transparent text-xs text-gold-300 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs flex items-center gap-1 hover:bg-gold-500/30 transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Kopyalandı' : 'Kopyala'}
              </button>
            </div>
          </div>

          {/* Download Action */}
          <button
            onClick={handleDownloadQR}
            className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 transition-all"
          >
            <Download className="w-4 h-4" />
            Yüksek Çözünürlüklü QR İndir (PNG)
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
