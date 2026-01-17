/**
 * AI Interpretation Types
 * Story 9.2: AI-Powered Personalized Interpretations
 */

/**
 * Card information for AI interpretation
 */
export interface AICardInfo {
  name: string;
  nameTh: string;
  position: number;
  positionLabel: string;
  positionLabelTh: string;
  isReversed: boolean;
  meaningUpright?: string;
  meaningReversed?: string;
  keywords?: string[];
}

/**
 * Request for AI interpretation
 */
export interface AIInterpretationRequest {
  userId: string;
  question?: string;
  cards: AICardInfo[];
  readingType: string;
  readingTypeTh?: string;
  language?: 'th' | 'en';
  includeHistory?: boolean;
}

/**
 * AI interpretation response
 */
export interface AIInterpretationResponse {
  success: boolean;
  interpretation?: string;
  error?: string;
  cached?: boolean;
  tokensUsed?: number;
  costEstimate?: number;
}

/**
 * Reading history item for context
 */
export interface ReadingHistoryItem {
  date: string;
  readingType: string;
  question?: string;
  cards: { name: string; isReversed: boolean }[];
}

/**
 * AI usage tracking data
 */
export interface AIUsageRecord {
  userId: string;
  timestamp: Date;
  tokensUsed: number;
  costEstimate: number;
  model: string;
  readingType: string;
  cached: boolean;
}

/**
 * Rate limit status
 */
export interface AIRateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  dailyUsed: number;
  dailyLimit: number;
}
