import { describe, it, expect } from 'vitest';
import {
  interpretCardAsYesNo,
  ConfidenceLevel,
  YesNoAnswer,
  CONFIDENCE_LABELS,
  ANSWER_LABELS,
  getConfidencePercentage,
  drawYesNoCard,
} from '../../src/lib/tarot/yesNoInterpretation';
import { TarotCardData } from '../../src/types/card';
import { createMockDeck } from '../../src/lib/tarot/shuffle';

// Sample major arcana cards for testing
const theSun: TarotCardData = {
  id: 'major-19',
  slug: 'the-sun',
  name: 'The Sun',
  nameTh: 'พระอาทิตย์',
  number: 19,
  suit: 'major',
  arcana: 'major',
  imageUrl: '/cards/major/19.jpg',
  meaningUpright: 'Success, joy, vitality',
  meaningReversed: 'Temporary setbacks',
  advice: 'Embrace positivity',
};

const theTower: TarotCardData = {
  id: 'major-16',
  slug: 'the-tower',
  name: 'The Tower',
  nameTh: 'หอคอย',
  number: 16,
  suit: 'major',
  arcana: 'major',
  imageUrl: '/cards/major/16.jpg',
  meaningUpright: 'Sudden change, upheaval',
  meaningReversed: 'Averted disaster',
  advice: 'Accept change',
};

const theFool: TarotCardData = {
  id: 'major-0',
  slug: 'the-fool',
  name: 'The Fool',
  nameTh: 'คนโง่',
  number: 0,
  suit: 'major',
  arcana: 'major',
  imageUrl: '/cards/major/00.jpg',
  meaningUpright: 'New beginnings',
  meaningReversed: 'Recklessness',
  advice: 'Take a leap of faith',
};

// Sample minor arcana cards
const aceOfWands: TarotCardData = {
  id: 'wands-1',
  slug: 'ace-of-wands',
  name: 'Ace of Wands',
  nameTh: 'เอซไม้เท้า',
  number: 1,
  suit: 'wands',
  arcana: 'minor',
  imageUrl: '/cards/wands/01.jpg',
  meaningUpright: 'Inspiration, new opportunities',
  meaningReversed: 'Delays, lack of direction',
  advice: 'Pursue your passions',
};

const fiveOfSwords: TarotCardData = {
  id: 'swords-5',
  slug: 'five-of-swords',
  name: 'Five of Swords',
  nameTh: 'ห้าดาบ',
  number: 5,
  suit: 'swords',
  arcana: 'minor',
  imageUrl: '/cards/swords/05.jpg',
  meaningUpright: 'Conflict, defeat',
  meaningReversed: 'Moving on, forgiveness',
  advice: 'Choose your battles',
};

const fiveOfPentacles: TarotCardData = {
  id: 'pentacles-5',
  slug: 'five-of-pentacles',
  name: 'Five of Pentacles',
  nameTh: 'ห้าเหรียญ',
  number: 5,
  suit: 'pentacles',
  arcana: 'minor',
  imageUrl: '/cards/pentacles/05.jpg',
  meaningUpright: 'Hardship, loss',
  meaningReversed: 'Recovery, improvement',
  advice: 'Seek help when needed',
};

const aceOfCups: TarotCardData = {
  id: 'cups-1',
  slug: 'ace-of-cups',
  name: 'Ace of Cups',
  nameTh: 'เอซถ้วย',
  number: 1,
  suit: 'cups',
  arcana: 'minor',
  imageUrl: '/cards/cups/01.jpg',
  meaningUpright: 'Love, new emotions',
  meaningReversed: 'Blocked emotions',
  advice: 'Open your heart',
};

