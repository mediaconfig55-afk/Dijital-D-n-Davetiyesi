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
          className="text-xs uppercase tracking-[0.3em] text-gold-400 font-medium flex items-center justify-center gap-2"
        >
          <Gift className="w-4 h-4" /> Hediye &amp; Takı
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl text-gold-gradient font-light mt-2"
        >
          Banka Hesap Bilgileri
        </motion.h2>
        <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-md mx-auto">
          {weddingConfig.giftInfo.message}
        </p>
        <div className="w-16 h-[1px] bg-gold-500/40 mx-auto mt-4" />
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
              {/* Metallic Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 font-mono">
                    Banka
                  </span>
                  <h3 className="font-serif text-xl text-neutral-100 font-semibold">
                    {account.bankName}
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-gold-400/30 text-gold-400">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              {/* Account Holder */}
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                  Alıcı Adı Soyadı
                </span>
                <p className="text-base text-neutral-100 font-medium tracking-wide">
                  {account.accountHolder}
                </p>
              </div>

              {/* IBAN Number & Copy Action */}
              <div className="bg-black/60 p-4 rounded-xl border border-gold-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-mono block">
                    IBAN Numarası
                  </span>
                  <p className="font-mono text-sm sm:text-base text-gold-300 tracking-wider break-all font-semibold">
                    {account.iban}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(account.iban)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                    isCopied
                      ? 'bg-emerald-500 text-black shadow-lg'
                      : 'bg-gold-gradient text-black hover:scale-105 active:scale-95'
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

              {/* Copied Floating Toast Notification */}
              <AnimatePresence>
                {isCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-3 right-3 bg-emerald-900/90 text-emerald-200 border border-emerald-500/50 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
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
