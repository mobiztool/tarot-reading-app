/**
 * Stripe Server-side SDK wrapper
 * Only for server-side use - contains secret key
 */
import Stripe from 'stripe';
import { config } from '@/lib/config';

/**
 * Stripe SDK instance for server-side operations
 * Uses secret key - NEVER expose to client
 */
export const stripe = new Stripe(config.stripeSecretKey, {
  // Using SDK's default API version for compatibility
  typescript: true,
  appInfo: {
    name: 'Tarot Reading App',
    version: '1.0.0',
  },
});

/**
 * Get Stripe API version being used
 */
export const getStripeApiVersion = (): string => {
  return config.stripeApiVersion;
};

/**
 * Check if Stripe server configuration is valid
 */
export const isStripeServerConfigured = (): boolean => {
  return Boolean(config.stripeSecretKey);
};
