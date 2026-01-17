/**
 * Spread Information and Constants - Client-Safe
 * This file contains only constants that can be safely imported in client components.
 * NO PRISMA IMPORTS - This file is safe for client-side use.
 */

import { SubscriptionTier } from '@/types/subscription';

// All spread types in the system (25 total)
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
  // VIP tier - adds 15 more (total 25) - includes Story 8.3 batch 2 + Story 9.1 batch 3
  | 'shadow_work'
  | 'friendship'
  | 'career_path'
  | 'financial_abundance'
  | 'past_life'
  | 'dream_interpretation'
  | 'moon_phases'
  | 'elemental_balance'
  | 'soul_purpose'
  | 'karma_lessons'
  | 'manifestation'
  // Story 9.1: Final Premium Spreads Batch 3
  | 'monthly_forecast'
  | 'year_ahead'
  | 'zodiac_wheel';

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

  // VIP tier - adds 15 more (total 25) - includes Story 8.3 batch 2 + Story 9.1 batch 3
  shadow_work: ['vip'],
  friendship: ['vip'],
  career_path: ['vip'],
  financial_abundance: ['vip'],
  past_life: ['vip'],
  dream_interpretation: ['vip'],
  moon_phases: ['vip'],
  elemental_balance: ['vip'],
  soul_purpose: ['vip'],
  karma_lessons: ['vip'],
  manifestation: ['vip'],
  // Story 9.1: Final Premium Spreads Batch 3
  monthly_forecast: ['vip'],
  year_ahead: ['vip'],
  zodiac_wheel: ['vip'],
};

// Spread information type
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

