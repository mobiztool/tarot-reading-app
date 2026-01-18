/**
 * Dashboard Statistics Calculation
 * Story 9.5: Premium User Dashboard & Statistics
 */

import { prisma } from '@/lib/prisma';
import { BADGES, Badge as GamificationBadge, checkNewBadges, type UserStats } from '@/lib/gamification/badges';
import type {
  DashboardData,
  DashboardSummary,
  ActivityDataPoint,
  SpreadDistributionItem,
  FavoriteCard,
  RecentReading,
  Badge,
  SubscriptionInfo,
  AIInsight,
  TimeRange,
} from './types';

// Spread type name mappings
const SPREAD_TYPE_NAMES: Record<string, string> = {
  daily: 'ไพ่ประจำวัน',
  three_card: '3 ใบ',
  love_relationships: 'ความรัก',
  career_money: 'การงาน',
  yes_no: 'ใช่/ไม่ใช่',
  celtic_cross: 'Celtic Cross',
  decision_making: 'ตัดสินใจ',
  self_discovery: 'ค้นหาตัวเอง',
  relationship_deep_dive: 'ความสัมพันธ์เจาะลึก',
  shadow_work: 'Shadow Work',
  chakra_alignment: 'สมดุลจักระ',
  friendship: 'มิตรภาพ',
  career_path: 'เส้นทางอาชีพ',
  financial_abundance: 'ความมั่งคั่ง',
  monthly_forecast: 'พยากรณ์รายเดือน',
  year_ahead: 'ปีหน้า',
  elemental_balance: 'สมดุลธาตุ',
  zodiac_wheel: 'ราศีจักร',
};

// Chart colors for spread distribution
const SPREAD_COLORS: string[] = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#84CC16', // Lime
];

/**
 * Get time range filter date
 */
function getTimeRangeDate(timeRange: TimeRange): Date | null {
  const now = new Date();
  switch (timeRange) {
    case '7d':
      return new Date(now.setDate(now.getDate() - 7));
    case '30d':
      return new Date(now.setDate(now.getDate() - 30));
    case '90d':
      return new Date(now.setDate(now.getDate() - 90));
    case 'all':
      return null;
  }
}

/**
 * Calculate reading streak
 */
async function calculateStreak(userId: string): Promise<{ current: number; longest: number }> {
  const readings = await prisma.reading.findMany({
    where: { user_id: userId },
    select: { created_at: true },
    orderBy: { created_at: 'desc' },
  });

  if (readings.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Get unique dates (normalized to start of day)
  const dates = [...new Set(
    readings.map(r => {
      const d = new Date(r.created_at);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    })
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  // Check if today or yesterday has a reading for current streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastReadingDate = new Date(dates[0]);
  const isActiveStreak = 
    lastReadingDate >= yesterday;

  if (isActiveStreak) {
    currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const current = new Date(dates[i - 1]);
      const prev = new Date(dates[i]);
      const diffDays = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < dates.length; i++) {
    const current = new Date(dates[i - 1]);
    const prev = new Date(dates[i]);
    const diffDays = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { current: currentStreak, longest: longestStreak };
}

/**
 * Get dashboard summary statistics
 */
async function getDashboardSummary(
  userId: string,
  timeRange: TimeRange
): Promise<DashboardSummary> {
  const startDate = getTimeRangeDate(timeRange);
  const whereClause = {
    user_id: userId,
    ...(startDate && { created_at: { gte: startDate } }),
  };

  // Total readings
  const totalReadings = await prisma.reading.count({
    where: whereClause,
  });

  // Readings this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const readingsThisWeek = await prisma.reading.count({
    where: {
      user_id: userId,
      created_at: { gte: weekAgo },
    },
  });

  // Readings this month
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const readingsThisMonth = await prisma.reading.count({
    where: {
      user_id: userId,
      created_at: { gte: monthAgo },
    },
  });

  // Favorite spread (most used)
  const spreadCounts = await prisma.reading.groupBy({
    by: ['reading_type'],
    where: whereClause,
    _count: true,
    orderBy: { _count: { reading_type: 'desc' } },
    take: 1,
  });

  const favoriteSpread = spreadCounts[0]?.reading_type || null;
  const favoriteSpreadTh = favoriteSpread ? SPREAD_TYPE_NAMES[favoriteSpread] || favoriteSpread : null;

  // Most common card
  const cardCounts = await prisma.readingCard.groupBy({
    by: ['card_id'],
    where: {
      reading: whereClause,
    },
    _count: true,
    orderBy: { _count: { card_id: 'desc' } },
    take: 1,
  });

  let mostCommonCard = null;
  let mostCommonCardTh = null;

  if (cardCounts[0]) {
    const card = await prisma.card.findUnique({
      where: { id: cardCounts[0].card_id },
      select: { name: true, name_th: true },
    });
    mostCommonCard = card?.name || null;
    mostCommonCardTh = card?.name_th || null;
  }

  // Streak
  const { current: currentStreak, longest: longestStreak } = await calculateStreak(userId);

  // Member since
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { created_at: true },
  });

  return {
    totalReadings,
    readingsThisWeek,
    readingsThisMonth,
    favoriteSpread,
    favoriteSpreadTh,
    mostCommonCard,
    mostCommonCardTh,
    currentStreak,
    longestStreak,
    memberSince: user?.created_at.toISOString() || new Date().toISOString(),
  };
}

