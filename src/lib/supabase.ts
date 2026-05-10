import { createClient } from '@supabase/supabase-js';

// TODO: Replace these placeholders with your actual Supabase project credentials.
// Find them in your Supabase dashboard → Settings → API
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Once credentials are set, update src/lib/storage.ts to call Supabase instead of localStorage.
// The database schema is in supabase/schema.sql.
