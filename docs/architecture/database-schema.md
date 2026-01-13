# Database Schema

This section defines the concrete database schema for PostgreSQL (Supabase). The schema is implemented using Prisma ORM for type-safe database access and includes all tables, relationships, indexes, constraints, and Row Level Security (RLS) policies.

## Prisma Schema Definition

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Supabase connection pooler
}

// ============================================================================
// USERS TABLE
// ============================================================================
model User {
  id                  String    @id @default(uuid()) @db.Uuid
  email               String    @unique @db.VarChar(255)
  name                String?   @db.VarChar(100)
  profile_picture_url String?   @db.Text
  created_at          DateTime  @default(now()) @db.Timestamptz
  updated_at          DateTime  @updatedAt @db.Timestamptz
  last_login_at       DateTime? @db.Timestamptz
  email_verified      Boolean   @default(false)
  auth_provider       AuthProvider @default(email)

  // Relationships
  readings            Reading[]
  favorite_cards      FavoriteCard[]
  preferences         UserPreferences?

  @@map("users")
  @@index([email])
  @@index([created_at])
}

enum AuthProvider {
  email
  google
  facebook
}

// ============================================================================
// CARDS TABLE (Reference Data - 78 Tarot Cards)
// ============================================================================
model Card {
  id                 String   @id @default(uuid()) @db.Uuid
  number             Int      // 0-21 for Major Arcana, 1-14 for Minor Arcana
  name               String   @db.VarChar(100)
  name_th            String   @db.VarChar(100)
  suit               Suit
  arcana             Arcana
  image_url          String   @db.Text
  image_back_url     String   @default("/cards/back.webp") @db.Text
  meaning_upright    String   @db.Text
  meaning_reversed   String   @db.Text
  keywords_upright   String[] @db.VarChar(50)
  keywords_reversed  String[] @db.VarChar(50)
  symbolism          String?  @db.Text
  advice             String   @db.Text
  element            Element?
  slug               String   @unique @db.VarChar(100)
  created_at         DateTime @default(now()) @db.Timestamptz

  // Relationships
  reading_cards      ReadingCard[]
  favorite_cards     FavoriteCard[]

  @@map("cards")
  @@unique([suit, number]) // Prevent duplicate cards
  @@index([suit])
  @@index([arcana])
  @@index([slug])
}

enum Suit {
  major_arcana
  wands
  cups
  swords
  pentacles
}

enum Arcana {
  major
  minor
}

enum Element {
  fire   // Wands
  water  // Cups
  air    // Swords
  earth  // Pentacles
}

// ============================================================================
// READINGS TABLE
// ============================================================================
model Reading {
  id            String      @id @default(uuid()) @db.Uuid
  user_id       String?     @db.Uuid // Nullable for anonymous readings
  reading_type  ReadingType
  question      String?     @db.VarChar(500)
  created_at    DateTime    @default(now()) @db.Timestamptz
  updated_at    DateTime    @updatedAt @db.Timestamptz
  is_favorite   Boolean     @default(false)
  notes         String?     @db.VarChar(2000)

  // Relationships
  user          User?        @relation(fields: [user_id], references: [id], onDelete: Cascade)
  reading_cards ReadingCard[]

  @@map("readings")
  @@index([user_id])
  @@index([created_at(sort: Desc)]) // For history queries
  @@index([user_id, created_at(sort: Desc)]) // Composite index for user history
  @@index([reading_type])
}

enum ReadingType {
  daily
  three_card
}

// ============================================================================
// READING_CARDS TABLE (Junction Table)
// ============================================================================
model ReadingCard {
  id             String         @id @default(uuid()) @db.Uuid
  reading_id     String         @db.Uuid
  card_id        String         @db.Uuid
  position       Int            // 0 for daily, 0-2 for three_card
  position_label PositionLabel?
  is_reversed    Boolean        @default(false)
  created_at     DateTime       @default(now()) @db.Timestamptz

  // Relationships
  reading        Reading @relation(fields: [reading_id], references: [id], onDelete: Cascade)
  card           Card    @relation(fields: [card_id], references: [id], onDelete: Restrict)

  @@map("reading_cards")
  @@unique([reading_id, position]) // Prevent duplicate positions in same reading
  @@index([reading_id])
  @@index([card_id])
}

enum PositionLabel {
  past
  present
  future
}

