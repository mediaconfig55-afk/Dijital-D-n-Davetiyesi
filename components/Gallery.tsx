'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingConfig, GalleryPhoto } from '@/config/weddingConfig';
import { X, ZoomIn, Camera } from 'lucide-react';
import Image from 'next/image';

export const Gallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  return (
    <section className="py-20 px-4 relative z-10 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.3em] text-gold-400 font-medium flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" /> Anılarımız
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl text-gold-gradient font-light mt-2"
        >
          Fotoğraf Galerisi
        </motion.h2>
        <div className="w-16 h-[1px] bg-gold-500/40 mx-auto mt-4" />
      </div>

      {/* Masonry / Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {weddingConfig.galleryPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer border border-gold-500/20 shadow-lg"
          >
            <Image
              src={photo.url}
              alt={photo.caption}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Hover Caption & Zoom Icon */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-left opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-mono text-gold-300 uppercase tracking-widest mb-1">
                Kare {index + 1}
              </span>
              <div className="flex items-center justify-between">
                <p className="font-serif text-lg text-neutral-100 group-hover:text-gold-200 transition-colors">
                  {photo.caption}
                </p>
                <div className="p-2 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center p-2"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/60 border border-gold-400/40 text-neutral-200 hover:text-gold-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Photo View */}
              <div className="relative w-full h-full max-h-[75vh] rounded-2xl overflow-hidden border border-gold-500/30">
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  fill
                  className="object-contain"
                />
              </div>

              <p className="font-serif text-xl text-gold-gradient mt-4 text-center">
                {selectedPhoto.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
