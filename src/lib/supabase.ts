import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente público (lectura desde el sitio)
export const supabase = createClient(url, anon);

// Cliente admin (escritura desde API routes)
export const supabaseAdmin = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});
