'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { X, CheckCircle, XCircle, HelpCircle, Users, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'attending' | 'declined' | 'maybe'>('attending');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        await supabase.from('attendance').insert([
          {
            guest_name: guestName.trim(),
            status,
            guest_count: status === 'attending' ? guestCount : 0,
            note: note.trim() || null,
          },
        ]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      if (status === 'attending') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#C9A96E', '#D4A0A0', '#7A9E7E', '#E8D5B0'],
        });
      }

      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2500);

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg glass-card-gold p-6 sm:p-8 border-gold-glow overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-warm-400 hover:text-gold-500 bg-cream-50/60 border border-gold-200/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <h3 className="font-serif text-2xl sm:text-3xl text-warm-700 font-light">
              Katılım Durumu (RSVP)
            </h3>
            <p className="text-xs text-warm-400 mt-1">
              Lütfen katılım durumunuzu bizimle paylaşın.
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-10 text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-gold-500 mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl text-warm-700">Yanıtınız Alındı!</h4>
              <p className="text-xs text-warm-400">
                Geri bildiriminiz için çok teşekkür ederiz.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Option Selector Cards */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('attending')}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${
                    status === 'attending'
                      ? 'bg-gold-400/15 border-gold-400 text-gold-600 shadow-gold-soft'
                      : 'bg-white/50 border-gold-200/30 text-warm-400 hover:border-gold-300/50'
                  }`}
                >
                  <CheckCircle className={`w-5 h-5 ${status === 'attending' ? 'text-gold-500' : 'text-warm-300'}`} />
                  <span>Katılıyorum</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('declined')}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${
                    status === 'declined'
                      ? 'bg-rose-100 border-rose-300 text-rose-500'
                      : 'bg-white/50 border-gold-200/30 text-warm-400 hover:border-gold-300/50'
                  }`}
                >
                  <XCircle className={`w-5 h-5 ${status === 'declined' ? 'text-rose-400' : 'text-warm-300'}`} />
                  <span>Katılamıyorum</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('maybe')}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${
                    status === 'maybe'
                      ? 'bg-amber-50 border-amber-300 text-amber-600'
                      : 'bg-white/50 border-gold-200/30 text-warm-400 hover:border-gold-300/50'
                  }`}
                >
                  <HelpCircle className={`w-5 h-5 ${status === 'maybe' ? 'text-amber-500' : 'text-warm-300'}`} />
                  <span>Emin Değilim</span>
                </button>
              </div>

              {/* Guest Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-400 mb-1 font-medium">
                  Adınız Soyadınız *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gold-200/40 focus:border-gold-400 text-warm-700 text-sm focus:outline-none transition-colors placeholder:text-warm-300"
                />
              </div>

              {/* Guest Count */}
              {status === 'attending' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-400 mb-1 font-medium">
                    Kişi Sayısı
                  </label>
                  <div className="flex items-center gap-3 bg-white/60 border border-gold-200/40 rounded-xl p-2">
                    <Users className="w-5 h-5 text-gold-500 ml-2" />
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="bg-transparent text-warm-700 text-sm focus:outline-none w-full"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num} className="bg-white text-warm-700">
                          {num} Kişi
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-400 mb-1 font-medium">
                  Ek Not / Diyet Tercihi (İsteğe Bağlı)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Örn: Vejetaryen menü tercihi..."
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gold-200/40 focus:border-gold-400 text-warm-700 text-sm focus:outline-none transition-colors resize-none placeholder:text-warm-300"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gold-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Kaydediliyor...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Yanıtımı Gönder
                  </span>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
