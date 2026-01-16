// Tarot Card Types

export type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
export type Arcana = 'major' | 'minor';

export interface TarotCardData {
  id: string;
  slug: string;
  name: string;
  nameTh: string;
  number: number | null;
  suit: Suit | null;
  arcana: Arcana;
  imageUrl: string;
  keywords?: string[];
  keywordsTh?: string[];
  keywordsUpright?: string[];
  keywordsReversed?: string[];
  meaningUpright: string;
  meaningReversed: string;
  advice: string;
  element?: string | null;
  symbolism?: string;
}

export type PositionLabel = 
  | 'past' | 'present' | 'future' 
  | 'you' | 'other' | 'relationship_energy' 
  | 'current_situation' | 'challenge_opportunity' | 'outcome'
  // Celtic Cross positions (10 cards)
  | 'cc_present' | 'cc_challenge' | 'cc_past' | 'cc_future' 
  | 'cc_above' | 'cc_below' | 'cc_advice' | 'cc_external' 
  | 'cc_hopes_fears' | 'cc_outcome'
  // Decision Making positions (5 cards)
  | 'dm_option_a_pros' | 'dm_option_a_cons' 
  | 'dm_option_b_pros' | 'dm_option_b_cons' | 'dm_best_path'
  // Self Discovery positions (5 cards)
  | 'sd_core_self' | 'sd_strengths' | 'sd_challenges'
  | 'sd_hidden_potential' | 'sd_path_forward'
  // Relationship Deep Dive positions (7 cards)
  | 'rdd_you' | 'rdd_them' | 'rdd_connection' 
  | 'rdd_your_feelings' | 'rdd_their_feelings' 
  | 'rdd_challenges' | 'rdd_future_potential'
  // Shadow Work positions (7 cards) - VIP only
  | 'sw_conscious_self' | 'sw_shadow' | 'sw_fear'
  | 'sw_denied_strength' | 'sw_integration' 
  | 'sw_healing' | 'sw_wholeness';

export interface DrawnCard {
  card: TarotCardData;
  isReversed: boolean;
  position?: PositionLabel;
}

export interface CardDisplayProps {
  card: TarotCardData;
  isReversed?: boolean;
  isFlipped?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
}

// Card size configurations
export const CARD_SIZES = {
  sm: { width: 80, height: 140 },
  md: { width: 120, height: 210 },
  lg: { width: 180, height: 315 },
  xl: { width: 240, height: 420 },
} as const;

// Suit display names
export const SUIT_NAMES: Record<Suit, { en: string; th: string }> = {
  major: { en: 'Major Arcana', th: 'ไพ่ใหญ่' },
  wands: { en: 'Wands', th: 'ไม้เท้า' },
  cups: { en: 'Cups', th: 'ถ้วย' },
  swords: { en: 'Swords', th: 'ดาบ' },
  pentacles: { en: 'Pentacles', th: 'เหรียญ' },
};

// Generate image path for a card
export function getCardImagePath(suit: Suit, number: number): string {
  return `/cards/${suit}/${number.toString().padStart(2, '0')}.webp`;
}

// Get card back image path
export function getCardBackPath(): string {
  return '/cards/card-back.svg';
}

/**
 * Story 7.7: Premium Card Backs
 * Get premium card back image path based on subscription tier
 */
export function getPremiumCardBackPath(isPremium: boolean = false): string {
  return isPremium ? '/cards/card-back-premium.svg' : '/cards/card-back.svg';
}
