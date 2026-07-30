-- ==========================================================
-- SUPABASE DATABASE & STORAGE SCHEMA (FULL RESET & CLEAN SETUP)
-- ==========================================================

-- 0. CLEANUP (Removes existing tables and policies to avoid "already exists" errors)
drop policy if exists "Public Access to Wedding Photos" on storage.objects;
drop policy if exists "Public Upload to Wedding Photos" on storage.objects;

drop table if exists public.photo_consents cascade;
drop table if exists public.photos cascade;
drop table if exists public.messages cascade;
drop table if exists public.attendance cascade;


-- 1. STORAGE BUCKET CREATION
insert into storage.buckets (id, name, public) 
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do nothing;

create policy "Public Access to Wedding Photos" 
on storage.objects for select 
using (bucket_id = 'wedding-photos');

create policy "Public Upload to Wedding Photos" 
on storage.objects for insert 
with check (bucket_id = 'wedding-photos');

create policy "Public Delete from Wedding Photos" 
on storage.objects for delete 
using (bucket_id = 'wedding-photos');


-- 2. PHOTOS TABLE
create table public.photos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  guest_name text,
  message text,
  photo_url text not null,
  storage_path text not null
);

alter table public.photos enable row level security;

create policy "Allow public read access to photos"
  on public.photos for select
  using (true);

create policy "Allow public insert access to photos"
  on public.photos for insert
  with check (true);

create policy "Allow public delete access to photos"
  on public.photos for delete
  using (true);


-- 3. MESSAGES TABLE
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  guest_name text not null,
  message text not null
);

alter table public.messages enable row level security;

create policy "Allow public read access to messages"
  on public.messages for select
  using (true);

create policy "Allow public insert access to messages"
  on public.messages for insert
  with check (true);


-- 4. ATTENDANCE TABLE (RSVP)
create table public.attendance (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  guest_name text not null,
  status text not null check (status in ('attending', 'declined', 'maybe')),
  guest_count integer default 1,
  note text
);

alter table public.attendance enable row level security;

create policy "Allow public insert access to attendance"
  on public.attendance for insert
  with check (true);

create policy "Allow public read access to attendance"
  on public.attendance for select
  using (true);


-- 5. PHOTO CONSENTS TABLE (KVKK Compliance)
create table public.photo_consents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  guest_name text not null,
  consent_text_version text not null default 'v1.0',
  consent_given boolean not null default true,
  photo_id uuid references public.photos(id) on delete cascade
);

alter table public.photo_consents enable row level security;

create policy "Allow public insert access to photo_consents"
  on public.photo_consents for insert
  with check (true);

create policy "Allow public read access to photo_consents"
  on public.photo_consents for select
  using (true);


-- 6. AUTOMATIC 2-DAY DELETION FUNCTION & CRON
create or replace function public.delete_old_wedding_photos()
returns void
language plpgsql
security definer
as $$
declare
  r record;
begin
  for r in 
    select id, storage_path 
    from public.photos 
    where created_at < now() - interval '2 days'
  loop
    delete from storage.objects
    where bucket_id = 'wedding-photos'
      and name = r.storage_path;

    delete from public.photo_consents
    where photo_id = r.id;

    delete from public.photos
    where id = r.id;
  end loop;
end;
$$;