// ============================================================================
// FAVORITE_CARDS TABLE (Epic 4)
// ============================================================================
model FavoriteCard {
  id         String   @id @default(uuid()) @db.Uuid
  user_id    String   @db.Uuid
  card_id    String   @db.Uuid
  created_at DateTime @default(now()) @db.Timestamptz

  // Relationships
  user       User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  card       Card @relation(fields: [card_id], references: [id], onDelete: Cascade)

  @@map("favorite_cards")
  @@unique([user_id, card_id]) // User can't favorite same card twice
  @@index([user_id])
  @@index([card_id])
}

// ============================================================================
// USER_PREFERENCES TABLE (Epic 4)
// ============================================================================
model UserPreferences {
  id                   String   @id @default(uuid()) @db.Uuid
  user_id              String   @unique @db.Uuid
  theme                Theme    @default(dark_mystical)
  enable_notifications Boolean  @default(false)
  notification_time    String?  @db.VarChar(5) // "HH:mm" format
  enable_sound_effects Boolean  @default(true)
  language             Language @default(th)
  created_at           DateTime @default(now()) @db.Timestamptz
  updated_at           DateTime @updatedAt @db.Timestamptz

  // Relationships
  user                 User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@map("user_preferences")
  @@index([user_id])
}

enum Theme {
  dark_mystical
  light_ethereal
  deep_ocean
  cosmic_purple
}

enum Language {
  th
  en
}
```

---

## Generated SQL DDL (PostgreSQL)

```sql
-- ============================================================================
-- ENUMS
-- ============================================================================
CREATE TYPE "AuthProvider" AS ENUM ('email', 'google', 'facebook');
CREATE TYPE "Suit" AS ENUM ('major_arcana', 'wands', 'cups', 'swords', 'pentacles');
CREATE TYPE "Arcana" AS ENUM ('major', 'minor');
CREATE TYPE "Element" AS ENUM ('fire', 'water', 'air', 'earth');
CREATE TYPE "ReadingType" AS ENUM ('daily', 'three_card');
CREATE TYPE "PositionLabel" AS ENUM ('past', 'present', 'future');
CREATE TYPE "Theme" AS ENUM ('dark_mystical', 'light_ethereal', 'deep_ocean', 'cosmic_purple');
CREATE TYPE "Language" AS ENUM ('th', 'en');

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "name" VARCHAR(100),
    "profile_picture_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "last_login_at" TIMESTAMPTZ,
    "email_verified" BOOLEAN NOT NULL DEFAULT FALSE,
    "auth_provider" "AuthProvider" NOT NULL DEFAULT 'email'
);

-- Indexes
CREATE INDEX "idx_users_email" ON "users"("email");
CREATE INDEX "idx_users_created_at" ON "users"("created_at");

-- Comments
COMMENT ON TABLE "users" IS 'Registered users of the application';
COMMENT ON COLUMN "users"."id" IS 'UUID from Supabase Auth (matches auth.users.id)';
COMMENT ON COLUMN "users"."email_verified" IS 'Synced with Supabase Auth email verification status';

-- ============================================================================
-- CARDS TABLE
-- ============================================================================
CREATE TABLE "cards" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "number" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "name_th" VARCHAR(100) NOT NULL,
    "suit" "Suit" NOT NULL,
    "arcana" "Arcana" NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_back_url" TEXT NOT NULL DEFAULT '/cards/back.webp',
    "meaning_upright" TEXT NOT NULL,
    "meaning_reversed" TEXT NOT NULL,
    "keywords_upright" VARCHAR(50)[] NOT NULL DEFAULT ARRAY[]::VARCHAR(50)[],
    "keywords_reversed" VARCHAR(50)[] NOT NULL DEFAULT ARRAY[]::VARCHAR(50)[],
    "symbolism" TEXT,
    "advice" TEXT NOT NULL,
    "element" "Element",
    "slug" VARCHAR(100) UNIQUE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX "idx_cards_slug" ON "cards"("slug");
CREATE UNIQUE INDEX "idx_cards_suit_number" ON "cards"("suit", "number");
CREATE INDEX "idx_cards_suit" ON "cards"("suit");
CREATE INDEX "idx_cards_arcana" ON "cards"("arcana");

