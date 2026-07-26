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
          colors: ['#D4AF37', '#FFF7D6', '#E8C39E'],
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg glass-card-gold p-6 sm:p-8 border-gold-glow overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-gold-400 bg-black/40 border border-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <h3 className="font-serif text-2xl sm:text-3xl text-gold-gradient font-light">
              Katılım Durumu (RSVP)
            </h3>
            <p className="text-xs text-neutral-300 mt-1">
              Lütfen katılım durumunuzu bizimle paylaşın.
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-10 text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-400/50 flex items-center justify-center text-gold-400 mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl text-gold-gradient">Yanıtınız Alındı!</h4>
              <p className="text-xs text-neutral-300">
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
                      ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-gold-soft'
                      : 'bg-black/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <CheckCircle className={`w-5 h-5 ${status === 'attending' ? 'text-gold-400' : 'text-neutral-500'}`} />
                  <span>Katılıyorum</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('declined')}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${
                    status === 'declined'
                      ? 'bg-red-500/20 border-red-500 text-red-300'
                      : 'bg-black/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <XCircle className={`w-5 h-5 ${status === 'declined' ? 'text-red-400' : 'text-neutral-500'}`} />
                  <span>Katılamıyorum</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('maybe')}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${
                    status === 'maybe'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-black/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <HelpCircle className={`w-5 h-5 ${status === 'maybe' ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>Emin Değilim</span>
                </button>
              </div>

              {/* Guest Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                  Adınız Soyadınız *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neutral-800 focus:border-gold-400 text-neutral-100 text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* Guest Count (If attending) */}
              {status === 'attending' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                    Kişi Sayısı
                  </label>
                  <div className="flex items-center gap-3 bg-black/60 border border-neutral-800 rounded-xl p-2">
                    <Users className="w-5 h-5 text-gold-400 ml-2" />
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="bg-transparent text-neutral-100 text-sm focus:outline-none w-full"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num} className="bg-neutral-900 text-white">
                          {num} Kişi
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Note / Message */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                  Ek Not / Diyet Tercihi (İsteğe Bağlı)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Örn: Vejetaryen menü tercihi..."
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neutral-800 focus:border-gold-400 text-neutral-100 text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gold-gradient text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
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
