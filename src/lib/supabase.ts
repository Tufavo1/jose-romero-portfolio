import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function buildPublicClient(): SupabaseClient {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (missing.length)
    throw new Error(
      `Missing required Supabase env vars: ${missing.join(", ")}`,
    );
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function buildAdminClient(): SupabaseClient {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length)
    throw new Error(
      `Missing required Supabase env vars: ${missing.join(", ")}`,
    );
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

let _supabase: SupabaseClient | undefined;
let _supabaseAdmin: SupabaseClient | undefined;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string | symbol) {
    if (!_supabase) _supabase = buildPublicClient();
    const value = Reflect.get(_supabase, prop, _supabase);
    if (typeof value === "function") return (value as Function).bind(_supabase);
    return value;
  },
});

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop: string | symbol) {
    if (!_supabaseAdmin) _supabaseAdmin = buildAdminClient();
    const value = Reflect.get(_supabaseAdmin, prop, _supabaseAdmin);
    if (typeof value === "function")
      return (value as Function).bind(_supabaseAdmin);
    return value;
  },
});
