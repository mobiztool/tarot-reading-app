-- Migration: Add Chakra Alignment spread support
-- Story 8.2: Chakra Alignment Spread

-- Add chakra_alignment to ReadingType enum
ALTER TYPE "ReadingType" ADD VALUE IF NOT EXISTS 'chakra_alignment';

-- Add chakra position labels to PositionLabel enum
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'ca_root';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'ca_sacral';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'ca_solar_plexus';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'ca_heart';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'ca_throat';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'ca_third_eye';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'ca_crown';
