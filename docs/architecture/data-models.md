# Data Models

This section defines the core data models/entities that will be shared between frontend and backend. These models represent the business domain and form the foundation of our database schema and API contracts.

## User

**Purpose:** Represents registered users of the application. Users can create accounts to save reading history, personalize settings, and access premium features in the future.

**Key Attributes:**
- `id`: string (UUID) - Unique user identifier from Supabase Auth
- `email`: string - User's email address (unique, required)
- `name`: string | null - User's display name (optional)
- `profile_picture_url`: string | null - URL to user's profile picture (stored in Supabase Storage)
- `created_at`: Date - Account creation timestamp
- `updated_at`: Date - Last profile update timestamp
- `last_login_at`: Date | null - Last successful login timestamp
- `email_verified`: boolean - Email verification status (Supabase Auth)
- `auth_provider`: enum - Authentication provider used (email, google, facebook)

### TypeScript Interface

```typescript
export interface User {
  id: string;
  email: string;
  name: string | null;
  profile_picture_url: string | null;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
  email_verified: boolean;
  auth_provider: 'email' | 'google' | 'facebook';
}

// Client-safe version (excludes sensitive data)
export type UserProfile = Omit<User, 'email_verified'>;
```

### Relationships

- **One-to-Many with Reading:** A user can have multiple readings (history)
- **One-to-Many with FavoriteCard:** A user can favorite multiple cards (Epic 4)
- **One-to-Many with ReadingNote:** A user can add notes to their readings (Epic 4)

---

## Card

**Purpose:** Represents the 78 tarot cards in the deck (22 Major Arcana + 56 Minor Arcana). Cards are static reference data seeded at database initialization and referenced by readings.

**Key Attributes:**
- `id`: string (UUID) - Unique card identifier
- `number`: number - Card number within its suit (0-21 for Major Arcana, 1-14 for Minor)
- `name`: string - Card name in English (e.g., "The Fool", "Ace of Cups")
- `name_th`: string - Card name in Thai (e.g., "คนบ้า", "เอซถ้วย")
- `suit`: enum - Card suit (major_arcana, wands, cups, swords, pentacles)
- `arcana`: enum - Major or Minor Arcana (major, minor)
- `image_url`: string - URL to card front image (WebP format, stored in Supabase Storage)
- `image_back_url`: string - URL to card back image (shared across all cards)
- `meaning_upright`: string - Interpretation when card is upright (Thai, 2-3 paragraphs)
- `meaning_reversed`: string - Interpretation when card is reversed (Thai, 2-3 paragraphs)
- `keywords_upright`: string[] - Key concepts for upright position (Thai)
- `keywords_reversed`: string[] - Key concepts for reversed position (Thai)
- `symbolism`: string - Explanation of visual elements (Epic 3, optional for MVP)
- `advice`: string - Practical guidance (Thai, 1-2 paragraphs)
- `element`: enum | null - Associated element for Minor Arcana (fire, water, air, earth)
- `slug`: string - SEO-friendly URL slug (e.g., "the-fool", "ace-of-cups")
- `created_at`: Date - Record creation timestamp

### TypeScript Interface

```typescript
export type Suit = 'major_arcana' | 'wands' | 'cups' | 'swords' | 'pentacles';
export type Arcana = 'major' | 'minor';
export type Element = 'fire' | 'water' | 'air' | 'earth';

export interface Card {
  id: string;
  number: number;
  name: string;
  name_th: string;
  suit: Suit;
  arcana: Arcana;
  image_url: string;
  image_back_url: string;
  meaning_upright: string;
  meaning_reversed: string;
  keywords_upright: string[];
  keywords_reversed: string[];
  symbolism: string | null;
  advice: string;
  element: Element | null;
  slug: string;
  created_at: Date;
}

// Lightweight version for lists and previews
export type CardSummary = Pick<Card, 'id' | 'name' | 'name_th' | 'suit' | 'image_url' | 'slug'>;
```

### Relationships

- **Many-to-Many with Reading:** Cards appear in multiple readings through ReadingCard junction table
- **One-to-Many with FavoriteCard:** A card can be favorited by multiple users (Epic 4)

---

## Reading

**Purpose:** Represents a tarot reading session. Each reading captures the type (Daily or 3-Card Spread), the question asked (optional), and metadata about when and by whom it was performed.

