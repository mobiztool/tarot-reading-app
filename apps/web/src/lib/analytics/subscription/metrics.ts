/**
 * Subscription Metrics
 * New subscriptions, cancellations, churn rate, tier distribution
 */

import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_TIERS, getTierFromPriceId } from '@/lib/subscription';
import { SubscriptionTier } from '@/types/subscription';

export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface SubscriptionMetrics {
  newSubscriptions: number;
  cancellations: number;
  activeSubscriptions: number;
  trialingSubscriptions: number;
  churnRate: number;      // Percentage
  netGrowth: number;      // New - Cancellations
}

export interface TierDistribution {
  tier: SubscriptionTier;
  tierName: string;
  count: number;
  percentage: number;
}

/**
 * Get start date based on period
 */
function getStartDate(now: Date, period: TimePeriod): Date {
  const date = new Date(now);
  
  switch (period) {
    case 'day':
      date.setDate(date.getDate() - 1);
      break;
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'quarter':
      date.setMonth(date.getMonth() - 3);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
  }
  
  return date;
}

/**
 * Get subscription metrics for a time period
 */
export async function getSubscriptionMetrics(period: TimePeriod = 'month'): Promise<SubscriptionMetrics> {
  const now = new Date();
  const startDate = getStartDate(now, period);

  const [newSubs, cancellations, active, trialing] = await Promise.all([
    // New subscriptions in period
    prisma.subscription.count({
      where: {
        created_at: { gte: startDate },
        status: { in: ['active', 'trialing'] },
      },
    }),
    
    // Cancellations in period
    prisma.subscription.count({
      where: {
        canceled_at: { gte: startDate },
      },
    }),
    
    // Currently active
    prisma.subscription.count({
      where: {
        status: 'active',
      },
    }),
    
    // Currently trialing
    prisma.subscription.count({
      where: {
        status: 'trialing',
      },
    }),
  ]);

  // Churn rate = cancellations / (active at start of period + new subs)
  // Simplified: cancellations / (active + cancellations)
  const totalBase = active + trialing + cancellations;
  const churnRate = totalBase > 0 ? (cancellations / totalBase) * 100 : 0;

  return {
    newSubscriptions: newSubs,
    cancellations,
    activeSubscriptions: active,
    trialingSubscriptions: trialing,
    churnRate: Math.round(churnRate * 100) / 100,
    netGrowth: newSubs - cancellations,
  };
}

/**
 * Get tier distribution for active subscriptions
 */
export async function getTierDistribution(): Promise<TierDistribution[]> {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: { in: ['active', 'trialing'] },
    },
    select: {
      stripe_price_id: true,
    },
  });

  // Count by tier
  const tierCounts: Record<SubscriptionTier, number> = {
    free: 0,
    basic: 0,
    pro: 0,
    vip: 0,
  };

  subscriptions.forEach(sub => {
    const tier = getTierFromPriceId(sub.stripe_price_id);
    if (tier && tier !== 'free') {
      tierCounts[tier]++;
    }
  });

  // Add free users (users without active subscription)
  const freeUsers = await prisma.user.count({
    where: {
      subscriptions: {
        none: {
          status: { in: ['active', 'trialing'] },
        },
      },
    },
  });
  tierCounts.free = freeUsers;

  const total = Object.values(tierCounts).reduce((sum, count) => sum + count, 0);

  // Build result
  const allTiers: SubscriptionTier[] = ['free', 'basic', 'pro', 'vip'];
  
  return allTiers.map(tier => ({
    tier,
    tierName: SUBSCRIPTION_TIERS[tier].nameTh,
    count: tierCounts[tier],
    percentage: total > 0 ? Math.round((tierCounts[tier] / total) * 1000) / 10 : 0,
  }));
}

/**
 * Get daily new subscriptions for a time range (for charts)
 */
export async function getDailyNewSubscriptions(days: number = 30): Promise<{ date: string; count: number }[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const subscriptions = await prisma.subscription.findMany({
    where: {
      created_at: { gte: startDate },
      status: { in: ['active', 'trialing', 'canceled'] },
    },
    select: {
      created_at: true,
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  // Group by date
  const dailyCounts: Record<string, number> = {};
  
  // Initialize all dates with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    dailyCounts[dateStr] = 0;
  }

  // Count subscriptions by date
  subscriptions.forEach(sub => {
    const dateStr = sub.created_at.toISOString().split('T')[0];
    if (dailyCounts[dateStr] !== undefined) {
      dailyCounts[dateStr]++;
    }
  });

  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
  }));
}

/**
 * Get daily cancellations for a time range (for charts)
 */
export async function getDailyCancellations(days: number = 30): Promise<{ date: string; count: number }[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const cancellations = await prisma.subscription.findMany({
    where: {
      canceled_at: { gte: startDate },
    },
    select: {
      canceled_at: true,
    },
    orderBy: {
      canceled_at: 'asc',
    },
  });

  // Group by date
  const dailyCounts: Record<string, number> = {};
  
  // Initialize all dates with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    dailyCounts[dateStr] = 0;
  }

  // Count cancellations by date
  cancellations.forEach(sub => {
    if (sub.canceled_at) {
      const dateStr = sub.canceled_at.toISOString().split('T')[0];
      if (dailyCounts[dateStr] !== undefined) {
        dailyCounts[dateStr]++;
      }
    }
  });

  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
  }));
}
