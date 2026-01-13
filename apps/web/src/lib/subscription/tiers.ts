/**
 * Subscription Tier Configuration
 * Defines all subscription tiers with features, pricing, and access levels
 */

import { SubscriptionTier } from '@/types/subscription';

export interface TierConfig {
  id: SubscriptionTier;
  name: string;
  nameTh: string;
  price: number; // THB per month
  priceId: string | null; // Stripe Price ID
  features: string[];
  featuresTh: string[];
  spreadAccess: string[];
  maxReadingsPerDay: number; // -1 = unlimited
  priority?: boolean;
  vip?: boolean;
}

// Simple price lookup
export const TIER_PRICES: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 99,
  pro: 199,
  vip: 399,
};

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    nameTh: 'ฟรี',
    price: 0,
    priceId: null,
    features: [
      'Daily card & 3-card spreads',
      'Basic reading history',
      'Tarot dictionary access',
    ],
    featuresTh: [
      'การ์ด 2 แบบ (ไพ่ประจำวัน, 3 ใบ)',
      'ประวัติการดูดวงพื้นฐาน',
      'พจนานุกรมไพ่ยิปซี',
    ],
    spreadAccess: ['daily', 'three_card'],
    maxReadingsPerDay: 3,
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    nameTh: 'เบสิค',
    price: 99,
    priceId: null, // Set dynamically at runtime
    features: [
      'All free features',
      'Love & Career spreads',
      'Yes/No readings',
      'Unlimited history',
      'Ad-free experience',
      'Save questions & interpretations',
    ],
    featuresTh: [
      'ทุกอย่างในแพ็คเกจฟรี',
      'การ์ดความรัก, การงาน',
      'การ์ดใช่/ไม่ใช่',
      'ประวัติไม่จำกัด',
      'ไม่มีโฆษณา',
      'บันทึกคำถามและคำทำนาย',
    ],
    spreadAccess: ['daily', 'three_card', 'love_relationships', 'career_money', 'yes_no'],
    maxReadingsPerDay: -1,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    nameTh: 'โปร',
    price: 199,
    priceId: null, // Set dynamically at runtime
    features: [
      'All Basic features',
      '5 premium spreads',
      'Deep insight interpretations',
      'Card recommendations',
      'PDF export',
    ],
    featuresTh: [
      'ทุกอย่างใน Basic',
      'การ์ดพรีเมียม 5 แบบ',
      'คำทำนายเจาะลึกพิเศษ',
      'ระบบแนะนำการ์ดที่เหมาะสม',
      'ส่งออก PDF',
    ],
    spreadAccess: [
      'daily', 'three_card', 'love_relationships', 'career_money', 'yes_no',
      'celtic_cross', 'decision_making', 'self_discovery', 'relationship_deep', 'chakra',
    ],
    maxReadingsPerDay: -1,
    priority: true,
  },
  vip: {
    id: 'vip',
    name: 'VIP',
    nameTh: 'วีไอพี',
    price: 399,
    priceId: null, // Set dynamically at runtime
    features: [
      'All Pro features',
      'All 18 spread types',
      'AI personalized readings',
      'Reading pattern analysis',
      'VIP dashboard',
      'Priority support',
    ],
    featuresTh: [
      'ทุกอย่างใน Pro',
      'การ์ดทั้งหมด 18 แบบ',
      'AI คำทำนายส่วนตัว',
      'วิเคราะห์รูปแบบการดูดวง',
      'แดชบอร์ดพิเศษ',
      'ซัพพอร์ตสำคัญ',
    ],
    spreadAccess: ['*'], // All spreads
    maxReadingsPerDay: -1,
    priority: true,
    vip: true,
  },
};

/**
 * Get tier configuration by ID
 */
export function getTierConfig(tierId: SubscriptionTier): TierConfig {
  return SUBSCRIPTION_TIERS[tierId];
}

/**
 * Get tier name in Thai
 */
export function getTierNameTh(tierId: SubscriptionTier): string {
  return SUBSCRIPTION_TIERS[tierId].nameTh;
}

/**
 * Get tier price
 */
export function getTierPrice(tierId: SubscriptionTier): number {
  return SUBSCRIPTION_TIERS[tierId].price;
}

/**
 * Get Stripe Price ID for a tier (reads from env vars at runtime)
 */
export function getTierPriceId(tierId: SubscriptionTier): string | null {
  // Read from environment variables at runtime
  const priceIdMap: Record<SubscriptionTier, string | undefined> = {
    free: undefined,
    basic: process.env.STRIPE_PRICE_ID_BASIC,
    pro: process.env.STRIPE_PRICE_ID_PRO,
    vip: process.env.STRIPE_PRICE_ID_VIP,
  };
  
  const priceId = priceIdMap[tierId];
  return priceId || null;
}

/**
 * Check if a spread is accessible for a given tier
 */
export function canAccessSpread(tierId: SubscriptionTier, spreadType: string): boolean {
  const tier = SUBSCRIPTION_TIERS[tierId];
  return tier.spreadAccess.includes('*') || tier.spreadAccess.includes(spreadType);
}

/**
 * Get all available tiers for purchase (excludes free)
 */
export function getPaidTiers(): TierConfig[] {
  return Object.values(SUBSCRIPTION_TIERS).filter(tier => tier.price > 0);
}

/**
 * Compare tiers (returns positive if tier1 > tier2)
 */
export function compareTiers(tier1: SubscriptionTier, tier2: SubscriptionTier): number {
  const tierOrder: Record<SubscriptionTier, number> = {
    free: 0,
    basic: 1,
    pro: 2,
    vip: 3,
  };
  return tierOrder[tier1] - tierOrder[tier2];
}

/**
 * Check if tier1 is higher than tier2
 */
export function isHigherTier(tier1: SubscriptionTier, tier2: SubscriptionTier): boolean {
  return compareTiers(tier1, tier2) > 0;
}
