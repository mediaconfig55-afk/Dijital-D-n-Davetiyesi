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
      // Small delay to ensure QR SVG is rendered in the hidden div
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
    const H = 2000;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // === BACKGROUND ===
    ctx.fillStyle = '#FFFDF8';
    ctx.fillRect(0, 0, W, H);

    // Subtle cream gradient overlay
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, 'rgba(255, 253, 248, 1)');
    bgGrad.addColorStop(0.5, 'rgba(245, 240, 232, 0.3)');
    bgGrad.addColorStop(1, 'rgba(255, 253, 248, 1)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // === DECORATIVE BORDER ===
    const borderMargin = 40;
    const borderRadius = 24;
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.35)';
    ctx.lineWidth = 2;
    roundRect(ctx, borderMargin, borderMargin, W - borderMargin * 2, H - borderMargin * 2, borderRadius);
    ctx.stroke();

    // Inner border
    const innerMargin = 52;
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.15)';
    ctx.lineWidth = 1;
    roundRect(ctx, innerMargin, innerMargin, W - innerMargin * 2, H - innerMargin * 2, borderRadius - 4);
    ctx.stroke();

    // === FLORAL CORNER ORNAMENTS ===
    ctx.font = '28px serif';
    ctx.fillStyle = 'rgba(212, 160, 160, 0.4)';
    ctx.fillText('✿', 62, 85);
    ctx.fillText('✿', W - 85, 85);
    ctx.fillText('❀', 62, H - 62);
    ctx.fillText('❀', W - 85, H - 62);

    // Corner lines
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.3)';
    ctx.lineWidth = 1;
    // Top-left
    drawLine(ctx, 95, 68, 140, 68);
    drawLine(ctx, 68, 95, 68, 140);
    // Top-right
    drawLine(ctx, W - 140, 68, W - 95, 68);
    drawLine(ctx, W - 68, 95, W - 68, 140);
    // Bottom-left
    drawLine(ctx, 95, H - 68, 140, H - 68);
    drawLine(ctx, 68, H - 140, 68, H - 95);
    // Bottom-right
    drawLine(ctx, W - 140, H - 68, W - 95, H - 68);
    drawLine(ctx, W - 68, H - 140, W - 68, H - 95);

    let yPos = 140;

    // === CREST / INITIALS CIRCLE ===
    const crestY = yPos + 45;
    ctx.beginPath();
    ctx.arc(W / 2, crestY, 48, 0, Math.PI * 2);
    ctx.strokeStyle = '#B88E40';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Initials text
    ctx.font = 'bold 28px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#8B6F47';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(weddingConfig.coupleInitials, W / 2, crestY);

    yPos = crestY + 70;

    // === "DÜĞÜN DAVETİYESİ" ===
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B5539';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.3em';
    ctx.fillText('D Ü Ğ Ü N   D A V E T İ Y E S İ', W / 2, yPos);

    yPos += 55;

    // === INVITATION TEXT ===
    ctx.font = '500 26px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#2A1D14';
    ctx.textAlign = 'center';
    const invLines = wrapText(ctx, `"${weddingConfig.invitationText}"`, W - 200);
    invLines.forEach((line) => {
      ctx.fillText(line, W / 2, yPos);
      yPos += 38;
    });

    yPos += 20;

    // === GOLD DIVIDER ===
    drawGoldDivider(ctx, W, yPos);
    yPos += 35;

    // === COUPLE NAMES ===
    ctx.font = '600 72px "Great Vibes", cursive';
    ctx.fillStyle = '#1A120C';
    ctx.textAlign = 'center';
    const namesText = `${weddingConfig.groomName}  &  ${weddingConfig.brideName}`;

    // Gold gradient for "&"
    // First draw full name
    ctx.fillText(namesText, W / 2, yPos + 15);

    yPos += 70;

    // === GOLD DIVIDER ===
    drawGoldDivider(ctx, W, yPos);
    yPos += 45;

    // === PARENT CARDS ===
    const cardWidth = 260;
    const cardHeight = 200;
    const cardGap = 40;
    const cardStartX = W / 2 - cardWidth - cardGap / 2;

    // Groom's Family Card
    drawParentCard(ctx, cardStartX, yPos, cardWidth, cardHeight, {
      emoji: '🤵',
      title: 'DAMADIN AİLESİ',
      father: weddingConfig.parents.groom.father,
      mother: weddingConfig.parents.groom.mother,
    });

    // Bride's Family Card
    drawParentCard(ctx, cardStartX + cardWidth + cardGap, yPos, cardWidth, cardHeight, {
      emoji: '👰',
      title: 'GELİNİN AİLESİ',
      father: weddingConfig.parents.bride.father,
      mother: weddingConfig.parents.bride.mother,
    });

    yPos += cardHeight + 45;

    // === GOLD DIVIDER ===
    drawGoldDivider(ctx, W, yPos);
    yPos += 40;

    // === DATE & VENUE SECTION ===
    // Date & Time
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B5B4E';
    ctx.textAlign = 'center';
    ctx.fillText('T A R İ H   &   S A A T', W / 2, yPos);
    yPos += 30;

    ctx.font = '600 24px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#1A120C';
    ctx.fillText(`${weddingConfig.displayDate}  •  ${weddingConfig.displayTime}`, W / 2, yPos);
    yPos += 50;

    // Venue
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B5B4E';
    ctx.fillText('M E K A N', W / 2, yPos);
    yPos += 30;

    ctx.font = '600 24px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#1A120C';
    ctx.fillText(weddingConfig.venue.name, W / 2, yPos);
    yPos += 30;

    ctx.font = '400 17px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#3D2B1F';
    const addrLines = wrapText(ctx, weddingConfig.venue.address, W - 240);
    addrLines.forEach((line) => {
      ctx.fillText(line, W / 2, yPos);
      yPos += 24;
    });

    yPos += 30;

    // === GOLD DIVIDER ===
    drawGoldDivider(ctx, W, yPos);
    yPos += 40;

    // === PROGRAM / SCHEDULE ===
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B5B4E';
    ctx.fillText('P R O G R A M   A K I Ş I', W / 2, yPos);
    yPos += 30;

    const scheduleBoxW = 500;
    const scheduleBoxX = (W - scheduleBoxW) / 2;

    weddingConfig.schedule.forEach((item) => {
      // Schedule item background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      roundRect(ctx, scheduleBoxX, yPos - 6, scheduleBoxW, 40, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(201, 169, 110, 0.2)';
      ctx.lineWidth = 1;
      roundRect(ctx, scheduleBoxX, yPos - 6, scheduleBoxW, 40, 10);
      ctx.stroke();

      // Time
      ctx.font = '600 16px "Plus Jakarta Sans", monospace';
      ctx.fillStyle = '#B8984E';
      ctx.textAlign = 'left';
      ctx.fillText(item.time, scheduleBoxX + 20, yPos + 18);

      // Title
      ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#4A3B2E';
      ctx.textAlign = 'right';
      ctx.fillText(item.title, scheduleBoxX + scheduleBoxW - 20, yPos + 18);

      yPos += 50;
    });

    yPos += 20;

    // === GOLD DIVIDER ===
    drawGoldDivider(ctx, W, yPos);
    yPos += 40;

    // === QR CODE SECTION ===
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B5B4E';
    ctx.textAlign = 'center';
    ctx.fillText('D İ J İ T A L   D A V E T İ Y E', W / 2, yPos);
    yPos += 8;

    ctx.font = '400 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#8B7B6B';
    ctx.fillText('QR kodu okutarak davetiyeye ulaşabilirsiniz', W / 2, yPos + 18);
    yPos += 40;

    // QR Code background box
    const qrSize = 180;
    const qrBoxPadding = 24;
    const qrBoxSize = qrSize + qrBoxPadding * 2;
    const qrBoxX = (W - qrBoxSize) / 2;

    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, qrBoxX, yPos, qrBoxSize, qrBoxSize, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.35)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, qrBoxX, yPos, qrBoxSize, qrBoxSize, 16);
    ctx.stroke();

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

    yPos += qrBoxSize + 25;

    // URL text under QR
    ctx.font = '400 12px "Plus Jakarta Sans", monospace';
    ctx.fillStyle = '#8B7B6B';
    ctx.textAlign = 'center';
    const displayUrl = siteUrl || 'dijital-davetiye.vercel.app';
    ctx.fillText(displayUrl, W / 2, yPos);

    yPos += 40;

    // === FOOTER NAMES ===
    ctx.font = '400 40px "Great Vibes", cursive';
    ctx.fillStyle = '#1A120C';
    ctx.textAlign = 'center';
    ctx.fillText(`${weddingConfig.groomName}  ❤  ${weddingConfig.brideName}`, W / 2, yPos);

    yPos += 30;

    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#3D2B1F';
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
            QR kodlu düğün davetiyenizi oluşturun ve anı olarak indirin.
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
            className="w-full py-3.5 rounded-xl bg-gold-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
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
// CANVAS HELPER FUNCTIONS
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

