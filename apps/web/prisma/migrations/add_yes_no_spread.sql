-- Add yes_no to ReadingType enum
-- Run this migration manually: psql $DATABASE_URL -f add_yes_no_spread.sql

ALTER TYPE "ReadingType" ADD VALUE 'yes_no';

