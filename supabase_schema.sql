-- ==========================================================
-- SUPABASE DATABASE & STORAGE SCHEMA FOR DIJITAL WEDDING INVITATION
-- ==========================================================

-- 1. STORAGE BUCKET CREATION
-- Bucket for guest uploaded photos
insert into storage.buckets (id, name, public) 
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do nothing;

-- Storage Bucket Policies
-- Allow public select/read of wedding photos
create policy "Public Access to Wedding Photos" 
on storage.objects for select 
using (bucket_id = 'wedding-photos');

-- Allow public insert/upload of wedding photos
create policy "Public Upload to Wedding Photos" 
on storage.objects for insert 
with check (bucket_id = 'wedding-photos');


-- 2. PHOTOS TABLE
-- Stores uploaded photo references, optional guest name, and memory message
create table if not exists public.photos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  guest_name text,
  message text,
  photo_url text not null,
  storage_path text not null
);

-- Enable RLS on photos
alter table public.photos enable row level security;

-- RLS Policies for photos
create policy "Allow public read access to photos"
  on public.photos for select
  using (true);

create policy "Allow public insert access to photos"
  on public.photos for insert
  with check (true);


-- 3. MESSAGES TABLE
-- Stores text-only guestbook messages
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  guest_name text not null,
  message text not null
);

-- Enable RLS on messages
alter table public.messages enable row level security;

-- RLS Policies for messages
create policy "Allow public read access to messages"
  on public.messages for select
  using (true);

create policy "Allow public insert access to messages"
  on public.messages for insert
  with check (true);


-- 4. ATTENDANCE TABLE (RSVP)
-- Stores RSVP responses
create table if not exists public.attendance (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  guest_name text not null,
  status text not null check (status in ('attending', 'declined', 'maybe')),
  guest_count integer default 1,
  note text
);

-- Enable RLS on attendance
alter table public.attendance enable row level security;

-- RLS Policies for attendance
create policy "Allow public insert access to attendance"
  on public.attendance for insert
  with check (true);

create policy "Allow public read access to attendance"
  on public.attendance for select
  using (true);
