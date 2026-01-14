/**
 * Access Control Module
 * Centralized exports for all access control functionality
 * 
 * NOTE: This file should ONLY be used in SERVER components/routes.
 * For client components, import directly from './spread-info'
 */

// Client-safe exports (no Prisma)
export {
  type SpreadType,
  type SpreadInfo,
  SPREAD_ACCESS_MATRIX,
  SPREAD_INFO,
  TIER_LEVELS,
  getMinimumTier,
  canAccessSpreadClient,
} from './spread-info';

// Server-only exports (requires Prisma)
export {
  type AccessCheckResult,
  canAccessSpread,
  getUserTier,
  getUserSubscription,
  getTierNameTh,
  getMinimumTierForSpread,
  getSpreadsForTier,
  getLockedSpreadsForTier,
  getSpreadCountByTier,
  isHigherTier,
} from './spreads';

// Reading limits (server-only)
export {
  type ReadingLimitResult,
  canCreateReading,
  getReadingLimitInfo,
  getLimitMessage,
} from './reading-limits';

// Backward compatibility aliases
import { type SpreadInfo, SPREAD_INFO, type SpreadType } from './spread-info';

export type SpreadConfig = SpreadInfo;
export type UserTier = 'guest' | 'free' | 'premium';

// Legacy helper functions for backward compatibility
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

export function getUpgradeMessage(currentTier: UserTier, targetSpread: SpreadType): string {
  const spread = SPREAD_INFO[targetSpread];
  if (!spread) return '';

  if (currentTier === 'guest' && spread.minimumTier === 'basic') {
    return 'สมัครสมาชิกฟรีเพื่อปลดล็อครูปแบบนี้';
  }
  if (currentTier === 'guest' && (spread.minimumTier === 'pro' || spread.minimumTier === 'vip')) {
    return 'อัพเกรดเป็น Premium เพื่อปลดล็อครูปแบบนี้';
  }
  if (currentTier === 'free' && (spread.minimumTier === 'pro' || spread.minimumTier === 'vip')) {
    return 'อัพเกรดเป็น Premium เพื่อปลดล็อครูปแบบนี้';
  }
  return '';
}
