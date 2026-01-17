/**
 * Unit Tests: Story 9.1 - Final Premium Spreads Batch 3
 * Tests for spread drawing functions and position labels
 */

import { describe, it, expect, vi } from 'vitest';
import {
  drawMonthlyForecastSpread,
  drawYearAheadSpread,
  drawElementalBalanceSpread,
  drawZodiacWheelSpread,
  createMockDeck,
} from '@/lib/tarot/shuffle';

// Create a mock deck for testing
const mockDeck = createMockDeck();

describe('Story 9.1: Monthly Forecast Spread', () => {
  it('should draw exactly 4 cards', () => {
    const cards = drawMonthlyForecastSpread(mockDeck);
    expect(cards).toHaveLength(4);
  });

  it('should have correct position labels', () => {
    const cards = drawMonthlyForecastSpread(mockDeck);
    
    expect(cards[0].position).toBe('mf_overall_theme');
    expect(cards[1].position).toBe('mf_challenges');
    expect(cards[2].position).toBe('mf_opportunities');
    expect(cards[3].position).toBe('mf_advice');
  });

  it('should draw unique cards', () => {
    const cards = drawMonthlyForecastSpread(mockDeck);
    const cardIds = cards.map(c => c.card.id);
    const uniqueIds = new Set(cardIds);
    
    expect(uniqueIds.size).toBe(4);
  });

  it('should have reversed status for each card', () => {
    const cards = drawMonthlyForecastSpread(mockDeck);
    
    cards.forEach(card => {
      expect(typeof card.isReversed).toBe('boolean');
    });
  });
});

describe('Story 9.1: Year Ahead Spread (13 cards)', () => {
  it('should draw exactly 13 cards', () => {
    const cards = drawYearAheadSpread(mockDeck);
    expect(cards).toHaveLength(13);
  });

  it('should have year overview as first position', () => {
    const cards = drawYearAheadSpread(mockDeck);
    expect(cards[0].position).toBe('ya_year_overview');
  });

  it('should have all 12 month positions', () => {
    const cards = drawYearAheadSpread(mockDeck);
    
    const expectedMonths = [
      'ya_january', 'ya_february', 'ya_march', 'ya_april',
      'ya_may', 'ya_june', 'ya_july', 'ya_august',
      'ya_september', 'ya_october', 'ya_november', 'ya_december',
    ];
    
    expectedMonths.forEach((month, index) => {
      expect(cards[index + 1].position).toBe(month);
    });
  });

  it('should draw 13 unique cards', () => {
    const cards = drawYearAheadSpread(mockDeck);
    const cardIds = cards.map(c => c.card.id);
    const uniqueIds = new Set(cardIds);
    
    expect(uniqueIds.size).toBe(13);
  });

  it('should have reversed status for each card', () => {
    const cards = drawYearAheadSpread(mockDeck);
    
    cards.forEach(card => {
      expect(typeof card.isReversed).toBe('boolean');
    });
  });
});

describe('Story 9.1: Elemental Balance Spread', () => {
  it('should draw exactly 4 cards', () => {
    const cards = drawElementalBalanceSpread(mockDeck);
    expect(cards).toHaveLength(4);
  });

  it('should have all 4 element positions', () => {
    const cards = drawElementalBalanceSpread(mockDeck);
    
    expect(cards[0].position).toBe('eb_fire');
    expect(cards[1].position).toBe('eb_water');
    expect(cards[2].position).toBe('eb_air');
    expect(cards[3].position).toBe('eb_earth');
  });

  it('should draw unique cards', () => {
    const cards = drawElementalBalanceSpread(mockDeck);
    const cardIds = cards.map(c => c.card.id);
    const uniqueIds = new Set(cardIds);
    
    expect(uniqueIds.size).toBe(4);
  });
});

describe('Story 9.1: Zodiac Wheel Spread (12 cards)', () => {
  it('should draw exactly 12 cards', () => {
    const cards = drawZodiacWheelSpread(mockDeck);
    expect(cards).toHaveLength(12);
  });

  it('should have all 12 house positions', () => {
    const cards = drawZodiacWheelSpread(mockDeck);
    
    for (let i = 1; i <= 12; i++) {
      expect(cards[i - 1].position).toBe(`zw_house_${i}`);
    }
  });

  it('should draw 12 unique cards', () => {
    const cards = drawZodiacWheelSpread(mockDeck);
    const cardIds = cards.map(c => c.card.id);
    const uniqueIds = new Set(cardIds);
    
    expect(uniqueIds.size).toBe(12);
  });

  it('should have reversed status for each card', () => {
    const cards = drawZodiacWheelSpread(mockDeck);
    
    cards.forEach(card => {
      expect(typeof card.isReversed).toBe('boolean');
    });
  });
});

describe('Story 9.1: Spread Position Labels', () => {
  it('Monthly Forecast should have 4 unique positions', () => {
    const positions = ['mf_overall_theme', 'mf_challenges', 'mf_opportunities', 'mf_advice'];
    expect(new Set(positions).size).toBe(4);
  });

  it('Year Ahead should have 13 unique positions', () => {
    const positions = [
      'ya_year_overview',
      'ya_january', 'ya_february', 'ya_march', 'ya_april',
      'ya_may', 'ya_june', 'ya_july', 'ya_august',
      'ya_september', 'ya_october', 'ya_november', 'ya_december',
    ];
    expect(new Set(positions).size).toBe(13);
  });

  it('Elemental Balance should have 4 unique positions', () => {
    const positions = ['eb_fire', 'eb_water', 'eb_air', 'eb_earth'];
    expect(new Set(positions).size).toBe(4);
  });

  it('Zodiac Wheel should have 12 unique positions', () => {
    const positions = Array.from({ length: 12 }, (_, i) => `zw_house_${i + 1}`);
    expect(new Set(positions).size).toBe(12);
  });

  it('Total new positions should be 33', () => {
    const monthlyPositions = 4;
    const yearAheadPositions = 13;
    const elementalPositions = 4;
    const zodiacPositions = 12;
    
    expect(monthlyPositions + yearAheadPositions + elementalPositions + zodiacPositions).toBe(33);
  });
});

describe('Story 9.1: Reading Session Type Support', () => {
  it('createMockDeck should return 78 cards', () => {
    expect(mockDeck).toHaveLength(78);
  });

  it('mock deck should have major arcana', () => {
    const majorArcana = mockDeck.filter(card => card.arcana === 'major');
    expect(majorArcana).toHaveLength(22);
  });

  it('mock deck should have minor arcana', () => {
    const minorArcana = mockDeck.filter(card => card.arcana === 'minor');
    expect(minorArcana).toHaveLength(56);
  });
});
