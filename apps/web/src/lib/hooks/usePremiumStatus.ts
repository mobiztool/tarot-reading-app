'use client';

/**
 * Story 7.7: Premium UI Enhancements
 * Hook to check user's premium status and tier
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { SubscriptionTier } from '@/types/subscription';

interface PremiumStatus {
  tier: SubscriptionTier;
  isPremium: boolean;
  isVip: boolean;
  isPro: boolean;
  isBasic: boolean;
  isFree: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to get user's premium status
 * Returns tier information and boolean flags for easy checks
 */
export function usePremiumStatus(): PremiumStatus {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTier = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/subscriptions');
      
      if (response.ok) {
        const data = await response.json();
        setTier(data.currentTier || 'free');
      } else {
        setTier('free');
      }
    } catch (err) {
      console.error('Failed to fetch subscription tier:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
      setTier('free');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTier();
  }, [fetchTier]);

  const status = useMemo(() => ({
    tier,
    isPremium: tier !== 'free',
    isVip: tier === 'vip',
    isPro: tier === 'pro' || tier === 'vip',
    isBasic: tier === 'basic' || tier === 'pro' || tier === 'vip',
    isFree: tier === 'free',
    isLoading,
    error,
    refetch: fetchTier,
  }), [tier, isLoading, error, fetchTier]);

  return status;
}

export default usePremiumStatus;