/**
 * Get reading activity data for chart
 */
async function getActivityData(
  userId: string,
  timeRange: TimeRange
): Promise<ActivityDataPoint[]> {
  const startDate = getTimeRangeDate(timeRange) || new Date(0);
  
  const readings = await prisma.reading.findMany({
    where: {
      user_id: userId,
      created_at: { gte: startDate },
    },
    select: { created_at: true },
    orderBy: { created_at: 'asc' },
  });

  // Group by date
  const dateMap = new Map<string, number>();
  
  readings.forEach(r => {
    const date = r.created_at.toISOString().split('T')[0];
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  // Fill in missing dates
  const result: ActivityDataPoint[] = [];
  const end = new Date();
  const current = new Date(startDate);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    const count = dateMap.get(dateStr) || 0;
    const thaiDate = new Intl.DateTimeFormat('th-TH', { 
      day: 'numeric', 
      month: 'short' 
    }).format(current);
    
    result.push({
      date: dateStr,
      count,
      label: thaiDate,
    });
    
    current.setDate(current.getDate() + 1);
  }

  return result;
}

/**
 * Get spread distribution data
 */
async function getSpreadDistribution(
  userId: string,
  timeRange: TimeRange
): Promise<SpreadDistributionItem[]> {
  const startDate = getTimeRangeDate(timeRange);
  const whereClause = {
    user_id: userId,
    ...(startDate && { created_at: { gte: startDate } }),
  };

  const spreadCounts = await prisma.reading.groupBy({
    by: ['reading_type'],
    where: whereClause,
    _count: true,
    orderBy: { _count: { reading_type: 'desc' } },
  });

  const total = spreadCounts.reduce((sum, s) => sum + s._count, 0);

  return spreadCounts.map((spread, index) => ({
    spreadType: spread.reading_type,
    spreadTypeTh: SPREAD_TYPE_NAMES[spread.reading_type] || spread.reading_type,
    count: spread._count,
    percentage: total > 0 ? Math.round((spread._count / total) * 100) : 0,
    color: SPREAD_COLORS[index % SPREAD_COLORS.length],
  }));
}

/**
 * Get favorite/most drawn cards
 */
async function getFavoriteCards(
  userId: string,
  timeRange: TimeRange,
  limit: number = 5
): Promise<FavoriteCard[]> {
  const startDate = getTimeRangeDate(timeRange);
  const whereClause = {
    reading: {
      user_id: userId,
      ...(startDate && { created_at: { gte: startDate } }),
    },
  };

  const cardCounts = await prisma.readingCard.groupBy({
    by: ['card_id'],
    where: whereClause,
    _count: true,
    orderBy: { _count: { card_id: 'desc' } },
    take: limit,
  });

  const total = cardCounts.reduce((sum, c) => sum + c._count, 0);

  const result: FavoriteCard[] = [];
  for (const cardCount of cardCounts) {
    const card = await prisma.card.findUnique({
      where: { id: cardCount.card_id },
      select: { id: true, name: true, name_th: true, image_url: true },
    });

    if (card) {
      // Get last drawn date
      const lastDrawn = await prisma.readingCard.findFirst({
        where: {
          card_id: cardCount.card_id,
          reading: { user_id: userId },
        },
        orderBy: { created_at: 'desc' },
        select: { created_at: true },
      });

      result.push({
        cardId: card.id,
        cardName: card.name,
        cardNameTh: card.name_th,
        imageUrl: card.image_url,
        count: cardCount._count,
        percentage: total > 0 ? Math.round((cardCount._count / total) * 100) : 0,
        lastDrawn: lastDrawn?.created_at.toISOString() || '',
      });
    }
  }

  return result;
}

/**
 * Get recent readings
 */
async function getRecentReadings(
  userId: string,
  limit: number = 5
): Promise<RecentReading[]> {
  const readings = await prisma.reading.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: limit,
    include: {
      _count: {
        select: { reading_cards: true },
      },
    },
  });

  return readings.map(r => ({
    id: r.id,
    spreadType: r.reading_type,
    spreadTypeTh: SPREAD_TYPE_NAMES[r.reading_type] || r.reading_type,
    question: r.question,
    createdAt: r.created_at.toISOString(),
    cardCount: r._count.reading_cards,
    isFavorite: r.is_favorite,
  }));
}

