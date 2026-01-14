/**
 * Decision Making Spread Unit Tests
 * Story 7.2: Decision Making Spread (5 Cards)
 */

import { describe, it, expect, vi } from 'vitest';
import { drawDecisionMakingSpread, createReadingSession } from '@/lib/tarot/shuffle';
import { DECISION_MAKING_POSITIONS, getDecisionMakingPositionContext, getSpreadPositions } from '@/lib/tarot/positionInterpretations';
import { canAccessSpread, SPREAD_ACCESS_MATRIX, SPREAD_INFO } from '@/lib/access-control/spreads';

// Mock Prisma for canAccessSpread tests
vi.mock('@/lib/prisma', () => ({
  prisma: {
    subscription: {
      findFirst: vi.fn(),
    },
  },
}));

describe('Decision Making Spread', () => {
  describe('Card Drawing', () => {
    const createMockDeck = () => {
      const deck = [];
      for (let i = 0; i < 78; i++) {
        deck.push({
          id: `card-${i}`,
          slug: `card-${i}`,
          name: `Card ${i}`,
          nameTh: `ไพ่ ${i}`,
          number: i,
          suit: i < 22 ? 'major' : 'wands',
          arcana: i < 22 ? 'major' : 'minor',
          imageUrl: `/cards/${i}.webp`,
          meaningUpright: 'Upright meaning',
          meaningReversed: 'Reversed meaning',
          advice: 'Advice text',
        });
      }
      return deck;
    };

    it('should draw exactly 5 cards for Decision Making spread', () => {
      const deck = createMockDeck();
      const drawnCards = drawDecisionMakingSpread(deck);

      expect(drawnCards).toHaveLength(5);
    });

    it('should have correct position labels for all 5 cards', () => {
      const deck = createMockDeck();
      const drawnCards = drawDecisionMakingSpread(deck);

      const expectedPositions = [
        'dm_option_a_pros',
        'dm_option_a_cons',
        'dm_option_b_pros',
        'dm_option_b_cons',
        'dm_best_path',
      ];

      drawnCards.forEach((card, index) => {
        expect(card.position).toBe(expectedPositions[index]);
      });
    });

    it('should not have duplicate cards', () => {
      const deck = createMockDeck();
      const drawnCards = drawDecisionMakingSpread(deck);

      const cardIds = drawnCards.map((c) => c.card.id);
      const uniqueIds = [...new Set(cardIds)];

      expect(uniqueIds).toHaveLength(5);
    });

    it('should have isReversed property on all cards', () => {
      const deck = createMockDeck();
      const drawnCards = drawDecisionMakingSpread(deck);

      drawnCards.forEach((card) => {
        expect(typeof card.isReversed).toBe('boolean');
      });
    });
  });

  describe('Reading Session', () => {
    const createMockDeck = () => {
      const deck = [];
      for (let i = 0; i < 78; i++) {
        deck.push({
          id: `card-${i}`,
          slug: `card-${i}`,
          name: `Card ${i}`,
          nameTh: `ไพ่ ${i}`,
          number: i,
          suit: i < 22 ? 'major' : 'wands',
          arcana: i < 22 ? 'major' : 'minor',
          imageUrl: `/cards/${i}.webp`,
          meaningUpright: 'Upright meaning',
          meaningReversed: 'Reversed meaning',
          advice: 'Advice text',
        });
      }
      return deck;
    };

    it('should create a Decision Making reading session with 5 cards', () => {
      const deck = createMockDeck();
      const session = createReadingSession('decision', deck, 'Option A vs Option B');

      expect(session.type).toBe('decision');
      expect(session.drawnCards).toHaveLength(5);
      expect(session.question).toBe('Option A vs Option B');
      expect(session.id).toMatch(/^reading_/);
    });
  });

  describe('Position Interpretations', () => {
    it('should have 5 position contexts for Decision Making', () => {
      const positions = Object.keys(DECISION_MAKING_POSITIONS);
      expect(positions).toHaveLength(5);
    });

    it('should have all required fields in each position context', () => {
      Object.values(DECISION_MAKING_POSITIONS).forEach((context) => {
        expect(context.id).toBeDefined();
        expect(context.name).toBeDefined();
        expect(context.nameTh).toBeDefined();
        expect(context.description).toBeDefined();
        expect(context.descriptionTh).toBeDefined();
        expect(context.focusAreas).toBeInstanceOf(Array);
        expect(context.focusAreasTh).toBeInstanceOf(Array);
        expect(context.interpretationGuide).toBeDefined();
        expect(context.interpretationGuideTh).toBeDefined();
        expect(context.exampleQuestions).toBeInstanceOf(Array);
        expect(context.exampleQuestionsTh).toBeInstanceOf(Array);
      });
    });

    it('should get Decision Making position context correctly', () => {
      const prosContext = getDecisionMakingPositionContext('dm_option_a_pros');
      expect(prosContext?.nameTh).toBe('ข้อดีของตัวเลือก A');

      const bestPathContext = getDecisionMakingPositionContext('dm_best_path');
      expect(bestPathContext?.nameTh).toBe('เส้นทางที่ดีที่สุด');
    });

    it('should return all 5 positions for Decision Making spread type', () => {
      const positions = getSpreadPositions('decision_making');
      expect(positions).toHaveLength(5);
    });
  });

  describe('Access Control', () => {
    it('should have decision_making in SPREAD_ACCESS_MATRIX', () => {
      expect(SPREAD_ACCESS_MATRIX.decision_making).toBeDefined();
      expect(SPREAD_ACCESS_MATRIX.decision_making).toContain('pro');
      expect(SPREAD_ACCESS_MATRIX.decision_making).toContain('vip');
      expect(SPREAD_ACCESS_MATRIX.decision_making).not.toContain('free');
      expect(SPREAD_ACCESS_MATRIX.decision_making).not.toContain('basic');
    });

    it('should have decision_making in SPREAD_INFO with correct properties', () => {
      const info = SPREAD_INFO.decision_making;
      expect(info).toBeDefined();
      expect(info.id).toBe('decision_making');
      expect(info.cardCount).toBe(5);
      expect(info.minimumTier).toBe('pro');
      expect(info.route).toBe('/reading/decision');
      expect(info.nameTh).toBe('การตัดสินใจ');
    });

    it('should require Pro tier or higher for decision_making', async () => {
      const { prisma } = await import('@/lib/prisma');
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(null);

      const freeResult = await canAccessSpread(null, 'decision_making');
      expect(freeResult.allowed).toBe(false);
      expect(freeResult.requiredTier).toBe('pro');
    });
  });

  describe('Position Labels Mapping', () => {
    const expectedPositions = [
      { position: 'dm_option_a_pros', nameTh: 'ข้อดีของตัวเลือก A' },
      { position: 'dm_option_a_cons', nameTh: 'ข้อเสียของตัวเลือก A' },
      { position: 'dm_option_b_pros', nameTh: 'ข้อดีของตัวเลือก B' },
      { position: 'dm_option_b_cons', nameTh: 'ข้อเสียของตัวเลือก B' },
      { position: 'dm_best_path', nameTh: 'เส้นทางที่ดีที่สุด' },
    ];

    expectedPositions.forEach(({ position, nameTh }) => {
      it(`should have correct Thai name for ${position}`, () => {
        const context = DECISION_MAKING_POSITIONS[position];
        expect(context?.nameTh).toBe(nameTh);
      });
    });
  });

  describe('Pros/Cons Structure', () => {
    it('should have 2 pros positions (Option A and B)', () => {
      const prosPositions = Object.keys(DECISION_MAKING_POSITIONS).filter(
        (key) => key.includes('pros')
      );
      expect(prosPositions).toHaveLength(2);
      expect(prosPositions).toContain('dm_option_a_pros');
      expect(prosPositions).toContain('dm_option_b_pros');
    });

    it('should have 2 cons positions (Option A and B)', () => {
      const consPositions = Object.keys(DECISION_MAKING_POSITIONS).filter(
        (key) => key.includes('cons')
      );
      expect(consPositions).toHaveLength(2);
      expect(consPositions).toContain('dm_option_a_cons');
      expect(consPositions).toContain('dm_option_b_cons');
    });

    it('should have 1 best_path position', () => {
      const bestPathPositions = Object.keys(DECISION_MAKING_POSITIONS).filter(
        (key) => key.includes('best_path')
      );
      expect(bestPathPositions).toHaveLength(1);
      expect(bestPathPositions).toContain('dm_best_path');
    });
  });
});

describe('Decision Making Performance', () => {
  it('should handle 5 cards efficiently (under 20ms)', () => {
    const createMockDeck = () => {
      const deck = [];
      for (let i = 0; i < 78; i++) {
        deck.push({
          id: `card-${i}`,
          slug: `card-${i}`,
          name: `Card ${i}`,
          nameTh: `ไพ่ ${i}`,
          number: i,
          suit: i < 22 ? 'major' : 'wands',
          arcana: i < 22 ? 'major' : 'minor',
          imageUrl: `/cards/${i}.webp`,
          meaningUpright: 'Upright meaning',
          meaningReversed: 'Reversed meaning',
          advice: 'Advice text',
        });
      }
      return deck;
    };

    const deck = createMockDeck();
    const startTime = performance.now();

    for (let i = 0; i < 100; i++) {
      drawDecisionMakingSpread(deck);
    }

    const endTime = performance.now();
    const averageTime = (endTime - startTime) / 100;

    expect(averageTime).toBeLessThan(20);
  });
});
