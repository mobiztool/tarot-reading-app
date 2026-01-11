-- Migration: Add love_relationships spread support
-- Description: Adds love_relationships to ReadingType enum and new position labels

-- Add new value to ReadingType enum
ALTER TYPE "ReadingType" ADD VALUE IF NOT EXISTS 'love_relationships';

-- Add new values to PositionLabel enum  
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'you';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'other';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'relationship_energy';

