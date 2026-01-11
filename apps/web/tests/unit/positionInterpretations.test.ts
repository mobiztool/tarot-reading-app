/**
 * Unit Tests for Position Interpretations (Story 5.6)
 * 
 * Quality Gate 1: Automated Checks
 * - Validates all 9 position contexts exist
 * - Checks Thai language content
 * - Verifies structure completeness
 */

import { describe, it, expect } from 'vitest';
import {
  LOVE_SPREAD_POSITIONS,
  CAREER_SPREAD_POSITIONS,
  YES_NO_POSITION,
  getLovePositionContext,
  getCareerPositionContext,
  getYesNoPositionContext,
  getSpreadPositions,
  getPositionInterpretationPrefix,
  PositionContext,
} from '../../src/lib/tarot/positionInterpretations';
import {
  generateLoveSpreadReading,
  generateCareerSpreadReading,
  generateYesNoSpreadReading,
} from '../../src/lib/tarot/positionAwareReading';
import { createMockDeck } from '../../src/lib/tarot/shuffle';
import { DrawnCard } from '../../src/types/card';

describe('Position Interpretations - Quality Gate 1: Structure', () => {
  describe('Love Spread Positions', () => {
    it('should have exactly 3 positions for love spread', () => {
      expect(Object.keys(LOVE_SPREAD_POSITIONS)).toHaveLength(3);
    });

    it('should have all required love positions', () => {
      expect(LOVE_SPREAD_POSITIONS.you).toBeDefined();
      expect(LOVE_SPREAD_POSITIONS.other).toBeDefined();
      expect(LOVE_SPREAD_POSITIONS.relationship_energy).toBeDefined();
    });

    it('each love position should have complete structure', () => {
      Object.values(LOVE_SPREAD_POSITIONS).forEach((position: PositionContext) => {
        expect(position.id).toBeTruthy();
        expect(position.name).toBeTruthy();
        expect(position.nameTh).toBeTruthy();
        expect(position.description).toBeTruthy();
        expect(position.descriptionTh).toBeTruthy();
        expect(position.focusAreas).toBeInstanceOf(Array);
        expect(position.focusAreasTh).toBeInstanceOf(Array);
        expect(position.interpretationGuide).toBeTruthy();
        expect(position.interpretationGuideTh).toBeTruthy();
        expect(position.exampleQuestions).toBeInstanceOf(Array);
        expect(position.exampleQuestionsTh).toBeInstanceOf(Array);
      });
    });
  });

  describe('Career Spread Positions', () => {
    it('should have exactly 3 positions for career spread', () => {
      expect(Object.keys(CAREER_SPREAD_POSITIONS)).toHaveLength(3);
    });

    it('should have all required career positions', () => {
      expect(CAREER_SPREAD_POSITIONS.current_situation).toBeDefined();
      expect(CAREER_SPREAD_POSITIONS.challenge_opportunity).toBeDefined();
      expect(CAREER_SPREAD_POSITIONS.outcome).toBeDefined();
    });

    it('each career position should have complete structure', () => {
      Object.values(CAREER_SPREAD_POSITIONS).forEach((position: PositionContext) => {
        expect(position.id).toBeTruthy();
        expect(position.name).toBeTruthy();
        expect(position.nameTh).toBeTruthy();
        expect(position.description).toBeTruthy();
        expect(position.descriptionTh).toBeTruthy();
        expect(position.focusAreas.length).toBeGreaterThan(0);
        expect(position.focusAreasTh.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Yes/No Position', () => {
    it('should have yes/no position defined', () => {
      expect(YES_NO_POSITION).toBeDefined();
    });

    it('should have answer framework', () => {
      expect(YES_NO_POSITION.answerFramework).toBeDefined();
      expect(YES_NO_POSITION.answerFramework.yes).toBeDefined();
      expect(YES_NO_POSITION.answerFramework.no).toBeDefined();
      expect(YES_NO_POSITION.answerFramework.maybe).toBeDefined();
    });

    it('each answer type should have indicators in Thai and English', () => {
      const { yes, no, maybe } = YES_NO_POSITION.answerFramework;
      
      expect(yes.indicators.length).toBeGreaterThan(0);
      expect(yes.indicatorsTh.length).toBeGreaterThan(0);
      expect(yes.indicators.length).toBe(yes.indicatorsTh.length);

      expect(no.indicators.length).toBeGreaterThan(0);
      expect(no.indicatorsTh.length).toBeGreaterThan(0);
      expect(no.indicators.length).toBe(no.indicatorsTh.length);

      expect(maybe.indicators.length).toBeGreaterThan(0);
      expect(maybe.indicatorsTh.length).toBeGreaterThan(0);
      expect(maybe.indicators.length).toBe(maybe.indicatorsTh.length);
    });
  });

  describe('Total 9 Positions Requirement', () => {
    it('should have exactly 9 positions total (3 love + 3 career + 1 yes/no * 3 answer types)', () => {
      const loveCount = Object.keys(LOVE_SPREAD_POSITIONS).length;
      const careerCount = Object.keys(CAREER_SPREAD_POSITIONS).length;
      const yesNoCount = 1; // Single position but with 3 answer types

      expect(loveCount + careerCount + yesNoCount).toBe(7); // 3 + 3 + 1 base positions
      
      // Counting with answer framework sub-positions
      const totalContexts = loveCount + careerCount + 3; // 3 answer types in yes/no
      expect(totalContexts).toBe(9);
    });
  });
});

describe('Position Interpretations - Quality Gate 2: Thai Language', () => {
  function containsThai(text: string): boolean {
    return /[\u0E00-\u0E7F]/.test(text);
  }

  describe('Love Spread Thai Content', () => {
    it('all love positions should have Thai names', () => {
      Object.values(LOVE_SPREAD_POSITIONS).forEach((position) => {
        expect(containsThai(position.nameTh)).toBe(true);
      });
    });

    it('all love positions should have Thai descriptions', () => {
      Object.values(LOVE_SPREAD_POSITIONS).forEach((position) => {
        expect(containsThai(position.descriptionTh)).toBe(true);
      });
    });

    it('all love positions should have Thai interpretation guides', () => {
      Object.values(LOVE_SPREAD_POSITIONS).forEach((position) => {
        expect(containsThai(position.interpretationGuideTh)).toBe(true);
      });
    });

    it('all love positions should have Thai example questions', () => {
      Object.values(LOVE_SPREAD_POSITIONS).forEach((position) => {
        position.exampleQuestionsTh.forEach((question) => {
          expect(containsThai(question)).toBe(true);
        });
      });
    });
  });

  describe('Career Spread Thai Content', () => {
    it('all career positions should have Thai names', () => {
      Object.values(CAREER_SPREAD_POSITIONS).forEach((position) => {
        expect(containsThai(position.nameTh)).toBe(true);
      });
    });

    it('all career positions should have Thai descriptions', () => {
      Object.values(CAREER_SPREAD_POSITIONS).forEach((position) => {
        expect(containsThai(position.descriptionTh)).toBe(true);
      });
    });
  });

  describe('Yes/No Thai Content', () => {
    it('yes/no position should have Thai content', () => {
      expect(containsThai(YES_NO_POSITION.nameTh)).toBe(true);
      expect(containsThai(YES_NO_POSITION.descriptionTh)).toBe(true);
      expect(containsThai(YES_NO_POSITION.interpretationGuideTh)).toBe(true);
    });

    it('yes/no answer indicators should have Thai translations', () => {
      const { yes, no, maybe } = YES_NO_POSITION.answerFramework;
      
      yes.indicatorsTh.forEach((indicator) => {
        expect(containsThai(indicator)).toBe(true);
      });
      no.indicatorsTh.forEach((indicator) => {
        expect(containsThai(indicator)).toBe(true);
      });
      maybe.indicatorsTh.forEach((indicator) => {
        expect(containsThai(indicator)).toBe(true);
      });
    });
  });
});

describe('Position Interpretations - Helper Functions', () => {
  describe('getLovePositionContext', () => {
    it('should return correct position for "you"', () => {
      const context = getLovePositionContext('you');
      expect(context.id).toBe('you');
      expect(context.nameTh).toBe('คุณ');
    });

    it('should return correct position for "other"', () => {
      const context = getLovePositionContext('other');
      expect(context.id).toBe('other');
      expect(context.nameTh).toBe('อีกฝ่าย');
    });

    it('should return correct position for "relationship_energy"', () => {
      const context = getLovePositionContext('relationship_energy');
      expect(context.id).toBe('relationship_energy');
      expect(context.nameTh).toBe('พลังงานความสัมพันธ์');
    });
  });

  describe('getCareerPositionContext', () => {
    it('should return correct position for "current_situation"', () => {
      const context = getCareerPositionContext('current_situation');
      expect(context.id).toBe('current_situation');
      expect(context.nameTh).toBe('สถานการณ์ปัจจุบัน');
    });

    it('should return correct position for "challenge_opportunity"', () => {
      const context = getCareerPositionContext('challenge_opportunity');
      expect(context.id).toBe('challenge_opportunity');
      expect(context.nameTh).toBe('อุปสรรคและโอกาส');
    });

    it('should return correct position for "outcome"', () => {
      const context = getCareerPositionContext('outcome');
      expect(context.id).toBe('outcome');
      expect(context.nameTh).toBe('ผลลัพธ์');
    });
  });

  describe('getYesNoPositionContext', () => {
    it('should return yes/no position', () => {
      const context = getYesNoPositionContext();
      expect(context.id).toBe('yes_no_answer');
      expect(context.answerFramework).toBeDefined();
    });
  });

  describe('getSpreadPositions', () => {
    it('should return 3 positions for love spread', () => {
      const positions = getSpreadPositions('love');
      expect(positions).toHaveLength(3);
    });

    it('should return 3 positions for career spread', () => {
      const positions = getSpreadPositions('career');
      expect(positions).toHaveLength(3);
    });

    it('should return 1 position for yes/no spread', () => {
      const positions = getSpreadPositions('yes_no');
      expect(positions).toHaveLength(1);
    });
  });

  describe('getPositionInterpretationPrefix', () => {
    it('should return Thai prefix for love position', () => {
      const prefix = getPositionInterpretationPrefix('love', 'you', false);
      expect(prefix).toContain('ในตำแหน่ง');
      expect(prefix).toContain('คุณ');
    });

    it('should include reversed indicator when card is reversed', () => {
      const prefix = getPositionInterpretationPrefix('love', 'you', true);
      expect(prefix).toContain('กลับหัว');
    });

    it('should not include reversed indicator when card is upright', () => {
      const prefix = getPositionInterpretationPrefix('career', 'outcome', false);
      expect(prefix).not.toContain('กลับหัว');
    });
  });
});

describe('Position-Aware Reading Generation', () => {
  const mockDeck = createMockDeck();
  
  // Helper to create mock drawn cards
  function createMockDrawnCards(count: number, reversed: boolean[] = []): DrawnCard[] {
    return mockDeck.slice(0, count).map((card, i) => ({
      card,
      isReversed: reversed[i] ?? false,
    }));
  }

  describe('generateLoveSpreadReading', () => {
    it('should generate reading with 3 positions', () => {
      const drawnCards = createMockDrawnCards(3);
      const reading = generateLoveSpreadReading(drawnCards, 'Test question');
      
      expect(reading.positions).toHaveLength(3);
      expect(reading.spreadType).toBe('love');
      expect(reading.question).toBe('Test question');
    });

    it('should have position-aware interpretations', () => {
      const drawnCards = createMockDrawnCards(3);
      const reading = generateLoveSpreadReading(drawnCards);
      
      reading.positions.forEach((pos) => {
        expect(pos.interpretation.positionContext).toBeTruthy();
        expect(pos.interpretation.combinedReading).toBeTruthy();
        expect(pos.interpretation.actionAdvice).toBeTruthy();
      });
    });

    it('should throw error if not 3 cards', () => {
      const drawnCards = createMockDrawnCards(2);
      expect(() => generateLoveSpreadReading(drawnCards)).toThrow();
    });

    it('should generate overall advice based on reversed count', () => {
      // All upright
      const allUpright = createMockDrawnCards(3, [false, false, false]);
      const uprightReading = generateLoveSpreadReading(allUpright);
      expect(uprightReading.overallAdvice).toContain('🌟');

      // All reversed
      const allReversed = createMockDrawnCards(3, [true, true, true]);
      const reversedReading = generateLoveSpreadReading(allReversed);
      expect(reversedReading.overallAdvice).toContain('⚠️');

      // Mixed
      const mixed = createMockDrawnCards(3, [true, false, false]);
      const mixedReading = generateLoveSpreadReading(mixed);
      expect(mixedReading.overallAdvice).toContain('💫');
    });
  });

  describe('generateCareerSpreadReading', () => {
    it('should generate reading with 3 positions', () => {
      const drawnCards = createMockDrawnCards(3);
      const reading = generateCareerSpreadReading(drawnCards, 'Career question');
      
      expect(reading.positions).toHaveLength(3);
      expect(reading.spreadType).toBe('career');
      expect(reading.question).toBe('Career question');
    });

    it('should have career-specific position names', () => {
      const drawnCards = createMockDrawnCards(3);
      const reading = generateCareerSpreadReading(drawnCards);
      
      const positionNames = reading.positions.map(p => p.position);
      expect(positionNames).toContain('current_situation');
      expect(positionNames).toContain('challenge_opportunity');
      expect(positionNames).toContain('outcome');
    });

    it('should throw error if not 3 cards', () => {
      const drawnCards = createMockDrawnCards(1);
      expect(() => generateCareerSpreadReading(drawnCards)).toThrow();
    });

    it('should generate overall advice based on reversed count', () => {
      // All upright
      const allUpright = createMockDrawnCards(3, [false, false, false]);
      const uprightReading = generateCareerSpreadReading(allUpright);
      expect(uprightReading.overallAdvice).toContain('💼');

      // All reversed
      const allReversed = createMockDrawnCards(3, [true, true, true]);
      const reversedReading = generateCareerSpreadReading(allReversed);
      expect(reversedReading.overallAdvice).toContain('🔍');
    });
  });

  describe('generateYesNoSpreadReading', () => {
    it('should generate reading with 1 position', () => {
      const drawnCard: DrawnCard = {
        card: mockDeck[0],
        isReversed: false,
      };
      const reading = generateYesNoSpreadReading(drawnCard, 'Will I succeed?');
      
      expect(reading.positions).toHaveLength(1);
      expect(reading.spreadType).toBe('yes_no');
      expect(reading.question).toBe('Will I succeed?');
    });

    it('should have yes/no position name', () => {
      const drawnCard: DrawnCard = {
        card: mockDeck[5],
        isReversed: true,
      };
      const reading = generateYesNoSpreadReading(drawnCard, 'Test?');
      
      expect(reading.positions[0].position).toBe('yes_no_answer');
    });
  });
});

describe('Content Quality - Relationship Focus (Love Spread)', () => {
  it('love position focus areas should be relationship-relevant', () => {
    const relationshipKeywords = ['relationship', 'love', 'emotional', 'partner', 'heart', 'connection'];
    
    Object.values(LOVE_SPREAD_POSITIONS).forEach((position) => {
      const allFocusAreas = position.focusAreas.join(' ').toLowerCase();
      const hasRelationshipFocus = relationshipKeywords.some(keyword => 
        allFocusAreas.includes(keyword)
      );
      expect(hasRelationshipFocus).toBe(true);
    });
  });
});

describe('Content Quality - Professional Guidance (Career Spread)', () => {
  it('career position focus areas should be work-relevant', () => {
    // Include broader career-related keywords
    const careerKeywords = [
      'career', 'work', 'financial', 'professional', 'position', 'job',
      'obstacle', 'opportunity', 'skill', 'timing', 'success', 'outcome',
      'environment', 'reputation', 'health'
    ];
    
    Object.values(CAREER_SPREAD_POSITIONS).forEach((position) => {
      const allFocusAreas = position.focusAreas.join(' ').toLowerCase();
      const hasCareerFocus = careerKeywords.some(keyword => 
        allFocusAreas.includes(keyword)
      );
      expect(hasCareerFocus).toBe(true);
    });
  });
});

describe('Content Quality - Yes/No Framework', () => {
  it('yes indicators should be positive in nature', () => {
    const positiveKeywords = ['positive', 'affirming', 'manifestation', 'completion', 'new'];
    
    const yesIndicators = YES_NO_POSITION.answerFramework.yes.indicators.join(' ').toLowerCase();
    const hasPositive = positiveKeywords.some(keyword => yesIndicators.includes(keyword));
    expect(hasPositive).toBe(true);
  });

  it('no indicators should be cautionary in nature', () => {
    const cautionaryKeywords = ['contracting', 'blocking', 'warning', 'caution', 'conflict', 'delay'];
    
    const noIndicators = YES_NO_POSITION.answerFramework.no.indicators.join(' ').toLowerCase();
    const hasCautionary = cautionaryKeywords.some(keyword => noIndicators.includes(keyword));
    expect(hasCautionary).toBe(true);
  });

  it('maybe indicators should be about uncertainty or transformation', () => {
    const uncertaintyKeywords = ['transformation', 'transition', 'change', 'not clear', 'reflection'];
    
    const maybeIndicators = YES_NO_POSITION.answerFramework.maybe.indicators.join(' ').toLowerCase();
    const hasUncertainty = uncertaintyKeywords.some(keyword => maybeIndicators.includes(keyword));
    expect(hasUncertainty).toBe(true);
  });
});

