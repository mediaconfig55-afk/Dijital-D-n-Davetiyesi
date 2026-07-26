'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';
import { supabase, isSupabaseConfigured, PhotoRecord, MessageRecord } from '@/lib/supabaseClient';
import { Heart, Camera, MessageSquare, Sparkles, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { MemoryBookUpload } from './MemoryBookUpload';

export const PostWeddingView: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const loadData = async () => {
      const { data: pData } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (pData) setPhotos(pData as PhotoRecord[]);

      const { data: mData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (mData) setMessages(mData as MessageRecord[]);
    };

    loadData();
  }, []);

  const handleNewPhotoUploaded = (newPhoto: PhotoRecord) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  return (
    <div className="min-h-screen py-16 px-4 max-w-6xl mx-auto space-y-20">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs text-gold-400 border-gold-glow uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>Düğün Hatırası Albümü</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl text-gold-gradient font-light">
          {weddingConfig.groomName} ❤️ {weddingConfig.brideName}
        </h1>

        <p className="font-serif italic text-lg sm:text-xl text-neutral-300 max-w-lg mx-auto">
          &quot;Bizimle bu unutulmaz günü paylaşan ve anılarımıza katkıda bulunan tüm dostlarımıza sonsuz teşekkürler.&quot;
        </p>

        <div className="w-24 h-[1px] bg-gold-500/40 mx-auto mt-6" />
      </motion.div>

      {/* Guest Upload Section */}
      <MemoryBookUpload onPhotoUploaded={handleNewPhotoUploaded} />

      {/* Guest Photos Stream */}
      <section className="space-y-8">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-medium flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" /> Misafir Fotoğrafları
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-100 font-light mt-2">
            Sizden Gelen Kareler
          </h2>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 glass-card max-w-md mx-auto p-6">
            <ImageIcon className="w-10 h-10 text-gold-400/50 mx-auto mb-2" />
            <p className="text-sm">Henüz yüklenmiş fotoğraf bulunmuyor.</p>
            <p className="text-xs text-neutral-500 mt-1">İlk fotoğrafı yukarıdaki bölümden yükleyebilirsiniz!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card-gold rounded-2xl overflow-hidden border-gold-glow flex flex-col justify-between"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={photo.photo_url}
                    alt={photo.guest_name || 'Misafir fotoğrafı'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 bg-black/60">
                  <p className="font-serif text-base text-gold-gradient font-medium">
                    {photo.guest_name || 'İsimsiz Misafir'}
                  </p>
                  {photo.message && (
                    <p className="text-xs text-neutral-300 italic mt-1">&quot;{photo.message}&quot;</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Guest Messages Stream */}
      {messages.length > 0 && (
        <section className="space-y-8">
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-medium flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" /> Anı Defteri
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-100 font-light mt-2">
              Tebrik &amp; Mesajlar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messages.map((item) => (
              <div key={item.id} className="glass-card p-5 border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-lg text-gold-gradient">{item.guest_name}</span>
                  <Heart className="w-4 h-4 text-gold-400" />
                </div>
                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
