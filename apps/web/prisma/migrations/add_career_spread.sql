-- Migration: Add career_money spread support
-- Description: Adds career_money to ReadingType enum and new position labels

-- Add new value to ReadingType enum
ALTER TYPE "ReadingType" ADD VALUE IF NOT EXISTS 'career_money';

-- Add new values to PositionLabel enum  
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'current_situation';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'challenge_opportunity';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'outcome';

