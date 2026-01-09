import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing. Returning mock client.");
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        signInWithOAuth: async () => ({ error: null }),
        verifyOtp: async () => ({ error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: () => ({ data: [], error: null }),
          }),
          order: () => ({ data: [], error: null }),
        }),
        insert: () => ({
          select: () => ({ single: async () => ({ data: null, error: null }) }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: async () => ({ data: null, error: null }),
            }),
          }),
        }),
        delete: () => ({ eq: () => ({ data: null, error: null }) }),
      }),
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
