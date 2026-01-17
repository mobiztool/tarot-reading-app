/**
 * Pattern Analysis Types
 * Types for VIP Reading Pattern Analysis feature (Story 9.4)
 */

/**
 * Card frequency data
 */
export interface CardFrequency {
  cardId: string;
  cardName: string;
  cardNameTh: string;
  count: number;
  percentage: number;
  uprightCount: number;
  reversedCount: number;
  imageUrl: string;
}

/**
 * Theme detection result
 */
export interface ThemeData {
  theme: ThemeType;
  themeTh: string;
  count: number;
  percentage: number;
  color: string;
}

export type ThemeType = 
  | 'love'
  | 'career'
  | 'spiritual'
  | 'personal_growth'
  | 'money'
  | 'health'
  | 'family'
  | 'general';

/**
 * Time pattern data
 */
export interface TimePattern {
  hour: number;
  count: number;
  percentage: number;
}

export interface DayPattern {
  day: number; // 0 = Sunday, 6 = Saturday
  dayName: string;
  dayNameTh: string;
  count: number;
  percentage: number;
}

export interface MonthlyReading {
  month: string; // YYYY-MM
  monthLabel: string;
  count: number;
}

/**
 * Spread usage statistics
 */
export interface SpreadUsage {
  spreadType: string;
  spreadName: string;
  spreadNameTh: string;
  count: number;
  percentage: number;
}

/**
 * Personalized insight
 */
export interface Insight {
  type: 'card' | 'theme' | 'time' | 'spread' | 'general';
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  actionable?: boolean;
  suggestion?: string;
  suggestionTh?: string;
}

/**
 * Complete pattern analysis result
 */
export interface PatternAnalysisResult {
  userId: string;
  analyzedAt: string;
  readingCount: number;
  sufficientData: boolean;
  minimumReadingsRequired: number;
  
  // Frequent cards
  frequentCards: CardFrequency[];
  
  // Themes
  themes: ThemeData[];
  
  // Time patterns
  timePatterns: TimePattern[];
  dayPatterns: DayPattern[];
  monthlyReadings: MonthlyReading[];
  
  // Spread usage
  spreadUsage: SpreadUsage[];
  
  // Personalized insights
  insights: Insight[];
}

/**
 * Reading comparison data
 */
export interface ComparisonReading {
  id: string;
  createdAt: string;
  readingType: string;
  readingTypeTh: string;
  question: string | null;
  cards: ComparisonCard[];
}

export interface ComparisonCard {
  position: number;
  positionLabel: string | null;
  isReversed: boolean;
  card: {
    id: string;
    name: string;
    nameTh: string;
    imageUrl: string;
  };
}

export interface ReadingComparison {
  reading1: ComparisonReading;
  reading2: ComparisonReading;
  commonCards: string[];
  differences: string[];
}

/**
 * API Response types
 */
export interface PatternAnalysisResponse {
  success: boolean;
  data?: PatternAnalysisResult;
  error?: string;
}

export interface ComparisonResponse {
  success: boolean;
  data?: ReadingComparison;
  error?: string;
}