-- Comments
COMMENT ON TABLE "cards" IS 'Reference data: 78 tarot cards (22 Major + 56 Minor Arcana)';
COMMENT ON COLUMN "cards"."slug" IS 'SEO-friendly URL slug (e.g., "the-fool", "ace-of-cups")';
COMMENT ON COLUMN "cards"."keywords_upright" IS 'Array of keywords for upright position (Thai)';

-- ============================================================================
-- READINGS TABLE
-- ============================================================================
CREATE TABLE "readings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
    "reading_type" "ReadingType" NOT NULL,
    "question" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "is_favorite" BOOLEAN NOT NULL DEFAULT FALSE,
    "notes" VARCHAR(2000)
);

-- Indexes
CREATE INDEX "idx_readings_user_id" ON "readings"("user_id");
CREATE INDEX "idx_readings_created_at" ON "readings"("created_at" DESC);
CREATE INDEX "idx_readings_user_created" ON "readings"("user_id", "created_at" DESC);
CREATE INDEX "idx_readings_type" ON "readings"("reading_type");

-- Comments
COMMENT ON TABLE "readings" IS 'Tarot reading sessions (daily or 3-card spread)';
COMMENT ON COLUMN "readings"."user_id" IS 'NULL for anonymous readings, can be claimed on signup';
COMMENT ON COLUMN "readings"."notes" IS 'Personal notes added by user (Epic 4)';

-- ============================================================================
-- READING_CARDS TABLE (Junction)
-- ============================================================================
CREATE TABLE "reading_cards" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "reading_id" UUID NOT NULL REFERENCES "readings"("id") ON DELETE CASCADE,
    "card_id" UUID NOT NULL REFERENCES "cards"("id") ON DELETE RESTRICT,
    "position" INTEGER NOT NULL CHECK ("position" >= 0 AND "position" <= 2),
    "position_label" "PositionLabel",
    "is_reversed" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT "uq_reading_position" UNIQUE ("reading_id", "position")
);

-- Indexes
CREATE INDEX "idx_reading_cards_reading_id" ON "reading_cards"("reading_id");
CREATE INDEX "idx_reading_cards_card_id" ON "reading_cards"("card_id");

-- Comments
COMMENT ON TABLE "reading_cards" IS 'Junction table linking readings to cards with position';
COMMENT ON COLUMN "reading_cards"."position" IS '0 for daily, 0-2 for three_card spread';
COMMENT ON COLUMN "reading_cards"."is_reversed" IS 'Whether card was drawn reversed (upside down)';

-- ============================================================================
-- FAVORITE_CARDS TABLE (Epic 4)
-- ============================================================================
CREATE TABLE "favorite_cards" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "card_id" UUID NOT NULL REFERENCES "cards"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT "uq_user_card_favorite" UNIQUE ("user_id", "card_id")
);

-- Indexes
CREATE INDEX "idx_favorite_cards_user_id" ON "favorite_cards"("user_id");
CREATE INDEX "idx_favorite_cards_card_id" ON "favorite_cards"("card_id");

-- Comments
COMMENT ON TABLE "favorite_cards" IS 'User bookmarked cards for quick reference';

-- ============================================================================
-- USER_PREFERENCES TABLE (Epic 4)
-- ============================================================================
CREATE TABLE "user_preferences" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID UNIQUE NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "theme" "Theme" NOT NULL DEFAULT 'dark_mystical',
    "enable_notifications" BOOLEAN NOT NULL DEFAULT FALSE,
    "notification_time" VARCHAR(5) CHECK ("notification_time" ~ '^([01]\d|2[0-3]):([0-5]\d)$'),
    "enable_sound_effects" BOOLEAN NOT NULL DEFAULT TRUE,
    "language" "Language" NOT NULL DEFAULT 'th',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX "idx_user_preferences_user_id" ON "user_preferences"("user_id");

-- Comments
COMMENT ON TABLE "user_preferences" IS 'User personalization settings (theme, notifications, language)';
COMMENT ON COLUMN "user_preferences"."notification_time" IS 'HH:mm format (24-hour) for daily reminders';
```

---

## Row Level Security (RLS) Policies

Supabase PostgreSQL supports Row Level Security to enforce authorization at the database level. These policies ensure users can only access their own data even if API logic is bypassed.

```sql
-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "readings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reading_cards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "favorite_cards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_preferences" ENABLE ROW LEVEL SECURITY;

-- Cards table is public (no RLS needed - reference data)

