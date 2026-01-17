/**
 * Pattern Analysis Service
 * Analyzes user reading history to detect patterns (Story 9.4)
 */

import {
  PatternAnalysisResult,
  CardFrequency,
  ThemeData,
  ThemeType,
  TimePattern,
  DayPattern,
  MonthlyReading,
  SpreadUsage,
  Insight,
} from './types';

// Minimum readings required for analysis
export const MINIMUM_READINGS = 10;

// Theme keywords for detection (Thai and English)
const THEME_KEYWORDS: Record<ThemeType, string[]> = {
  love: [
    'รัก', 'ความรัก', 'แฟน', 'คู่', 'แต่งงาน', 'หัวใจ', 'ความสัมพันธ์',
    'love', 'relationship', 'partner', 'marriage', 'heart', 'romance',
  ],
  career: [
    'งาน', 'อาชีพ', 'การงาน', 'เจ้านาย', 'เลื่อนขั้น', 'สัมภาษณ์',
    'work', 'career', 'job', 'boss', 'promotion', 'interview',
  ],
  money: [
    'เงิน', 'การเงิน', 'รายได้', 'หนี้', 'ลงทุน', 'ธุรกิจ',
    'money', 'finance', 'income', 'debt', 'investment', 'business',
  ],
  health: [
    'สุขภาพ', 'เจ็บ', 'ป่วย', 'โรค', 'หมอ', 'รักษา',
    'health', 'sick', 'illness', 'doctor', 'medical', 'wellness',
  ],
  family: [
    'ครอบครัว', 'พ่อ', 'แม่', 'ลูก', 'พี่', 'น้อง', 'ญาติ',
    'family', 'parents', 'children', 'siblings', 'relatives',
  ],
  spiritual: [
    'จิตวิญญาณ', 'สมาธิ', 'ปฏิบัติธรรม', 'กรรม', 'ชาติก่อน',
    'spiritual', 'meditation', 'karma', 'soul', 'enlightenment',
  ],
  personal_growth: [
    'พัฒนา', 'เติบโต', 'เรียนรู้', 'เปลี่ยนแปลง', 'ก้าวหน้า',
    'growth', 'development', 'learn', 'change', 'improve', 'self',
  ],
  general: [],
};

const THEME_NAMES_TH: Record<ThemeType, string> = {
  love: 'ความรัก',
  career: 'การงาน',
  money: 'การเงิน',
  health: 'สุขภาพ',
  family: 'ครอบครัว',
  spiritual: 'จิตวิญญาณ',
  personal_growth: 'การพัฒนาตนเอง',
  general: 'ทั่วไป',
};

const THEME_COLORS: Record<ThemeType, string> = {
  love: '#E91E63',
  career: '#2196F3',
  money: '#4CAF50',
  health: '#FF9800',
  family: '#9C27B0',
  spiritual: '#673AB7',
  personal_growth: '#00BCD4',
  general: '#607D8B',
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_TH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];

const SPREAD_NAMES_TH: Record<string, string> = {
  daily: 'ไพ่รายวัน',
  three_card: 'ไพ่ 3 ใบ',
  love_relationships: 'ความรัก',
  career_money: 'การงาน-การเงิน',
  yes_no: 'ใช่/ไม่ใช่',
  celtic_cross: 'Celtic Cross',
  decision_making: 'การตัดสินใจ',
  self_discovery: 'ค้นหาตัวเอง',
  relationship_deep_dive: 'ความสัมพันธ์เชิงลึก',
  chakra_alignment: 'จักระ',
  shadow_work: 'Shadow Work',
  friendship: 'มิตรภาพ',
  career_path: 'เส้นทางอาชีพ',
  financial_abundance: 'ความมั่งคั่ง',
  past_life: 'ชาติก่อน',
  dream_interpretation: 'ทำนายฝัน',
  moon_phases: 'ข้างขึ้น-ข้างแรม',
  elemental_balance: 'ธาตุสมดุล',
  soul_purpose: 'จุดประสงค์ชีวิต',
  karma_lessons: 'บทเรียนกรรม',
  monthly_forecast: 'พยากรณ์รายเดือน',
  year_ahead: 'พยากรณ์ปี',
  zodiac_wheel: 'ราศีจักร',
};

interface ReadingData {
  id: string;
  createdAt: Date;
  readingType: string;
  question: string | null;
  cards: {
    cardId: string;
    isReversed: boolean;
    card: {
      id: string;
      name: string;
      nameTh: string;
      imageUrl: string;
    };
  }[];
}

/**
 * Analyze user's reading patterns
 */
export function analyzePatterns(
  userId: string,
  readings: ReadingData[]
): PatternAnalysisResult {
  const readingCount = readings.length;
  const sufficientData = readingCount >= MINIMUM_READINGS;
  
  const result: PatternAnalysisResult = {
    userId,
    analyzedAt: new Date().toISOString(),
    readingCount,
    sufficientData,
    minimumReadingsRequired: MINIMUM_READINGS,
    frequentCards: [],
    themes: [],
    timePatterns: [],
    dayPatterns: [],
    monthlyReadings: [],
    spreadUsage: [],
    insights: [],
  };
  
  if (!sufficientData) {
    return result;
  }
  
  // Calculate all patterns
  result.frequentCards = calculateCardFrequencies(readings);
  result.themes = detectThemes(readings);
  result.timePatterns = calculateTimePatterns(readings);
  result.dayPatterns = calculateDayPatterns(readings);
  result.monthlyReadings = calculateMonthlyReadings(readings);
  result.spreadUsage = calculateSpreadUsage(readings);
  result.insights = generateInsights(result);
  
  return result;
}

