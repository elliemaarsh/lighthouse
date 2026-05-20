import { createClient } from '@supabase/supabase-js';

// TODO: Add your Supabase credentials to .env.local
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Lighthouse] Supabase env vars missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.local',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
