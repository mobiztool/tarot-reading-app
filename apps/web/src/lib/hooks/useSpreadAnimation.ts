/**
 * useSpreadAnimation Hook
 * Story 7.5: Premium Spread Responsive Layouts (AC: 9)
 * 
 * Provides animation utilities for staggered card reveals
 */

import { useMemo, useCallback } from 'react';
import { AnimationConfig, UseSpreadAnimationReturn } from '@/types/spread-layout';

interface UseSpreadAnimationOptions {
  cardCount: number;
  enabled?: boolean;
  staggerDelay?: number; // ms between each card
  flipDuration?: number; // ms for flip animation
  entranceAnimation?: 'fade' | 'scale' | 'slide';
}

export function useSpreadAnimation({
  cardCount,
  enabled = true,
  staggerDelay = 300,
  flipDuration = 700,
  entranceAnimation = 'fade',
}: UseSpreadAnimationOptions): UseSpreadAnimationReturn {
  // Calculate animation delay for each card position
  const getAnimationDelay = useCallback(
    (index: number): number => {
      if (!enabled) return 0;
      return index * staggerDelay;
    },
    [enabled, staggerDelay]
  );

  // Generate animation class based on state
  const getAnimationClass = useCallback(
    (index: number, isRevealed: boolean): string => {
      if (!enabled) return '';

      const delay = getAnimationDelay(index);
      const classes: string[] = [];

      // Entrance animation
      switch (entranceAnimation) {
        case 'scale':
          classes.push(isRevealed ? 'animate-scale-in' : 'scale-0');
          break;
        case 'slide':
          classes.push(isRevealed ? 'animate-slide-up' : 'translate-y-8 opacity-0');
          break;
        case 'fade':
        default:
          classes.push(isRevealed ? 'animate-fade-in' : 'opacity-0');
          break;
      }

      return classes.join(' ');
    },
    [enabled, entranceAnimation, getAnimationDelay]
  );

  // Check if animation should be applied
  const shouldAnimate = useCallback(
    (index: number): boolean => {
      if (!enabled) return false;
      return index < cardCount;
    },
    [enabled, cardCount]
  );

  return useMemo(
    () => ({
      getAnimationDelay,
      getAnimationClass,
      shouldAnimate,
    }),
    [getAnimationDelay, getAnimationClass, shouldAnimate]
  );
}

// Animation configuration presets
export const ANIMATION_PRESETS = {
  fast: {
    staggerDelay: 150,
    flipDuration: 500,
  },
  normal: {
    staggerDelay: 300,
    flipDuration: 700,
  },
  slow: {
    staggerDelay: 500,
    flipDuration: 900,
  },
  dramatic: {
    staggerDelay: 800,
    flipDuration: 1200,
  },
} as const;

export default useSpreadAnimation;
