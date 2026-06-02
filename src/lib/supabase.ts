import { createClient } from '@supabase/supabase-js';

// Supabase anon key is designed to be public (used with RLS policies).
// It is NOT a secret — Supabase explicitly documents this as a publishable key.
// Security is enforced via Row Level Security (RLS) on the database side.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://crtjfemyudugyabuulas.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_kLEIdOsLYse0Bu2Lh3chBg_HOqjm8cn';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
