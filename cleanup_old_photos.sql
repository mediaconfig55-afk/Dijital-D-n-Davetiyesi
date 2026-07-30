-- ==========================================================
-- 2 GÜNDEN ESKİ FOTOĞRAFLARI OTOMATİK SİLME (PG_CRON & PL/PGSQL)
-- ==========================================================

-- 1. 2 gün (48 saat) eski fotoğrafları silen fonksiyon
create or replace function public.delete_old_wedding_photos()
returns void
language plpgsql
security definer
as $$
declare
  r record;
begin
  -- 2 Günden (48 saatten) eski fotoğraflar arasında döngü
  for r in 
    select id, storage_path 
    from public.photos 
    where created_at < now() - interval '2 days'
  loop
    -- a. Storage'dan dosyayı sil
    delete from storage.objects
    where bucket_id = 'wedding-photos'
      and name = r.storage_path;

    -- b. KVKK consent kaydını sil
    delete from public.photo_consents
    where photo_id = r.id;

    -- c. Photos tablosundaki kaydı sil
    delete from public.photos
    where id = r.id;
  end loop;
end;
$$;

-- 2. Her saat başı çalışacak pg_cron job tanımı
-- Not: Supabase Dashboard -> Database -> Extensions sekmesinden pg_cron eklentisinin aktif edilmesi gerekir.
select cron.schedule(
  'auto-delete-old-wedding-photos',
  '0 * * * *', -- Her saat başı 0. dakikada çalışır
  $$ select public.delete_old_wedding_photos(); $$
);
