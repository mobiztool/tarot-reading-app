// Export Prisma-generated types for use across the application
// These types will be available after running: pnpm prisma generate

export type {
  Card,
  Reading,
  ReadingCard,
  Suit,
  Arcana,
  ReadingType,
  PositionLabel,
  Element,
} from '@prisma/client';

// Extended types for API responses
export interface ReadingWithCards {
  id: string;
  user_id: string | null;
  reading_type: string;
  question: string | null;
  created_at: Date;
  updated_at: Date;
  is_favorite: boolean;
  notes: string | null;
  reading_cards: ReadingCardWithCard[];
}

export interface ReadingCardWithCard {
  id: string;
  reading_id: string;
  card_id: string;
  position: number;
  position_label: string | null;
  is_reversed: boolean;
  created_at: Date;
  card: {
    id: string;
    name: string;
    name_th: string;
    slug: string;
    suit: string;
    arcana: string;
    image_url: string;
    meaning_upright: string;
    meaning_reversed: string;
    keywords_upright: string[];
    keywords_reversed: string[];
  };
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CardListResponse {
  cards: Card[];
  total: number;
}

export interface ReadingResponse {
  reading: ReadingWithCards;
}


