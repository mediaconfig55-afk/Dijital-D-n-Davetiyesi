'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured, PhotoRecord } from '@/lib/supabaseClient';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, Heart, Sparkles, ShieldCheck, X, ScrollText } from 'lucide-react';
import confetti from 'canvas-confetti';

const KVKK_CONSENT_VERSION = 'v1.0';

const KVKK_CONSENT_TEXT = `Kişisel Verilerin Korunması Hakkında Aydınlatma ve Açık Rıza Metni

6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, dijital düğün davetiyesi platformuna fotoğraf yükleyerek aşağıdaki hususları kabul etmiş sayılırsınız:

1. Toplanan Veriler
Yüklediğiniz fotoğraf(lar), adınız-soyadınız ve varsa mesajınız işlenecektir.

2. İşlenme Amacı
Yüklediğiniz fotoğraflar, düğün anı albümü oluşturmak amacıyla dijital ortamda saklanacak ve düğün davetiyesi web sitesinde diğer misafirler tarafından görüntülenebilecektir.

3. Saklama Süresi
Fotoğraflar ve ilgili kişisel veriler, veri sorumlusu tarafından silinene kadar bulut depolama hizmetinde saklanacaktır.

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

  // KVKK Consent State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentName, setConsentName] = useState('');
  const [consentError, setConsentError] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

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

  // Open KVKK consent modal on form submit
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

        // Insert KVKK consent record linked to photo
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

        if (dbData && onPhotoUploaded) {
          onPhotoUploaded(dbData as PhotoRecord);
        }
      } else {
        // Fallback demo mock
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUploadProgress(100);
      }

      setUploadProgress(100);
      setIsUploading(false);
      setIsSuccess(true);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF7D6', '#E8C39E'],
      });

      // Reset form fields
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
    <section className="py-20 px-4 relative z-10 max-w-3xl mx-auto">
      {/* Upload Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card-gold p-6 sm:p-10 relative overflow-hidden"
      >
        {/* Section Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-gold-400 mb-2">
            <Heart className="w-5 h-5 fill-gold-400" />
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-gold-gradient font-light">
            Bugünden Bir Kare ve Bir Hatıra Bırakın ❤️
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2">
            Bu özel günden çektiğiniz fotoğrafları ve güzel dileklerinizi dijital anı albümümüze ekleyin.
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* File Picker Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gold-400/40 hover:border-gold-400 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-black/40 hover:bg-black/60 group relative overflow-hidden"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative w-full h-56 rounded-xl overflow-hidden border border-gold-500/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Önizleme"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-gold-300 font-medium bg-black/70 px-4 py-2 rounded-full border border-gold-400/50">
                    Fotoğrafı Değiştir
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="p-4 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-400 mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-neutral-200">
                  Fotoğrafınızı Seçin veya Sürükleyip Bırakın
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  (Telefon galerisinden seçebilir veya anlık çekebilirsiniz)
                </p>
              </div>
            )}
          </div>

          {/* Guest Name & Message Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                Adınız Soyadınız (İsteğe Bağlı)
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Örn: Ahmet & Zeynep"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neutral-800 focus:border-gold-400 text-neutral-100 text-sm focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                Mesajınız / Dileğiniz
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Örn: Size ömür boyu mutluluklar dileriz! ❤️"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neutral-800 focus:border-gold-400 text-neutral-100 text-sm focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Error Notice */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
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
                className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-sm"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 animate-bounce" />
                <div>
                  <p className="font-semibold text-emerald-300">Harika! Anınız Paylaşıldı</p>
                  <p className="text-xs text-emerald-200/80">Fotoğrafınız ve mesajınız dijital anı albümüne kaydedildi.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gold-300">
                <span>Fotoğraf Yükleniyor...</span>
                <span>%{uploadProgress}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
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
            className="w-full py-4 rounded-xl bg-gold-gradient text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
      </motion.div>

      {/* ========== KVKK CONSENT MODAL ========== */}
      <AnimatePresence>
        {showConsentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowConsentModal(false); }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-gold-400/30 bg-gradient-to-b from-neutral-900 to-black shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gold-500/10 border border-gold-400/30">
                    <ShieldCheck className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-100">
                      Gizlilik ve KVKK Onayı
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Fotoğraf yüklemeden önce onayınız gerekmektedir
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConsentModal(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Consent Text */}
              <div className="flex-1 overflow-y-auto p-5">
                <div className="flex items-center gap-2 text-gold-400 mb-3">
                  <ScrollText className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Aydınlatma Metni</span>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-neutral-800 text-sm text-neutral-300 leading-relaxed whitespace-pre-line max-h-52 overflow-y-auto scrollbar-thin">
                  {KVKK_CONSENT_TEXT}
                </div>

                {/* Consent Name Input */}
                <div className="mt-5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                    Adınız Soyadınız <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={consentName}
                    onChange={(e) => { setConsentName(e.target.value); setConsentError(null); }}
                    placeholder="Adınızı ve soyadınızı girin"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neutral-800 focus:border-gold-400 text-neutral-100 text-sm focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-start gap-3 mt-5 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => { setConsentChecked(e.target.checked); setConsentError(null); }}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-md border-2 border-neutral-600 peer-checked:border-gold-400 peer-checked:bg-gold-400 transition-all flex items-center justify-center group-hover:border-gold-400/60">
                      {consentChecked && (
                        <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-neutral-300 leading-snug">
                    Yukarıdaki <strong className="text-gold-400">Kişisel Verilerin Korunması Aydınlatma Metnini</strong> okudum ve fotoğrafımın dijital ortamda işlenmesine açık rıza veriyorum.
                  </span>
                </label>

                {/* Consent Error */}
                <AnimatePresence>
                  {consentError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 p-3 mt-4 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{consentError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Modal Buttons */}
              <div className="p-5 border-t border-neutral-800 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowConsentModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleConsentAndUpload}
                  disabled={!consentChecked || !consentName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient text-black text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none shadow-gold-glow"
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
