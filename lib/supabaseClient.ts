import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Fallback empty client if env vars are missing to avoid app runtime crashes
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

/**
 * Types matching Supabase database schema
 */
export interface PhotoRecord {
  id: string;
  created_at: string;
  guest_name?: string;
  message?: string;
  photo_url: string;
  storage_path: string;
}

export interface MessageRecord {
  id: string;
  created_at: string;
  guest_name: string;
  message: string;
}

export interface AttendanceRecord {
  id: string;
  created_at: string;
  guest_name: string;
  status: 'attending' | 'declined' | 'maybe';
  guest_count: number;
  note?: string;
}

export interface PhotoConsentRecord {
  id: string;
  created_at: string;
  guest_name: string;
  consent_text_version: string;
  consent_given: boolean;
  photo_id?: string;
}
