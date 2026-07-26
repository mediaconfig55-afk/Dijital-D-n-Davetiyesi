'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured, MessageRecord } from '@/lib/supabaseClient';
import { MessageSquare, Send, Heart, Sparkles, User } from 'lucide-react';

export const GuestBook: React.FC = () => {
  const [messages, setMessages] = useState<MessageRecord[]>([
    {
      id: 'm1',
      created_at: new Date().toISOString(),
      guest_name: 'Can & Selin',
      message: 'İki güzel insana bir ömür boyu sonsuz mutluluklar dileriz! Düğünde buluşmak üzere ❤️',
    },
    {
      id: 'm2',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      guest_name: 'Mehmet Yılmaz',
      message: 'Tebrik ederim, bir ömür boyu sağlık ve huzur dolu bir evlilik diliyorum.',
    },
  ]);
  const [guestName, setGuestName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch messages from Supabase on mount if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setMessages(data as MessageRecord[]);
      }
    };

    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !messageText.trim()) return;

    setIsSubmitting(true);

    try {
      const newMsgObj: MessageRecord = {
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        guest_name: guestName.trim(),
        message: messageText.trim(),
      };

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('messages')
          .insert([
            {
              guest_name: guestName.trim(),
              message: messageText.trim(),
            },
          ])
          .select()
          .single();

        if (!error && data) {
          setMessages((prev) => [data as MessageRecord, ...prev]);
        } else {
          setMessages((prev) => [newMsgObj, ...prev]);
        }
      } else {
        setMessages((prev) => [newMsgObj, ...prev]);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      setGuestName('');
      setMessageText('');

      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
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
          <MessageSquare className="w-4 h-4" /> Anı Defteri
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl text-gold-gradient font-light mt-2"
        >
          Mesaj Defterimiz
        </motion.h2>
        <p className="text-xs sm:text-sm text-neutral-300 mt-2">
          Bizim için bir tebrik mesajı veya güzel bir temenni bırakın.
        </p>
        <div className="w-16 h-[1px] bg-gold-500/40 mx-auto mt-4" />
      </div>

      {/* Message Input Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onSubmit={handleSubmit}
        className="glass-card-gold p-6 sm:p-8 mb-12 border-gold-glow"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1 font-medium">
              İsminiz
            </label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Adınız Soyadınız"
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neutral-800 focus:border-gold-400 text-neutral-100 text-sm focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1 font-medium">
              Mesajınız
            </label>
            <textarea
              required
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Tebriklerinizi ve dileklerinizi buraya yazabilirsiniz..."
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neutral-800 focus:border-gold-400 text-neutral-100 text-sm focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSuccess ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4" /> Mesajınız kaydedildi, teşekkürler!
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-full bg-gold-gradient text-black font-semibold text-sm flex items-center gap-2 shadow-gold-soft hover:scale-105 transition-all disabled:opacity-50 ml-auto"
            >
              <Send className="w-4 h-4" />
              Mesajı Gönder
            </button>
          </div>
        </div>
      </motion.form>

      {/* Messages Feed Stream */}
      <div className="space-y-4">
        <AnimatePresence>
          {messages.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-5 border-neutral-800 hover:border-gold-500/30 transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-400/30 flex items-center justify-center text-gold-400 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg text-neutral-100 font-medium">
                    {item.guest_name}
                  </h4>
                  <Heart className="w-4 h-4 text-gold-400/60" />
                </div>
                <p className="text-sm text-neutral-300 mt-1 leading-relaxed font-light">
                  {item.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
