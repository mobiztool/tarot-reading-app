/**
 * Spread Access Control
 * Controls which spreads are accessible based on subscription tier
 * Story 6.3: Feature Gating by Subscription Tier
 */

import { SubscriptionTier } from '@/types/subscription';
import { prisma } from '@/lib/prisma';

// All spread types in the system (18 total)
export type SpreadType =
  // Free tier - 2 spreads
  | 'daily'
  | 'three_card'
  // Basic tier - adds 3 more (total 5)
  | 'love_relationships'
  | 'career_money'
  | 'yes_no'
  // Pro tier - adds 5 more (total 10)
  | 'celtic_cross'
  | 'decision_making'
  | 'self_discovery'
  | 'relationship_deep_dive'
  | 'chakra_alignment'
  // VIP tier - adds 8 more (total 18)
  | 'shadow_work'
  | 'past_life'
  | 'dream_interpretation'
  | 'moon_phases'
  | 'elemental_balance'
  | 'soul_purpose'
  | 'karma_lessons'
  | 'manifestation';

// Spread access matrix - which tiers can access which spreads
export const SPREAD_ACCESS_MATRIX: Record<SpreadType, SubscriptionTier[]> = {
  // Free tier - 2 spreads (available to all)
  daily: ['free', 'basic', 'pro', 'vip'],
  three_card: ['free', 'basic', 'pro', 'vip'],

  // Basic tier - adds 3 more (total 5)
  love_relationships: ['basic', 'pro', 'vip'],
  career_money: ['basic', 'pro', 'vip'],
  yes_no: ['basic', 'pro', 'vip'],

  // Pro tier - adds 5 more (total 10)
  celtic_cross: ['pro', 'vip'],
  decision_making: ['pro', 'vip'],
  self_discovery: ['pro', 'vip'],
  relationship_deep_dive: ['pro', 'vip'],
  chakra_alignment: ['pro', 'vip'],

  // VIP tier - adds 8 more (total 18)
  shadow_work: ['vip'],
  past_life: ['vip'],
  dream_interpretation: ['vip'],
  moon_phases: ['vip'],
  elemental_balance: ['vip'],
  soul_purpose: ['vip'],
  karma_lessons: ['vip'],
  manifestation: ['vip'],
};

// Spread metadata for UI display
export interface SpreadInfo {
  id: SpreadType;
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  cardCount: number;
  estimatedTime: string;
  minimumTier: SubscriptionTier;
  isAvailable: boolean;
  route: string;
}

