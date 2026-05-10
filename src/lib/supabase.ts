import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase credentials.\n" +
    "• Local dev: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local\n" +
    "• GitHub Pages: add them as repository secrets in Settings → Secrets → Actions"
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