function drawGoldDivider(ctx: CanvasRenderingContext2D, canvasW: number, y: number) {
  const grad = ctx.createLinearGradient(canvasW * 0.2, y, canvasW * 0.8, y);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.5, 'rgba(201, 169, 110, 0.5)');
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(canvasW * 0.15, y);
  ctx.lineTo(canvasW * 0.85, y);
  ctx.stroke();
}

function drawParentCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  info: { emoji: string; title: string; father: string; mother: string }
) {
  // Card background
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(201, 169, 110, 0.35)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, 16);
  ctx.stroke();

  // Floral decoration
  ctx.font = '14px serif';
  ctx.fillStyle = 'rgba(212, 160, 160, 0.5)';
  ctx.textAlign = 'right';
  ctx.fillText('✿', x + w - 14, y + 22);

  const cx = x + w / 2;
  let ty = y + 32;

  // Emoji
  ctx.font = '32px serif';
  ctx.textAlign = 'center';
  ctx.fillText(info.emoji, cx, ty);
  ty += 32;

  // Title
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#6B5539';
  ctx.fillText(info.title, cx, ty);
  ty += 20;

  // Divider line
  const lineGrad = ctx.createLinearGradient(cx - 30, ty, cx + 30, ty);
  lineGrad.addColorStop(0, 'transparent');
  lineGrad.addColorStop(0.5, '#B88E40');
  lineGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 30, ty);
  ctx.lineTo(cx + 30, ty);
  ctx.stroke();
  ty += 22;

  // Father
  ctx.font = '600 18px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#1A120C';
  ctx.fillText(info.father, cx, ty);
  ty += 22;

  // "&"
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
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
