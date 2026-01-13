/**
 * Retention Analysis
 * Track user retention by tier and cohort
 */

import { prisma } from '@/lib/prisma';
import { getTierFromPriceId, SUBSCRIPTION_TIERS } from '@/lib/subscription';
import { SubscriptionTier } from '@/types/subscription';

export interface RetentionByTier {
  tier: SubscriptionTier;
  tierName: string;
  totalSubscriptions: number;
  stillActive: number;
  retentionRate: number;
  avgDaysActive: number;
}

export interface CohortRetention {
  cohortMonth: string;  // YYYY-MM
  totalUsers: number;
  retainedByMonth: number[];  // Array of retained users at month 1, 2, 3, etc.
  retentionRates: number[];   // Percentage retained at each month
}

/**
 * Get retention rate by tier
 * Looks at subscriptions created 30+ days ago
 */
export async function getRetentionByTier(): Promise<RetentionByTier[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all subscriptions created more than 30 days ago
  const oldSubscriptions = await prisma.subscription.findMany({
    where: {
      created_at: { lte: thirtyDaysAgo },
    },
    select: {
      id: true,
      stripe_price_id: true,
      status: true,
      created_at: true,
      canceled_at: true,
    },
  });

  // Group by tier
  const tierData: Record<SubscriptionTier, {
    total: number;
    active: number;
    totalDays: number;
  }> = {
    free: { total: 0, active: 0, totalDays: 0 },
    basic: { total: 0, active: 0, totalDays: 0 },
    pro: { total: 0, active: 0, totalDays: 0 },
    vip: { total: 0, active: 0, totalDays: 0 },
  };

  const now = new Date();

  oldSubscriptions.forEach(sub => {
    const tier = getTierFromPriceId(sub.stripe_price_id);
    if (!tier || tier === 'free') return;

    tierData[tier].total++;
    
    if (['active', 'trialing'].includes(sub.status)) {
      tierData[tier].active++;
      // Days active = now - created
      const daysActive = Math.floor((now.getTime() - sub.created_at.getTime()) / (1000 * 60 * 60 * 24));
      tierData[tier].totalDays += daysActive;
    } else if (sub.canceled_at) {
      // Days active = canceled - created
      const daysActive = Math.floor((sub.canceled_at.getTime() - sub.created_at.getTime()) / (1000 * 60 * 60 * 24));
      tierData[tier].totalDays += daysActive;
    }
  });

  // Build result
  const paidTiers: SubscriptionTier[] = ['basic', 'pro', 'vip'];
  
  return paidTiers.map(tier => ({
    tier,
    tierName: SUBSCRIPTION_TIERS[tier].nameTh,
    totalSubscriptions: tierData[tier].total,
    stillActive: tierData[tier].active,
    retentionRate: tierData[tier].total > 0 
      ? Math.round((tierData[tier].active / tierData[tier].total) * 10000) / 100
      : 0,
    avgDaysActive: tierData[tier].total > 0
      ? Math.round(tierData[tier].totalDays / tierData[tier].total)
      : 0,
  }));
}

/**
 * Get cohort retention (monthly cohorts)
 * Shows how many users from each monthly cohort are still active
 */
export async function getCohortRetention(monthsBack: number = 6): Promise<CohortRetention[]> {
  const cohorts: CohortRetention[] = [];
  const now = new Date();

  for (let i = monthsBack; i >= 1; i--) {
    const cohortStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const cohortEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const cohortMonth = cohortStart.toISOString().slice(0, 7); // YYYY-MM

    // Get subscriptions created in this cohort
    const cohortSubs = await prisma.subscription.findMany({
      where: {
        created_at: {
          gte: cohortStart,
          lte: cohortEnd,
        },
      },
      select: {
        id: true,
        status: true,
        canceled_at: true,
        created_at: true,
      },
    });

    const totalUsers = cohortSubs.length;
    if (totalUsers === 0) {
      cohorts.push({
        cohortMonth,
        totalUsers: 0,
        retainedByMonth: [],
        retentionRates: [],
      });
      continue;
    }

    // Calculate retention for each subsequent month
    const retainedByMonth: number[] = [];
    const retentionRates: number[] = [];

    for (let month = 1; month <= i; month++) {
      const checkDate = new Date(cohortStart);
      checkDate.setMonth(checkDate.getMonth() + month);

      // Count users still active at this point
      const retained = cohortSubs.filter(sub => {
        // If currently active
        if (['active', 'trialing'].includes(sub.status)) {
          return true;
        }
        // If canceled, check if cancel date was after check date
        if (sub.canceled_at && sub.canceled_at >= checkDate) {
          return true;
        }
        return false;
      }).length;

      retainedByMonth.push(retained);
      retentionRates.push(Math.round((retained / totalUsers) * 100));
    }

    cohorts.push({
      cohortMonth,
      totalUsers,
      retainedByMonth,
      retentionRates,
    });
  }

  return cohorts;
}

/**
 * Get average subscription lifetime in days
 */
export async function getAverageSubscriptionLifetime(): Promise<number> {
  const canceledSubs = await prisma.subscription.findMany({
    where: {
      status: 'canceled',
      canceled_at: { not: null },
    },
    select: {
      created_at: true,
      canceled_at: true,
    },
  });

  if (canceledSubs.length === 0) return 0;

  const totalDays = canceledSubs.reduce((sum, sub) => {
    if (!sub.canceled_at) return sum;
    const days = Math.floor((sub.canceled_at.getTime() - sub.created_at.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  return Math.round(totalDays / canceledSubs.length);
}

/**
 * Get churn rate by tier
 */
export async function getChurnRateByTier(): Promise<{ tier: SubscriptionTier; churnRate: number }[]> {
  const retention = await getRetentionByTier();
  
  return retention.map(r => ({
    tier: r.tier,
    churnRate: Math.round((100 - r.retentionRate) * 100) / 100,
  }));
}
