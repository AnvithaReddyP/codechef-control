import { createClient } from '@supabase/supabase-js';

// We fallback to dummy strings to avoid crashes at build time,
// but real queries will fail if these are not provided in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

export const isMockConfigured = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export const supabase = createClient(supabaseUrl, supabaseKey);
