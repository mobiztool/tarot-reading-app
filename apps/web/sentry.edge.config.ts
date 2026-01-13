// Sentry Edge Runtime Configuration
// Captures errors in Edge Runtime (Middleware, Edge API Routes)

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Debug mode (only in development)
    debug: process.env.NODE_ENV === 'development',
  });
} else {
  console.warn('[Sentry] NEXT_PUBLIC_SENTRY_DSN not configured');
}
