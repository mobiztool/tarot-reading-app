/**
 * useSpreadRecommendations Hook
 * Story 7.8: Spread Recommendation Engine
 * 
 * Provides spread recommendations based on user question with debouncing
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { SubscriptionTier } from '@/types/subscription';
import {
  getSpreadRecommendations,
  getDefaultRecommendations,
  RecommendationResult,
  SpreadRecommendation,
} from '@/lib/recommendation';

interface UseSpreadRecommendationsOptions {
  userTier: SubscriptionTier;
  maxRecommendations?: number;
  debounceMs?: number;
  minQuestionLength?: number;
}

interface UseSpreadRecommendationsReturn {
  recommendations: SpreadRecommendation[];
  hasMatches: boolean;
  primaryCategory: string | null;
  isLoading: boolean;
  updateQuestion: (question: string) => void;
}

export function useSpreadRecommendations({
  userTier,
  maxRecommendations = 5,
  debounceMs = 300,
  minQuestionLength = 3,
}: UseSpreadRecommendationsOptions): UseSpreadRecommendationsReturn {
  const [question, setQuestion] = useState('');
  const [debouncedQuestion, setDebouncedQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce question updates
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuestion(question);
      setIsLoading(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [question, debounceMs]);

  // Calculate recommendations
  const result = useMemo<RecommendationResult>(() => {
    if (debouncedQuestion.trim().length >= minQuestionLength) {
      return getSpreadRecommendations(debouncedQuestion, userTier, maxRecommendations);
    }
    return getDefaultRecommendations(userTier, maxRecommendations);
  }, [debouncedQuestion, userTier, maxRecommendations, minQuestionLength]);

  const updateQuestion = useCallback((newQuestion: string) => {
    setQuestion(newQuestion);
  }, []);

  return {
    recommendations: result.recommendations,
    hasMatches: result.hasMatches,
    primaryCategory: result.primaryCategory,
    isLoading,
    updateQuestion,
  };
}