/**
 * Get user badges
 */
async function getUserBadges(userId: string): Promise<Badge[]> {
  // Get user stats for badge calculation
  const [
    totalReadings,
    totalFavorites,
    totalNotes,
    cardsViewed,
  ] = await Promise.all([
    prisma.reading.count({ where: { user_id: userId } }),
    prisma.reading.count({ where: { user_id: userId, is_favorite: true } }),
    prisma.reading.count({ where: { user_id: userId, notes: { not: null } } }),
    prisma.readingCard.findMany({
      where: { reading: { user_id: userId } },
      select: { card_id: true },
      distinct: ['card_id'],
    }),
  ]);

  // Build user stats for badge checking
  const userStats: UserStats = {
    totalReadings,
    totalShares: 0, // TODO: Track shares
    totalNotes,
    totalFavorites,
    cardsViewed: cardsViewed.map(c => c.card_id),
    currentStreak: 0,
    longestStreak: 0,
    referralCount: 0,
    earnedBadges: [],
  };

  // Get earned badges
  const earnedBadges = checkNewBadges(userStats);
  const earnedIds = new Set(earnedBadges.map(b => b.id));

  // Map all badges with earned status
  return BADGES.map(badge => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    emoji: badge.emoji,
    earned: earnedIds.has(badge.id) || checkBadgeEarned(badge.id, userStats),
    earnedAt: earnedIds.has(badge.id) ? new Date().toISOString() : null,
    progress: getBadgeProgress(badge.id, userStats),
    requirement: badge.requirement,
  }));
}

/**
 * Check if a specific badge is earned
 */
function checkBadgeEarned(badgeId: string, stats: UserStats): boolean {
  switch (badgeId) {
    case 'first_reading':
      return stats.totalReadings >= 1;
    case 'reading_master':
      return stats.totalReadings >= 50;
    case 'note_taker':
      return stats.totalNotes >= 5;
    case 'collector':
      return stats.totalFavorites >= 10;
    case 'explorer':
      return stats.cardsViewed.length >= 22;
    default:
      return false;
  }
}

