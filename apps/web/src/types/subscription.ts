/**
 * Subscription Types
 * Centralized type definitions for subscription system
 */

/**
 * Subscription tiers available in the app
 */
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'vip';

/**
 * Subscription status values (matches Prisma enum)
 */
export type SubscriptionStatus = 
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'unpaid'
  | 'paused';

/**
 * All available tiers
 */
export const TIER_VALUES: SubscriptionTier[] = ['free', 'basic', 'pro', 'vip'];

/**
 * Check if a string is a valid subscription tier
 */
export function isValidTier(tier: string): tier is SubscriptionTier {
  return TIER_VALUES.includes(tier as SubscriptionTier);
}

/**
 * Get default tier
 */
export function getDefaultTier(): SubscriptionTier {
  return 'free';
}
