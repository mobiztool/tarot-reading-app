/**
 * Stripe Integration
 * Public exports for Stripe functionality
 */

// Client-side exports (safe for browser)
export { getStripe, isStripeConfigured } from './client';

// Error handling exports
export {
  handleStripeError,
  isStripeError,
  logStripeError,
  type StripeErrorResponse,
  type StripeErrorType,
} from './errors';

// Server-side exports (only import in server components/API routes)
// Note: Import directly from './server' and './customer' in server-side code
// to avoid accidentally exposing server code to client
