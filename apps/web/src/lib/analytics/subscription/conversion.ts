/**
 * Conversion Funnel Analytics
 * Track user journey from free to paid tiers
 */

import { prisma } from '@/lib/prisma';
import { getTierFromPriceId } from '@/lib/subscription';
import { SubscriptionTier } from '@/types/subscription';

export interface ConversionFunnel {
  totalUsers: number;
  freeUsers: number;
  upgradedUsers: number;
  basicUsers: number;
  proUsers: number;
  vipUsers: number;
  conversionRate: number;  // % of free users who upgraded
  basicToProRate: number;  // % of basic who upgraded to pro
  proToVipRate: number;    // % of pro who upgraded to vip
}

export interface TierConversionRate {
  fromTier: SubscriptionTier;
  toTier: SubscriptionTier;
  count: number;
  rate: number;
}

/**
 * Get conversion funnel data
 */
export async function getConversionFunnel(daysBack: number = 30): Promise<ConversionFunnel> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  // Total registered users
  const totalUsers = await prisma.user.count();

  // Users with active subscriptions by tier
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: { in: ['active', 'trialing'] },
    },
    select: {
      stripe_price_id: true,
      user_id: true,
    },
    distinct: ['user_id'],
  });

  // Count by tier
  let basicUsers = 0;
  let proUsers = 0;
  let vipUsers = 0;

  subscriptions.forEach(sub => {
    const tier = getTierFromPriceId(sub.stripe_price_id);
    switch (tier) {
      case 'basic':
        basicUsers++;
        break;
      case 'pro':
        proUsers++;
        break;
      case 'vip':
        vipUsers++;
        break;
    }
  });

  const upgradedUsers = basicUsers + proUsers + vipUsers;
  const freeUsers = totalUsers - upgradedUsers;

  // Calculate conversion rates
  const conversionRate = totalUsers > 0 ? (upgradedUsers / totalUsers) * 100 : 0;
  
  // For tier upgrade rates, we would need to track historical data
  // For now, use simplified calculation based on current distribution
  const basicToProRate = basicUsers > 0 ? (proUsers / (basicUsers + proUsers + vipUsers)) * 100 : 0;
  const proToVipRate = proUsers > 0 ? (vipUsers / (proUsers + vipUsers)) * 100 : 0;

  return {
    totalUsers,
    freeUsers,
    upgradedUsers,
    basicUsers,
    proUsers,
    vipUsers,
    conversionRate: Math.round(conversionRate * 100) / 100,
    basicToProRate: Math.round(basicToProRate * 100) / 100,
    proToVipRate: Math.round(proToVipRate * 100) / 100,
  };
}

/**
 * Get funnel data for visualization (stage-by-stage)
 */
export async function getFunnelStages(): Promise<{ stage: string; count: number; percentage: number }[]> {
  const funnel = await getConversionFunnel();
  
  const stages = [
    { stage: 'ผู้ใช้ทั้งหมด', count: funnel.totalUsers },
    { stage: 'ผู้ใช้ฟรี', count: funnel.freeUsers },
    { stage: 'สมาชิก Basic', count: funnel.basicUsers },
    { stage: 'สมาชิก Pro', count: funnel.proUsers },
    { stage: 'สมาชิก VIP', count: funnel.vipUsers },
  ];

  const maxCount = stages[0].count || 1;

  return stages.map(stage => ({
    ...stage,
    percentage: Math.round((stage.count / maxCount) * 100),
  }));
}

/**
 * Get pricing page views vs conversions (if tracked)
 */
export async function getPricingPageConversion(daysBack: number = 30): Promise<{
  pageViews: number;
  checkoutStarts: number;
  successfulPayments: number;
  conversionRate: number;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  // Count analytics events for pricing page
  const [pageViews, checkoutStarts] = await Promise.all([
    prisma.analyticsEvent.count({
      where: {
        event_type: 'spread_page_view',
        metadata: {
          path: ['page'],
          equals: 'pricing',
        },
        created_at: { gte: startDate },
      },
    }),
    // For checkout starts, count based on subscription creation
    prisma.subscription.count({
      where: {
        created_at: { gte: startDate },
      },
    }),
  ]);

  // Successful payments
  const successfulPayments = await prisma.invoice.count({
    where: {
      status: 'paid',
      created_at: { gte: startDate },
    },
  });

  const conversionRate = pageViews > 0 ? (successfulPayments / pageViews) * 100 : 0;

  return {
    pageViews,
    checkoutStarts,
    successfulPayments,
    conversionRate: Math.round(conversionRate * 100) / 100,
  };
}

/**
 * Get upgrade paths (which tier users typically upgrade from/to)
 */
export async function getUpgradePaths(): Promise<TierConversionRate[]> {
  // This would require tracking tier changes in a separate table
  // For now, return placeholder data based on current distribution
  const funnel = await getConversionFunnel();
  
  const paths: TierConversionRate[] = [
    {
      fromTier: 'free',
      toTier: 'basic',
      count: funnel.basicUsers,
      rate: funnel.totalUsers > 0 ? (funnel.basicUsers / funnel.totalUsers) * 100 : 0,
    },
    {
      fromTier: 'free',
      toTier: 'pro',
      count: Math.floor(funnel.proUsers * 0.3), // Estimate 30% direct
      rate: funnel.totalUsers > 0 ? ((funnel.proUsers * 0.3) / funnel.totalUsers) * 100 : 0,
    },
    {
      fromTier: 'basic',
      toTier: 'pro',
      count: Math.floor(funnel.proUsers * 0.7), // Estimate 70% from basic
      rate: funnel.basicUsers > 0 ? ((funnel.proUsers * 0.7) / funnel.basicUsers) * 100 : 0,
    },
    {
      fromTier: 'pro',
      toTier: 'vip',
      count: funnel.vipUsers,
      rate: funnel.proUsers > 0 ? (funnel.vipUsers / funnel.proUsers) * 100 : 0,
    },
  ];

  return paths.map(p => ({
    ...p,
    rate: Math.round(p.rate * 100) / 100,
  }));
}
