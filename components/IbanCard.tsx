'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';
import { CreditCard, Copy, Check, Gift } from 'lucide-react';

export const IbanCard: React.FC = () => {
  const [copiedIban, setCopiedIban] = useState<string | null>(null);

  const handleCopy = (iban: string) => {
    navigator.clipboard.writeText(iban.replace(/\s+/g, ''));
    setCopiedIban(iban);
    setTimeout(() => setCopiedIban(null), 2500);
  };

  return (
    <section className="py-20 px-4 relative z-10 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.3em] text-gold-500 font-medium flex items-center justify-center gap-2"
        >
          <Gift className="w-4 h-4" /> Hediye &amp; Takı
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl text-warm-700 font-light mt-2"
        >
          Banka Hesap Bilgileri
        </motion.h2>
        <p className="text-xs sm:text-sm text-warm-400 mt-2 max-w-md mx-auto">
          {weddingConfig.giftInfo.message}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold-400/50" />
          <span className="text-rose-300/50 text-sm">✿</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold-400/50" />
        </div>
      </div>

      {/* IBAN Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weddingConfig.giftInfo.bankAccounts.map((account, index) => {
          const isCopied = copiedIban === account.iban;

          return (
            <motion.div
              key={account.iban}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="glass-card-gold p-6 rounded-2xl relative overflow-hidden shimmer-effect border-gold-glow flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold-500 font-mono">
                    Banka
                  </span>
                  <h3 className="font-serif text-xl text-warm-700 font-semibold">
                    {account.bankName}
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-gold-400/10 border border-gold-200/30 text-gold-500">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              {/* Account Holder */}
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-widest text-warm-400 font-mono">
                  Alıcı Adı Soyadı
                </span>
                <p className="text-base text-warm-700 font-medium tracking-wide">
                  {account.accountHolder}
                </p>
              </div>

              {/* IBAN Number & Copy Action */}
              <div className="bg-cream-50/80 p-4 rounded-xl border border-gold-200/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <span className="text-[9px] uppercase tracking-widest text-warm-400 font-mono block">
                    IBAN Numarası
                  </span>
                  <p className="font-mono text-sm sm:text-base text-gold-600 tracking-wider break-all font-semibold">
                    {account.iban}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(account.iban)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                    isCopied
                      ? 'bg-sage-400 text-white shadow-lg'
                      : 'bg-gold-gradient text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Kopyalandı!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      IBAN Kopyala
                    </>
                  )}
                </button>
              </div>

              {/* Copied Toast */}
              <AnimatePresence>
                {isCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-3 right-3 bg-sage-400/90 text-white border border-sage-300/50 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Panoya kopyalandı</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
