'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingConfig } from '@/config/weddingConfig';
import { supabase, isSupabaseConfigured, PhotoRecord } from '@/lib/supabaseClient';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, Heart, Sparkles, ShieldCheck, X, ScrollText, Clock, Lock, ZoomIn, Camera, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';

const KVKK_CONSENT_VERSION = 'v1.0';

const KVKK_CONSENT_TEXT = `Kişisel Verilerin Korunması Hakkında Aydınlatma ve Açık Rıza Metni

6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, dijital düğün davetiyesi platformuna fotoğraf yükleyerek aşağıdaki hususları kabul etmiş sayılırsınız:

1. Toplanan Veriler
Yüklediğiniz fotoğraf(lar), adınız-soyadınız ve varsa mesajınız işlenecektir.

2. İşlenme Amacı
Yüklediğiniz fotoğraflar, düğün anı albümü oluşturmak amacıyla dijital ortamda saklanacak ve düğün gecesi belirlenen saatten itibaren dijital davetiye anı duvarında sergilenebilecektir.

3. Saklama Süresi
Fotoğraflar ve ilgili kişisel veriler, veri güvenliği ve anı koruma ilkesi gereğince 2 gün (48 saat) boyunca saklanacak, 2 günün sonunda sistem tarafından otomatik ve kalıcı olarak silinecektir.

4. Üçüncü Taraflarla Paylaşım
Verileriniz, hosting ve depolama hizmeti sağlayıcısı dışında herhangi bir üçüncü tarafla paylaşılmayacaktır.

5. Haklarınız
KVKK'nın 11. maddesi gereğince; kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme haklarına sahipsiniz. Bu haklarınızı kullanmak için veri sorumlusuyla iletişime geçebilirsiniz.

Bu metni okuyarak ve "Onaylıyorum" butonuna basarak, yukarıda belirtilen şartlar dahilinde fotoğrafınızın ve kişisel bilgilerinizin işlenmesine açık rıza vermiş olursunuz.`;

interface MemoryBookUploadProps {
  onPhotoUploaded?: (photo: PhotoRecord) => void;
}

