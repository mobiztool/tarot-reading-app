import { describe, it, expect, beforeEach } from 'vitest';
import {
  shuffleArray,
  shuffleDeck,
  shouldBeReversed,
  drawCards,
  drawDailyCard,
  drawThreeCardSpread,
  generateReadingSessionId,
  createReadingSession,
  createMockDeck,
} from '../shuffle';
import { TarotCardData } from '@/types/card';

describe('Shuffle Functions', () => {
  let mockDeck: TarotCardData[];

  beforeEach(() => {
    mockDeck = createMockDeck();
  });

  describe('createMockDeck', () => {
    it('should create a deck with 78 cards', () => {
      expect(mockDeck.length).toBe(78);
    });

    it('should have 22 Major Arcana cards', () => {
      const majorArcana = mockDeck.filter((card) => card.arcana === 'major');
      expect(majorArcana.length).toBe(22);
    });

    it('should have 56 Minor Arcana cards', () => {
      const minorArcana = mockDeck.filter((card) => card.arcana === 'minor');
      expect(minorArcana.length).toBe(56);
    });

    it('should have 14 cards in each suit', () => {
      const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;
      suits.forEach((suit) => {
        const suitCards = mockDeck.filter((card) => card.suit === suit);
        expect(suitCards.length).toBe(14);
      });
    });

    it('should have unique IDs for all cards', () => {
      const ids = mockDeck.map((card) => card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(78);
    });
  });

  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const input = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(input);
      expect(shuffled.length).toBe(input.length);
    });

    it('should contain all original elements', () => {
      const input = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(input);
      expect(shuffled.sort()).toEqual(input.sort());
    });

    it('should not modify the original array', () => {
      const input = [1, 2, 3, 4, 5];
      const originalCopy = [...input];
      shuffleArray(input);
      expect(input).toEqual(originalCopy);
    });

    it('should produce different orderings over multiple calls', () => {
      const input = Array.from({ length: 10 }, (_, i) => i);
      const results = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const shuffled = shuffleArray(input);
        results.add(JSON.stringify(shuffled));
      }

      // Should have multiple unique orderings
      expect(results.size).toBeGreaterThan(50);
    });
  });

  describe('shuffleDeck', () => {
    it('should return 78 cards', () => {
      const shuffled = shuffleDeck(mockDeck);
      expect(shuffled.length).toBe(78);
    });

    it('should contain all original cards', () => {
      const shuffled = shuffleDeck(mockDeck);
      const originalIds = mockDeck.map((c) => c.id).sort();
      const shuffledIds = shuffled.map((c) => c.id).sort();
      expect(shuffledIds).toEqual(originalIds);
    });
  });

  describe('shouldBeReversed', () => {
    it('should return boolean', () => {
      const result = shouldBeReversed();
      expect(typeof result).toBe('boolean');
    });

    it('should have approximately 50% true over many iterations', () => {
      let trueCount = 0;
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        if (shouldBeReversed()) trueCount++;
      }

      const percentage = (trueCount / iterations) * 100;
      // Allow for ±10% variance
      expect(percentage).toBeGreaterThan(40);
      expect(percentage).toBeLessThan(60);
    });
  });

  describe('drawCards', () => {
    it('should draw the specified number of cards', () => {
      const drawn = drawCards(mockDeck, 3);
      expect(drawn.length).toBe(3);
    });

    it('should return unique cards (no duplicates)', () => {
      const drawn = drawCards(mockDeck, 10);
      const ids = drawn.map((d) => d.card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });

    it('should include isReversed boolean for each card', () => {
      const drawn = drawCards(mockDeck, 5);
      drawn.forEach((d) => {
        expect(typeof d.isReversed).toBe('boolean');
      });
    });

    it('should assign positions when provided', () => {
      const positions: Array<'past' | 'present' | 'future'> = ['past', 'present', 'future'];
      const drawn = drawCards(mockDeck, 3, positions);

      expect(drawn[0].position).toBe('past');
      expect(drawn[1].position).toBe('present');
      expect(drawn[2].position).toBe('future');
    });

    it('should throw error when drawing more cards than available', () => {
      expect(() => drawCards(mockDeck, 100)).toThrow();
    });
  });

  describe('drawDailyCard', () => {
    it('should draw exactly 1 card', () => {
      const card = drawDailyCard(mockDeck);
      expect(card).toBeDefined();
      expect(card.card).toBeDefined();
    });

    it('should have isReversed property', () => {
      const card = drawDailyCard(mockDeck);
      expect(typeof card.isReversed).toBe('boolean');
    });
  });

  describe('drawThreeCardSpread', () => {
    it('should draw exactly 3 cards', () => {
      const cards = drawThreeCardSpread(mockDeck);
      expect(cards.length).toBe(3);
    });

    it('should assign correct positions', () => {
      const cards = drawThreeCardSpread(mockDeck);
      expect(cards[0].position).toBe('past');
      expect(cards[1].position).toBe('present');
      expect(cards[2].position).toBe('future');
    });

    it('should draw unique cards', () => {
      const cards = drawThreeCardSpread(mockDeck);
      const ids = cards.map((c) => c.card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });
  });

  describe('generateReadingSessionId', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateReadingSessionId());
      }
      expect(ids.size).toBe(100);
    });

    it('should start with "reading_" prefix', () => {
      const id = generateReadingSessionId();
      expect(id.startsWith('reading_')).toBe(true);
    });

    it('should have reasonable length', () => {
      const id = generateReadingSessionId();
      expect(id.length).toBeGreaterThan(15);
      expect(id.length).toBeLessThan(40);
    });
  });

  describe('createReadingSession', () => {
    it('should create a daily reading session', () => {
      const session = createReadingSession('daily', mockDeck);
      expect(session.type).toBe('daily');
      expect(session.drawnCards.length).toBe(1);
      expect(session.id).toBeDefined();
      expect(session.createdAt).toBeInstanceOf(Date);
    });

    it('should create a three-card reading session', () => {
      const session = createReadingSession('three-card', mockDeck);
      expect(session.type).toBe('three-card');
      expect(session.drawnCards.length).toBe(3);
    });

    it('should include question when provided', () => {
      const question = 'Will I find love?';
      const session = createReadingSession('daily', mockDeck, question);
      expect(session.question).toBe(question);
    });

    it('should not include question when not provided', () => {
      const session = createReadingSession('daily', mockDeck);
      expect(session.question).toBeUndefined();
    });
  });

  describe('Performance', () => {
    it('should complete shuffle and draw in under 50ms', () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        const shuffled = shuffleDeck(mockDeck);
        drawCards(shuffled, 3);
      }

      const end = performance.now();
      const avgTime = (end - start) / 100;

      expect(avgTime).toBeLessThan(50);
    });
  });
});


