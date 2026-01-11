/**
 * LTV (Lifetime Value) Calculation
 * Calculate customer lifetime value by tier
 */

import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_TIERS, getTierFromPriceId } from '@/lib/subscription';
import { SubscriptionTier } from '@/types/subscription';

export interface LTVByTier {
  tier: SubscriptionTier;
  tierName: string;
  monthlyPrice: number;
  avgLifetimeMonths: number;
  ltv: number;
  sampleSize: number;
}

export interface LTVSummary {
  averageLTV: number;
  highestLTVTier: SubscriptionTier;
  lowestLTVTier: SubscriptionTier;
  totalProjectedLTV: number;  // LTV × active customers
  byTier: LTVByTier[];
}

/**
 * Calculate LTV for a specific tier
 */
export async function calculateLTV(tier: SubscriptionTier): Promise<LTVByTier> {
  if (tier === 'free') {
    return {
      tier: 'free',
      tierName: 'ฟรี',
      monthlyPrice: 0,
      avgLifetimeMonths: 0,
      ltv: 0,
      sampleSize: 0,
    };
  }

  const tierConfig = SUBSCRIPTION_TIERS[tier];
  const tierPrice = tierConfig.price;

  // Get all canceled subscriptions for this tier
  const canceledSubs = await prisma.subscription.findMany({
    where: {
      status: 'canceled',
      canceled_at: { not: null },
    },
    select: {
      stripe_price_id: true,
      created_at: true,
      canceled_at: true,
    },
  });

  // Filter by tier
  const tierSubs = canceledSubs.filter(sub => 
    getTierFromPriceId(sub.stripe_price_id) === tier
  );

  if (tierSubs.length === 0) {
    // If no canceled subs, estimate based on active subs
    const activeSubs = await prisma.subscription.findMany({
      where: {
        status: { in: ['active', 'trialing'] },
      },
      select: {
        stripe_price_id: true,
        created_at: true,
      },
    });

    const activeTierSubs = activeSubs.filter(sub =>
      getTierFromPriceId(sub.stripe_price_id) === tier
    );

    if (activeTierSubs.length === 0) {
      return {
        tier,
        tierName: tierConfig.nameTh,
        monthlyPrice: tierPrice,
        avgLifetimeMonths: 0,
        ltv: 0,
        sampleSize: 0,
      };
    }

    // Use average age of active subscriptions as estimate
    const now = new Date();
    const totalMonths = activeTierSubs.reduce((sum, sub) => {
      const months = (now.getTime() - sub.created_at.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return sum + months;
    }, 0);

    const avgMonths = totalMonths / activeTierSubs.length;
    // Estimate LTV as current avg × 2 (they're still active)
    const estimatedLifetime = avgMonths * 2;

    return {
      tier,
      tierName: tierConfig.nameTh,
      monthlyPrice: tierPrice,
      avgLifetimeMonths: Math.round(estimatedLifetime * 10) / 10,
      ltv: Math.round(tierPrice * estimatedLifetime),
      sampleSize: activeTierSubs.length,
    };
  }

  // Calculate average lifetime from canceled subscriptions
  const totalMonths = tierSubs.reduce((sum, sub) => {
    if (!sub.canceled_at) return sum;
    const months = (sub.canceled_at.getTime() - sub.created_at.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return sum + months;
  }, 0);

  const avgLifetimeMonths = totalMonths / tierSubs.length;
  const ltv = tierPrice * avgLifetimeMonths;

  return {
    tier,
    tierName: tierConfig.nameTh,
    monthlyPrice: tierPrice,
    avgLifetimeMonths: Math.round(avgLifetimeMonths * 10) / 10,
    ltv: Math.round(ltv),
    sampleSize: tierSubs.length,
  };
}

/**
 * Get LTV summary for all tiers
 */
export async function getLTVSummary(): Promise<LTVSummary> {
  const tiers: SubscriptionTier[] = ['basic', 'pro', 'vip'];
  
  const ltvByTier = await Promise.all(tiers.map(tier => calculateLTV(tier)));

  // Calculate weighted average LTV
  const totalSamples = ltvByTier.reduce((sum, t) => sum + t.sampleSize, 0);
  const weightedLTV = ltvByTier.reduce((sum, t) => sum + (t.ltv * t.sampleSize), 0);
  const averageLTV = totalSamples > 0 ? weightedLTV / totalSamples : 0;

  // Find highest and lowest LTV tiers (excluding zero)
  const nonZeroLTV = ltvByTier.filter(t => t.ltv > 0);
  const highestLTV = nonZeroLTV.length > 0 
    ? nonZeroLTV.reduce((max, t) => t.ltv > max.ltv ? t : max)
    : ltvByTier[0];
  const lowestLTV = nonZeroLTV.length > 0
    ? nonZeroLTV.reduce((min, t) => t.ltv < min.ltv ? t : min)
    : ltvByTier[0];

  // Calculate total projected LTV (active customers × their tier LTV)
  const activeSubscriptions = await prisma.subscription.findMany({
    where: {
      status: { in: ['active', 'trialing'] },
    },
    select: {
      stripe_price_id: true,
    },
  });

  const ltvMap: Record<SubscriptionTier, number> = {
    free: 0,
    basic: ltvByTier.find(t => t.tier === 'basic')?.ltv || 0,
    pro: ltvByTier.find(t => t.tier === 'pro')?.ltv || 0,
    vip: ltvByTier.find(t => t.tier === 'vip')?.ltv || 0,
  };

  const totalProjectedLTV = activeSubscriptions.reduce((sum, sub) => {
    const tier = getTierFromPriceId(sub.stripe_price_id);
    return sum + (tier ? ltvMap[tier] : 0);
  }, 0);

  return {
    averageLTV: Math.round(averageLTV),
    highestLTVTier: highestLTV.tier,
    lowestLTVTier: lowestLTV.tier,
    totalProjectedLTV: Math.round(totalProjectedLTV),
    byTier: ltvByTier,
  };
}

/**
 * Get LTV to CAC ratio (if CAC is tracked)
 * For now, return a placeholder since CAC isn't tracked
 */
export async function getLTVtoCACRatio(): Promise<{
  ltv: number;
  estimatedCAC: number;
  ratio: number;
}> {
  const summary = await getLTVSummary();
  
  // Estimated CAC (placeholder - would need marketing spend data)
  const estimatedCAC = 50; // ฿50 per customer acquisition estimate

  return {
    ltv: summary.averageLTV,
    estimatedCAC,
    ratio: estimatedCAC > 0 ? Math.round((summary.averageLTV / estimatedCAC) * 10) / 10 : 0,
  };
}
