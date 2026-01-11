'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseRateLimiterReturn {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutTimeRemaining: number; // in seconds
  recordAttempt: (success: boolean) => void;
  reset: () => void;
}

const STORAGE_KEY = 'login_rate_limit';

interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
}

export function useRateLimiter(
  maxAttempts: number = 5,
  lockoutMinutes: number = 15
): UseRateLimiterReturn {
  const [state, setState] = useState<RateLimitState>({
    attempts: 0,
    lockedUntil: null,
  });
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: RateLimitState = JSON.parse(stored);
        // Check if lockout has expired
        if (parsed.lockedUntil && Date.now() >= parsed.lockedUntil) {
          // Lockout expired, reset
          localStorage.removeItem(STORAGE_KEY);
        } else {
          setState(parsed);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Update lockout timer
  useEffect(() => {
    if (!state.lockedUntil) {
      setLockoutTimeRemaining(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((state.lockedUntil! - Date.now()) / 1000));
      setLockoutTimeRemaining(remaining);

      if (remaining === 0) {
        // Lockout expired
        setState({ attempts: 0, lockedUntil: null });
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [state.lockedUntil]);

  const recordAttempt = useCallback(
    (success: boolean) => {
      if (success) {
        // Reset on success
        setState({ attempts: 0, lockedUntil: null });
        localStorage.removeItem(STORAGE_KEY);
      } else {
        const newAttempts = state.attempts + 1;
        const newLockedUntil =
          newAttempts >= maxAttempts
            ? Date.now() + lockoutMinutes * 60 * 1000
            : null;

        const newState = {
          attempts: newAttempts,
          lockedUntil: newLockedUntil,
        };

        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }
    },
    [state.attempts, maxAttempts, lockoutMinutes]
  );

  const reset = useCallback(() => {
    setState({ attempts: 0, lockedUntil: null });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isLocked = state.lockedUntil !== null && Date.now() < state.lockedUntil;
  const remainingAttempts = Math.max(0, maxAttempts - state.attempts);

  return {
    isLocked,
    remainingAttempts,
    lockoutTimeRemaining,
    recordAttempt,
    reset,
  };
}


