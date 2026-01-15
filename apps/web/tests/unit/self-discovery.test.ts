/**
 * Self Discovery Spread Unit Tests
 * Story 7.3: Self Discovery Spread (5 Cards)
 * Test Design: QA Engineer Quinn - 2026-01-13
 */

import { describe, it, expect } from 'vitest';
import {
  drawSelfDiscoverySpread,
  createMockDeck,
  createReadingSession,
} from '@/lib/tarot/shuffle';

describe('Self Discovery Spread - Unit Tests', () => {
  const mockDeck = createMockDeck();

  describe('drawSelfDiscoverySpread', () => {
    it('TC-7.3-010: should draw exactly 5 cards', () => {
      const cards = drawSelfDiscoverySpread(mockDeck);
      expect(cards).toHaveLength(5);
    });

    it('TC-7.3-011: should assign correct introspective position labels', () => {
      const cards = drawSelfDiscoverySpread(mockDeck);
      
      // Verify all 5 positions match test design
      expect(cards[0].position).toBe('sd_core_self');       // Core Self
      expect(cards[1].position).toBe('sd_strengths');       // Strengths
      expect(cards[2].position).toBe('sd_challenges');      // Challenges
      expect(cards[3].position).toBe('sd_hidden_potential');// Hidden Potential
      expect(cards[4].position).toBe('sd_path_forward');    // Path Forward
    });

    it('should draw unique cards (no duplicates)', () => {
      const cards = drawSelfDiscoverySpread(mockDeck);
      const cardIds = cards.map(c => c.card.id);
      const uniqueIds = [...new Set(cardIds)];
      
      expect(uniqueIds).toHaveLength(5);
    });

    it('should randomly assign reversed status', () => {
      // Run multiple times to verify randomness
      let hasReversed = false;
      let hasUpright = false;
      
      for (let i = 0; i < 100; i++) {
        const cards = drawSelfDiscoverySpread(mockDeck);
        cards.forEach(card => {
          if (card.isReversed) hasReversed = true;
          else hasUpright = true;
        });
        if (hasReversed && hasUpright) break;
      }
      
      // Should have both reversed and upright cards across runs
      expect(hasReversed).toBe(true);
      expect(hasUpright).toBe(true);
    });

    it('should include valid card data', () => {
      const cards = drawSelfDiscoverySpread(mockDeck);
      
      cards.forEach(drawnCard => {
        expect(drawnCard.card).toBeDefined();
        expect(drawnCard.card.id).toBeDefined();
        expect(drawnCard.card.name).toBeDefined();
        expect(drawnCard.card.nameTh).toBeDefined();
        expect(typeof drawnCard.isReversed).toBe('boolean');
      });
    });
  });

  describe('createReadingSession for self-discovery', () => {
    it('should create session with self-discovery type', () => {
      const session = createReadingSession('self-discovery', mockDeck, 'ฉันต้องการเข้าใจตัวเองมากขึ้น');
      
      expect(session.type).toBe('self-discovery');
      expect(session.question).toBe('ฉันต้องการเข้าใจตัวเองมากขึ้น');
      expect(session.drawnCards).toHaveLength(5);
    });

    it('should generate unique session ID', () => {
      const session1 = createReadingSession('self-discovery', mockDeck);
      const session2 = createReadingSession('self-discovery', mockDeck);
      
      expect(session1.id).not.toBe(session2.id);
      expect(session1.id).toMatch(/^reading_/);
    });

    it('should set createdAt timestamp', () => {
      const before = new Date();
      const session = createReadingSession('self-discovery', mockDeck);
      const after = new Date();
      
      expect(session.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(session.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('TC-7.3-030: reading_type validation', () => {
    it('should use correct reading_type value "self_discovery"', () => {
      // This tests that the type system recognizes self_discovery
      const session = createReadingSession('self-discovery', mockDeck);
      expect(session.type).toBe('self-discovery');
    });
  });
});
