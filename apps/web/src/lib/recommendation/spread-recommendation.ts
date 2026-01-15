/**
 * Spread Recommendation Engine
 * Story 7.8: Spread Recommendation Engine
 * Phase 3: Simple keyword matching
 * 
 * Analyzes user questions and suggests appropriate spreads
 * Supports both Thai and English keywords
 */

import { SpreadType, SPREAD_INFO, SpreadInfo, canAccessSpreadClient } from '@/lib/access-control/spread-info';
import { SubscriptionTier } from '@/types/subscription';

// ============================================================================
// Keyword Definitions
// ============================================================================

/**
 * Keyword categories with Thai and English support
 */
export interface KeywordCategory {
  id: string;
  keywords: {
    th: string[];
    en: string[];
  };
  recommendedSpreads: SpreadType[];
  priority: number; // Higher = more specific match
}

/**
 * Keyword categories mapped to spread recommendations
 * Priority determines which category takes precedence on multiple matches
 */
export const KEYWORD_CATEGORIES: KeywordCategory[] = [
  // Love & Relationships
  {
    id: 'love',
    keywords: {
      th: ['ความรัก', 'รัก', 'แฟน', 'คู่', 'หัวใจ', 'ชีวิตคู่', 'แต่งงาน', 'เนื้อคู่', 'คนรัก', 'สัมพันธ์', 'ความสัมพันธ์', 'เลิกกัน', 'หย่า', 'นอกใจ', 'รักซ้อน'],
      en: ['love', 'relationship', 'partner', 'romance', 'heart', 'marriage', 'dating', 'boyfriend', 'girlfriend', 'spouse', 'soulmate', 'breakup', 'divorce', 'affair'],
    },
    recommendedSpreads: ['love_relationships', 'relationship_deep_dive', 'three_card', 'yes_no'],
    priority: 8,
  },

  // Career & Money
  {
    id: 'career',
    keywords: {
      th: ['การงาน', 'งาน', 'อาชีพ', 'เงิน', 'การเงิน', 'เงินเดือน', 'เลื่อนตำแหน่ง', 'เจ้านาย', 'ลูกน้อง', 'ธุรกิจ', 'ลงทุน', 'ค้าขาย', 'สมัครงาน', 'สัมภาษณ์งาน', 'ตกงาน', 'หนี้', 'รายได้'],
      en: ['career', 'job', 'work', 'money', 'finance', 'salary', 'promotion', 'boss', 'business', 'investment', 'income', 'debt', 'interview', 'unemployed', 'profession'],
    },
    recommendedSpreads: ['career_money', 'three_card', 'decision_making', 'yes_no'],
    priority: 8,
  },

  // Decision Making
  {
    id: 'decision',
    keywords: {
      th: ['ตัดสินใจ', 'เลือก', 'ทางเลือก', 'ควรทำ', 'ไม่ควร', 'ดีไหม', 'เหมาะไหม', 'คิดไม่ออก', 'ลังเล', 'สองทาง', 'ทางแยก'],
      en: ['decide', 'decision', 'choose', 'choice', 'should', 'option', 'alternative', 'hesitate', 'crossroad', 'dilemma'],
    },
    recommendedSpreads: ['decision_making', 'yes_no', 'three_card'],
    priority: 9,
  },

  // Yes/No Questions
  {
    id: 'yesno',
    keywords: {
      th: ['ใช่ไหม', 'หรือเปล่า', 'จะได้ไหม', 'จะสำเร็จไหม', 'จะเป็นไปได้ไหม', 'จะเกิดขึ้นไหม', 'มีโอกาสไหม'],
      en: ['will i', 'will it', 'should i', 'is it', 'can i', 'possible', 'succeed', 'happen'],
    },
    recommendedSpreads: ['yes_no', 'three_card'],
    priority: 7,
  },

  // Self Discovery
  {
    id: 'self',
    keywords: {
      th: ['ตัวเอง', 'ตัวตน', 'ค้นหาตัวเอง', 'เข้าใจตัวเอง', 'พัฒนาตัวเอง', 'จุดแข็ง', 'จุดอ่อน', 'ศักยภาพ', 'ความสามารถ'],
      en: ['myself', 'self', 'identity', 'discover', 'understand', 'strength', 'weakness', 'potential', 'ability', 'personal growth'],
    },
    recommendedSpreads: ['self_discovery', 'three_card', 'soul_purpose'],
    priority: 7,
  },

  // Spirituality & Energy
  {
    id: 'spiritual',
    keywords: {
      th: ['จิตวิญญาณ', 'พลังงาน', 'จักระ', 'สมาธิ', 'ธรรม', 'กรรม', 'ชาติก่อน', 'อดีตชาติ', 'วิญญาณ', 'ความฝัน', 'ฝัน'],
      en: ['spiritual', 'energy', 'chakra', 'meditation', 'karma', 'past life', 'soul', 'dream', 'spirit', 'aura'],
    },
    recommendedSpreads: ['chakra_alignment', 'soul_purpose', 'past_life', 'karma_lessons', 'dream_interpretation'],
    priority: 6,
  },

  // Future & General
  {
    id: 'future',
    keywords: {
      th: ['อนาคต', 'จะเป็นอย่างไร', 'จะเกิดอะไร', 'ปีหน้า', 'เดือนหน้า', 'วันนี้', 'พรุ่งนี้', 'สัปดาห์นี้'],
      en: ['future', 'what will', 'tomorrow', 'next week', 'next month', 'next year', 'upcoming', 'destiny'],
    },
    recommendedSpreads: ['three_card', 'daily', 'celtic_cross'],
    priority: 5,
  },

  // Shadow & Inner Work
  {
    id: 'shadow',
    keywords: {
      th: ['ด้านมืด', 'กลัว', 'ความกลัว', 'บาดแผล', 'เจ็บปวด', 'อดีต', 'บาดแผลใจ', 'ปมด้อย'],
      en: ['shadow', 'fear', 'trauma', 'pain', 'past', 'wound', 'darkness', 'hidden'],
    },
    recommendedSpreads: ['shadow_work', 'self_discovery', 'three_card'],
    priority: 6,
  },

  // Manifestation & Goals
  {
    id: 'manifestation',
    keywords: {
      th: ['ดึงดูด', 'ความปรารถนา', 'เป้าหมาย', 'ความฝัน', 'สำเร็จ', 'ได้รับ', 'ต้องการ'],
      en: ['manifest', 'attract', 'desire', 'goal', 'wish', 'achieve', 'success', 'want', 'dream'],
    },
    recommendedSpreads: ['manifestation', 'three_card', 'daily'],
    priority: 6,
  },
];

