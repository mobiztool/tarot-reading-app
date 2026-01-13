'use client';

import { useState, useCallback } from 'react';
import { DrawnCard, TarotCardData } from '@/types/card';
import { createReadingSession, createMockDeck, ReadingSession } from '@/lib/tarot';

export type ReadingType = 'daily' | 'three-card' | 'love' | 'career' | 'celtic-cross';
export type ReadingState = 'idle' | 'shuffling' | 'drawing' | 'revealing' | 'complete';

interface UseTarotReadingReturn {
  // State
  readingState: ReadingState;
  session: ReadingSession | null;
  drawnCards: DrawnCard[];
  revealedCards: boolean[];
  currentCardIndex: number;

  // Actions
  startReading: (type: ReadingType, question?: string) => void;
  revealCard: (index: number) => void;
  revealNextCard: () => void;
  revealAllCards: () => void;
  resetReading: () => void;

  // Computed
  isComplete: boolean;
  allRevealed: boolean;
}

/**
 * Custom hook for managing tarot reading state and actions
 * Handles shuffling, drawing, and revealing cards with animation timing
 */
export function useTarotReading(deck: TarotCardData[] = createMockDeck()): UseTarotReadingReturn {
  const [readingState, setReadingState] = useState<ReadingState>('idle');
  const [session, setSession] = useState<ReadingSession | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  /**
   * Start a new reading session
   */
  const startReading = useCallback(
    (type: ReadingType, question?: string) => {
      setReadingState('shuffling');

      // Simulate shuffle animation time
      setTimeout(() => {
        setReadingState('drawing');

        // Create session and draw cards
        const newSession = createReadingSession(type, deck, question);
        setSession(newSession);
        setDrawnCards(newSession.drawnCards);
        setRevealedCards(new Array(newSession.drawnCards.length).fill(false));
        setCurrentCardIndex(0);

        // Move to revealing state
        setTimeout(() => {
          setReadingState('revealing');
        }, 300);
      }, 800);
    },
    [deck]
  );

  /**
   * Reveal a specific card by index
   */
  const revealCard = useCallback((index: number) => {
    setRevealedCards((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    // Check if all cards are revealed
    setRevealedCards((prev) => {
      if (prev.every((revealed) => revealed)) {
        setReadingState('complete');
      }
      return prev;
    });
  }, []);

  /**
   * Reveal the next unrevealed card
   */
  const revealNextCard = useCallback(() => {
    const nextIndex = revealedCards.findIndex((revealed) => !revealed);
    if (nextIndex !== -1) {
      revealCard(nextIndex);
      setCurrentCardIndex(nextIndex + 1);
    }
  }, [revealedCards, revealCard]);

  /**
   * Reveal all cards at once
   */
  const revealAllCards = useCallback(() => {
    setRevealedCards((prev) => prev.map(() => true));
    setCurrentCardIndex(drawnCards.length);
    setReadingState('complete');
  }, [drawnCards.length]);

  /**
   * Reset the reading to initial state
   */
  const resetReading = useCallback(() => {
    setReadingState('idle');
    setSession(null);
    setDrawnCards([]);
    setRevealedCards([]);
    setCurrentCardIndex(0);
  }, []);

  // Computed values
  const isComplete = readingState === 'complete';
  const allRevealed = revealedCards.length > 0 && revealedCards.every((r) => r);

  return {
    readingState,
    session,
    drawnCards,
    revealedCards,
    currentCardIndex,
    startReading,
    revealCard,
    revealNextCard,
    revealAllCards,
    resetReading,
    isComplete,
    allRevealed,
  };
}

export default useTarotReading;

