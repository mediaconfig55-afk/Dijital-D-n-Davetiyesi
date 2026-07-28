'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';

export const OurStory: React.FC = () => {
  return (
    <section className="py-20 px-4 relative z-10 max-w-3xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.3em] text-gold-500 font-medium"
        >
          Yolculuğumuz
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl text-warm-700 font-light mt-2"
        >
          Hikayemiz
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-center gap-2 mt-4"
        >
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold-400/50" />
          <span className="text-rose-300/50 text-sm">✿</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold-400/50" />
        </motion.div>
      </div>

      {/* Timeline Container */}
      <div className="relative border-l-2 border-gold-400/20 ml-6 sm:ml-32 space-y-12">
        {weddingConfig.storyTimeline.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative pl-8 sm:pl-12"
          >
            {/* Timeline Node Circle */}
            <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-white border-2 border-gold-400/40 flex items-center justify-center text-lg shadow-card">
              <span>{item.icon}</span>
            </div>

            {/* Date Tag on Left for Desktop */}
            <div className="hidden sm:block absolute -left-36 top-2 text-right w-24">
              <span className="text-xs font-mono text-gold-500 font-semibold tracking-wide">
                {item.date}
              </span>
            </div>

            {/* Card Content */}
            <div className="glass-card p-5 sm:p-6 border-gold-glow hover:shadow-card-hover transition-all group">
              <div className="sm:hidden text-xs font-mono text-gold-500 mb-1">
                {item.date}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-warm-700 font-medium group-hover:text-gold-500 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-warm-500 mt-2 leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
