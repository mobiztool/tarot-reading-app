-- Story 8.3: Add Remaining Premium Spreads Batch 2
-- Migration: Add 3 new ReadingType values and 15 new PositionLabel values

-- Add new reading types for Story 8.3 batch 2 spreads
ALTER TYPE "ReadingType" ADD VALUE IF NOT EXISTS 'friendship';
ALTER TYPE "ReadingType" ADD VALUE IF NOT EXISTS 'career_path';
ALTER TYPE "ReadingType" ADD VALUE IF NOT EXISTS 'financial_abundance';

-- Add new position labels for Friendship Reading (4 positions)
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'fr_foundation';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'fr_challenges';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'fr_strength';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'fr_future';

-- Add new position labels for Career Path (6 positions)
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'cp_current';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'cp_skills';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'cp_obstacles';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'cp_opportunities';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'cp_guidance';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'cp_outcome';

-- Add new position labels for Financial Abundance (5 positions)
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'fa_current';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'fa_blocks';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'fa_opportunities';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'fa_action';
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'fa_abundance';
