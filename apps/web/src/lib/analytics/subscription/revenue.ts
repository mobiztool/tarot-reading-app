/**
 * Revenue Calculations
 * MRR, ARR, Revenue per User, and other financial metrics
 */

import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_TIERS, getTierFromPriceId } from '@/lib/subscription';
import { SubscriptionTier } from '@/types/subscription';

export interface RevenueMetrics {
  mrr: number;           // Monthly Recurring Revenue (in THB)
  arr: number;           // Annual Recurring Revenue (in THB)
  revenuePerUser: number; // Average revenue per paying user
  totalRevenue: number;   // Total collected revenue
  monthlyGrowth: number;  // Month-over-month growth percentage
}

export interface RevenueByTier {
  tier: SubscriptionTier;
  tierName: string;
  activeSubscriptions: number;
  mrr: number;
  percentage: number;
}

/**
 * Calculate Monthly Recurring Revenue
 * Sum of all active subscription prices
 */
export async function calculateMRR(): Promise<number> {
  const activeSubscriptions = await prisma.subscription.findMany({
    where: {
      status: { in: ['active', 'trialing'] },
    },
    select: {
      stripe_price_id: true,
    },
  });

  const mrr = activeSubscriptions.reduce((sum, sub) => {
    const tier = getTierFromPriceId(sub.stripe_price_id);
    if (tier && SUBSCRIPTION_TIERS[tier]) {
      return sum + SUBSCRIPTION_TIERS[tier].price;
    }
    return sum;
  }, 0);

  return mrr;
}

/**
 * Calculate Annual Recurring Revenue
 * MRR × 12
 */
export async function calculateARR(): Promise<number> {
  const mrr = await calculateMRR();
  return mrr * 12;
}

/**
 * Calculate Average Revenue Per User (ARPU)
 * Total revenue divided by total paying users
 */
export async function calculateRevenuePerUser(): Promise<number> {
  // Sum of all paid invoices
  const totalRevenue = await prisma.invoice.aggregate({
    where: { status: 'paid' },
    _sum: { amount: true },
  });

  // Count of users with at least one paid subscription
  const payingUsers = await prisma.user.count({
    where: {
      subscriptions: {
        some: {
          status: { in: ['active', 'canceled', 'trialing'] },
        },
      },
    },
  });

  if (payingUsers === 0) return 0;
  
  // Amount is in satang (cents), convert to THB
  return ((totalRevenue._sum.amount || 0) / 100) / payingUsers;
}

/**
 * Calculate total collected revenue
 */
export async function calculateTotalRevenue(): Promise<number> {
  const result = await prisma.invoice.aggregate({
    where: { status: 'paid' },
    _sum: { amount: true },
  });

  // Convert from satang to THB
  return (result._sum.amount || 0) / 100;
}

/**
 * Calculate month-over-month growth
 */
export async function calculateMonthlyGrowth(): Promise<number> {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // This month's revenue
  const thisMonthRevenue = await prisma.invoice.aggregate({
    where: {
      status: 'paid',
      paid_at: { gte: thisMonthStart },
    },
    _sum: { amount: true },
  });

  // Last month's revenue
  const lastMonthRevenue = await prisma.invoice.aggregate({
    where: {
      status: 'paid',
      paid_at: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
    _sum: { amount: true },
  });

  const thisMonth = thisMonthRevenue._sum.amount || 0;
  const lastMonth = lastMonthRevenue._sum.amount || 0;

  if (lastMonth === 0) return thisMonth > 0 ? 100 : 0;

  return ((thisMonth - lastMonth) / lastMonth) * 100;
}

/**
 * Get all revenue metrics
 */
export async function getRevenueMetrics(): Promise<RevenueMetrics> {
  const [mrr, arr, revenuePerUser, totalRevenue, monthlyGrowth] = await Promise.all([
    calculateMRR(),
    calculateARR(),
    calculateRevenuePerUser(),
    calculateTotalRevenue(),
    calculateMonthlyGrowth(),
  ]);

  return {
    mrr,
    arr,
    revenuePerUser,
    totalRevenue,
    monthlyGrowth,
  };
}

/**
 * Get revenue breakdown by tier
 */
export async function getRevenueByTier(): Promise<RevenueByTier[]> {
  const activeSubscriptions = await prisma.subscription.findMany({
    where: {
      status: { in: ['active', 'trialing'] },
    },
    select: {
      stripe_price_id: true,
    },
  });

  // Group by tier
  const tierCounts: Record<SubscriptionTier, number> = {
    free: 0,
    basic: 0,
    pro: 0,
    vip: 0,
  };

  activeSubscriptions.forEach(sub => {
    const tier = getTierFromPriceId(sub.stripe_price_id);
    if (tier && tier !== 'free') {
      tierCounts[tier]++;
    }
  });

  const totalMRR = await calculateMRR();

  // Build result for paid tiers only
  const result: RevenueByTier[] = [];
  const paidTiers: SubscriptionTier[] = ['basic', 'pro', 'vip'];

  for (const tier of paidTiers) {
    const count = tierCounts[tier];
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    const tierMRR = count * tierConfig.price;

    result.push({
      tier,
      tierName: tierConfig.nameTh,
      activeSubscriptions: count,
      mrr: tierMRR,
      percentage: totalMRR > 0 ? (tierMRR / totalMRR) * 100 : 0,
    });
  }

  return result;
}
