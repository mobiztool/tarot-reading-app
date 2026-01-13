// Badge System for Gamification

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: string;
  category: 'reading' | 'social' | 'engagement' | 'special';
}

export const BADGES: Badge[] = [
  // Reading badges
  {
    id: 'first_reading',
    name: 'ผู้แสวงหา',
    description: 'ดูดวงครั้งแรก',
    emoji: '🔮',
    requirement: 'Complete first reading',
    category: 'reading',
  },
  {
    id: 'daily_reader',
    name: 'นักอ่านประจำวัน',
    description: 'ดูดวงรายวัน 7 วันติดต่อกัน',
    emoji: '📅',
    requirement: 'Complete daily reading 7 consecutive days',
    category: 'reading',
  },
  {
    id: 'reading_master',
    name: 'ปรมาจารย์',
    description: 'ดูดวงครบ 50 ครั้ง',
    emoji: '🎓',
    requirement: 'Complete 50 readings',
    category: 'reading',
  },

  // Social badges
  {
    id: 'first_share',
    name: 'ผู้แบ่งปัน',
    description: 'แชร์ผลดูดวงครั้งแรก',
    emoji: '🌟',
    requirement: 'Share first reading',
    category: 'social',
  },
  {
    id: 'social_butterfly',
    name: 'ผีเสื้อสังคม',
    description: 'แชร์ผลดูดวง 10 ครั้ง',
    emoji: '🦋',
    requirement: 'Share 10 readings',
    category: 'social',
  },
  {
    id: 'influencer',
    name: 'อินฟลูเอนเซอร์',
    description: 'มีคนมาจากลิงก์ของคุณ 5 คน',
    emoji: '👑',
    requirement: 'Refer 5 new users',
    category: 'social',
  },

  // Engagement badges
  {
    id: 'note_taker',
    name: 'นักจดบันทึก',
    description: 'เขียนโน้ตบนการดู 5 ครั้ง',
    emoji: '📝',
    requirement: 'Add notes to 5 readings',
    category: 'engagement',
  },
  {
    id: 'collector',
    name: 'นักสะสม',
    description: 'บันทึกการดูเป็นรายการโปรด 10 ครั้ง',
    emoji: '⭐',
    requirement: 'Favorite 10 readings',
    category: 'engagement',
  },
  {
    id: 'explorer',
    name: 'นักสำรวจ',
    description: 'ดูความหมายไพ่ครบ 22 ใบ Major Arcana',
    emoji: '🗺️',
    requirement: 'View all 22 Major Arcana cards',
    category: 'engagement',
  },

  // Special badges
  {
    id: 'early_adopter',
    name: 'ผู้ใช้รุ่นแรก',
    description: 'สมัครสมาชิกในช่วง Beta',
    emoji: '🚀',
    requirement: 'Sign up during beta period',
    category: 'special',
  },
  {
    id: 'feedback_hero',
    name: 'ฮีโร่ฟีดแบ็ก',
    description: 'ส่งความคิดเห็นที่เป็นประโยชน์',
    emoji: '💪',
    requirement: 'Submit helpful feedback',
    category: 'special',
  },
];

export interface UserBadge {
  badgeId: string;
  earnedAt: string;
}

export interface UserStats {
  totalReadings: number;
  totalShares: number;
  totalNotes: number;
  totalFavorites: number;
  cardsViewed: string[];
  currentStreak: number;
  longestStreak: number;
  referralCount: number;
  earnedBadges: UserBadge[];
}

// Check if user has earned a badge
export function hasBadge(stats: UserStats, badgeId: string): boolean {
  return stats.earnedBadges.some((b) => b.badgeId === badgeId);
}

// Get all badges a user has earned
export function getEarnedBadges(stats: UserStats): Badge[] {
  const earnedIds = new Set(stats.earnedBadges.map((b) => b.badgeId));
  return BADGES.filter((badge) => earnedIds.has(badge.id));
}

// Check which badges user can earn based on stats
export function checkNewBadges(stats: UserStats): Badge[] {
  const newBadges: Badge[] = [];
  const earnedIds = new Set(stats.earnedBadges.map((b) => b.badgeId));

  // First reading
  if (stats.totalReadings >= 1 && !earnedIds.has('first_reading')) {
    const badge = BADGES.find((b) => b.id === 'first_reading');
    if (badge) newBadges.push(badge);
  }

  // Reading master
  if (stats.totalReadings >= 50 && !earnedIds.has('reading_master')) {
    const badge = BADGES.find((b) => b.id === 'reading_master');
    if (badge) newBadges.push(badge);
  }

  // First share
  if (stats.totalShares >= 1 && !earnedIds.has('first_share')) {
    const badge = BADGES.find((b) => b.id === 'first_share');
    if (badge) newBadges.push(badge);
  }

  // Social butterfly
  if (stats.totalShares >= 10 && !earnedIds.has('social_butterfly')) {
    const badge = BADGES.find((b) => b.id === 'social_butterfly');
    if (badge) newBadges.push(badge);
  }

  // Influencer
  if (stats.referralCount >= 5 && !earnedIds.has('influencer')) {
    const badge = BADGES.find((b) => b.id === 'influencer');
    if (badge) newBadges.push(badge);
  }

  // Note taker
  if (stats.totalNotes >= 5 && !earnedIds.has('note_taker')) {
    const badge = BADGES.find((b) => b.id === 'note_taker');
    if (badge) newBadges.push(badge);
  }

  // Collector
  if (stats.totalFavorites >= 10 && !earnedIds.has('collector')) {
    const badge = BADGES.find((b) => b.id === 'collector');
    if (badge) newBadges.push(badge);
  }

  // Explorer
  if (stats.cardsViewed.length >= 22 && !earnedIds.has('explorer')) {
    const badge = BADGES.find((b) => b.id === 'explorer');
    if (badge) newBadges.push(badge);
  }

  return newBadges;
}