**Key Attributes:**
- `id`: string (UUID) - Unique reading identifier
- `user_id`: string | null - Foreign key to User (null for anonymous readings)
- `reading_type`: enum - Type of reading performed (daily, three_card)
- `question`: string | null - User's question or intention (max 500 chars, optional)
- `created_at`: Date - Reading creation timestamp
- `updated_at`: Date - Last modification timestamp (for notes in Epic 4)
- `is_favorite`: boolean - Whether user marked this reading as favorite (Epic 4)
- `notes`: string | null - Personal notes added by user (Epic 4, max 2000 chars)

### TypeScript Interface

```typescript
export type ReadingType = 'daily' | 'three_card';

export interface Reading {
  id: string;
  user_id: string | null;
  reading_type: ReadingType;
  question: string | null;
  created_at: Date;
  updated_at: Date;
  is_favorite: boolean;
  notes: string | null;
}

// Extended version with related data for display
export interface ReadingWithCards extends Reading {
  cards: ReadingCardWithDetails[];
}
```

### Relationships

- **Many-to-One with User:** A reading belongs to one user (or null for anonymous)
- **One-to-Many with ReadingCard:** A reading contains 1-3 cards via ReadingCard junction table

---

## ReadingCard

**Purpose:** Junction table that links readings to cards. Stores position-specific information (Past/Present/Future for 3-Card Spread) and whether the card was drawn reversed (upside down).

**Key Attributes:**
- `id`: string (UUID) - Unique junction record identifier
- `reading_id`: string - Foreign key to Reading
- `card_id`: string - Foreign key to Card
- `position`: number - Card position in the spread (0 for Daily, 0-2 for 3-Card)
- `position_label`: enum | null - Semantic position label (past, present, future) for 3-Card Spread
- `is_reversed`: boolean - Whether card was drawn reversed (affects interpretation)
- `created_at`: Date - Record creation timestamp

### TypeScript Interface

```typescript
export type PositionLabel = 'past' | 'present' | 'future';

export interface ReadingCard {
  id: string;
  reading_id: string;
  card_id: string;
  position: number;
  position_label: PositionLabel | null;
  is_reversed: boolean;
  created_at: Date;
}

// Extended version with full card details for display
export interface ReadingCardWithDetails extends ReadingCard {
  card: Card;
  // Computed property for display
  interpretation: string; // Returns meaning_upright or meaning_reversed based on is_reversed
}
```

### Relationships

- **Many-to-One with Reading:** Multiple cards belong to one reading
- **Many-to-One with Card:** References the drawn card from the Card table

---

## FavoriteCard (Epic 4)

**Purpose:** Tracks which cards users have favorited for quick reference. Supports Epic 4 personalization features.

**Key Attributes:**
- `id`: string (UUID) - Unique favorite record identifier
- `user_id`: string - Foreign key to User
- `card_id`: string - Foreign key to Card
- `created_at`: Date - When card was favorited

### TypeScript Interface

```typescript
export interface FavoriteCard {
  id: string;
  user_id: string;
  card_id: string;
  created_at: Date;
}

// Extended version for display
export interface FavoriteCardWithDetails extends FavoriteCard {
  card: Card;
}
```

### Relationships

- **Many-to-One with User:** A favorite belongs to one user
- **Many-to-One with Card:** A favorite references one card
- **Unique Constraint:** (user_id, card_id) - User can't favorite same card twice

---

## UserPreferences (Epic 4)

**Purpose:** Stores user personalization settings such as theme choice, notification preferences, and display options.

**Key Attributes:**
- `id`: string (UUID) - Unique preferences record identifier
- `user_id`: string - Foreign key to User (unique - one preferences record per user)
- `theme`: enum - Selected UI theme (dark_mystical, light_ethereal, deep_ocean, cosmic_purple)
- `enable_notifications`: boolean - Push notification preference
- `notification_time`: string | null - Preferred daily reminder time (HH:mm format)
- `enable_sound_effects`: boolean - Whether to play sound effects (card flip, shuffle)
- `language`: enum - Interface language preference (th, en)
- `created_at`: Date - Record creation timestamp
- `updated_at`: Date - Last update timestamp

### TypeScript Interface

```typescript
export type Theme = 'dark_mystical' | 'light_ethereal' | 'deep_ocean' | 'cosmic_purple';
export type Language = 'th' | 'en';

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: Theme;
  enable_notifications: boolean;
  notification_time: string | null;
  enable_sound_effects: boolean;
  language: Language;
  created_at: Date;
  updated_at: Date;
}
```

### Relationships

- **One-to-One with User:** Each user has one preferences record

---
