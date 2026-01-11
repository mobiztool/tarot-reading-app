-- Story 5.7: Add Analytics Events Table
-- This migration adds the analytics_events table for tracking spread usage

-- Create event type enum
DO $$ BEGIN
    CREATE TYPE "AnalyticsEventType" AS ENUM (
        'spread_page_view',
        'spread_started',
        'spread_completed',
        'spread_abandoned',
        'spread_gate_shown',
        'login_prompt_clicked',
        'signup_completed',
        'question_submitted',
        'card_drawn',
        'result_viewed',
        'result_shared',
        'user_returned',
        'spread_repeated'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create device type enum
DO $$ BEGIN
    CREATE TYPE "DeviceType" AS ENUM (
        'mobile',
        'tablet',
        'desktop'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS "analytics_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_type" "AnalyticsEventType" NOT NULL,
    "spread_type" "ReadingType",
    "user_id" UUID,
    "reading_id" UUID,
    "device_type" "DeviceType",
    "session_id" VARCHAR(255),
    "metadata" JSONB,
    "duration_ms" INTEGER,
    "step" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "analytics_events" 
    ADD CONSTRAINT "analytics_events_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "analytics_events" 
    ADD CONSTRAINT "analytics_events_reading_id_fkey" 
    FOREIGN KEY ("reading_id") REFERENCES "readings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "analytics_events_event_type_spread_type_created_at_idx" 
    ON "analytics_events"("event_type", "spread_type", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "analytics_events_user_id_created_at_idx" 
    ON "analytics_events"("user_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "analytics_events_spread_type_created_at_idx" 
    ON "analytics_events"("spread_type", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "analytics_events_session_id_idx" 
    ON "analytics_events"("session_id");

CREATE INDEX IF NOT EXISTS "analytics_events_created_at_idx" 
    ON "analytics_events"("created_at" DESC);

-- Add comment for documentation
COMMENT ON TABLE "analytics_events" IS 'Tracks all analytics events for spread usage, conversions, and engagement (Story 5.7)';

