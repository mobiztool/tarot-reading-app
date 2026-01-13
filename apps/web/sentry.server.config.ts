// Sentry Server-Side Configuration
// Captures errors in Next.js server components and API routes

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

    // Filter out common errors
    beforeSend(event) {
      // Only send errors in production
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Sentry Server]', event);
        return null;
      }

      return event;
    },
  });
} else {
  console.warn('[Sentry] NEXT_PUBLIC_SENTRY_DSN not configured');
}