/**
 * Get badge progress percentage
 */
function getBadgeProgress(badgeId: string, stats: UserStats): number {
  switch (badgeId) {
    case 'first_reading':
      return Math.min(100, stats.totalReadings * 100);
    case 'reading_master':
      return Math.min(100, Math.round((stats.totalReadings / 50) * 100));
    case 'note_taker':
      return Math.min(100, Math.round((stats.totalNotes / 5) * 100));
    case 'collector':
      return Math.min(100, Math.round((stats.totalFavorites / 10) * 100));
    case 'explorer':
      return Math.min(100, Math.round((stats.cardsViewed.length / 22) * 100));
    default:
      return 0;
  }
}

/**
 * Get subscription info
 */
async function getSubscriptionInfo(userId: string): Promise<SubscriptionInfo | null> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      user_id: userId,
      status: { in: ['active', 'trialing', 'past_due'] },
    },
    orderBy: { created_at: 'desc' },
  });

  if (!subscription) {
    return null;
  }

  // Derive tier from price ID
  let tier: 'free' | 'basic' | 'pro' | 'vip' = 'free';
  const priceId = subscription.stripe_price_id;
  if (priceId === process.env.STRIPE_PRICE_ID_VIP) {
    tier = 'vip';
  } else if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
    tier = 'pro';
  } else if (priceId === process.env.STRIPE_PRICE_ID_BASIC) {
    tier = 'basic';
  }

  return {
    tier,
    status: subscription.status,
    currentPeriodEnd: subscription.current_period_end.toISOString(),
    cancelAt: subscription.cancel_at?.toISOString() || null,
    isTrialing: subscription.status === 'trialing',
  };
}

/**
 * Get all dashboard data
 */
export async function getDashboardData(
  userId: string,
  timeRange: TimeRange,
  isVip: boolean
): Promise<DashboardData> {
  const [
    summary,
    activityData,
    spreadDistribution,
    favoriteCards,
    recentReadings,
    badges,
    subscription,
  ] = await Promise.all([
    getDashboardSummary(userId, timeRange),
    getActivityData(userId, timeRange),
    getSpreadDistribution(userId, timeRange),
    getFavoriteCards(userId, timeRange),
    getRecentReadings(userId),
    getUserBadges(userId),
    getSubscriptionInfo(userId),
  ]);

  // VIP-only AI insights (placeholder for now)
  let aiInsights: AIInsight[] | null = null;
  if (isVip && summary.totalReadings > 0) {
    aiInsights = [
      {
        type: 'pattern',
        title: 'รูปแบบการดูดวงของคุณ',
        content: `คุณมักจะดูดวงเกี่ยวกับ${summary.favoriteSpreadTh || 'หลายหัวข้อ'} ไพ่ที่ปรากฏบ่อยที่สุดคือ ${summary.mostCommonCardTh || 'หลากหลายไพ่'} ซึ่งอาจสะท้อนถึงช่วงเวลาแห่งการเปลี่ยนแปลงในชีวิตของคุณ`,
        generatedAt: new Date().toISOString(),
      },
      {
        type: 'recommendation',
        title: 'คำแนะนำสำหรับคุณ',
        content: summary.currentStreak > 0 
          ? `ยอดเยี่ยม! คุณดูดวงติดต่อกัน ${summary.currentStreak} วัน ลองทำให้ครบ ${Math.ceil(summary.currentStreak / 7) * 7} วันเพื่อรับเหรียญพิเศษ`
          : 'ลองตั้งเป้าดูดวงทุกวันเพื่อสร้าง streak และรับเหรียญรางวัล',
        generatedAt: new Date().toISOString(),
      },
    ];
  }

  return {
    summary,
    activityData,
    spreadDistribution,
    favoriteCards,
    recentReadings,
    badges,
    subscription,
    aiInsights,
  };
}
