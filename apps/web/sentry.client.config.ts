// Sentry Client-Side Configuration
// Captures errors in the browser

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay (optional - captures user interactions)
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Debug mode (only in development)
    debug: process.env.NODE_ENV === 'development',

    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true, // Privacy: mask all text content
        blockAllMedia: true, // Privacy: block all media (images, videos)
      }),
      Sentry.browserTracingIntegration(),
    ],

    // Filter out common errors
    beforeSend(event, hint) {
      // Filter out non-errors
      if (event.exception) {
        const error = hint.originalException;

        // Ignore specific errors
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message);

          // Ignore common browser errors
          if (
            message.includes('ResizeObserver') ||
            message.includes('Non-Error promise rejection')
          ) {
            return null;
          }
        }
      }

      return event;
    },
  });
} else {
  console.warn('[Sentry] NEXT_PUBLIC_SENTRY_DSN not configured');
}
