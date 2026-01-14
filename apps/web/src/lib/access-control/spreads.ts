/**
 * Spread Access Control - Server-Side Functions
 * Controls which spreads are accessible based on subscription tier
 * Story 6.3: Feature Gating by Subscription Tier
 * 
 * NOTE: This file contains Prisma queries and should only be used server-side.
 * For client components, use spread-info.ts instead.
 */

import { SubscriptionTier } from '@/types/subscription';
import { prisma } from '@/lib/prisma';

// Re-export client-safe types and constants
export {
  type SpreadType,
  type SpreadInfo,
  SPREAD_ACCESS_MATRIX,
  SPREAD_INFO,
  TIER_LEVELS,
} from './spread-info';

// Import for local use
import { type SpreadType, SPREAD_ACCESS_MATRIX, TIER_LEVELS } from './spread-info';

/**
 * Map Stripe Price ID to subscription tier
 */
function getTierFromPriceId(priceId: string): SubscriptionTier {
  const basicPriceId = process.env.STRIPE_PRICE_ID_BASIC;
  const proPriceId = process.env.STRIPE_PRICE_ID_PRO;
  const vipPriceId = process.env.STRIPE_PRICE_ID_VIP;

  if (priceId === vipPriceId) return 'vip';
  if (priceId === proPriceId) return 'pro';
  if (priceId === basicPriceId) return 'basic';
  return 'free';
}

/**
 * Get user's current tier from their active subscription
 */
export async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      user_id: userId,
      status: { in: ['active', 'trialing'] },
    },
    orderBy: { created_at: 'desc' },
    select: { stripe_price_id: true },
  });
  
  if (!subscription) return 'free';
  return getTierFromPriceId(subscription.stripe_price_id);
}

/**
 * Get user's active subscription with grace period check
 */
export async function getUserSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      user_id: userId,
      status: { in: ['active', 'trialing', 'past_due'] },
    },
    orderBy: { created_at: 'desc' },
  });
}

export interface AccessCheckResult {
  allowed: boolean;
  reason?: string;
  requiredTier?: SubscriptionTier;
  currentTier: SubscriptionTier;
}

/**
 * Check if user can access a specific spread
 */
export async function canAccessSpread(
  userId: string | null,
  spreadType: SpreadType
): Promise<AccessCheckResult> {
  // Guest users = FREE tier
  const currentTier: SubscriptionTier = userId ? await getUserTier(userId) : 'free';

  // Check if spread exists
  const allowedTiers = SPREAD_ACCESS_MATRIX[spreadType];
  if (!allowedTiers) {
    return {
      allowed: false,
      reason: 'Spread type not found',
      currentTier,
    };
  }

  // Check if tier has access
  const allowed = allowedTiers.includes(currentTier);

  if (!allowed) {
    const requiredTier = allowedTiers[0];
    return {
      allowed: false,
      reason: `ต้องการแพ็คเกจ ${getTierNameTh(requiredTier)} หรือสูงกว่า`,
      requiredTier,
      currentTier,
    };
  }

  // Check grace period for canceled subscriptions (using cancel_at field)
  if (userId && currentTier !== 'free') {
    const subscription = await getUserSubscription(userId);
    if (subscription?.cancel_at) {
      const now = new Date();
      const cancelAt = new Date(subscription.cancel_at);
      if (now > cancelAt) {
        const requiredTier = getTierFromPriceId(subscription.stripe_price_id);
        return {
          allowed: false,
          reason: 'Subscription expired',
          requiredTier,
          currentTier: 'free',
        };
      }
    }
  }

  return { allowed: true, currentTier };
}

/**
 * Get tier name in Thai
 */
export function getTierNameTh(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    free: 'ฟรี',
    basic: 'Basic',
    pro: 'Pro',
    vip: 'VIP',
  };
  return names[tier];
}

/**
 * Get minimum tier required for a spread
 */
export function getMinimumTierForSpread(spreadType: SpreadType): SubscriptionTier {
  return SPREAD_ACCESS_MATRIX[spreadType]?.[0] || 'free';
}

/**
 * Get all spreads accessible for a tier
 */
export function getSpreadsForTier(tier: SubscriptionTier): SpreadType[] {
  return Object.entries(SPREAD_ACCESS_MATRIX)
    .filter(([, tiers]) => tiers.includes(tier))
    .map(([spread]) => spread as SpreadType);
}

/**
 * Get all locked spreads for a tier
 */
export function getLockedSpreadsForTier(tier: SubscriptionTier): SpreadType[] {
  return Object.entries(SPREAD_ACCESS_MATRIX)
    .filter(([, tiers]) => !tiers.includes(tier))
    .map(([spread]) => spread as SpreadType);
}

/**
 * Get spread count by tier
 */
export function getSpreadCountByTier(): Record<SubscriptionTier, number> {
  return {
    free: getSpreadsForTier('free').length,
    basic: getSpreadsForTier('basic').length,
    pro: getSpreadsForTier('pro').length,
    vip: getSpreadsForTier('vip').length,
  };
}

/**
 * Check if tier is higher than another
 */
export function isHigherTier(tier1: SubscriptionTier, tier2: SubscriptionTier): boolean {
  return TIER_LEVELS[tier1] > TIER_LEVELS[tier2];
}
