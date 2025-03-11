
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables if available, otherwise fallback to the values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://nvqmtnvlcnsskxvvxrtf.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cW10bnZsY25zc2t4dnZ4cnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTIxNzgsImV4cCI6MjA1NzAyODE3OH0.9mqDpwF9jXaS4jB9l30fueHuHDiYooQDXfhkiQu76kc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
