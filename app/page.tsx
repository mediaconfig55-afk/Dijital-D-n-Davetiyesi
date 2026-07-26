'use client';

import React, { useState } from 'react';
import { weddingConfig } from '@/config/weddingConfig';
import { SplashScreen } from '@/components/SplashScreen';
import { Hero } from '@/components/Hero';
import { InvitationCard } from '@/components/InvitationCard';
import { OurStory } from '@/components/OurStory';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Gallery } from '@/components/Gallery';
import { MemoryBookUpload } from '@/components/MemoryBookUpload';
import { GuestBook } from '@/components/GuestBook';
import { RSVPModal } from '@/components/RSVPModal';
import { LocationMap } from '@/components/LocationMap';
import { IbanCard } from '@/components/IbanCard';
import { PostWeddingView } from '@/components/PostWeddingView';
import { BackgroundAudio } from '@/components/BackgroundAudio';
import { Footer } from '@/components/Footer';
import { QRCodeModal } from '@/components/QRCodeModal';

export default function Home() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

  // If after-wedding mode is activated in config, show PostWeddingView directly
  if (weddingConfig.isPostWeddingMode) {
    return (
      <main className="min-h-screen bg-[#070707] text-[#fcfbf7]">
        <PostWeddingView />
        <Footer onOpenQR={() => setIsQROpen(true)} />
        <QRCodeModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] text-[#fcfbf7] relative overflow-hidden select-none">
      {/* 1. Cinematic Opening Splash & Curtain Experience */}
      {!isSplashComplete && (
        <SplashScreen onComplete={() => setIsSplashComplete(true)} />
      )}

      {/* 2. Main Invitation Content */}
      <div className={`transition-opacity duration-1000 ${isSplashComplete ? 'opacity-100' : 'opacity-[0.01]'}`}>
        <Hero />
        <InvitationCard onOpenRSVP={() => setIsRSVPOpen(true)} />
        <OurStory />
        <CountdownTimer />
        <Gallery />
        <MemoryBookUpload />
        <GuestBook />
        <LocationMap />
        <IbanCard />
        <Footer onOpenQR={() => setIsQROpen(true)} />

        {/* Floating RSVP Trigger Button, Ambient Audio & QR Modal */}
        <BackgroundAudio />
        <RSVPModal isOpen={isRSVPOpen} onClose={() => setIsRSVPOpen(false)} />
        <QRCodeModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} />
      </div>
    </main>
  );
}
