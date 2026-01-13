import { createBrowserClient } from '@supabase/ssr';

// Cached client instance
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Return cached client if available
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time or SSG, these might not be available
  // Return a mock client that will be replaced at runtime
  if (!supabaseUrl || !supabaseAnonKey) {
    // Only throw on client-side when actually trying to use the client
    if (typeof window !== 'undefined') {
      throw new Error(
        'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
    }
    // During SSG/build, return a placeholder that won't be used
    return null as unknown as ReturnType<typeof createBrowserClient>;
  }

  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

