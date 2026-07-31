'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Sparkles, Loader2 } from 'lucide-react';
import { weddingConfig } from '@/config/weddingConfig';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [siteUrl, setSiteUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const hiddenQrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
  }, []);

  // Generate invitation image whenever modal opens
  useEffect(() => {
    if (isOpen && siteUrl) {
      const timer = setTimeout(() => {
        generateInvitationPreview();
      }, 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, siteUrl]);

  const getQrDataUrl = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      const svgEl = hiddenQrRef.current?.querySelector('svg');
      if (!svgEl) {
        resolve('');
        return;
      }
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 400;
        c.height = 400;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 400, 400);
        }
        resolve(c.toDataURL('image/png'));
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });
  }, []);

  const generateInvitationPreview = useCallback(async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await renderInvitationCanvas();
      setPreviewDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating invitation:', err);
    } finally {
      setIsGenerating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteUrl]);

  const renderInvitationCanvas = useCallback(async (): Promise<string> => {
    const W = 1200;
    const H = 1750;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // === BACKGROUND ===
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(0, 0, W, H);

    // Soft Luxury Radial Background Glow
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.8);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(0.6, '#FFFDF6');
    bgGrad.addColorStop(1, '#F8F2E6');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // === LUXURY DOUBLE GOLD BORDER WITH MOTIFS ===
    const marginOuter = 36;
    const marginInner = 50;

    // Outer Thin Golden Border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.5;
    roundRect(ctx, marginOuter, marginOuter, W - marginOuter * 2, H - marginOuter * 2, 20);
    ctx.stroke();

    // Inner Thick Golden Border with Dash Pattern Accent
    ctx.strokeStyle = '#B88E40';
    ctx.lineWidth = 2.5;
    roundRect(ctx, marginInner, marginInner, W - marginInner * 2, H - marginInner * 2, 14);
    ctx.stroke();

    // Dotted Decorative Border Layer
    ctx.strokeStyle = 'rgba(184, 142, 64, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    roundRect(ctx, marginInner + 8, marginInner + 8, W - (marginInner + 8) * 2, H - (marginInner + 8) * 2, 10);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // === ORNATE CORNER MOTIFS ===
    drawOrnateCorners(ctx, marginInner + 18, W - (marginInner + 18), marginInner + 18, H - (marginInner + 18));

    let yPos = 135;

    // === CREST / ROYAL EMBLEM (INITIALS SEAL) ===
    const crestY = yPos + 40;
    
    // Outer Decorative Rays / Ring
    ctx.save();
    ctx.translate(W / 2, crestY);
    ctx.strokeStyle = 'rgba(184, 142, 64, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 24; i++) {
      ctx.rotate((Math.PI * 2) / 24);
      ctx.beginPath();
      ctx.moveTo(52, 0);
      ctx.lineTo(58, 0);
      ctx.stroke();
    }
    ctx.restore();

    // Outer Circle
    ctx.beginPath();
    ctx.arc(W / 2, crestY, 50, 0, Math.PI * 2);
    ctx.strokeStyle = '#B88E40';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#FFFDF8';
    ctx.fill();

    // Inner Dotted Circle
    ctx.beginPath();
    ctx.arc(W / 2, crestY, 44, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(184, 142, 64, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Initials Text
    ctx.font = 'bold 26px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#8B6F47';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(weddingConfig.coupleInitials, W / 2, crestY);

    yPos = crestY + 70;

    // === "DÜĞÜN DAVETİYESİ" TITLE & ORNAMENT ===
    drawMotifHeaderDecoration(ctx, W / 2, yPos - 12);
    
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#7A5B2B';
    ctx.textAlign = 'center';
    ctx.fillText('D Ü Ğ Ü N   D A V E T İ Y E S İ', W / 2, yPos + 10);

    yPos += 50;

    // === INVITATION TEXT ===
    ctx.font = '500 25px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#2A1D14';
    ctx.textAlign = 'center';
    const invLines = wrapText(ctx, `"${weddingConfig.invitationText}"`, W - 260);
    invLines.forEach((line) => {
      ctx.fillText(line, W / 2, yPos);
      yPos += 36;
    });

    yPos += 15;

    // === ORNATE GOLD DIVIDER ===
    drawOrnateDivider(ctx, W / 2, yPos);
    yPos += 45;

    // === COUPLE NAMES ===
    ctx.font = '600 76px "Great Vibes", cursive';
    ctx.fillStyle = '#1A120C';
    ctx.textAlign = 'center';
    const namesText = `${weddingConfig.groomName}  &  ${weddingConfig.brideName}`;
    ctx.fillText(namesText, W / 2, yPos);

    yPos += 50;

    // === ORNATE GOLD DIVIDER ===
    drawOrnateDivider(ctx, W / 2, yPos);
    yPos += 45;

    // === PARENT CARDS ===
    const cardWidth = 280;
    const cardHeight = 195;
    const cardGap = 45;
    const cardStartX = W / 2 - cardWidth - cardGap / 2;

    // Damadın Ailesi
    drawOrnateParentCard(ctx, cardStartX, yPos, cardWidth, cardHeight, {
      emoji: '🤵',
      title: 'DAMADIN AİLESİ',
      father: weddingConfig.parents.groom.father,
      mother: weddingConfig.parents.groom.mother,
    });

    // Gelinin Ailesi
    drawOrnateParentCard(ctx, cardStartX + cardWidth + cardGap, yPos, cardWidth, cardHeight, {
      emoji: '👰',
      title: 'GELİNİN AİLESİ',
      father: weddingConfig.parents.bride.father,
      mother: weddingConfig.parents.bride.mother,
    });

    yPos += cardHeight + 45;

    // === ORNATE GOLD DIVIDER ===
    drawOrnateDivider(ctx, W / 2, yPos);
    yPos += 40;

    // === DATE & VENUE SECTION ===
    // Date Header
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#7A5B2B';
    ctx.textAlign = 'center';
    ctx.fillText('T A R İ H   &   S A A T', W / 2, yPos);
    yPos += 28;

    ctx.font = '600 25px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#1A120C';
    ctx.fillText(`${weddingConfig.displayDate}  •  ${weddingConfig.displayTime}`, W / 2, yPos);
    yPos += 48;

    // Venue Header
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#7A5B2B';
    ctx.fillText('M E K A N', W / 2, yPos);
    yPos += 28;

    ctx.font = '600 25px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#1A120C';
    ctx.fillText(weddingConfig.venue.name, W / 2, yPos);
    yPos += 28;

    ctx.font = '400 18px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#3D2B1F';
    const addrLines = wrapText(ctx, weddingConfig.venue.address, W - 260);
    addrLines.forEach((line) => {
      ctx.fillText(line, W / 2, yPos);
      yPos += 24;
    });

    yPos += 25;

    // === ORNATE GOLD DIVIDER ===
    drawOrnateDivider(ctx, W / 2, yPos);
    yPos += 40;

    // === QR CODE PASSEPARTOUT SECTION ===
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#7A5B2B';
    ctx.textAlign = 'center';
    ctx.fillText('D İ J İ T A L   D A V E T İ Y E', W / 2, yPos);
    yPos += 10;

    ctx.font = '400 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B5B4E';
    ctx.fillText('QR kodu okutarak davetiyeye ulaşabilirsiniz', W / 2, yPos + 14);
    yPos += 35;

    // QR Code Frame & Box
    const qrSize = 170;
    const qrBoxPadding = 20;
    const qrBoxSize = qrSize + qrBoxPadding * 2;
    const qrBoxX = (W - qrBoxSize) / 2;

    // Luxury QR Box Shadow & Frame
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, qrBoxX, yPos, qrBoxSize, qrBoxSize, 16);
    ctx.fill();
    ctx.strokeStyle = '#B88E40';
    ctx.lineWidth = 1.5;
    roundRect(ctx, qrBoxX, yPos, qrBoxSize, qrBoxSize, 16);
    ctx.stroke();

    // Inner Accent Corner Markers on QR Box
    const qM = 8;
    const qL = 12;
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    // Top-left
    drawLine(ctx, qrBoxX + qM, yPos + qM, qrBoxX + qM + qL, yPos + qM);
    drawLine(ctx, qrBoxX + qM, yPos + qM, qrBoxX + qM, yPos + qM + qL);
    // Top-right
    drawLine(ctx, qrBoxX + qrBoxSize - qM, yPos + qM, qrBoxX + qrBoxSize - qM - qL, yPos + qM);
    drawLine(ctx, qrBoxX + qrBoxSize - qM, yPos + qM, qrBoxX + qrBoxSize - qM, yPos + qM + qL);
    // Bottom-left
    drawLine(ctx, qrBoxX + qM, yPos + qrBoxSize - qM, qrBoxX + qM + qL, yPos + qrBoxSize - qM);
    drawLine(ctx, qrBoxX + qM, yPos + qrBoxSize - qM, qrBoxX + qM, yPos + qrBoxSize - qM - qL);
    // Bottom-right
    drawLine(ctx, qrBoxX + qrBoxSize - qM, yPos + qrBoxSize - qM, qrBoxX + qrBoxSize - qM - qL, yPos + qrBoxSize - qM);
    drawLine(ctx, qrBoxX + qrBoxSize - qM, yPos + qrBoxSize - qM, qrBoxX + qrBoxSize - qM, yPos + qrBoxSize - qM - qL);

    // Draw QR code image
    const qrDataUrl = await getQrDataUrl();
    if (qrDataUrl) {
      const qrImg = new Image();
      await new Promise<void>((resolve) => {
        qrImg.onload = () => {
          ctx.drawImage(qrImg, qrBoxX + qrBoxPadding, yPos + qrBoxPadding, qrSize, qrSize);
          resolve();
        };
        qrImg.onerror = () => resolve();
        qrImg.src = qrDataUrl;
      });
    }

    yPos += qrBoxSize + 20;

    // URL text under QR
    ctx.font = '500 12px "Plus Jakarta Sans", monospace';
    ctx.fillStyle = '#8B6F47';
    ctx.textAlign = 'center';
    const displayUrl = siteUrl || 'dijital-davetiye.vercel.app';
    ctx.fillText(displayUrl, W / 2, yPos);

    yPos += 38;

    // === FOOTER EMBLEM & NAMES ===
    ctx.font = '400 38px "Great Vibes", cursive';
    ctx.fillStyle = '#1A120C';
    ctx.textAlign = 'center';
    ctx.fillText(`${weddingConfig.groomName}  ❤  ${weddingConfig.brideName}`, W / 2, yPos);

    yPos += 28;

    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B5539';
    ctx.fillText(`${weddingConfig.displayDate}  •  ${weddingConfig.venue.city}`, W / 2, yPos);

    return canvas.toDataURL('image/png', 1.0);
  }, [siteUrl, getQrDataUrl]);

  const handleDownload = () => {
    if (!previewDataUrl) return;
    const link = document.createElement('a');
    link.download = `${weddingConfig.groomName}_${weddingConfig.brideName}_Dugun_Davetiyesi.png`;
    link.href = previewDataUrl;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg glass-card-gold p-5 sm:p-8 border-gold-glow text-center overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-warm-400 hover:text-gold-500 bg-cream-50/60 border border-gold-200/30 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 text-gold-500 mb-2">
            <Sparkles className="w-5 h-5" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-warm-700 font-light">
            Düğün Davetiyesi
          </h3>
          <p className="text-xs text-warm-400 mt-1 mb-4">
            QR kodlu özel tasarım düğün davetiyenizi oluşturun ve anı olarak indirin.
          </p>

          {/* Preview Area */}
          <div className="flex-1 overflow-y-auto mb-4 min-h-0">
            <div className="flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 py-12">
                  <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                  <p className="text-sm text-warm-400">Davetiye oluşturuluyor...</p>
                </div>
              ) : previewDataUrl ? (
                <div className="p-2 bg-white rounded-xl border border-gold-300/40 shadow-gold-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewDataUrl}
                    alt="Düğün Davetiyesi Önizleme"
                    className="w-full max-w-[340px] rounded-lg"
                  />
                </div>
              ) : (
                <div className="py-12 text-sm text-warm-400">
                  Önizleme yüklenemedi. Lütfen tekrar deneyin.
                </div>
              )}
            </div>
          </div>

          {/* Download Action */}
          <button
            onClick={handleDownload}
            disabled={!previewDataUrl || isGenerating}
            className="w-full py-3.5 rounded-xl bg-gold-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Davetiyeyi İndir (PNG)
          </button>
        </motion.div>
      </div>

      {/* Hidden QR SVG for canvas rendering */}
      <div ref={hiddenQrRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <QRCodeSVG
          value={siteUrl || 'https://dijital-davetiye.vercel.app'}
          size={400}
          bgColor="#FFFFFF"
          fgColor="#8B6F47"
          level="H"
          includeMargin={false}
        />
      </div>
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════
// CANVAS HELPER & MOTIF DRAWING FUNCTIONS
// ═══════════════════════════════════════════

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// Ornate Corner Motifs (Vintage / Filigree Crafts)
function drawOrnateCorners(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  y1: number,
  y2: number
) {
  const cornerSize = 40;
  ctx.strokeStyle = '#B88E40';
  ctx.lineWidth = 1.5;

  const drawCorner = (cx: number, cy: number, flipX: number, flipY: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(flipX, flipY);

    // L-shaped Corner Bar
    ctx.beginPath();
    ctx.moveTo(0, cornerSize);
    ctx.lineTo(0, 0);
    ctx.lineTo(cornerSize, 0);
    ctx.stroke();

    // Inner Arc
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI / 2);
    ctx.stroke();

    // Corner Diamond Accent
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(10, 10, 3, 0, Math.PI * 2);
    ctx.fill();

    // Outer Decorative Floral Dots
    ctx.fillStyle = 'rgba(212, 160, 160, 0.6)';
    ctx.font = '16px serif';
    ctx.fillText('✿', 22, -4);

    ctx.restore();
  };

  // Top-Left
  drawCorner(x1, y1, 1, 1);
  // Top-Right
  drawCorner(x2, y1, -1, 1);
  // Bottom-Left
  drawCorner(x1, y2, 1, -1);
  // Bottom-Right
  drawCorner(x2, y2, -1, -1);
}

