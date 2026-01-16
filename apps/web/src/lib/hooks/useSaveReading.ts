import { useState, useCallback } from 'react';
import { DrawnCard } from '@/types/card';
import { useAuth } from './useAuth';

type PositionLabel = 
  | 'past' | 'present' | 'future' | 'you' | 'other' | 'relationship_energy' 
  | 'current_situation' | 'challenge_opportunity' | 'outcome' | 'yes_no_answer'
  // Celtic Cross positions
  | 'cc_present' | 'cc_challenge' | 'cc_past' | 'cc_future' | 'cc_above'
  | 'cc_below' | 'cc_advice' | 'cc_external' | 'cc_hopes_fears' | 'cc_outcome'
  // Decision Making positions
  | 'dm_option_a_pros' | 'dm_option_a_cons' | 'dm_option_b_pros' | 'dm_option_b_cons' | 'dm_best_path'
  // Self Discovery positions
  | 'sd_core_self' | 'sd_strengths' | 'sd_challenges' | 'sd_hidden_potential' | 'sd_path_forward'
  // Relationship Deep Dive positions
  | 'rdd_you' | 'rdd_them' | 'rdd_connection' | 'rdd_your_feelings' | 'rdd_their_feelings' | 'rdd_challenges' | 'rdd_future_potential'
  // Shadow Work positions
  | 'sw_conscious_self' | 'sw_shadow' | 'sw_fear' | 'sw_denied_strength' | 'sw_integration' | 'sw_healing' | 'sw_wholeness'
  // Chakra Alignment positions
  | 'ca_root' | 'ca_sacral' | 'ca_solar_plexus' | 'ca_heart' | 'ca_throat' | 'ca_third_eye' | 'ca_crown';

type ReadingType = 'daily' | 'three_card' | 'love_relationships' | 'career_money' | 'yes_no' | 'celtic_cross' | 'decision_making' | 'self_discovery' | 'relationship_deep_dive' | 'shadow_work' | 'chakra_alignment';

interface SaveReadingCard {
  cardId: string;
  position: number;
  positionLabel?: PositionLabel;
  isReversed: boolean;
}

interface SaveReadingRequest {
  readingType: ReadingType;
  question?: string;
  optionA?: string; // For Decision Making spread
  optionB?: string; // For Decision Making spread
  cards: SaveReadingCard[];
  userId?: string;
}

interface SavedReading {
  id: string;
  readingType: string;
  question: string | null;
  createdAt: string;
  cards: Array<{
    position: number;
    positionLabel: string | null;
    isReversed: boolean;
    card: {
      id: string;
      name: string;
      nameTh: string;
      slug: string;
    };
  }>;
}

interface DecisionOptions {
  optionA?: string;
  optionB?: string;
}

interface UseSaveReadingReturn {
  saveReading: (
    readingType: ReadingType,
    drawnCards: DrawnCard[],
    question?: string,
    positionLabels?: PositionLabel[],
    options?: DecisionOptions
  ) => Promise<SavedReading | null>;
  isSaving: boolean;
  savedReading: SavedReading | null;
  error: Error | null;
}

/**
 * Hook for saving tarot readings to the database
 */
export function useSaveReading(): UseSaveReadingReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [savedReading, setSavedReading] = useState<SavedReading | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const saveReading = useCallback(
    async (
      readingType: ReadingType,
      drawnCards: DrawnCard[],
      question?: string,
      customPositionLabels?: PositionLabel[],
      options?: DecisionOptions
    ): Promise<SavedReading | null> => {
      setIsSaving(true);
      setError(null);

      try {
        // Determine position labels based on reading type
        let positionLabels: Array<PositionLabel | undefined>;
        if (customPositionLabels) {
          positionLabels = customPositionLabels;
        } else if (readingType === 'three_card') {
          positionLabels = ['past', 'present', 'future'];
        } else if (readingType === 'love_relationships') {
          positionLabels = ['you', 'other', 'relationship_energy'];
        } else if (readingType === 'career_money') {
          positionLabels = ['current_situation', 'challenge_opportunity', 'outcome'];
        } else if (readingType === 'celtic_cross') {
          positionLabels = [
            'cc_present', 'cc_challenge', 'cc_past', 'cc_future', 'cc_above',
            'cc_below', 'cc_advice', 'cc_external', 'cc_hopes_fears', 'cc_outcome',
          ];
        } else if (readingType === 'decision_making') {
          positionLabels = [
            'dm_option_a_pros', 'dm_option_a_cons', 'dm_option_b_pros', 'dm_option_b_cons', 'dm_best_path',
          ];
        } else if (readingType === 'self_discovery') {
          positionLabels = [
            'sd_core_self', 'sd_strengths', 'sd_challenges', 'sd_hidden_potential', 'sd_path_forward',
          ];
        } else if (readingType === 'relationship_deep_dive') {
          positionLabels = [
            'rdd_you', 'rdd_them', 'rdd_connection', 'rdd_your_feelings', 'rdd_their_feelings', 'rdd_challenges', 'rdd_future_potential',
          ];
        } else if (readingType === 'shadow_work') {
          positionLabels = [
            'sw_conscious_self', 'sw_shadow', 'sw_fear', 'sw_denied_strength', 'sw_integration', 'sw_healing', 'sw_wholeness',
          ];
        } else if (readingType === 'chakra_alignment') {
          positionLabels = [
            'ca_root', 'ca_sacral', 'ca_solar_plexus', 'ca_heart', 'ca_throat', 'ca_third_eye', 'ca_crown',
          ];
        } else {
          positionLabels = [undefined];
        }

        const requestBody: SaveReadingRequest = {
          readingType,
          question,
          optionA: options?.optionA, // For Decision Making spread
          optionB: options?.optionB, // For Decision Making spread
          userId: user?.id, // Include user ID if logged in
          cards: drawnCards.map((drawnCard, index) => ({
            cardId: drawnCard.card.id,
            position: index,
            positionLabel: positionLabels[index],
            isReversed: drawnCard.isReversed,
          })),
        };

        const response = await fetch('/api/readings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || data.error || 'Failed to save reading');
        }

        setSavedReading(data.data);
        return data.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        setError(error);
        console.error('Failed to save reading:', error);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [user]
  );

  return { saveReading, isSaving, savedReading, error };
}

