/**
 * Subscription Helper Functions
 * Utilities for checking subscription status and access
 */

import { SubscriptionTier, SubscriptionStatus } from '@/types/subscription';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_TIERS, canAccessSpread } from './tiers';

/**
 * Active subscription statuses
 */
const ACTIVE_STATUSES: SubscriptionStatus[] = ['active', 'trialing', 'past_due'];

/**
 * Map Stripe Price ID to subscription tier
 */
export function getTierFromPriceId(priceId: string): SubscriptionTier {
  const basicPriceId = process.env.STRIPE_PRICE_ID_BASIC;
  const proPriceId = process.env.STRIPE_PRICE_ID_PRO;
  const vipPriceId = process.env.STRIPE_PRICE_ID_VIP;

  if (priceId === vipPriceId) return 'vip';
  if (priceId === proPriceId) return 'pro';
  if (priceId === basicPriceId) return 'basic';
  return 'free';
}

/**
 * Get user's active subscription
 */
export async function getUserSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      user_id: userId,
      status: { in: ACTIVE_STATUSES },
    },
    orderBy: { created_at: 'desc' },
  });
}

/**
 * Check if user has an active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return !!subscription;
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
 * Check if user can access a specific feature/spread
 */
export async function canUserAccessSpread(
  userId: string,
  spreadType: string
): Promise<boolean> {
  const tier = await getUserTier(userId);
  return canAccessSpread(tier, spreadType);
}

/**
 * Get user's remaining readings for today
 * Returns -1 if unlimited
 */
export async function getRemainingReadingsToday(userId: string): Promise<number> {
  const tier = await getUserTier(userId);
  const tierConfig = SUBSCRIPTION_TIERS[tier];

  if (tierConfig.maxReadingsPerDay === -1) {
    return -1; // Unlimited
  }

  // Count today's readings
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayReadings = await prisma.reading.count({
    where: {
      user_id: userId,
      created_at: { gte: today },
    },
  });

  return Math.max(0, tierConfig.maxReadingsPerDay - todayReadings);
}

/**
 * Check if user can create a new reading
 */
export async function canCreateReading(userId: string): Promise<boolean> {
  const remaining = await getRemainingReadingsToday(userId);
  return remaining === -1 || remaining > 0;
}

/**
 * Get subscription by Stripe subscription ID
 */
export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  return prisma.subscription.findUnique({
    where: { stripe_subscription_id: stripeSubscriptionId },
  });
}

/**
 * Check if subscription is in grace period (canceled but still accessible)
 * Uses cancel_at field (DateTime) instead of cancel_at_period_end (boolean)
 */
export function isInGracePeriod(subscription: {
  status: SubscriptionStatus;
  cancel_at: Date | null;
  current_period_end: Date;
}): boolean {
  if (!subscription.cancel_at) {
    return false;
  }

  return (
    subscription.status === 'active' &&
    new Date() < new Date(subscription.cancel_at)
  );
}

/**
 * Get days until subscription ends
 */
export function getDaysUntilEnd(currentPeriodEnd: Date): number {
  const now = new Date();
  const end = new Date(currentPeriodEnd);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Format subscription status for display
 */
export function getStatusDisplayTh(status: SubscriptionStatus): string {
  const statusMap: Record<SubscriptionStatus, string> = {
    active: 'ใช้งาน',
    trialing: 'ทดลองใช้',
    past_due: 'ค้างชำระ',
    canceled: 'ยกเลิกแล้ว',
    paused: 'หยุดชั่วคราว',
    incomplete: 'รอชำระเงิน',
    incomplete_expired: 'หมดอายุ',
    unpaid: 'ไม่ชำระเงิน',
  };
  return statusMap[status];
}

/**
 * Get status badge color
 */
export function getStatusColor(status: SubscriptionStatus): string {
  const colorMap: Record<SubscriptionStatus, string> = {
    active: 'green',
    trialing: 'blue',
    past_due: 'yellow',
    canceled: 'gray',
    paused: 'orange',
    incomplete: 'yellow',
    incomplete_expired: 'red',
    unpaid: 'red',
  };
  return colorMap[status];
}
