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

export type PositionLabel = 'past' | 'present' | 'future' | 'you' | 'other' | 'relationship_energy' | 'current_situation' | 'challenge_opportunity' | 'outcome';

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
