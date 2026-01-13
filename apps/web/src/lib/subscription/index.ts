/**
 * Subscription Module
 * Public exports for subscription functionality
 */

// Tier configuration
export {
  SUBSCRIPTION_TIERS,
  TIER_PRICES,
  getTierConfig,
  getTierNameTh,
  getTierPrice,
  getTierPriceId,
  canAccessSpread,
  getPaidTiers,
  compareTiers,
  isHigherTier,
  type TierConfig,
} from './tiers';

// Helper functions
export {
  getUserSubscription,
  hasActiveSubscription,
  getUserTier,
  getTierFromPriceId,
  canUserAccessSpread,
  getRemainingReadingsToday,
  canCreateReading,
  getSubscriptionByStripeId,
  isInGracePeriod,
  getDaysUntilEnd,
  getStatusDisplayTh,
  getStatusColor,
} from './helpers';