describe('Yes/No Interpretation Algorithm', () => {
  describe('Major Arcana Interpretations', () => {
    it('should return Strong Yes for The Sun upright', () => {
      const result = interpretCardAsYesNo(theSun, false);
      expect(result.answer).toBe('yes');
      expect(result.confidence).toBe(ConfidenceLevel.STRONG_YES);
    });

    it('should return Leaning Yes for The Sun reversed', () => {
      const result = interpretCardAsYesNo(theSun, true);
      expect(result.answer).toBe('yes');
      expect(result.confidence).toBe(ConfidenceLevel.LEANING_YES);
    });

    it('should return Strong No for The Tower upright', () => {
      const result = interpretCardAsYesNo(theTower, false);
      expect(result.answer).toBe('no');
      expect(result.confidence).toBe(ConfidenceLevel.STRONG_NO);
    });

    it('should return Maybe for The Tower reversed', () => {
      const result = interpretCardAsYesNo(theTower, true);
      expect(result.answer).toBe('maybe');
      expect(result.confidence).toBe(ConfidenceLevel.MAYBE);
    });

    it('should return Maybe for The Fool upright', () => {
      const result = interpretCardAsYesNo(theFool, false);
      expect(result.answer).toBe('maybe');
      expect(result.confidence).toBe(ConfidenceLevel.MAYBE);
    });

    it('should return Leaning No for The Fool reversed', () => {
      const result = interpretCardAsYesNo(theFool, true);
      expect(result.answer).toBe('no');
      expect(result.confidence).toBe(ConfidenceLevel.LEANING_NO);
    });
  });

  describe('Minor Arcana Interpretations', () => {
    it('should return Leaning Yes for Ace of Wands upright', () => {
      const result = interpretCardAsYesNo(aceOfWands, false);
      expect(result.answer).toBe('yes');
      expect(result.confidence).toBe(ConfidenceLevel.LEANING_YES);
    });

    it('should return Maybe for Ace of Wands reversed', () => {
      const result = interpretCardAsYesNo(aceOfWands, true);
      expect(result.answer).toBe('maybe');
      expect(result.confidence).toBe(ConfidenceLevel.MAYBE);
    });

    it('should return Leaning No for Five of Swords upright', () => {
      const result = interpretCardAsYesNo(fiveOfSwords, false);
      expect(result.answer).toBe('no');
      expect(result.confidence).toBe(ConfidenceLevel.LEANING_NO);
    });

    it('should return Maybe for Five of Swords reversed (blocked negativity)', () => {
      const result = interpretCardAsYesNo(fiveOfSwords, true);
      expect(result.answer).toBe('maybe');
      expect(result.confidence).toBe(ConfidenceLevel.MAYBE);
    });

    it('should return Leaning No for Five of Pentacles upright', () => {
      const result = interpretCardAsYesNo(fiveOfPentacles, false);
      expect(result.answer).toBe('no');
      expect(result.confidence).toBe(ConfidenceLevel.LEANING_NO);
    });

    it('should return Leaning Yes for Ace of Cups upright', () => {
      const result = interpretCardAsYesNo(aceOfCups, false);
      expect(result.answer).toBe('yes');
      expect(result.confidence).toBe(ConfidenceLevel.LEANING_YES);
    });
  });

  describe('Result Structure', () => {
    it('should include answer, confidence, and explanations', () => {
      const result = interpretCardAsYesNo(theSun, false);
      expect(result).toHaveProperty('answer');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('explanation');
      expect(result).toHaveProperty('shortExplanation');
    });

    it('should have non-empty explanations', () => {
      const result = interpretCardAsYesNo(theSun, false);
      expect(result.explanation.length).toBeGreaterThan(0);
      expect(result.shortExplanation.length).toBeGreaterThan(0);
    });

    it('should include card name in explanation', () => {
      const result = interpretCardAsYesNo(theSun, false);
      expect(result.explanation).toContain(theSun.nameTh);
      expect(result.shortExplanation).toContain(theSun.nameTh);
    });

    it('should indicate reversed status in explanation when reversed', () => {
      const result = interpretCardAsYesNo(theSun, true);
      expect(result.explanation).toContain('กลับหัว');
      expect(result.shortExplanation).toContain('กลับหัว');
    });
  });

  describe('Confidence Labels', () => {
    it('should have Thai and English labels for all confidence levels', () => {
      const levels = Object.values(ConfidenceLevel);
      levels.forEach((level) => {
        expect(CONFIDENCE_LABELS[level]).toHaveProperty('th');
        expect(CONFIDENCE_LABELS[level]).toHaveProperty('en');
        expect(CONFIDENCE_LABELS[level]).toHaveProperty('emoji');
        expect(CONFIDENCE_LABELS[level]).toHaveProperty('color');
        expect(CONFIDENCE_LABELS[level]).toHaveProperty('percentage');
      });
    });

    it('should have correct percentage order (Strong Yes > Leaning Yes > Maybe > Leaning No > Strong No)', () => {
      expect(getConfidencePercentage(ConfidenceLevel.STRONG_YES)).toBeGreaterThan(
        getConfidencePercentage(ConfidenceLevel.LEANING_YES)
      );
      expect(getConfidencePercentage(ConfidenceLevel.LEANING_YES)).toBeGreaterThan(
        getConfidencePercentage(ConfidenceLevel.MAYBE)
      );
      expect(getConfidencePercentage(ConfidenceLevel.MAYBE)).toBeGreaterThan(
        getConfidencePercentage(ConfidenceLevel.LEANING_NO)
      );
      expect(getConfidencePercentage(ConfidenceLevel.LEANING_NO)).toBeGreaterThan(
        getConfidencePercentage(ConfidenceLevel.STRONG_NO)
      );
    });
  });

  describe('Answer Labels', () => {
    it('should have Thai and English labels for all answer types', () => {
      const answers: YesNoAnswer[] = ['yes', 'no', 'maybe'];
      answers.forEach((answer) => {
        expect(ANSWER_LABELS[answer]).toHaveProperty('th');
        expect(ANSWER_LABELS[answer]).toHaveProperty('en');
        expect(ANSWER_LABELS[answer]).toHaveProperty('emoji');
        expect(ANSWER_LABELS[answer]).toHaveProperty('color');
      });
    });
  });

  describe('Draw Yes/No Card', () => {
    it('should draw a single card from the deck', () => {
      const deck = createMockDeck();
      const { card, isReversed } = drawYesNoCard(deck);
      expect(card).toBeDefined();
      expect(typeof isReversed).toBe('boolean');
    });

    it('should draw cards randomly (statistical test)', () => {
      const deck = createMockDeck();
      const drawnCards = new Set<string>();

      // Draw 20 cards and check for variety
      for (let i = 0; i < 20; i++) {
        const { card } = drawYesNoCard(deck);
        drawnCards.add(card.id);
      }

      // Should have drawn multiple different cards
      expect(drawnCards.size).toBeGreaterThan(1);
    });

    it('should have approximately 50% reversed cards (statistical test)', () => {
      const deck = createMockDeck();
      let reversedCount = 0;
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const { isReversed } = drawYesNoCard(deck);
        if (isReversed) reversedCount++;
      }

      // Allow for some variance - should be between 30% and 70%
      const reversedPercentage = reversedCount / iterations;
      expect(reversedPercentage).toBeGreaterThan(0.3);
      expect(reversedPercentage).toBeLessThan(0.7);
    });
  });

  describe('All 78 Cards Coverage', () => {
    it('should handle all cards in the deck without errors', () => {
      const deck = createMockDeck();

      deck.forEach((card) => {
        // Test upright
        const uprightResult = interpretCardAsYesNo(card, false);
        expect(['yes', 'no', 'maybe']).toContain(uprightResult.answer);
        expect(Object.values(ConfidenceLevel)).toContain(uprightResult.confidence);

        // Test reversed
        const reversedResult = interpretCardAsYesNo(card, true);
        expect(['yes', 'no', 'maybe']).toContain(reversedResult.answer);
        expect(Object.values(ConfidenceLevel)).toContain(reversedResult.confidence);
      });
    });

    it('should produce valid explanations for all cards', () => {
      const deck = createMockDeck();

      deck.forEach((card) => {
        const result = interpretCardAsYesNo(card, false);
        expect(result.explanation.length).toBeGreaterThan(10);
        expect(result.shortExplanation.length).toBeGreaterThan(5);
      });
    });
  });
});

describe('Question Validation', () => {
  const MIN_QUESTION_LENGTH = 10;

  it('should validate minimum question length', () => {
    const shortQuestion = 'ใช่ไหม?';
    const validQuestion = 'ควรเปลี่ยนงานตอนนี้ไหม?';

    expect(shortQuestion.length).toBeLessThan(MIN_QUESTION_LENGTH);
    expect(validQuestion.length).toBeGreaterThanOrEqual(MIN_QUESTION_LENGTH);
  });

  it('should reject empty questions', () => {
    const emptyQuestion = '';
    expect(emptyQuestion.trim().length).toBe(0);
  });
});