export const MemoryBookUpload: React.FC<MemoryBookUploadProps> = ({ onPhotoUploaded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Time Gating States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRevealOpen, setIsRevealOpen] = useState(false);

  // Photos State & Lightbox
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoRecord[]>([]);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<PhotoRecord | null>(null);

  // KVKK Consent State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentName, setConsentName] = useState('');
  const [consentError, setConsentError] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

  // Check current time against wedding timeline
  useEffect(() => {
    const checkTimelineStatus = () => {
      const now = new Date().getTime();

      // Start Time (Default: Wedding date at 19:00)
      const startTimeStr = weddingConfig.photoUploadStartTime || weddingConfig.weddingDate;
      const startTime = new Date(startTimeStr).getTime();

      // Reveal Time (Default: 23:59:59 of wedding date / 00:00 midnight)
      const revealTimeStr = weddingConfig.photoRevealTime || weddingConfig.weddingDate;
      const revealTime = new Date(revealTimeStr).getTime();

      setIsUploadOpen(now >= startTime);
      setIsRevealOpen(now >= revealTime);
    };

    checkTimelineStatus();
    const interval = setInterval(checkTimelineStatus, 5000); // Check every 5s

    return () => clearInterval(interval);
  }, []);

  // Load photos if reveal time is reached
  useEffect(() => {
    if (!isSupabaseConfigured || !isRevealOpen) return;

    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setUploadedPhotos(data as PhotoRecord[]);
      }
    };

    fetchPhotos();
  }, [isRevealOpen]);

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    setIsSuccess(false);

    if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      setErrorMsg('Lütfen sadece geçerli bir fotoğraf dosyası (JPG, PNG, WEBP) seçin.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`Dosya boyutu çok yüksek. Maksimum ${MAX_FILE_SIZE_MB}MB yükleyebilirsiniz.`);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Open KVKK modal on submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Lütfen önce bir fotoğraf seçin.');
      return;
    }

    if (guestName.trim()) {
      setConsentName(guestName.trim());
    }

    setConsentError(null);
    setConsentChecked(false);
    setShowConsentModal(true);
  };

  // Upload after consent
  const handleConsentAndUpload = async () => {
    if (!consentName.trim()) {
      setConsentError('Onay için adınızı ve soyadınızı girmeniz zorunludur.');
      return;
    }
    if (!consentChecked) {
      setConsentError('Devam etmek için gizlilik metnini okuyup onay kutusunu işaretlemeniz gerekmektedir.');
      return;
    }

    setShowConsentModal(false);
    setIsUploading(true);
    setUploadProgress(20);
    setErrorMsg(null);

    if (!guestName.trim()) {
      setGuestName(consentName.trim());
    }

    const finalGuestName = guestName.trim() || consentName.trim();

    try {
      let finalPhotoUrl = previewUrl || '';
      let storagePath = 'local-preview';

      if (isSupabaseConfigured) {
        const fileExt = selectedFile!.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        storagePath = `guest_uploads/${fileName}`;

        setUploadProgress(40);
        const { data: storageData, error: storageError } = await supabase.storage
          .from('wedding-photos')
          .upload(storagePath, selectedFile!, {
            cacheControl: '3600',
            upsert: false,
          });

        if (storageError) {
          throw new Error(`Depolama hatası: ${storageError.message}`);
        }

        setUploadProgress(60);
        const { data: publicUrlData } = supabase.storage
          .from('wedding-photos')
          .getPublicUrl(storageData.path);

        finalPhotoUrl = publicUrlData.publicUrl;

        // Insert photo record into DB
        const { data: dbData, error: dbError } = await supabase
          .from('photos')
          .insert([
            {
              guest_name: finalGuestName,
              message: message.trim() || null,
              photo_url: finalPhotoUrl,
              storage_path: storagePath,
            },
          ])
          .select()
          .single();

        if (dbError) {
          throw new Error(`Veritabanı hatası: ${dbError.message}`);
        }

        setUploadProgress(85);

        // Insert KVKK consent record
        const { error: consentDbError } = await supabase
          .from('photo_consents')
          .insert([
            {
              guest_name: consentName.trim(),
              consent_text_version: KVKK_CONSENT_VERSION,
              consent_given: true,
              photo_id: dbData?.id || null,
            },
          ]);

        if (consentDbError) {
          console.error('Consent record error:', consentDbError);
        }

        if (dbData) {
          if (isRevealOpen) {
            setUploadedPhotos((prev) => [dbData as PhotoRecord, ...prev]);
          }
          if (onPhotoUploaded) {
            onPhotoUploaded(dbData as PhotoRecord);
          }
        }
      } else {
        // Fallback demo mock
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUploadProgress(100);
      }

      setUploadProgress(100);
      setIsUploading(false);
      setIsSuccess(true);

      // Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF7D6', '#E8C39E'],
      });

      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setGuestName('');
        setMessage('');
        setIsSuccess(false);
        setConsentName('');
        setConsentChecked(false);
      }, 4000);

    } catch (err: any) {
      console.error(err);
      setIsUploading(false);
      setErrorMsg(err.message || 'Fotoğraf yüklenirken bir hata oluştu.');
    }
  };

  return (
    <section className="py-20 px-4 relative z-10 max-w-4xl mx-auto space-y-16">
      {/* Upload Section Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card-gold p-6 sm:p-10 relative overflow-hidden shadow-card"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-rose-400 mb-2">
            <Heart className="w-5 h-5 fill-rose-300/40" />
            <Sparkles className="w-4 h-4 text-gold-500" />
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-warm-800 font-medium">
            Bugünden Bir Kare ve Bir Hatıra Bırakın ❤️
          </h2>
          <p className="text-xs sm:text-sm text-warm-600 mt-2 font-medium">
            Bu özel günden çektiğiniz fotoğrafları ve güzel dileklerinizi dijital anı albümümüze ekleyin.
          </p>
        </div>

        {/* TIME STAGE 1: BEFORE 19:00 (LOCKED) */}
        {!isUploadOpen ? (
          <div className="text-center p-8 sm:p-12 rounded-2xl bg-white/80 border border-gold-200/60 space-y-4 shadow-soft">
            <div className="w-16 h-16 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center mx-auto text-gold-600 animate-pulse">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-warm-800 font-medium">
              Fotoğraf Yükleme Henüz Açılmadı
            </h3>
            <p className="text-sm text-gold-700 font-semibold">
              📷 Fotoğraf paylaşım alanı düğün günü saat <strong className="text-warm-900">19:00</strong>&apos;da otomatik açılacaktır.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-100 border border-gold-300 text-xs text-warm-800 font-semibold mt-2">
              <Clock className="w-4 h-4 text-gold-600" />
              <span>Düğün Tarihi: {weddingConfig.displayDate} - 19:00</span>
            </div>
          </div>
        ) : (
          /* TIME STAGE 2 & 3: AFTER 19:00 (UPLOAD FORM ACTIVE) */
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* File Picker Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gold-400/60 hover:border-gold-600 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-white/80 hover:bg-white group relative overflow-hidden shadow-soft"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative w-full h-56 rounded-xl overflow-hidden border border-gold-300/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Önizleme"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-warm-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white font-semibold bg-warm-800/90 px-4 py-2 rounded-full border border-gold-300">
                      Fotoğrafı Değiştir
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="p-4 rounded-full bg-gold-100 border border-gold-300 text-gold-600 mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-semibold text-warm-800">
                    Fotoğrafınızı Seçin veya Sürükleyip Bırakın
                  </p>
                  <p className="text-xs text-warm-500 font-medium mt-1">
                    (Telefon galerisinden seçebilir veya anlık çekebilirsiniz)
                  </p>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-700 mb-1.5 font-semibold">
                  Adınız Soyadınız (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Örn: Ahmet & Zeynep"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gold-300 focus:border-gold-500 text-warm-900 text-sm focus:outline-none transition-colors placeholder:text-warm-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-700 mb-1.5 font-semibold">
                  Mesajınız / Dileğiniz
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Örn: Size ömür boyu mutluluklar dileriz! ❤️"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gold-300 focus:border-gold-500 text-warm-900 text-sm focus:outline-none transition-colors resize-none placeholder:text-warm-400 font-medium"
                />
              </div>
            </div>

            {/* Notice for State 2 (19:00 - 00:00) */}
            {!isRevealOpen && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gold-50 border border-gold-300 text-warm-800 text-xs">
                <EyeOff className="w-4 h-4 text-gold-600 shrink-0" />
                <span>
                  <strong className="text-gold-800">Gizli Moderasyon Modu:</strong> Yüklediğiniz fotoğraflar saat <strong className="text-warm-900">00:00&apos;da</strong> canlı anı albümünde tüm misafirlere açılacaktır.
                </span>
              </div>
            )}

            {/* Error Notice */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Banner */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 animate-bounce" />
                  <div>
                    <p className="font-bold text-emerald-900">Harika! Fotoğrafınız Alındı</p>
                    <p className="text-xs text-emerald-700 font-medium">Fotoğrafınız kaydedildi. Gece 00:00&apos;da anı albümünde yayınlanacaktır.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-warm-700 font-semibold">
                  <span>Fotoğraf Yükleniyor...</span>
                  <span>%{uploadProgress}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-cream-200 overflow-hidden border border-gold-200">
                  <div
                    className="h-full bg-gold-gradient transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="w-full py-4 rounded-xl bg-gold-gradient text-white font-bold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Yükleniyor...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Anıyı &amp; Fotoğrafı Gönder
                </span>
              )}
            </button>
          </form>
        )}
      </motion.div>

      {/* TIME STAGE 3: AFTER 00:00 MIDNIGHT (AUTOMATIC PUBLIC LIVE STREAM REVEAL) */}
      {isRevealOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-600 font-bold flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" /> Düğün Anı Duvarı
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-warm-800 font-medium mt-2">
              Misafirlerimizden Gelen Kareler ❤️
            </h3>
            <p className="text-xs text-warm-600 font-medium mt-1">
              Fotoğrafların üzerine tıklayarak büyük boyutta görüntüleyebilirsiniz
            </p>
          </div>

          {uploadedPhotos.length === 0 ? (
            <div className="text-center py-12 text-warm-600 glass-card-gold max-w-md mx-auto p-6 border border-gold-300">
              <ImageIcon className="w-10 h-10 text-gold-500 mx-auto mb-2" />
              <p className="text-sm font-semibold">Henüz yüklenmiş fotoğraf bulunmuyor.</p>
              <p className="text-xs text-warm-500 mt-1">Fotoğraflarınızı yukarıdaki alandan yükleyebilirsiniz!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {uploadedPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setActiveLightboxPhoto(photo)}
                  className="group relative rounded-2xl overflow-hidden glass-card-gold border-gold-300 hover:border-gold-500 cursor-pointer shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-warm-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.photo_url}
                      alt={photo.guest_name || 'Misafir fotoğrafı'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-warm-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 rounded-full bg-white/80 border border-gold-400 text-gold-700 shadow-md">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {(photo.guest_name || photo.message) && (
                    <div className="p-4 border-t border-gold-200/50 bg-white/90">
                      {photo.guest_name && (
                        <p className="font-semibold text-sm text-gold-700 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 shrink-0" />
                          {photo.guest_name}
                        </p>
                      )}
                      {photo.message && (
                        <p className="text-xs text-warm-700 italic mt-1 line-clamp-2">
                          &quot;{photo.message}&quot;
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeLightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxPhoto(null)}
            className="fixed inset-0 z-[9999] bg-warm-900/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center rounded-2xl bg-white border border-gold-300 overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setActiveLightboxPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-warm-900/70 border border-gold-200 text-white hover:text-gold-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full h-[65vh] bg-warm-950 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeLightboxPhoto.photo_url}
                  alt={activeLightboxPhoto.guest_name || 'Büyütülmüş Görsel'}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="w-full p-5 bg-white border-t border-gold-200 text-center">
                {activeLightboxPhoto.guest_name && (
                  <p className="font-serif text-lg text-gold-700 font-semibold">
                    {activeLightboxPhoto.guest_name}
                  </p>
                )}
                {activeLightboxPhoto.message && (
                  <p className="text-sm text-warm-700 italic mt-1">
                    &quot;{activeLightboxPhoto.message}&quot;
                  </p>
                )}
                <p className="text-[10px] text-warm-500 font-semibold mt-2 uppercase tracking-widest">
                  {new Date(activeLightboxPhoto.created_at).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KVKK CONSENT MODAL */}
      <AnimatePresence>
        {showConsentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowConsentModal(false); }}
          >
            <div className="absolute inset-0 bg-warm-900/80 backdrop-blur-md" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-gold-300 bg-white shadow-2xl overflow-hidden z-10"
            >
              <div className="flex items-center justify-between p-5 border-b border-gold-200 bg-cream-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gold-100 border border-gold-300">
                    <ShieldCheck className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-warm-900">
                      Gizlilik ve KVKK Onayı
                    </h3>
                    <p className="text-xs text-warm-600 font-medium">
                      Fotoğraf yüklemeden önce onayınız gerekmektedir
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConsentModal(false)}
                  className="p-1.5 rounded-full hover:bg-gold-100 transition-colors text-warm-500 hover:text-warm-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex items-center gap-2 text-gold-700">
                  <ScrollText className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-bold">Aydınlatma Metni</span>
                </div>

                <div className="p-4 rounded-xl bg-warm-50 border border-warm-200 text-xs sm:text-sm text-warm-800 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto scrollbar-thin font-medium">
                  {KVKK_CONSENT_TEXT}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-700 mb-1.5 font-bold">
                    Adınız Soyadınız <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={consentName}
                    onChange={(e) => { setConsentName(e.target.value); setConsentError(null); }}
                    placeholder="Adınızı ve soyadınızı girin"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gold-300 focus:border-gold-500 text-warm-900 text-sm focus:outline-none transition-colors font-medium"
                    autoFocus
                  />
                </div>

                <label className="flex items-start gap-3 pt-2 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => { setConsentChecked(e.target.checked); setConsentError(null); }}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-md border-2 border-warm-400 peer-checked:border-gold-600 peer-checked:bg-gold-500 transition-all flex items-center justify-center group-hover:border-gold-500">
                      {consentChecked && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-warm-800 leading-snug font-medium">
                    Yukarıdaki <strong className="text-gold-700 font-bold">Kişisel Verilerin Korunması Aydınlatma Metnini</strong> okudum ve fotoğrafımın dijital ortamda işlenmesine açık rıza veriyorum.
                  </span>
                </label>

                <AnimatePresence>
                  {consentError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{consentError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-5 border-t border-gold-200 bg-cream-50 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setShowConsentModal(false)}
                  className="px-5 py-3 rounded-xl border border-warm-300 bg-white text-warm-700 text-sm font-semibold hover:bg-warm-100 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleConsentAndUpload}
                  disabled={!consentChecked || !consentName.trim()}
                  className="px-6 py-3 min-h-[48px] rounded-xl bg-gold-gradient text-white text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none shadow-gold-glow cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Onaylıyorum ve Gönder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
