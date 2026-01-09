/**
 * Access Control Module
 * Centralized logic for spread access permissions
 * Future-proofed for Premium tier gating (Phase 3)
 */

// User tiers
export type UserTier = 'guest' | 'free' | 'premium';

// Spread types
export type SpreadType = 
  | 'daily' 
  | 'three_card' 
  | 'love_relationships' 
  | 'career_money' 
  | 'yes_no'
  | 'celtic_cross'  // Future Premium spread
  | 'relationship'  // Future Premium spread
  | 'career_path';  // Future Premium spread

// Spread configuration
export interface SpreadConfig {
  id: SpreadType;
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  requiredTier: UserTier;
  icon: string;
  cardCount: number;
  estimatedTime: string;
  route: string;
  isAvailable: boolean;  // For unreleased spreads
}

// Spread access matrix
export const SPREAD_ACCESS_MATRIX: Record<SpreadType, SpreadConfig> = {
  daily: {
    id: 'daily',
    name: 'Daily Reading',
    nameTh: 'ดูดวงประจำวัน',
    description: 'Get daily guidance with a single card',
    descriptionTh: 'รับคำแนะนำประจำวันด้วยไพ่ 1 ใบ',
    requiredTier: 'guest',
    icon: '☀️',
    cardCount: 1,
    estimatedTime: '~1 นาที',
    route: '/reading/daily',
    isAvailable: true,
  },
  three_card: {
    id: 'three_card',
    name: '3-Card Spread',
    nameTh: 'ไพ่ 3 ใบ',
    description: 'Past, Present, Future insights',
    descriptionTh: 'อดีต ปัจจุบัน อนาคต',
    requiredTier: 'guest',
    icon: '🌙',
    cardCount: 3,
    estimatedTime: '~3 นาที',
    route: '/reading/three-card',
    isAvailable: true,
  },
  love_relationships: {
    id: 'love_relationships',
    name: 'Love & Relationships',
    nameTh: 'ดูดวงความรัก',
    description: 'Understand your relationships',
    descriptionTh: 'เข้าใจความสัมพันธ์ของคุณ',
    requiredTier: 'free',
    icon: '💕',
    cardCount: 3,
    estimatedTime: '~3 นาที',
    route: '/reading/love',
    isAvailable: true,
  },
  career_money: {
    id: 'career_money',
    name: 'Career & Money',
    nameTh: 'ดูดวงการงาน',
    description: 'Career and financial guidance',
    descriptionTh: 'คำแนะนำด้านอาชีพและการเงิน',
    requiredTier: 'free',
    icon: '💼',
    cardCount: 3,
    estimatedTime: '~3 นาที',
    route: '/reading/career',
    isAvailable: true,
  },
  yes_no: {
    id: 'yes_no',
    name: 'Yes/No Question',
    nameTh: 'คำถามใช่หรือไม่',
    description: 'Quick answers for specific questions',
    descriptionTh: 'คำตอบรวดเร็วสำหรับคำถามเฉพาะ',
    requiredTier: 'free',
    icon: '🔮',
    cardCount: 1,
    estimatedTime: '<30 วินาที',
    route: '/reading/yes-no',
    isAvailable: true,
  },
  // Future Premium spreads (Phase 3)
  celtic_cross: {
    id: 'celtic_cross',
    name: 'Celtic Cross',
    nameTh: 'กากบาทเซลติก',
    description: 'Deep comprehensive reading',
    descriptionTh: 'การอ่านไพ่แบบลึกซึ้งครบถ้วน',
    requiredTier: 'premium',
    icon: '✨',
    cardCount: 10,
    estimatedTime: '~10 นาที',
    route: '/reading/celtic-cross',
    isAvailable: false,
  },
  relationship: {
    id: 'relationship',
    name: 'Relationship Compatibility',
    nameTh: 'ความเข้ากันของคู่รัก',
    description: 'In-depth relationship analysis',
    descriptionTh: 'วิเคราะห์ความสัมพันธ์เชิงลึก',
    requiredTier: 'premium',
    icon: '💑',
    cardCount: 7,
    estimatedTime: '~7 นาที',
    route: '/reading/relationship',
    isAvailable: false,
  },
  career_path: {
    id: 'career_path',
    name: 'Career Path',
    nameTh: 'เส้นทางอาชีพ',
    description: 'Long-term career planning',
    descriptionTh: 'วางแผนอาชีพระยะยาว',
    requiredTier: 'premium',
    icon: '📈',
    cardCount: 5,
    estimatedTime: '~5 นาที',
    route: '/reading/career-path',
    isAvailable: false,
  },
};

