/**
 * Stripe Client-side SDK wrapper
 * Safe to use in browser - only uses publishable key
 */
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { config } from '@/lib/config';

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe.js instance for client-side usage
 * Singleton pattern to avoid multiple SDK loads
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = config.stripePublishableKey;
    
    if (!publishableKey) {
      console.error('Stripe publishable key is not configured');
      return Promise.resolve(null);
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

/**
 * Check if Stripe is properly configured
 */
export const isStripeConfigured = (): boolean => {
  return Boolean(config.stripePublishableKey);
};
