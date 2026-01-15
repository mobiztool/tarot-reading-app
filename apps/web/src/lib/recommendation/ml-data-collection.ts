/**
 * ML Data Collection for Spread Recommendations
 * Story 7.8: Spread Recommendation Engine
 * Phase 4: ML Foundation - Data Collection
 * 
 * This module provides infrastructure for collecting user interaction data
 * that can be used to train ML models in the future.
 * 
 * Current implementation: Stores data locally for analytics
 * Future: Send to ML pipeline for model training
 */

import { SpreadType } from '@/lib/access-control/spread-info';
import { SubscriptionTier } from '@/types/subscription';

// ============================================================================
// Types for ML Training Data
// ============================================================================

/**
 * Represents a user's interaction with spread recommendations
 */
export interface RecommendationInteraction {
  // Unique identifier
  id: string;
  timestamp: string;
  
  // User context
  userId?: string; // Anonymous if not logged in
  sessionId: string;
  userTier: SubscriptionTier;
  
  // Question data
  questionText: string;
  questionLength: number;
  detectedKeywords: string[];
  primaryCategory: string | null;
  
  // Recommendation data
  recommendedSpreads: SpreadType[];
  recommendationScores: number[];
  
  // User action
  action: 'shown' | 'clicked' | 'ignored' | 'completed';
  selectedSpread?: SpreadType;
  selectedSpreadRank?: number; // Position in the recommendation list (1-indexed)
  
  // Outcome (if reading was completed)
  readingCompleted?: boolean;
  readingDurationSeconds?: number;
  readingSaved?: boolean;
  
  // Device context
  deviceType: 'mobile' | 'tablet' | 'desktop';
  locale: string;
}

/**
 * Summary of recommendation performance for a spread
 */
export interface SpreadRecommendationStats {
  spreadId: SpreadType;
  
  // Show metrics
  timesRecommended: number;
  timesInTopPosition: number;
  
  // Click metrics
  timesClicked: number;
  clickThroughRate: number;
  
  // Completion metrics
  timesCompleted: number;
  completionRate: number;
  
  // Category performance
  performanceByCategory: Record<string, {
    shown: number;
    clicked: number;
    ctr: number;
  }>;
}

// ============================================================================
// Data Collection Functions
// ============================================================================

/**
 * Local storage key for recommendation data
 */
const STORAGE_KEY = 'recommendation_ml_data';
const MAX_LOCAL_ENTRIES = 100; // Keep last 100 interactions locally

/**
 * Generate a unique ID for an interaction
 */
function generateInteractionId(): string {
  return `ri_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get or create a session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('recommendation_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('recommendation_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Detect device type based on screen size
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Create a recommendation interaction record
 */
export function createInteractionRecord(params: {
  userId?: string;
  userTier: SubscriptionTier;
  questionText: string;
  detectedKeywords: string[];
  primaryCategory: string | null;
  recommendedSpreads: SpreadType[];
  recommendationScores: number[];
  action: RecommendationInteraction['action'];
  selectedSpread?: SpreadType;
  selectedSpreadRank?: number;
}): RecommendationInteraction {
  return {
    id: generateInteractionId(),
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userId: params.userId,
    userTier: params.userTier,
    questionText: params.questionText,
    questionLength: params.questionText.length,
    detectedKeywords: params.detectedKeywords,
    primaryCategory: params.primaryCategory,
    recommendedSpreads: params.recommendedSpreads,
    recommendationScores: params.recommendationScores,
    action: params.action,
    selectedSpread: params.selectedSpread,
    selectedSpreadRank: params.selectedSpreadRank,
    deviceType: getDeviceType(),
    locale: typeof navigator !== 'undefined' ? navigator.language : 'th-TH',
  };
}

/**
 * Store interaction data locally
 * In production, this would also send to analytics/ML pipeline
 */
export function storeInteraction(interaction: RecommendationInteraction): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Get existing data
    const existingData = localStorage.getItem(STORAGE_KEY);
    const interactions: RecommendationInteraction[] = existingData 
      ? JSON.parse(existingData) 
      : [];
    
    // Add new interaction
    interactions.push(interaction);
    
    // Keep only last N entries
    const trimmedInteractions = interactions.slice(-MAX_LOCAL_ENTRIES);
    
    // Store back
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedInteractions));
    
    // Log for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[ML Data] Stored interaction:', interaction.id, {
        action: interaction.action,
        category: interaction.primaryCategory,
        selectedSpread: interaction.selectedSpread,
      });
    }
  } catch (error) {
    console.error('[ML Data] Failed to store interaction:', error);
  }
}

/**
 * Update an existing interaction (e.g., when reading is completed)
 */
export function updateInteraction(
  interactionId: string,
  updates: Partial<Pick<RecommendationInteraction, 
    'action' | 'readingCompleted' | 'readingDurationSeconds' | 'readingSaved'
  >>
): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) return;
    
    const interactions: RecommendationInteraction[] = JSON.parse(existingData);
    const index = interactions.findIndex(i => i.id === interactionId);
    
    if (index !== -1) {
      interactions[index] = { ...interactions[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
    }
  } catch (error) {
    console.error('[ML Data] Failed to update interaction:', error);
  }
}

/**
 * Get local interaction data for analysis
 */
export function getLocalInteractions(): RecommendationInteraction[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Calculate basic recommendation stats from local data
 * This is a placeholder for future ML model feedback
 */
export function calculateLocalStats(): Record<SpreadType, {
  shown: number;
  clicked: number;
  ctr: number;
}> {
  const interactions = getLocalInteractions();
  const stats: Record<string, { shown: number; clicked: number }> = {};
  
  for (const interaction of interactions) {
    for (const spread of interaction.recommendedSpreads) {
      if (!stats[spread]) {
        stats[spread] = { shown: 0, clicked: 0 };
      }
      stats[spread].shown++;
    }
    
    if (interaction.selectedSpread && stats[interaction.selectedSpread]) {
      stats[interaction.selectedSpread].clicked++;
    }
  }
  
  // Calculate CTR
  const result: Record<string, { shown: number; clicked: number; ctr: number }> = {};
  for (const [spread, data] of Object.entries(stats)) {
    result[spread] = {
      ...data,
      ctr: data.shown > 0 ? data.clicked / data.shown : 0,
    };
  }
  
  return result as Record<SpreadType, { shown: number; clicked: number; ctr: number }>;
}

/**
 * Clear local ML data (for privacy or testing)
 */
export function clearLocalData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// ============================================================================
// Future ML Integration Points
// ============================================================================

/**
 * FUTURE: Send batch data to ML training pipeline
 * This would be called periodically or on page unload
 */
export async function sendToMLPipeline(interactions: RecommendationInteraction[]): Promise<void> {
  // TODO: Phase 4 - Implement API call to ML service
  // await fetch('/api/ml/recommendation-data', {
  //   method: 'POST',
  //   body: JSON.stringify({ interactions }),
  // });
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[ML Data] Future: Would send to ML pipeline:', interactions.length, 'interactions');
  }
}

/**
 * FUTURE: Fetch personalized recommendation weights from ML model
 */
export async function fetchMLRecommendations(_userId: string): Promise<Record<SpreadType, number> | null> {
  // TODO: Phase 4 - Implement API call to get ML-based recommendations
  // const response = await fetch(`/api/ml/recommendations/${userId}`);
  // return await response.json();
  return null; // Currently using keyword-based recommendations
}