// Full spread information
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
    route: '/reading/decision',
  },
  self_discovery: {
    id: 'self_discovery',
    name: 'Self Discovery',
    nameTh: 'ค้นพบตัวเอง',
    description: 'Explore your inner self through introspection',
    descriptionTh: 'สำรวจตัวตนภายในผ่านการใคร่ครวญ',
    icon: '🔍',
    cardCount: 5,
    estimatedTime: '~5 นาที',
    minimumTier: 'pro',
    isAvailable: true,
    route: '/reading/self-discovery',
  },
  relationship_deep_dive: {
    id: 'relationship_deep_dive',
    name: 'Relationship Deep Dive',
    nameTh: 'วิเคราะห์ความสัมพันธ์',
    description: 'Deep relationship analysis',
    descriptionTh: 'วิเคราะห์ความสัมพันธ์อย่างลึกซึ้ง',
    icon: '💞',
    cardCount: 7,
    estimatedTime: '~7 นาที',
    minimumTier: 'pro',
    isAvailable: true,
    route: '/reading/relationship-deep-dive',
  },
  chakra_alignment: {
    id: 'chakra_alignment',
    name: 'Chakra Alignment',
    nameTh: 'จักระสมดุล',
    description: 'Balance your energy centers',
    descriptionTh: 'สร้างสมดุลจุดพลังงาน',
    icon: '🧘',
    cardCount: 7,
    estimatedTime: '~7 นาที',
    minimumTier: 'pro',
    isAvailable: true,
    route: '/reading/chakra',
  },

  // VIP tier
  shadow_work: {
    id: 'shadow_work',
    name: 'Shadow Work',
    nameTh: 'งานเงา',
    description: 'Deep psychological exploration of your shadow self',
    descriptionTh: 'สำรวจเงาในตัวตนและจิตใต้สำนึกอย่างลึกซึ้ง',
    icon: '🌑',
    cardCount: 7,
    estimatedTime: '~10 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/shadow-work',
  },
  // Story 8.3: Batch 2 Premium Spreads
  friendship: {
    id: 'friendship',
    name: 'Friendship Reading',
    nameTh: 'ดูดวงมิตรภาพ',
    description: 'Understand your friendships and social connections',
    descriptionTh: 'เข้าใจมิตรภาพและความสัมพันธ์ทางสังคม',
    icon: '🤝',
    cardCount: 4,
    estimatedTime: '~4 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/friendship',
  },
  career_path: {
    id: 'career_path',
    name: 'Career Path',
    nameTh: 'เส้นทางอาชีพ',
    description: 'Navigate your career journey with deep insights',
    descriptionTh: 'ค้นพบเส้นทางอาชีพด้วยข้อมูลเชิงลึก',
    icon: '🎯',
    cardCount: 6,
    estimatedTime: '~6 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/career-path',
  },
  financial_abundance: {
    id: 'financial_abundance',
    name: 'Financial Abundance',
    nameTh: 'ความมั่งคั่งทางการเงิน',
    description: 'Unlock your path to financial prosperity',
    descriptionTh: 'ปลดล็อคเส้นทางสู่ความมั่งคั่ง',
    icon: '💰',
    cardCount: 5,
    estimatedTime: '~5 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/financial',
  },
  past_life: {
    id: 'past_life',
    name: 'Past Life Reading',
    nameTh: 'ชาติก่อน',
    description: 'Insights from past lives',
    descriptionTh: 'ความเข้าใจจากอดีตชาติ',
    icon: '⏳',
    cardCount: 5,
    estimatedTime: '~8 นาที',
    minimumTier: 'vip',
    isAvailable: false,
    route: '/reading/past-life',
  },
  dream_interpretation: {
    id: 'dream_interpretation',
    name: 'Dream Interpretation',
    nameTh: 'ตีความฝัน',
    description: 'Understand your dreams',
    descriptionTh: 'ตีความความฝันของคุณ',
    icon: '💭',
    cardCount: 4,
    estimatedTime: '~5 นาที',
    minimumTier: 'vip',
    isAvailable: false,
    route: '/reading/dreams',
  },
  moon_phases: {
    id: 'moon_phases',
    name: 'Moon Phases',
    nameTh: 'ข้างขึ้นข้างแรม',
    description: 'Align with lunar energy',
    descriptionTh: 'รับพลังจากดวงจันทร์',
    icon: '🌕',
    cardCount: 4,
    estimatedTime: '~5 นาที',
    minimumTier: 'vip',
    isAvailable: false,
    route: '/reading/moon-phases',
  },
  elemental_balance: {
    id: 'elemental_balance',
    name: 'Elemental Balance',
    nameTh: 'ธาตุสมดุล',
    description: 'Balance fire, water, air, earth',
    descriptionTh: 'สร้างสมดุลธาตุทั้งสี่',
    icon: '🔥',
    cardCount: 4,
    estimatedTime: '~5 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/elemental',
  },
  soul_purpose: {
    id: 'soul_purpose',
    name: 'Soul Purpose',
    nameTh: 'เป้าหมายจิตวิญญาณ',
    description: 'Discover your life purpose',
    descriptionTh: 'ค้นพบเป้าหมายชีวิต',
    icon: '💫',
    cardCount: 7,
    estimatedTime: '~10 นาที',
    minimumTier: 'vip',
    isAvailable: false,
    route: '/reading/soul-purpose',
  },
  karma_lessons: {
    id: 'karma_lessons',
    name: 'Karma Lessons',
    nameTh: 'บทเรียนกรรม',
    description: 'Understand karmic patterns',
    descriptionTh: 'เข้าใจบทเรียนกรรม',
    icon: '☯️',
    cardCount: 6,
    estimatedTime: '~8 นาที',
    minimumTier: 'vip',
    isAvailable: false,
    route: '/reading/karma',
  },
  manifestation: {
    id: 'manifestation',
    name: 'Manifestation',
    nameTh: 'ดึงดูดสิ่งที่ต้องการ',
    description: 'Manifest your desires',
    descriptionTh: 'ดึงดูดสิ่งที่ปรารถนา',
    icon: '✨',
    cardCount: 5,
    estimatedTime: '~6 นาที',
    minimumTier: 'vip',
    isAvailable: false,
    route: '/reading/manifestation',
  },
  // Story 9.1: Final Premium Spreads Batch 3
  monthly_forecast: {
    id: 'monthly_forecast',
    name: 'Monthly Forecast',
    nameTh: 'พยากรณ์ประจำเดือน',
    description: 'Monthly energy and guidance',
    descriptionTh: 'พลังงานและคำแนะนำประจำเดือน',
    icon: '📅',
    cardCount: 4,
    estimatedTime: '~4 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/monthly',
  },
  year_ahead: {
    id: 'year_ahead',
    name: 'Year Ahead',
    nameTh: 'พยากรณ์ทั้งปี',
    description: 'Comprehensive yearly forecast with 13 cards',
    descriptionTh: 'พยากรณ์ครอบคลุมทั้งปีด้วย 13 ไพ่',
    icon: '📆',
    cardCount: 13,
    estimatedTime: '~15 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/year-ahead',
  },
  zodiac_wheel: {
    id: 'zodiac_wheel',
    name: 'Zodiac Wheel',
    nameTh: 'วงล้อจักรราศี',
    description: 'Astrology + Tarot: 12 houses reading',
    descriptionTh: 'ผสมผสานโหราศาสตร์และทาโรต์ 12 เรือน',
    icon: '♈',
    cardCount: 12,
    estimatedTime: '~12 นาที',
    minimumTier: 'vip',
    isAvailable: true,
    route: '/reading/zodiac',
  },
};

// Tier hierarchy for comparison
export const TIER_LEVELS: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  vip: 3,
};

// Get minimum tier required for a spread
export function getMinimumTier(spreadType: SpreadType): SubscriptionTier {
  const allowedTiers = SPREAD_ACCESS_MATRIX[spreadType];
  if (!allowedTiers || allowedTiers.length === 0) return 'free';
  
  // Find the minimum tier level
  const minLevel = Math.min(...allowedTiers.map(tier => TIER_LEVELS[tier]));
  const tierNames: SubscriptionTier[] = ['free', 'basic', 'pro', 'vip'];
  return tierNames[minLevel] || 'free';
}

// Check if a spread is accessible for a given tier (client-side check)
export function canAccessSpreadClient(tier: SubscriptionTier, spreadType: SpreadType): boolean {
  const allowedTiers = SPREAD_ACCESS_MATRIX[spreadType];
  if (!allowedTiers) return false;
  return allowedTiers.includes(tier);
}