export const SPREAD_INFO: Record<SpreadType, SpreadInfo> = {
  // Free tier
  daily: {
    id: 'daily',
    name: 'Daily Reading',
    nameTh: 'ดูดวงประจำวัน',
    description: 'Get daily guidance with a single card',
    descriptionTh: 'รับคำแนะนำประจำวันด้วยไพ่ 1 ใบ',
    icon: '☀️',
    cardCount: 1,
    estimatedTime: '~1 นาที',
    minimumTier: 'free',
    isAvailable: true,
    route: '/reading/daily',
  },
  three_card: {
    id: 'three_card',
    name: '3-Card Spread',
    nameTh: 'ไพ่ 3 ใบ',
    description: 'Past, Present, Future insights',
    descriptionTh: 'อดีต ปัจจุบัน อนาคต',
    icon: '🌙',
    cardCount: 3,
    estimatedTime: '~3 นาที',
    minimumTier: 'free',
    isAvailable: true,
    route: '/reading/three-card',
  },

  // Basic tier
  love_relationships: {
    id: 'love_relationships',
    name: 'Love & Relationships',
    nameTh: 'ดูดวงความรัก',
    description: 'Understand your relationships',
    descriptionTh: 'เข้าใจความสัมพันธ์ของคุณ',
    icon: '💕',
    cardCount: 3,
    estimatedTime: '~3 นาที',
    minimumTier: 'basic',
    isAvailable: true,
    route: '/reading/love',
  },
  career_money: {
    id: 'career_money',
    name: 'Career & Money',
    nameTh: 'ดูดวงการงาน',
    description: 'Career and financial guidance',
    descriptionTh: 'คำแนะนำด้านอาชีพและการเงิน',
    icon: '💼',
    cardCount: 3,
    estimatedTime: '~3 นาที',
    minimumTier: 'basic',
    isAvailable: true,
    route: '/reading/career',
  },
  yes_no: {
    id: 'yes_no',
    name: 'Yes/No Question',
    nameTh: 'คำถามใช่หรือไม่',
    description: 'Quick answers for specific questions',
    descriptionTh: 'คำตอบรวดเร็วสำหรับคำถามเฉพาะ',
    icon: '🔮',
    cardCount: 1,
    estimatedTime: '~30 วินาที',
    minimumTier: 'basic',
    isAvailable: true,
    route: '/reading/yes-no',
  },

  // Pro tier
  celtic_cross: {
    id: 'celtic_cross',
    name: 'Celtic Cross',
    nameTh: 'กากบาทเซลติก',
    description: 'Deep comprehensive reading',
    descriptionTh: 'การอ่านไพ่แบบลึกซึ้งครบถ้วน',
    icon: '✨',
    cardCount: 10,
    estimatedTime: '~10 นาที',
    minimumTier: 'pro',
    isAvailable: true,
    route: '/reading/celtic-cross',
  },
  decision_making: {
    id: 'decision_making',
    name: 'Decision Making',
    nameTh: 'การตัดสินใจ',
    description: 'Guidance for important decisions',
    descriptionTh: 'คำแนะนำสำหรับการตัดสินใจสำคัญ',
    icon: '⚖️',
    cardCount: 5,
    estimatedTime: '~5 นาที',
    minimumTier: 'pro',
    isAvailable: true,
    route: '/reading/decision-making',
  },
  self_discovery: {
    id: 'self_discovery',
    name: 'Self Discovery',
    nameTh: 'ค้นพบตัวเอง',
    description: 'Explore your inner self',
    descriptionTh: 'สำรวจตัวตนภายในของคุณ',
    icon: '🪞',
    cardCount: 5,
    estimatedTime: '~5 นาที',
    minimumTier: 'pro',
    isAvailable: true,
    route: '/reading/self-discovery',
  },
  relationship_deep_dive: {
    id: 'relationship_deep_dive',
    name: 'Relationship Deep Dive',
    nameTh: 'วิเคราะห์ความสัมพันธ์เชิงลึก',
    description: 'In-depth relationship analysis',
    descriptionTh: 'วิเคราะห์ความสัมพันธ์อย่างละเอียด',
    icon: '💑',
    cardCount: 7,
    estimatedTime: '~7 นาที',
    minimumTier: 'pro',
    isAvailable: true,
    route: '/reading/relationship-deep-dive',
  },
  chakra_alignment: {
    id: 'chakra_alignment',
    name: 'Chakra Alignment',
    nameTh: 'สมดุลจักระ',
    description: 'Balance your energy centers',
    descriptionTh: 'ปรับสมดุลศูนย์พลังงานของคุณ',
    icon: '🧘',
    cardCount: 7,
    estimatedTime: '~7 นาที',
    minimumTier: 'pro',
    isAvailable: true,
    route: '/reading/chakra-alignment',
  },

  // VIP tier
  shadow_work: {
    id: 'shadow_work',
    name: 'Shadow Work',
    nameTh: 'สำรวจด้านมืด',
    description: 'Explore your shadow self',
    descriptionTh: 'สำรวจตัวตนที่ซ่อนเร้น',
    icon: '🌑',
    cardCount: 5,
    estimatedTime: '~5 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/shadow-work',
  },
  past_life: {
    id: 'past_life',
    name: 'Past Life',
    nameTh: 'ชาติก่อน',
    description: 'Insights from past lives',
    descriptionTh: 'มองย้อนไปชาติก่อน',
    icon: '⏳',
    cardCount: 5,
    estimatedTime: '~5 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/past-life',
  },
  dream_interpretation: {
    id: 'dream_interpretation',
    name: 'Dream Interpretation',
    nameTh: 'ตีความฝัน',
    description: 'Understand your dreams',
    descriptionTh: 'ทำความเข้าใจความฝันของคุณ',
    icon: '💭',
    cardCount: 3,
    estimatedTime: '~3 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/dream-interpretation',
  },
  moon_phases: {
    id: 'moon_phases',
    name: 'Moon Phases',
    nameTh: 'ข้างขึ้นข้างแรม',
    description: 'Reading aligned with moon cycles',
    descriptionTh: 'ดูดวงตามวัฏจักรดวงจันทร์',
    icon: '🌕',
    cardCount: 4,
    estimatedTime: '~4 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/moon-phases',
  },
  elemental_balance: {
    id: 'elemental_balance',
    name: 'Elemental Balance',
    nameTh: 'สมดุลธาตุ',
    description: 'Balance earth, water, fire, air',
    descriptionTh: 'ปรับสมดุลดิน น้ำ ไฟ ลม',
    icon: '🌍',
    cardCount: 4,
    estimatedTime: '~4 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/elemental-balance',
  },
  soul_purpose: {
    id: 'soul_purpose',
    name: 'Soul Purpose',
    nameTh: 'เป้าหมายวิญญาณ',
    description: 'Discover your life purpose',
    descriptionTh: 'ค้นพบจุดมุ่งหมายในชีวิต',
    icon: '✨',
    cardCount: 5,
    estimatedTime: '~5 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/soul-purpose',
  },
  karma_lessons: {
    id: 'karma_lessons',
    name: 'Karma Lessons',
    nameTh: 'บทเรียนกรรม',
    description: 'Understand your karmic path',
    descriptionTh: 'เข้าใจเส้นทางกรรมของคุณ',
    icon: '☯️',
    cardCount: 5,
    estimatedTime: '~5 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/karma-lessons',
  },
  manifestation: {
    id: 'manifestation',
    name: 'Manifestation',
    nameTh: 'การบรรลุเป้าหมาย',
    description: 'Guidance for manifesting goals',
    descriptionTh: 'คำแนะนำสำหรับการบรรลุเป้าหมาย',
    icon: '🎯',
    cardCount: 4,
    estimatedTime: '~4 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/manifestation',
  },
};

// Tier hierarchy for comparison
const TIER_LEVELS: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  vip: 3,
};

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
