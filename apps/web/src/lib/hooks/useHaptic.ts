'use client';

import { useCallback, useEffect, useState } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Hook for haptic feedback on mobile devices
 * Uses the Vibration API when available
 */
export function useHaptic() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Check if Vibration API is supported
    setIsSupported('vibrate' in navigator);
    
    // Load preference from localStorage
    const saved = localStorage.getItem('haptic-enabled');
    if (saved !== null) {
      setIsEnabled(saved === 'true');
    }
  }, []);

  const vibrate = useCallback((pattern: HapticPattern = 'light') => {
    if (!isSupported || !isEnabled) return;

    const patterns: Record<HapticPattern, number | number[]> = {
      light: 10,
      medium: 25,
      heavy: 50,
      success: [10, 50, 10],
      warning: [25, 50, 25],
      error: [50, 50, 50],
    };

    try {
      navigator.vibrate(patterns[pattern]);
    } catch {
      // Vibration not supported or blocked
    }
  }, [isSupported, isEnabled]);

  const toggleEnabled = useCallback(() => {
    setIsEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem('haptic-enabled', String(newValue));
      return newValue;
    });
  }, []);

  return {
    vibrate,
    isSupported,
    isEnabled,
    toggleEnabled,
  };
}


