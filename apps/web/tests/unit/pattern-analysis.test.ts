/**
 * Unit Tests for Pattern Analysis (Story 9.4)
 * Tests pattern detection algorithms, data transformations, and access control
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  analyzePatterns,
  MINIMUM_READINGS,
} from '@/lib/patterns/analyzer';
import type {
  PatternAnalysisResult,
  ThemeType,
} from '@/lib/patterns/types';

// Mock reading data factory
function createMockReading(
  overrides: Partial<{
    id: string;
    createdAt: Date;
    readingType: string;
    question: string | null;
    cards: { cardId: string; isReversed: boolean; card: { id: string; name: string; nameTh: string; imageUrl: string } }[];
  }> = {}
): {
  id: string;
  createdAt: Date;
  readingType: string;
  question: string | null;
  cards: { cardId: string; isReversed: boolean; card: { id: string; name: string; nameTh: string; imageUrl: string } }[];
} {
  return {
    id: overrides.id || `reading-${Math.random()}`,
    createdAt: overrides.createdAt || new Date(),
    readingType: overrides.readingType || 'three_card',
    question: overrides.question || null,
    cards: overrides.cards || [
      {
        cardId: 'card-1',
        isReversed: false,
        card: { id: 'card-1', name: 'The Fool', nameTh: 'คนโง่', imageUrl: '/cards/00.jpg' },
      },
    ],
  };
}

// Generate array of mock readings
function generateMockReadings(count: number, cardNum = 1): ReturnType<typeof createMockReading>[] {
  const cardId = `card-${cardNum}`;
  return Array.from({ length: count }, (_, i) =>
    createMockReading({
      id: `reading-${i}`,
      createdAt: new Date(Date.now() - i * 86400000), // Each day apart
      cards: [
        {
          cardId,
          isReversed: i % 3 === 0, // Every 3rd reading is reversed
          card: { id: cardId, name: 'The Fool', nameTh: 'คนโง่', imageUrl: '/cards/00.jpg' },
        },
      ],
    })
  );
}

describe('Pattern Analysis - Minimum Data Requirements', () => {
  it('should return sufficientData=false when readings < MINIMUM_READINGS', () => {
    const readings = generateMockReadings(5);
    const result = analyzePatterns('user-1', readings);
    
    expect(result.sufficientData).toBe(false);
    expect(result.readingCount).toBe(5);
    expect(result.minimumReadingsRequired).toBe(MINIMUM_READINGS);
  });
  
  it('should return sufficientData=true when readings >= MINIMUM_READINGS', () => {
    const readings = generateMockReadings(10);
    const result = analyzePatterns('user-1', readings);
    
    expect(result.sufficientData).toBe(true);
    expect(result.readingCount).toBe(10);
  });
  
  it('should return empty arrays when data is insufficient', () => {
    const readings = generateMockReadings(3);
    const result = analyzePatterns('user-1', readings);
    
    expect(result.frequentCards).toHaveLength(0);
    expect(result.themes).toHaveLength(0);
    expect(result.insights).toHaveLength(0);
  });
  
  it('should handle zero readings', () => {
    const result = analyzePatterns('user-1', []);
    
    expect(result.sufficientData).toBe(false);
    expect(result.readingCount).toBe(0);
    expect(result.frequentCards).toHaveLength(0);
  });
});

describe('Pattern Analysis - Card Frequency Detection', () => {
  it('should correctly count card appearances', () => {
    const readings = [
      ...generateMockReadings(5, 1), // Card 1: 5 times
      ...generateMockReadings(3, 2), // Card 2: 3 times
      ...generateMockReadings(2, 3), // Card 3: 2 times
    ];
    
    const result = analyzePatterns('user-1', readings);
    
    expect(result.frequentCards.length).toBeGreaterThan(0);
    
    const card1 = result.frequentCards.find(c => c.cardId === 'card-1');
    const card2 = result.frequentCards.find(c => c.cardId === 'card-2');
    const card3 = result.frequentCards.find(c => c.cardId === 'card-3');
    
    expect(card1?.count).toBe(5);
    expect(card2?.count).toBe(3);
    expect(card3?.count).toBe(2);
  });
  
  it('should calculate correct percentages', () => {
    const readings = generateMockReadings(10, 1);
    const result = analyzePatterns('user-1', readings);
    
    const card = result.frequentCards.find(c => c.cardId === 'card-1');
    expect(card?.percentage).toBe(100); // All cards are the same
  });
  
  it('should count upright and reversed separately', () => {
    const readings = [
      createMockReading({
        cards: [{ cardId: 'card-1', isReversed: false, card: { id: 'card-1', name: 'The Fool', nameTh: 'คนโง่', imageUrl: '/cards/00.jpg' } }],
      }),
      createMockReading({
        cards: [{ cardId: 'card-1', isReversed: true, card: { id: 'card-1', name: 'The Fool', nameTh: 'คนโง่', imageUrl: '/cards/00.jpg' } }],
      }),
      createMockReading({
        cards: [{ cardId: 'card-1', isReversed: true, card: { id: 'card-1', name: 'The Fool', nameTh: 'คนโง่', imageUrl: '/cards/00.jpg' } }],
      }),
      ...generateMockReadings(7, 2), // Fill to minimum
    ];
    
    const result = analyzePatterns('user-1', readings);
    const card = result.frequentCards.find(c => c.cardId === 'card-1');
    
    expect(card?.uprightCount).toBe(1);
    expect(card?.reversedCount).toBe(2);
  });
  
  it('should return top 10 cards sorted by frequency', () => {
    const readings: ReturnType<typeof createMockReading>[] = [];
    
    // Create readings with different card frequencies
    for (let cardNum = 1; cardNum <= 15; cardNum++) {
      const cardId = `card-${cardNum}`;
      for (let i = 0; i < (16 - cardNum); i++) {
        readings.push(createMockReading({
          cards: [{ cardId, isReversed: false, card: { id: cardId, name: `Card ${cardNum}`, nameTh: `การ์ด ${cardNum}`, imageUrl: `/cards/${cardNum}.jpg` } }],
        }));
      }
    }
    
    const result = analyzePatterns('user-1', readings);
    
    expect(result.frequentCards.length).toBeLessThanOrEqual(10);
    
    // Check sorted order (descending)
    for (let i = 1; i < result.frequentCards.length; i++) {
      expect(result.frequentCards[i - 1].count).toBeGreaterThanOrEqual(result.frequentCards[i].count);
    }
  });
});

describe('Pattern Analysis - Theme Detection', () => {
  it('should detect love theme from question', () => {
    const readings = [
      createMockReading({ question: 'เรื่องความรักของฉัน' }),
      createMockReading({ question: 'แฟนจะกลับมาไหม' }),
      createMockReading({ question: 'เรื่องงาน' }),
      ...generateMockReadings(7),
    ];
    
    const result = analyzePatterns('user-1', readings);
    const loveTheme = result.themes.find(t => t.theme === 'love');
    
    expect(loveTheme).toBeDefined();
    expect(loveTheme?.count).toBe(2);
  });
  
  it('should detect career theme from question', () => {
    const readings = [
      createMockReading({ question: 'งานใหม่จะได้ไหม' }),
      createMockReading({ question: 'เลื่อนขั้นเมื่อไหร่' }),
      createMockReading({ question: 'สัมภาษณ์งานพรุ่งนี้' }),
      ...generateMockReadings(7),
    ];
    
    const result = analyzePatterns('user-1', readings);
    const careerTheme = result.themes.find(t => t.theme === 'career');
    
    expect(careerTheme).toBeDefined();
    expect(careerTheme?.count).toBe(3);
  });
  
  it('should detect money theme from question', () => {
    const readings = [
      createMockReading({ question: 'การเงินจะดีขึ้นไหม' }),
      createMockReading({ question: 'ควรลงทุนไหม' }),
      ...generateMockReadings(8),
    ];
    
    const result = analyzePatterns('user-1', readings);
    const moneyTheme = result.themes.find(t => t.theme === 'money');
    
    expect(moneyTheme).toBeDefined();
    expect(moneyTheme?.count).toBe(2);
  });
  
  it('should categorize unmatched questions as general', () => {
    const readings = [
      createMockReading({ question: 'อะไรก็ได้' }),
      createMockReading({ question: 'ดูดวงหน่อย' }),
      ...generateMockReadings(8),
    ];
    
    const result = analyzePatterns('user-1', readings);
    const generalTheme = result.themes.find(t => t.theme === 'general');
    
    expect(generalTheme).toBeDefined();
    expect(generalTheme?.count).toBe(2);
  });
  
  it('should not count readings without questions', () => {
    const readings = [
      createMockReading({ question: null }),
      createMockReading({ question: 'ความรัก' }),
      ...generateMockReadings(8),
    ];
    
    const result = analyzePatterns('user-1', readings);
    const totalThemeCount = result.themes.reduce((sum, t) => sum + t.count, 0);
    
    expect(totalThemeCount).toBe(1); // Only the one with question
  });
  
  it('should calculate correct theme percentages', () => {
    const readings = [
      createMockReading({ question: 'ความรัก' }),
      createMockReading({ question: 'แฟน' }),
      createMockReading({ question: 'งาน' }),
      createMockReading({ question: 'เงิน' }),
      ...generateMockReadings(6),
    ];
    
    const result = analyzePatterns('user-1', readings);
    const loveTheme = result.themes.find(t => t.theme === 'love');
    
    expect(loveTheme?.percentage).toBe(50); // 2 out of 4 questions
  });
});

describe('Pattern Analysis - Time Patterns', () => {
  it('should detect hour patterns', () => {
    const readings = [
      createMockReading({ createdAt: new Date('2024-01-01T10:00:00') }),
      createMockReading({ createdAt: new Date('2024-01-02T10:30:00') }),
      createMockReading({ createdAt: new Date('2024-01-03T22:00:00') }),
      ...generateMockReadings(7),
    ];
    
    const result = analyzePatterns('user-1', readings);
    
    expect(result.timePatterns).toHaveLength(24);
    expect(result.timePatterns[10].count).toBeGreaterThanOrEqual(2);
  });
  
  it('should detect day of week patterns', () => {
    // Create readings on Monday
    const monday = new Date('2024-01-01'); // This was a Monday
    const readings = [
      createMockReading({ createdAt: monday }),
      createMockReading({ createdAt: new Date(monday.getTime() + 7 * 86400000) }), // Next Monday
      createMockReading({ createdAt: new Date(monday.getTime() + 14 * 86400000) }), // 2 weeks later
      ...generateMockReadings(7),
    ];
    
    const result = analyzePatterns('user-1', readings);
    
    expect(result.dayPatterns).toHaveLength(7);
    const mondayPattern = result.dayPatterns[1]; // Monday is day 1
    expect(mondayPattern.dayName).toBe('Monday');
    expect(mondayPattern.dayNameTh).toBe('จันทร์');
  });
  
  it('should calculate monthly trends', () => {
    const readings = [
      createMockReading({ createdAt: new Date('2024-01-15') }),
      createMockReading({ createdAt: new Date('2024-01-20') }),
      createMockReading({ createdAt: new Date('2024-02-10') }),
      ...generateMockReadings(7),
    ];
    
    const result = analyzePatterns('user-1', readings);
    
    expect(result.monthlyReadings.length).toBeGreaterThan(0);
  });
});

describe('Pattern Analysis - Spread Usage', () => {
  it('should count spread type usage', () => {
    const readings = [
      createMockReading({ readingType: 'three_card' }),
      createMockReading({ readingType: 'three_card' }),
      createMockReading({ readingType: 'daily' }),
      createMockReading({ readingType: 'celtic_cross' }),
      ...generateMockReadings(6),
    ];
    
    const result = analyzePatterns('user-1', readings);
    
    const threeCardSpread = result.spreadUsage.find(s => s.spreadType === 'three_card');
    expect(threeCardSpread?.count).toBeGreaterThanOrEqual(2);
  });
  
  it('should provide Thai names for spreads', () => {
    const readings = [
      createMockReading({ readingType: 'daily' }),
      ...generateMockReadings(9),
    ];
    
    const result = analyzePatterns('user-1', readings);
    const dailySpread = result.spreadUsage.find(s => s.spreadType === 'daily');
    
    expect(dailySpread?.spreadNameTh).toBe('ไพ่รายวัน');
  });
  
  it('should sort spreads by usage count', () => {
    const readings = [
      createMockReading({ readingType: 'three_card' }),
      createMockReading({ readingType: 'three_card' }),
      createMockReading({ readingType: 'three_card' }),
      createMockReading({ readingType: 'daily' }),
      createMockReading({ readingType: 'daily' }),
      createMockReading({ readingType: 'celtic_cross' }),
      ...generateMockReadings(4),
    ];
    
    const result = analyzePatterns('user-1', readings);
    
    // Check sorted order
    for (let i = 1; i < result.spreadUsage.length; i++) {
      expect(result.spreadUsage[i - 1].count).toBeGreaterThanOrEqual(result.spreadUsage[i].count);
    }
  });
});

describe('Pattern Analysis - Insights Generation', () => {
  it('should generate card insight when data is sufficient', () => {
    const readings = generateMockReadings(15, 1);
    const result = analyzePatterns('user-1', readings);
    
    const cardInsight = result.insights.find(i => i.type === 'card');
    expect(cardInsight).toBeDefined();
    expect(cardInsight?.titleTh).toContain('ปรากฏบ่อย');
  });
  
  it('should generate theme insight when themes exist', () => {
    const readings = [
      createMockReading({ question: 'ความรัก' }),
      createMockReading({ question: 'แฟน' }),
      createMockReading({ question: 'คนรัก' }),
      ...generateMockReadings(7),
    ];
    
    const result = analyzePatterns('user-1', readings);
    const themeInsight = result.insights.find(i => i.type === 'theme');
    
    expect(themeInsight).toBeDefined();
    expect(themeInsight?.titleTh).toContain('สนใจเรื่อง');
  });
  
  it('should generate time insight', () => {
    const readings = generateMockReadings(10);
    const result = analyzePatterns('user-1', readings);
    
    const timeInsight = result.insights.find(i => i.type === 'time');
    expect(timeInsight).toBeDefined();
  });
  
  it('should generate spread insight', () => {
    const readings = generateMockReadings(10);
    const result = analyzePatterns('user-1', readings);
    
    const spreadInsight = result.insights.find(i => i.type === 'spread');
    expect(spreadInsight).toBeDefined();
    expect(spreadInsight?.titleTh).toContain('รูปแบบที่คุณชอบ');
  });
  
  it('should always generate general journey insight', () => {
    const readings = generateMockReadings(10);
    const result = analyzePatterns('user-1', readings);
    
    const generalInsight = result.insights.find(i => i.type === 'general');
    expect(generalInsight).toBeDefined();
    expect(generalInsight?.titleTh).toBe('เส้นทางของคุณ');
    expect(generalInsight?.descriptionTh).toContain('10 ครั้ง');
  });
  
  it('should include actionable suggestions', () => {
    const readings = generateMockReadings(15, 1);
    const result = analyzePatterns('user-1', readings);
    
    const actionableInsights = result.insights.filter(i => i.actionable);
    expect(actionableInsights.length).toBeGreaterThan(0);
    
    const withSuggestion = actionableInsights.find(i => i.suggestionTh);
    expect(withSuggestion?.suggestionTh).toBeDefined();
  });
});

describe('Pattern Analysis - Edge Cases', () => {
  it('should handle readings with multiple cards', () => {
    const readings = Array.from({ length: 10 }, () =>
      createMockReading({
        cards: [
          { cardId: 'card-1', isReversed: false, card: { id: 'card-1', name: 'The Fool', nameTh: 'คนโง่', imageUrl: '/cards/00.jpg' } },
          { cardId: 'card-2', isReversed: true, card: { id: 'card-2', name: 'The Magician', nameTh: 'นักมายากล', imageUrl: '/cards/01.jpg' } },
          { cardId: 'card-3', isReversed: false, card: { id: 'card-3', name: 'High Priestess', nameTh: 'นักบวชหญิง', imageUrl: '/cards/02.jpg' } },
        ],
      })
    );
    
    const result = analyzePatterns('user-1', readings);
    
    // Should count all cards
    const totalCards = result.frequentCards.reduce((sum, c) => sum + c.count, 0);
    expect(totalCards).toBe(30); // 10 readings × 3 cards
  });
  
  it('should handle tie in card frequency', () => {
    const readings = [
      ...Array.from({ length: 5 }, () => createMockReading({
        cards: [{ cardId: 'card-1', isReversed: false, card: { id: 'card-1', name: 'Card 1', nameTh: 'การ์ด 1', imageUrl: '/1.jpg' } }],
      })),
      ...Array.from({ length: 5 }, () => createMockReading({
        cards: [{ cardId: 'card-2', isReversed: false, card: { id: 'card-2', name: 'Card 2', nameTh: 'การ์ด 2', imageUrl: '/2.jpg' } }],
      })),
    ];
    
    const result = analyzePatterns('user-1', readings);
    
    // Both should have equal count
    const card1 = result.frequentCards.find(c => c.cardId === 'card-1');
    const card2 = result.frequentCards.find(c => c.cardId === 'card-2');
    
    expect(card1?.count).toBe(card2?.count);
  });
  
  it('should handle empty questions array', () => {
    const readings = generateMockReadings(10); // All with null questions
    const result = analyzePatterns('user-1', readings);
    
    // Should not crash, themes should be empty or have only general
    expect(result.themes.length).toBe(0);
  });
  
  it('should include Thai translations in all outputs', () => {
    const readings = [
      createMockReading({ question: 'ความรัก' }),
      ...generateMockReadings(9),
    ];
    
    const result = analyzePatterns('user-1', readings);
    
    // Check Thai exists in various outputs
    result.frequentCards.forEach(card => {
      expect(card.cardNameTh).toBeDefined();
    });
    
    result.themes.forEach(theme => {
      expect(theme.themeTh).toBeDefined();
    });
    
    result.dayPatterns.forEach(day => {
      expect(day.dayNameTh).toBeDefined();
    });
    
    result.spreadUsage.forEach(spread => {
      expect(spread.spreadNameTh).toBeDefined();
    });
    
    result.insights.forEach(insight => {
      expect(insight.titleTh).toBeDefined();
      expect(insight.descriptionTh).toBeDefined();
    });
  });
});

describe('Pattern Analysis Types', () => {
  it('should return correct result structure', () => {
    const readings = generateMockReadings(10);
    const result = analyzePatterns('user-1', readings);
    
    // Check all required fields exist
    expect(result.userId).toBe('user-1');
    expect(result.analyzedAt).toBeDefined();
    expect(typeof result.readingCount).toBe('number');
    expect(typeof result.sufficientData).toBe('boolean');
    expect(typeof result.minimumReadingsRequired).toBe('number');
    expect(Array.isArray(result.frequentCards)).toBe(true);
    expect(Array.isArray(result.themes)).toBe(true);
    expect(Array.isArray(result.timePatterns)).toBe(true);
    expect(Array.isArray(result.dayPatterns)).toBe(true);
    expect(Array.isArray(result.monthlyReadings)).toBe(true);
    expect(Array.isArray(result.spreadUsage)).toBe(true);
    expect(Array.isArray(result.insights)).toBe(true);
  });
  
  it('should have valid analyzedAt timestamp', () => {
    const readings = generateMockReadings(10);
    const result = analyzePatterns('user-1', readings);
    
    const analyzedDate = new Date(result.analyzedAt);
    expect(analyzedDate.getTime()).toBeLessThanOrEqual(Date.now());
    expect(analyzedDate.getTime()).toBeGreaterThan(Date.now() - 60000); // Within last minute
  });
});
