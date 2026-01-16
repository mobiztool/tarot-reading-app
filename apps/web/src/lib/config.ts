// Type-safe environment variable access
export const config = {
  // Database
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Analytics
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',

  // Error Tracking
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Stripe Payment Gateway
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  stripeApiVersion: process.env.STRIPE_API_VERSION || '2023-10-16',

  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  // Feature Flags - Premium Spreads Beta
  premiumSpreadsBeta: {
    enabled: process.env.NEXT_PUBLIC_PREMIUM_BETA_ENABLED === 'true',
    maxBetaUsers: parseInt(process.env.NEXT_PUBLIC_PREMIUM_BETA_MAX_USERS || '100', 10),
    feedbackEnabled: process.env.NEXT_PUBLIC_FEEDBACK_ENABLED !== 'false',
  },
} as const;

// Type guard for required env vars
export const validateRequiredEnvVars = (): void => {
  const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Check if analytics should be enabled
export const isAnalyticsEnabled = (): boolean => {
  return config.isProduction && typeof window !== 'undefined';
};