// ============================================================================
// Recommendation Result Types
// ============================================================================

export interface SpreadRecommendation {
  spread: SpreadInfo;
  matchScore: number;
  matchedKeywords: string[];
  matchedCategory: string;
  reason: string;
  reasonTh: string;
  isAccessible: boolean;
  requiredTier: SubscriptionTier;
}

export interface RecommendationResult {
  question: string;
  recommendations: SpreadRecommendation[];
  hasMatches: boolean;
  primaryCategory: string | null;
}

// ============================================================================
// Recommendation Engine
// ============================================================================

/**
 * Analyze question text and extract matched keywords
 */
export function analyzeQuestion(question: string): {
  matchedCategories: { category: KeywordCategory; matchedKeywords: string[] }[];
} {
  const normalizedQuestion = question.toLowerCase().trim();
  const matchedCategories: { category: KeywordCategory; matchedKeywords: string[] }[] = [];

  for (const category of KEYWORD_CATEGORIES) {
    const matchedKeywords: string[] = [];

    // Check Thai keywords
    for (const keyword of category.keywords.th) {
      if (normalizedQuestion.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    }

    // Check English keywords
    for (const keyword of category.keywords.en) {
      if (normalizedQuestion.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    }

    if (matchedKeywords.length > 0) {
      matchedCategories.push({ category, matchedKeywords });
    }
  }

  // Sort by priority (higher priority first), then by number of matched keywords
  matchedCategories.sort((a, b) => {
    if (b.category.priority !== a.category.priority) {
      return b.category.priority - a.category.priority;
    }
    return b.matchedKeywords.length - a.matchedKeywords.length;
  });

  return { matchedCategories };
}

/**
 * Generate reason text for why a spread was recommended
 */
function generateReasonText(
  category: KeywordCategory,
  matchedKeywords: string[]
): { reason: string; reasonTh: string } {
  const keywordSample = matchedKeywords.slice(0, 2).join(', ');
  
  const reasonMap: Record<string, { reason: string; reasonTh: string }> = {
    love: {
      reason: `Based on your question about ${keywordSample}`,
      reasonTh: `จากคำถามเกี่ยวกับ${keywordSample}`,
    },
    career: {
      reason: `Based on your question about ${keywordSample}`,
      reasonTh: `จากคำถามเกี่ยวกับ${keywordSample}`,
    },
    decision: {
      reason: 'Helps you make clear decisions',
      reasonTh: 'ช่วยให้คุณตัดสินใจได้ชัดเจน',
    },
    yesno: {
      reason: 'Quick answer for your specific question',
      reasonTh: 'คำตอบรวดเร็วสำหรับคำถามของคุณ',
    },
    self: {
      reason: 'Helps you understand yourself better',
      reasonTh: 'ช่วยให้เข้าใจตัวเองมากขึ้น',
    },
    spiritual: {
      reason: 'Explores your spiritual journey',
      reasonTh: 'สำรวจเส้นทางจิตวิญญาณของคุณ',
    },
    future: {
      reason: 'Insights about your path ahead',
      reasonTh: 'มองเห็นเส้นทางข้างหน้า',
    },
    shadow: {
      reason: 'Explore your inner depths',
      reasonTh: 'สำรวจส่วนลึกภายใน',
    },
    manifestation: {
      reason: 'Helps you attract what you desire',
      reasonTh: 'ช่วยดึงดูดสิ่งที่คุณต้องการ',
    },
  };

  return reasonMap[category.id] || {
    reason: 'Recommended for your question',
    reasonTh: 'แนะนำสำหรับคำถามของคุณ',
  };
}

/**
 * Get spread recommendations based on user question
 */
export function getSpreadRecommendations(
  question: string,
  userTier: SubscriptionTier,
  maxRecommendations: number = 5
): RecommendationResult {
  const { matchedCategories } = analyzeQuestion(question);

  if (matchedCategories.length === 0) {
    // No keyword matches - return popular/default spreads
    return getDefaultRecommendations(userTier, maxRecommendations);
  }

  const recommendations: SpreadRecommendation[] = [];
  const addedSpreads = new Set<SpreadType>();

  // Process each matched category
  for (const { category, matchedKeywords } of matchedCategories) {
    const { reason, reasonTh } = generateReasonText(category, matchedKeywords);

    for (const spreadType of category.recommendedSpreads) {
      // Skip if already added
      if (addedSpreads.has(spreadType)) continue;

      const spreadInfo = SPREAD_INFO[spreadType];
      if (!spreadInfo || !spreadInfo.isAvailable) continue;

      const isAccessible = canAccessSpreadClient(userTier, spreadType);

      recommendations.push({
        spread: spreadInfo,
        matchScore: category.priority * 10 + matchedKeywords.length,
        matchedKeywords,
        matchedCategory: category.id,
        reason,
        reasonTh,
        isAccessible,
        requiredTier: spreadInfo.minimumTier,
      });

      addedSpreads.add(spreadType);
    }
  }

  // Sort by match score (higher first), then by accessibility
  recommendations.sort((a, b) => {
    // Accessible spreads first
    if (a.isAccessible !== b.isAccessible) {
      return a.isAccessible ? -1 : 1;
    }
    return b.matchScore - a.matchScore;
  });

  return {
    question,
    recommendations: recommendations.slice(0, maxRecommendations),
    hasMatches: true,
    primaryCategory: matchedCategories[0]?.category.id || null,
  };
}

/**
 * Get default recommendations when no keywords match
 */
export function getDefaultRecommendations(
  userTier: SubscriptionTier,
  maxRecommendations: number = 5
): RecommendationResult {
  // Popular spreads in order of general usefulness
  const popularSpreads: SpreadType[] = [
    'three_card',
    'daily',
    'love_relationships',
    'career_money',
    'yes_no',
    'celtic_cross',
    'decision_making',
  ];

  const recommendations: SpreadRecommendation[] = [];

  for (const spreadType of popularSpreads) {
    const spreadInfo = SPREAD_INFO[spreadType];
    if (!spreadInfo || !spreadInfo.isAvailable) continue;

    const isAccessible = canAccessSpreadClient(userTier, spreadType);

    recommendations.push({
      spread: spreadInfo,
      matchScore: 50 - recommendations.length * 5, // Decreasing score by order
      matchedKeywords: [],
      matchedCategory: 'popular',
      reason: 'Popular choice for general readings',
      reasonTh: 'รูปแบบยอดนิยม',
      isAccessible,
      requiredTier: spreadInfo.minimumTier,
    });

    if (recommendations.length >= maxRecommendations) break;
  }

  // Sort accessible first
  recommendations.sort((a, b) => {
    if (a.isAccessible !== b.isAccessible) {
      return a.isAccessible ? -1 : 1;
    }
    return b.matchScore - a.matchScore;
  });

  return {
    question: '',
    recommendations,
    hasMatches: false,
    primaryCategory: null,
  };
}

/**
 * Get recommendations filtered by accessibility
 * Returns only spreads user can access
 */
export function getAccessibleRecommendations(
  question: string,
  userTier: SubscriptionTier,
  maxRecommendations: number = 3
): SpreadRecommendation[] {
  const result = getSpreadRecommendations(question, userTier, maxRecommendations * 2);
  return result.recommendations
    .filter((r) => r.isAccessible)
    .slice(0, maxRecommendations);
}