// Tier hierarchy for comparison
const TIER_LEVELS: Record<UserTier, number> = {
  guest: 0,
  free: 1,
  premium: 2,
};

/**
 * Check if a user can access a specific spread
 */
export function canAccessSpread(
  userTier: UserTier,
  spreadType: SpreadType
): boolean {
  const spread = SPREAD_ACCESS_MATRIX[spreadType];
  if (!spread) return false;
  if (!spread.isAvailable) return false;
  
  return TIER_LEVELS[userTier] >= TIER_LEVELS[spread.requiredTier];
}

/**
 * Get the required tier for a spread
 */
export function getRequiredTier(spreadType: SpreadType): UserTier {
  return SPREAD_ACCESS_MATRIX[spreadType]?.requiredTier || 'premium';
}

/**
 * Get all spreads available for a user tier
 */
export function getAvailableSpreads(userTier: UserTier): SpreadConfig[] {
  return Object.values(SPREAD_ACCESS_MATRIX).filter(
    (spread) => spread.isAvailable && canAccessSpread(userTier, spread.id)
  );
}

/**
 * Get all spreads that require upgrade for a user tier
 */
export function getLockedSpreads(userTier: UserTier): SpreadConfig[] {
  return Object.values(SPREAD_ACCESS_MATRIX).filter(
    (spread) => spread.isAvailable && !canAccessSpread(userTier, spread.id)
  );
}

/**
 * Get upgrade message based on current tier
 */
export function getUpgradeMessage(currentTier: UserTier, targetSpread: SpreadType): string {
  const spread = SPREAD_ACCESS_MATRIX[targetSpread];
  if (!spread) return '';

  if (currentTier === 'guest' && spread.requiredTier === 'free') {
    return 'สมัครสมาชิกฟรีเพื่อปลดล็อครูปแบบนี้';
  }

  if (currentTier === 'guest' && spread.requiredTier === 'premium') {
    return 'อัพเกรดเป็น Premium เพื่อปลดล็อครูปแบบนี้';
  }

  if (currentTier === 'free' && spread.requiredTier === 'premium') {
    return 'อัพเกรดเป็น Premium เพื่อปลดล็อครูปแบบนี้';
  }

  return '';
}

/**
 * Get benefits for upgrading from current tier
 */
export function getUpgradeBenefits(currentTier: UserTier): string[] {
  if (currentTier === 'guest') {
    return [
      '🔓 ปลดล็อครูปแบบความรัก, การงาน และ Yes/No',
      '📊 บันทึกประวัติการดูดวงทั้งหมด',
      '🔖 บันทึกไพ่โปรดของคุณ',
      '📈 ดูสถิติการดูดวงย้อนหลัง',
      '🔔 รับการแจ้งเตือนดวงประจำวัน',
    ];
  }

  if (currentTier === 'free') {
    return [
      '✨ รูปแบบ Celtic Cross (10 ใบ)',
      '💑 วิเคราะห์ความเข้ากันของคู่รัก',
      '📈 วางแผนเส้นทางอาชีพ',
      '🎯 คำทำนายเชิงลึกพิเศษ',
      '📞 ปรึกษากับผู้เชี่ยวชาญ',
    ];
  }

  return [];
}

/**
 * Get route for spread type
 */
export function getSpreadRoute(spreadType: SpreadType): string {
  return SPREAD_ACCESS_MATRIX[spreadType]?.route || '/reading';
}

/**
 * Get spread config by route
 */
export function getSpreadByRoute(route: string): SpreadConfig | undefined {
  return Object.values(SPREAD_ACCESS_MATRIX).find(
    (spread) => spread.route === route
  );
}

/**
 * Check if route requires authentication
 */
export function isProtectedRoute(route: string): boolean {
  const spread = getSpreadByRoute(route);
  if (!spread) return false;
  return spread.requiredTier !== 'guest';
}

/**
 * Get list of all protected routes
 */
export function getProtectedRoutes(): string[] {
  return Object.values(SPREAD_ACCESS_MATRIX)
    .filter((spread) => spread.requiredTier !== 'guest' && spread.isAvailable)
    .map((spread) => spread.route);
}

/**
 * Get user tier from user object
 */
export function getUserTier(user: unknown): UserTier {
  if (!user) return 'guest';
  const userObj = user as { subscription?: string };
  if (userObj.subscription === 'premium') return 'premium';
  return 'free';
}