/**
 * Calculate card appearance frequencies
 */
function calculateCardFrequencies(readings: ReadingData[]): CardFrequency[] {
  const cardMap = new Map<string, {
    cardId: string;
    cardName: string;
    cardNameTh: string;
    imageUrl: string;
    count: number;
    uprightCount: number;
    reversedCount: number;
  }>();
  
  let totalCards = 0;
  
  for (const reading of readings) {
    for (const rc of reading.cards) {
      totalCards++;
      const existing = cardMap.get(rc.cardId);
      
      if (existing) {
        existing.count++;
        if (rc.isReversed) {
          existing.reversedCount++;
        } else {
          existing.uprightCount++;
        }
      } else {
        cardMap.set(rc.cardId, {
          cardId: rc.cardId,
          cardName: rc.card.name,
          cardNameTh: rc.card.nameTh,
          imageUrl: rc.card.imageUrl,
          count: 1,
          uprightCount: rc.isReversed ? 0 : 1,
          reversedCount: rc.isReversed ? 1 : 0,
        });
      }
    }
  }
  
  // Convert to array and calculate percentages
  const frequencies: CardFrequency[] = Array.from(cardMap.values())
    .map(card => ({
      ...card,
      percentage: totalCards > 0 ? (card.count / totalCards) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 cards
  
  return frequencies;
}

/**
 * Detect themes from questions
 */
function detectThemes(readings: ReadingData[]): ThemeData[] {
  const themeCounts = new Map<ThemeType, number>();
  let totalWithQuestion = 0;
  
  for (const reading of readings) {
    if (!reading.question) continue;
    
    totalWithQuestion++;
    const questionLower = reading.question.toLowerCase();
    let matched = false;
    
    for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
      if (theme === 'general') continue;
      
      for (const keyword of keywords) {
        if (questionLower.includes(keyword.toLowerCase())) {
          const current = themeCounts.get(theme as ThemeType) || 0;
          themeCounts.set(theme as ThemeType, current + 1);
          matched = true;
          break;
        }
      }
    }
    
    if (!matched) {
      const current = themeCounts.get('general') || 0;
      themeCounts.set('general', current + 1);
    }
  }
  
  // Convert to array
  const themes: ThemeData[] = Array.from(themeCounts.entries())
    .map(([theme, count]) => ({
      theme,
      themeTh: THEME_NAMES_TH[theme],
      count,
      percentage: totalWithQuestion > 0 ? (count / totalWithQuestion) * 100 : 0,
      color: THEME_COLORS[theme],
    }))
    .filter(t => t.count > 0)
    .sort((a, b) => b.count - a.count);
  
  return themes;
}

/**
 * Calculate time-of-day patterns
 */
function calculateTimePatterns(readings: ReadingData[]): TimePattern[] {
  const hourCounts = new Array(24).fill(0);
  
  for (const reading of readings) {
    const hour = reading.createdAt.getHours();
    hourCounts[hour]++;
  }
  
  const total = readings.length;
  
  return hourCounts.map((count, hour) => ({
    hour,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));
}

/**
 * Calculate day-of-week patterns
 */
function calculateDayPatterns(readings: ReadingData[]): DayPattern[] {
  const dayCounts = new Array(7).fill(0);
  
  for (const reading of readings) {
    const day = reading.createdAt.getDay();
    dayCounts[day]++;
  }
  
  const total = readings.length;
  
  return dayCounts.map((count, day) => ({
    day,
    dayName: DAY_NAMES[day],
    dayNameTh: DAY_NAMES_TH[day],
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));
}

/**
 * Calculate monthly reading trends
 */
function calculateMonthlyReadings(readings: ReadingData[]): MonthlyReading[] {
  const monthMap = new Map<string, number>();
  
  for (const reading of readings) {
    const year = reading.createdAt.getFullYear();
    const month = reading.createdAt.getMonth() + 1;
    const key = `${year}-${String(month).padStart(2, '0')}`;
    
    const current = monthMap.get(key) || 0;
    monthMap.set(key, current + 1);
  }
  
  // Sort by date and get last 12 months
  const sortedMonths = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12);
  
  const MONTH_NAMES_TH = [
    '', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  return sortedMonths.map(([month, count]) => {
    const [year, monthNum] = month.split('-');
    const monthLabel = `${MONTH_NAMES_TH[parseInt(monthNum)]} ${parseInt(year) + 543 - 2500}`;
    
    return {
      month,
      monthLabel,
      count,
    };
  });
}

/**
 * Calculate spread type usage
 */
function calculateSpreadUsage(readings: ReadingData[]): SpreadUsage[] {
  const spreadCounts = new Map<string, number>();
  
  for (const reading of readings) {
    const current = spreadCounts.get(reading.readingType) || 0;
    spreadCounts.set(reading.readingType, current + 1);
  }
  
  const total = readings.length;
  
  return Array.from(spreadCounts.entries())
    .map(([spreadType, count]) => ({
      spreadType,
      spreadName: spreadType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      spreadNameTh: SPREAD_NAMES_TH[spreadType] || spreadType,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generate personalized insights
 */
function generateInsights(result: PatternAnalysisResult): Insight[] {
  const insights: Insight[] = [];
  
  // Card insights
  if (result.frequentCards.length > 0) {
    const topCard = result.frequentCards[0];
    insights.push({
      type: 'card',
      title: `${topCard.cardName} Appears Often`,
      titleTh: `${topCard.cardNameTh} ปรากฏบ่อย`,
      description: `${topCard.cardName} has appeared in ${topCard.count} of your readings (${topCard.percentage.toFixed(1)}%)`,
      descriptionTh: `${topCard.cardNameTh} ปรากฏใน ${topCard.count} ครั้ง (${topCard.percentage.toFixed(1)}%) ของการดูดวงของคุณ`,
      icon: '🎴',
      actionable: true,
      suggestion: `Consider exploring the deeper meaning of ${topCard.cardName} in your life`,
      suggestionTh: `ลองศึกษาความหมายเชิงลึกของ${topCard.cardNameTh}ในชีวิตของคุณ`,
    });
  }
  
  // Theme insights
  if (result.themes.length > 0) {
    const topTheme = result.themes[0];
    if (topTheme.theme !== 'general') {
      insights.push({
        type: 'theme',
        title: `Focus on ${topTheme.theme.replace('_', ' ')}`,
        titleTh: `สนใจเรื่อง${topTheme.themeTh}`,
        description: `${topTheme.percentage.toFixed(1)}% of your questions are about ${topTheme.theme.replace('_', ' ')}`,
        descriptionTh: `${topTheme.percentage.toFixed(1)}% ของคำถามเป็นเรื่อง${topTheme.themeTh}`,
        icon: '🎯',
        actionable: result.themes.length > 1,
        suggestion: result.themes.length > 1 
          ? `Try exploring other areas like ${result.themes[1].theme.replace('_', ' ')}`
          : undefined,
        suggestionTh: result.themes.length > 1
          ? `ลองสำรวจเรื่องอื่นๆ เช่น ${result.themes[1].themeTh}`
          : undefined,
      });
    }
  }
  
  // Time pattern insights
  const peakHour = result.timePatterns.reduce((max, t) => 
    t.count > max.count ? t : max, result.timePatterns[0]);
  
  if (peakHour && peakHour.count > 0) {
    const timeOfDay = peakHour.hour < 6 ? 'ดึก' :
                      peakHour.hour < 12 ? 'เช้า' :
                      peakHour.hour < 18 ? 'บ่าย' : 'ค่ำ';
    insights.push({
      type: 'time',
      title: 'Your Reading Time',
      titleTh: 'เวลาดูดวงของคุณ',
      description: `You prefer reading around ${peakHour.hour}:00`,
      descriptionTh: `คุณชอบดูดวงช่วง ${peakHour.hour}:00 น. (${timeOfDay})`,
      icon: '⏰',
    });
  }
  
  // Day pattern insights
  const peakDay = result.dayPatterns.reduce((max, d) => 
    d.count > max.count ? d : max, result.dayPatterns[0]);
  
  if (peakDay && peakDay.count > 0) {
    insights.push({
      type: 'time',
      title: 'Your Favorite Day',
      titleTh: 'วันที่คุณดูดวงบ่อยสุด',
      description: `You read most on ${peakDay.dayName}`,
      descriptionTh: `คุณดูดวงบ่อยสุดในวัน${peakDay.dayNameTh}`,
      icon: '📅',
    });
  }
  
  // Spread usage insights
  if (result.spreadUsage.length > 0) {
    const topSpread = result.spreadUsage[0];
    insights.push({
      type: 'spread',
      title: 'Your Favorite Spread',
      titleTh: 'รูปแบบที่คุณชอบ',
      description: `${topSpread.spreadName} is your most used spread (${topSpread.count} times)`,
      descriptionTh: `${topSpread.spreadNameTh} เป็นรูปแบบที่คุณใช้บ่อยที่สุด (${topSpread.count} ครั้ง)`,
      icon: '⭐',
      actionable: result.spreadUsage.length < 5,
      suggestion: 'Try exploring different spread types for new perspectives',
      suggestionTh: 'ลองใช้รูปแบบอื่นๆ เพื่อมุมมองใหม่',
    });
  }
  
  // General insight
  insights.push({
    type: 'general',
    title: 'Your Journey',
    titleTh: 'เส้นทางของคุณ',
    description: `You've completed ${result.readingCount} readings so far`,
    descriptionTh: `คุณดูดวงไปแล้ว ${result.readingCount} ครั้ง`,
    icon: '✨',
  });
  
  return insights;
}
