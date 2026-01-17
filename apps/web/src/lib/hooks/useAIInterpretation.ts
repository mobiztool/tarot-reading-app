/**
 * AI Interpretation Hook
 * Story 9.2: AI-Powered Personalized Interpretations
 * 
 * Custom hook for requesting AI-powered tarot interpretations
 */

'use client';

import { useState, useCallback } from 'react';
import { AICardInfo } from '@/lib/ai/types';

interface AIInterpretationState {
  isLoading: boolean;
  interpretation: string | null;
  error: string | null;
  cached: boolean;
  remaining: number | null;
}

interface AIInterpretationStatus {
  available: boolean;
  authenticated: boolean;
  isVip: boolean;
  currentTier?: string;
  rateLimit: {
    remaining: number;
    dailyLimit: number;
    resetAt: string;
  } | null;
}

interface UseAIInterpretationReturn {
  // State
  state: AIInterpretationState;
  status: AIInterpretationStatus | null;
  
  // Actions
  requestInterpretation: (
    readingType: string,
    cards: AICardInfo[],
    question?: string
  ) => Promise<boolean>;
  fetchStatus: () => Promise<void>;
  reset: () => void;
}

const initialState: AIInterpretationState = {
  isLoading: false,
  interpretation: null,
  error: null,
  cached: false,
  remaining: null,
};

/**
 * Hook for AI-powered tarot interpretation
 */
export function useAIInterpretation(): UseAIInterpretationReturn {
  const [state, setState] = useState<AIInterpretationState>(initialState);
  const [status, setStatus] = useState<AIInterpretationStatus | null>(null);

  /**
   * Fetch AI service status
   */
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/interpret');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch AI status:', error);
    }
  }, []);

  /**
   * Request AI interpretation
   */
  const requestInterpretation = useCallback(
    async (
      readingType: string,
      cards: AICardInfo[],
      question?: string
    ): Promise<boolean> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await fetch('/api/ai/interpret', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            readingType,
            cards,
            question,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่',
          }));
          return false;
        }

        setState({
          isLoading: false,
          interpretation: data.interpretation,
          error: null,
          cached: data.cached || false,
          remaining: data.remaining ?? null,
        });

        return true;
      } catch (error) {
        console.error('AI interpretation error:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่',
        }));
        return false;
      }
    },
    []
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    status,
    requestInterpretation,
    fetchStatus,
    reset,
  };
}

export default useAIInterpretation;
