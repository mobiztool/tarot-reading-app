import { describe, it, expect, beforeEach } from 'vitest';
import { drawCareerSpread, createMockDeck, createReadingSession } from '../../src/lib/tarot/shuffle';

describe('Career Spread', () => {
  let mockDeck: ReturnType<typeof createMockDeck>;

  beforeEach(() => {
    mockDeck = createMockDeck();
  });

  describe('drawCareerSpread', () => {
    it('should draw exactly 3 cards', () => {
      const cards = drawCareerSpread(mockDeck);
      expect(cards).toHaveLength(3);
    });

    it('should assign correct position labels', () => {
      const cards = drawCareerSpread(mockDeck);
      expect(cards[0].position).toBe('current_situation');
      expect(cards[1].position).toBe('challenge_opportunity');
      expect(cards[2].position).toBe('outcome');
    });

    it('should draw unique cards (no duplicates)', () => {
      const cards = drawCareerSpread(mockDeck);
      const cardIds = cards.map(c => c.card.id);
      const uniqueIds = new Set(cardIds);
      expect(uniqueIds.size).toBe(3);
    });

    it('should assign isReversed property to each card', () => {
      const cards = drawCareerSpread(mockDeck);
      cards.forEach(card => {
        expect(typeof card.isReversed).toBe('boolean');
      });
    });

    it('should have approximately 50% reversed cards over many draws', () => {
      let reversedCount = 0;
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const cards = drawCareerSpread(mockDeck);
        reversedCount += cards.filter(c => c.isReversed).length;
      }

      const reversedPercentage = (reversedCount / (iterations * 3)) * 100;
      // Allow for 15% variance (35-65%)
      expect(reversedPercentage).toBeGreaterThan(35);
      expect(reversedPercentage).toBeLessThan(65);
    });
  });

  describe('createReadingSession with career type', () => {
    it('should create a career reading session with correct type', () => {
      const session = createReadingSession('career', mockDeck, 'ควรเปลี่ยนงานหรือยัง?');
      expect(session.type).toBe('career');
      expect(session.drawnCards).toHaveLength(3);
      expect(session.question).toBe('ควรเปลี่ยนงานหรือยัง?');
    });

    it('should generate unique session ID', () => {
      const session1 = createReadingSession('career', mockDeck);
      const session2 = createReadingSession('career', mockDeck);
      expect(session1.id).not.toBe(session2.id);
    });

    it('should set createdAt to current date', () => {
      const before = new Date();
      const session = createReadingSession('career', mockDeck);
      const after = new Date();

      expect(session.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(session.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should draw cards with career spread positions', () => {
      const session = createReadingSession('career', mockDeck);
      expect(session.drawnCards[0].position).toBe('current_situation');
      expect(session.drawnCards[1].position).toBe('challenge_opportunity');
      expect(session.drawnCards[2].position).toBe('outcome');
    });
  });
});

