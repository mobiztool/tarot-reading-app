'use client';

import { useState, useEffect } from 'react';
import { TarotCardData } from '@/types/card';
import { createMockDeck } from '@/lib/tarot';

interface UseCardsReturn {
  cards: TarotCardData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch tarot cards from database
 * Falls back to mock deck if fetch fails
 */
export function useCards(): UseCardsReturn {
  const [cards, setCards] = useState<TarotCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cards');
      const result = await response.json();

      if (result.success && result.data) {
        setCards(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch cards');
      }
    } catch (err) {
      console.error('Error fetching cards, using mock deck:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to mock deck
      setCards(createMockDeck());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    isLoading,
    error,
    refetch: fetchCards,
  };
}

export default useCards;


