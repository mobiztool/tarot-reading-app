// Type-safe environment variable access
export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
  sentryDsn: process.env.SENTRY_DSN || '',
} as const;

// Type guard for required env vars
export const validateRequiredEnvVars = (): void => {
  const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
