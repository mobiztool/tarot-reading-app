/**
 * Celtic Cross Spread Unit Tests
 * Story 7.1: Celtic Cross Spread (10 Cards)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { drawCelticCrossSpread, createReadingSession } from '@/lib/tarot/shuffle';
import { CELTIC_CROSS_POSITIONS, getCelticCrossPositionContext, getSpreadPositions } from '@/lib/tarot/positionInterpretations';
import { canAccessSpread, SPREAD_ACCESS_MATRIX, SPREAD_INFO } from '@/lib/access-control/spreads';

// Mock Prisma for canAccessSpread tests
vi.mock('@/lib/prisma', () => ({
  prisma: {
    subscription: {
      findFirst: vi.fn(),
    },
  },
}));

describe('Celtic Cross Spread', () => {
  describe('Card Drawing', () => {
    // Create a mock deck with 78 cards
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

    it('should draw exactly 10 cards for Celtic Cross spread', () => {
      const deck = createMockDeck();
      const drawnCards = drawCelticCrossSpread(deck);

      expect(drawnCards).toHaveLength(10);
    });

    it('should have correct position labels for all 10 cards', () => {
      const deck = createMockDeck();
      const drawnCards = drawCelticCrossSpread(deck);

      const expectedPositions = [
        'cc_present',
        'cc_challenge',
        'cc_past',
        'cc_future',
        'cc_above',
        'cc_below',
        'cc_advice',
        'cc_external',
        'cc_hopes_fears',
        'cc_outcome',
      ];

      drawnCards.forEach((card, index) => {
        expect(card.position).toBe(expectedPositions[index]);
      });
    });

    it('should not have duplicate cards', () => {
      const deck = createMockDeck();
      const drawnCards = drawCelticCrossSpread(deck);

      const cardIds = drawnCards.map((c) => c.card.id);
      const uniqueIds = [...new Set(cardIds)];

      expect(uniqueIds).toHaveLength(10);
    });

    it('should have isReversed property on all cards', () => {
      const deck = createMockDeck();
      const drawnCards = drawCelticCrossSpread(deck);

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

    it('should create a Celtic Cross reading session with 10 cards', () => {
      const deck = createMockDeck();
      const session = createReadingSession('celtic-cross', deck, 'Test question');

      expect(session.type).toBe('celtic-cross');
      expect(session.drawnCards).toHaveLength(10);
      expect(session.question).toBe('Test question');
      expect(session.id).toMatch(/^reading_/);
    });
  });

  describe('Position Interpretations', () => {
    it('should have 10 position contexts for Celtic Cross', () => {
      const positions = Object.keys(CELTIC_CROSS_POSITIONS);
      expect(positions).toHaveLength(10);
    });

    it('should have all required fields in each position context', () => {
      Object.values(CELTIC_CROSS_POSITIONS).forEach((context) => {
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

    it('should get Celtic Cross position context correctly', () => {
      const presentContext = getCelticCrossPositionContext('cc_present');
      expect(presentContext?.nameTh).toBe('สถานการณ์ปัจจุบัน');

      const outcomeContext = getCelticCrossPositionContext('cc_outcome');
      expect(outcomeContext?.nameTh).toBe('ผลลัพธ์สุดท้าย');
    });

    it('should return all 10 positions for Celtic Cross spread type', () => {
      const positions = getSpreadPositions('celtic_cross');
      expect(positions).toHaveLength(10);
    });
  });

  describe('Access Control', () => {
    it('should have celtic_cross in SPREAD_ACCESS_MATRIX', () => {
      expect(SPREAD_ACCESS_MATRIX.celtic_cross).toBeDefined();
      expect(SPREAD_ACCESS_MATRIX.celtic_cross).toContain('pro');
      expect(SPREAD_ACCESS_MATRIX.celtic_cross).toContain('vip');
      expect(SPREAD_ACCESS_MATRIX.celtic_cross).not.toContain('free');
      expect(SPREAD_ACCESS_MATRIX.celtic_cross).not.toContain('basic');
    });

    it('should have celtic_cross in SPREAD_INFO with correct properties', () => {
      const info = SPREAD_INFO.celtic_cross;
      expect(info).toBeDefined();
      expect(info.id).toBe('celtic_cross');
      expect(info.cardCount).toBe(10);
      expect(info.minimumTier).toBe('pro');
      expect(info.route).toBe('/reading/celtic-cross');
      expect(info.nameTh).toBe('กากบาทเซลติก');
    });

    it('should require Pro tier or higher for celtic_cross', async () => {
      // Test for free user - should be denied
      const { prisma } = await import('@/lib/prisma');
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(null);

      const freeResult = await canAccessSpread(null, 'celtic_cross');
      expect(freeResult.allowed).toBe(false);
      expect(freeResult.requiredTier).toBe('pro');
    });
  });

  describe('Position Labels Mapping', () => {
    const expectedPositions = [
      { position: 'cc_present', nameTh: 'สถานการณ์ปัจจุบัน' },
      { position: 'cc_challenge', nameTh: 'อุปสรรค/ความท้าทาย' },
      { position: 'cc_past', nameTh: 'รากฐาน/อดีต' },
      { position: 'cc_future', nameTh: 'อนาคตอันใกล้' },
      { position: 'cc_above', nameTh: 'เป้าหมาย/ความปรารถนา' },
      { position: 'cc_below', nameTh: 'จิตใต้สำนึก' },
      { position: 'cc_advice', nameTh: 'คำแนะนำ' },
      { position: 'cc_external', nameTh: 'อิทธิพลภายนอก' },
      { position: 'cc_hopes_fears', nameTh: 'ความหวังและความกลัว' },
      { position: 'cc_outcome', nameTh: 'ผลลัพธ์สุดท้าย' },
    ];

    expectedPositions.forEach(({ position, nameTh }) => {
      it(`should have correct Thai name for ${position}`, () => {
        const context = CELTIC_CROSS_POSITIONS[position];
        expect(context?.nameTh).toBe(nameTh);
      });
    });
  });
});

describe('Celtic Cross Performance', () => {
  it('should handle 10 cards efficiently (under 50ms)', () => {
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
    
    // Draw 100 times to measure average performance
    for (let i = 0; i < 100; i++) {
      drawCelticCrossSpread(deck);
    }
    
    const endTime = performance.now();
    const averageTime = (endTime - startTime) / 100;

    expect(averageTime).toBeLessThan(50);
  });
});