// Header Floral / Crown Decoration
function drawMotifHeaderDecoration(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  // Center Floral Symbol
  ctx.font = '22px serif';
  ctx.fillStyle = '#C88A8A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✿', 0, 0);

  // Left & Right Flourish Lines with Diamonds
  ctx.strokeStyle = '#B88E40';
  ctx.lineWidth = 1;

  // Left
  drawLine(ctx, -20, 0, -80, 0);
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.arc(-80, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // Right
  drawLine(ctx, 20, 0, 80, 0);
  ctx.beginPath();
  ctx.arc(80, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Ornate Section Divider with Center Diamond Accent
function drawOrnateDivider(ctx: CanvasRenderingContext2D, cx: number, y: number) {
  const width = 380;
  const x1 = cx - width / 2;
  const x2 = cx + width / 2;

  const gradLeft = ctx.createLinearGradient(x1, y, cx - 20, y);
  gradLeft.addColorStop(0, 'transparent');
  gradLeft.addColorStop(1, '#B88E40');

  const gradRight = ctx.createLinearGradient(cx + 20, y, x2, y);
  gradRight.addColorStop(0, '#B88E40');
  gradRight.addColorStop(1, 'transparent');

  // Left Line
  ctx.strokeStyle = gradLeft;
  ctx.lineWidth = 1;
  drawLine(ctx, x1, y, cx - 20, y);

  // Right Line
  ctx.strokeStyle = gradRight;
  drawLine(ctx, cx + 20, y, x2, y);

  // Center Diamond & Flourish Symbol
  ctx.save();
  ctx.translate(cx, y);

  // Diamond
  ctx.fillStyle = '#B88E40';
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.lineTo(5, 0);
  ctx.lineTo(0, 5);
  ctx.lineTo(-5, 0);
  ctx.closePath();
  ctx.fill();

  // Side Small Dots
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.arc(-11, 0, 2, 0, Math.PI * 2);
  ctx.arc(11, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Ornate Parent Card Box
function drawOrnateParentCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  info: { emoji: string; title: string; father: string; mother: string }
) {
  // Card Background
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, x, y, w, h, 14);
  ctx.fill();

  // Double Border for Card
  ctx.strokeStyle = 'rgba(184, 142, 64, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, 14);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(184, 142, 64, 0.15)';
  ctx.lineWidth = 1;
  roundRect(ctx, x + 4, y + 4, w - 8, h - 8, 10);
  ctx.stroke();

  // Top Corner Floral Ornaments
  ctx.font = '13px serif';
  ctx.fillStyle = 'rgba(200, 138, 138, 0.6)';
  ctx.textAlign = 'left';
  ctx.fillText('✿', x + 10, y + 20);
  ctx.textAlign = 'right';
  ctx.fillText('✿', x + w - 10, y + 20);

  const cx = x + w / 2;
  let ty = y + 30;

  // Emoji
  ctx.font = '30px serif';
  ctx.textAlign = 'center';
  ctx.fillText(info.emoji, cx, ty);
  ty += 30;

  // Title
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#7A5B2B';
  ctx.fillText(info.title, cx, ty);
  ty += 18;

  // Small Line Accent
  const lineGrad = ctx.createLinearGradient(cx - 35, ty, cx + 35, ty);
  lineGrad.addColorStop(0, 'transparent');
  lineGrad.addColorStop(0.5, '#B88E40');
  lineGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1;
  drawLine(ctx, cx - 35, ty, cx + 35, ty);
  ty += 22;

  // Father
  ctx.font = '600 18px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#1A120C';
  ctx.fillText(info.father, cx, ty);
  ty += 22;

  // "&"
  ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#8B7B6B';
  ctx.fillText('&', cx, ty);
  ty += 22;

  // Mother
  ctx.font = '600 18px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#1A120C';
  ctx.fillText(info.mother, cx, ty);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
