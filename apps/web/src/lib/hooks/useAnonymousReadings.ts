'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const SESSION_STORAGE_KEY = 'tarot_session_id';
const READINGS_COUNT_KEY = 'anonymous_readings_count';
const ONBOARDING_SHOWN_KEY = 'onboarding_shown';

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

interface UseAnonymousReadingsReturn {
  sessionId: string;
  readingsCount: number;
  incrementReadingsCount: () => void;
  shouldShowOnboarding: boolean;
  markOnboardingComplete: () => void;
  claimReadings: (userId: string) => Promise<number>;
}

export function useAnonymousReadings(): UseAnonymousReadingsReturn {
  const [sessionId, setSessionId] = useState('');
  const [readingsCount, setReadingsCount] = useState(0);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    // Get or create session ID
    let storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!storedSessionId) {
      storedSessionId = generateSessionId();
      localStorage.setItem(SESSION_STORAGE_KEY, storedSessionId);
    }
    setSessionId(storedSessionId);

    // Get readings count
    const count = parseInt(localStorage.getItem(READINGS_COUNT_KEY) || '0', 10);
    setReadingsCount(count);

    // Check if onboarding should show (only for newly authenticated users who haven't seen it)
    const onboardingShown = localStorage.getItem(ONBOARDING_SHOWN_KEY);
    if (!onboardingShown) {
      // Will be triggered by auth callback or first login detection
      setShouldShowOnboarding(false);
    }
  }, []);

  // Increment readings count
  const incrementReadingsCount = useCallback(() => {
    const newCount = readingsCount + 1;
    setReadingsCount(newCount);
    localStorage.setItem(READINGS_COUNT_KEY, newCount.toString());
  }, [readingsCount]);

  // Mark onboarding as complete
  const markOnboardingComplete = useCallback(() => {
    setShouldShowOnboarding(false);
    localStorage.setItem(ONBOARDING_SHOWN_KEY, 'true');
  }, []);

  // Claim anonymous readings for a user
  const claimReadings = useCallback(async (userId: string): Promise<number> => {
    if (!sessionId) return 0;

    try {
      const supabase = createClient();

      // Update readings with matching session_id to have the new user_id
      const { data, error } = await supabase
        .from('readings')
        .update({ user_id: userId })
        .eq('session_id', sessionId)
        .is('user_id', null)
        .select('id');

      if (error) {
        console.error('Error claiming readings:', error);
        return 0;
      }

      const claimedCount = data?.length || 0;

      // Reset local counts after claiming
      if (claimedCount > 0) {
        localStorage.removeItem(READINGS_COUNT_KEY);
        setReadingsCount(0);
      }

      return claimedCount;
    } catch (err) {
      console.error('Error claiming readings:', err);
      return 0;
    }
  }, [sessionId]);

  return {
    sessionId,
    readingsCount,
    incrementReadingsCount,
    shouldShowOnboarding,
    markOnboardingComplete,
    claimReadings,
  };
}


