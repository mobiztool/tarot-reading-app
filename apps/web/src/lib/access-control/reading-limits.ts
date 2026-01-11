/**
 * Reading Limits
 * Controls daily reading limits based on subscription tier
 * Story 6.3: Feature Gating by Subscription Tier (AC: 7)
 */

import { SubscriptionTier } from '@/types/subscription';
import { prisma } from '@/lib/prisma';
import { getUserTier } from './spreads';

// Reading limits per tier
const READING_LIMITS: Record<SubscriptionTier, number> = {
  free: 3,    // 3 readings per day
  basic: -1,  // unlimited
  pro: -1,    // unlimited
  vip: -1,    // unlimited
};

export interface ReadingLimitResult {
  allowed: boolean;
  reason?: string;
  readingsToday: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
}

/**
 * Check if user can create a new reading
 */
export async function canCreateReading(userId: string | null): Promise<ReadingLimitResult> {
  // Guest users - very limited (could use IP tracking, but simplified for now)
  if (!userId) {
    return {
      allowed: true,
      readingsToday: 0,
      limit: 3,
      remaining: 3,
      isUnlimited: false,
    };
  }

  const tier = await getUserTier(userId);
  const limit = READING_LIMITS[tier];

  // Paid tiers have unlimited readings
  if (limit === -1) {
    return {
      allowed: true,
      readingsToday: 0,
      limit: -1,
      remaining: -1,
      isUnlimited: true,
    };
  }

  // Count today's readings for free tier
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const readingsToday = await prisma.reading.count({
    where: {
      user_id: userId,
      created_at: { gte: today },
    },
  });

  const remaining = Math.max(0, limit - readingsToday);
  const allowed = readingsToday < limit;

  return {
    allowed,
    reason: allowed ? undefined : `คุณใช้โควต้าการดูดวงวันนี้หมดแล้ว (${limit} ครั้ง/วัน) อัพเกรดเพื่อดูดวงไม่จำกัด!`,
    readingsToday,
    limit,
    remaining,
    isUnlimited: false,
  };
}

/**
 * Get reading limit info for display
 */
export async function getReadingLimitInfo(userId: string | null): Promise<{
  tier: SubscriptionTier;
  limit: number;
  used: number;
  remaining: number;
  isUnlimited: boolean;
  resetTime: Date;
}> {
  const tier: SubscriptionTier = userId ? await getUserTier(userId) : 'free';
  const limit = READING_LIMITS[tier];

  if (limit === -1) {
    return {
      tier,
      limit: -1,
      used: 0,
      remaining: -1,
      isUnlimited: true,
      resetTime: new Date(),
    };
  }

  // Count today's readings
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const used = userId
    ? await prisma.reading.count({
        where: {
          user_id: userId,
          created_at: { gte: today },
        },
      })
    : 0;

  // Reset time is tomorrow midnight
  const resetTime = new Date(today);
  resetTime.setDate(resetTime.getDate() + 1);

  return {
    tier,
    limit,
    used,
    remaining: Math.max(0, limit - used),
    isUnlimited: false,
    resetTime,
  };
}

/**
 * Get limit message for UI display
 */
export function getLimitMessage(remaining: number, isUnlimited: boolean): string {
  if (isUnlimited) {
    return '✨ ดูดวงได้ไม่จำกัด';
  }
  if (remaining === 0) {
    return '⚠️ ใช้โควต้าหมดแล้ววันนี้';
  }
  return `📊 เหลือ ${remaining} ครั้งวันนี้`;
}