-- ============================================================================
-- USERS TABLE RLS POLICIES
-- ============================================================================
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON "users" FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON "users" FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================================
-- READINGS TABLE RLS POLICIES
-- ============================================================================
-- Authenticated users can create readings (user_id will be set to auth.uid())
CREATE POLICY "Authenticated users can create readings"
    ON "readings" FOR INSERT
    WITH CHECK (
        (auth.uid() IS NOT NULL AND user_id = auth.uid())
        OR user_id IS NULL -- Allow anonymous readings
    );

-- Users can view their own readings
CREATE POLICY "Users can view own readings"
    ON "readings" FOR SELECT
    USING (auth.uid() = user_id);

-- Anonymous readings are viewable by anyone who has the ID (for sharing)
CREATE POLICY "Anonymous readings viewable by reading ID"
    ON "readings" FOR SELECT
    USING (user_id IS NULL);

-- Users can update their own readings (for notes, favorite status)
CREATE POLICY "Users can update own readings"
    ON "readings" FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own readings
CREATE POLICY "Users can delete own readings"
    ON "readings" FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- READING_CARDS TABLE RLS POLICIES
-- ============================================================================
-- Inherit permissions from readings table (automatic via foreign key)
CREATE POLICY "Reading cards inherit reading permissions"
    ON "reading_cards" FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "readings"
            WHERE "readings"."id" = "reading_cards"."reading_id"
            AND (
                "readings"."user_id" = auth.uid()
                OR "readings"."user_id" IS NULL
            )
        )
    );

-- ============================================================================
-- FAVORITE_CARDS TABLE RLS POLICIES
-- ============================================================================
-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
    ON "favorite_cards" FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create favorites
CREATE POLICY "Users can create favorites"
    ON "favorite_cards" FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
    ON "favorite_cards" FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- USER_PREFERENCES TABLE RLS POLICIES
-- ============================================================================
-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
    ON "user_preferences" FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
    ON "user_preferences" FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can create their preferences (first time setup)
CREATE POLICY "Users can create own preferences"
    ON "user_preferences" FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

---

## Database Triggers & Functions

```sql
-- ============================================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_readings_updated_at
    BEFORE UPDATE ON "readings"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON "user_preferences"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER: Auto-create user preferences on user creation
-- ============================================================================
CREATE OR REPLACE FUNCTION create_default_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "user_preferences" ("user_id")
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_preferences_on_signup
    AFTER INSERT ON "users"
    FOR EACH ROW
    EXECUTE FUNCTION create_default_preferences();
```

---

## Database Indexes Summary

| Table | Index Name | Columns | Type | Purpose |
|-------|------------|---------|------|---------|
| **users** | `idx_users_email` | email | B-tree | Fast email lookups (login) |
| **users** | `idx_users_created_at` | created_at | B-tree | User cohort analysis |
| **cards** | `idx_cards_slug` | slug | B-tree (Unique) | SEO-friendly URL lookups |
| **cards** | `idx_cards_suit_number` | suit, number | B-tree (Unique) | Prevent duplicate cards |
| **cards** | `idx_cards_suit` | suit | B-tree | Filter by suit |
| **cards** | `idx_cards_arcana` | arcana | B-tree | Filter by Major/Minor |
| **readings** | `idx_readings_user_id` | user_id | B-tree | User's reading history |
| **readings** | `idx_readings_created_at` | created_at DESC | B-tree | Recent readings first |
| **readings** | `idx_readings_user_created` | user_id, created_at DESC | Composite | Optimized user history queries |
| **readings** | `idx_readings_type` | reading_type | B-tree | Filter by type |
| **reading_cards** | `idx_reading_cards_reading_id` | reading_id | B-tree | JOIN with readings |
| **reading_cards** | `idx_reading_cards_card_id` | card_id | B-tree | JOIN with cards |
| **reading_cards** | `uq_reading_position` | reading_id, position | B-tree (Unique) | Prevent duplicate positions |
| **favorite_cards** | `idx_favorite_cards_user_id` | user_id | B-tree | User's favorites list |
| **favorite_cards** | `idx_favorite_cards_card_id` | card_id | B-tree | Card popularity stats |
| **favorite_cards** | `uq_user_card_favorite` | user_id, card_id | B-tree (Unique) | Prevent duplicate favorites |
| **user_preferences** | `idx_user_preferences_user_id` | user_id | B-tree (Unique) | One-to-one with users |

**Total Indexes:** 17 indexes across 6 tables

---
