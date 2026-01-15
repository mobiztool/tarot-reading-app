/**
 * Recommendation Module
 * Story 7.8: Spread Recommendation Engine
 */

export {
  // Types
  type KeywordCategory,
  type SpreadRecommendation,
  type RecommendationResult,
  // Constants
  KEYWORD_CATEGORIES,
  // Functions
  analyzeQuestion,
  getSpreadRecommendations,
  getDefaultRecommendations,
  getAccessibleRecommendations,
} from './spread-recommendation';

export {
  // ML Data Collection Types
  type RecommendationInteraction,
  type SpreadRecommendationStats,
  // ML Data Collection Functions
  createInteractionRecord,
  storeInteraction,
  updateInteraction,
  getLocalInteractions,
  calculateLocalStats,
  clearLocalData,
  // Future ML Integration
  sendToMLPipeline,
  fetchMLRecommendations,
} from './ml-data-collection';
