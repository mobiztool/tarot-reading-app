import { describe, it, expect, beforeEach } from 'vitest';
import { drawLoveSpread, createMockDeck, createReadingSession } from '../../src/lib/tarot/shuffle';

describe('Love Spread', () => {
  let mockDeck: ReturnType<typeof createMockDeck>;

  beforeEach(() => {
    mockDeck = createMockDeck();
  });

  describe('drawLoveSpread', () => {
    it('should draw exactly 3 cards', () => {
      const cards = drawLoveSpread(mockDeck);
      expect(cards).toHaveLength(3);
    });

    it('should assign correct position labels', () => {
      const cards = drawLoveSpread(mockDeck);
      expect(cards[0].position).toBe('you');
      expect(cards[1].position).toBe('other');
      expect(cards[2].position).toBe('relationship_energy');
    });

    it('should draw unique cards (no duplicates)', () => {
      const cards = drawLoveSpread(mockDeck);
      const cardIds = cards.map(c => c.card.id);
      const uniqueIds = new Set(cardIds);
      expect(uniqueIds.size).toBe(3);
    });

    it('should assign isReversed property to each card', () => {
      const cards = drawLoveSpread(mockDeck);
      cards.forEach(card => {
        expect(typeof card.isReversed).toBe('boolean');
      });
    });

    it('should have approximately 50% reversed cards over many draws', () => {
      let reversedCount = 0;
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const cards = drawLoveSpread(mockDeck);
        reversedCount += cards.filter(c => c.isReversed).length;
      }

      const reversedPercentage = (reversedCount / (iterations * 3)) * 100;
      // Allow for 15% variance (35-65%)
      expect(reversedPercentage).toBeGreaterThan(35);
      expect(reversedPercentage).toBeLessThan(65);
    });
  });

  describe('createReadingSession with love type', () => {
    it('should create a love reading session with correct type', () => {
      const session = createReadingSession('love', mockDeck, 'จะเจอคนที่ใช่ไหม?');
      expect(session.type).toBe('love');
      expect(session.drawnCards).toHaveLength(3);
      expect(session.question).toBe('จะเจอคนที่ใช่ไหม?');
    });

    it('should generate unique session ID', () => {
      const session1 = createReadingSession('love', mockDeck);
      const session2 = createReadingSession('love', mockDeck);
      expect(session1.id).not.toBe(session2.id);
    });

    it('should set createdAt to current date', () => {
      const before = new Date();
      const session = createReadingSession('love', mockDeck);
      const after = new Date();

      expect(session.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(session.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should draw cards with love spread positions', () => {
      const session = createReadingSession('love', mockDeck);
      expect(session.drawnCards[0].position).toBe('you');
      expect(session.drawnCards[1].position).toBe('other');
      expect(session.drawnCards[2].position).toBe('relationship_energy');
    });
  });
});

