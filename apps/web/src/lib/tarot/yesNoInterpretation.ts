/**
 * Yes/No Tarot Interpretation Algorithm
 */

import { TarotCardData, Suit } from '@/types/card';

export type YesNoAnswer = 'yes' | 'no' | 'maybe';

export enum ConfidenceLevel {
  STRONG_YES = 'strong_yes',
  LEANING_YES = 'leaning_yes',
  MAYBE = 'maybe',
  LEANING_NO = 'leaning_no',
  STRONG_NO = 'strong_no',
}

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, { th: string; en: string; emoji: string; color: string; percentage: number }> = {
  [ConfidenceLevel.STRONG_YES]: { th: 'ใช่แน่นอน', en: 'Strong Yes', emoji: '✨', color: 'from-green-500 to-emerald-600', percentage: 95 },
  [ConfidenceLevel.LEANING_YES]: { th: 'น่าจะใช่', en: 'Leaning Yes', emoji: '👍', color: 'from-teal-500 to-green-500', percentage: 75 },
  [ConfidenceLevel.MAYBE]: { th: 'อาจจะ', en: 'Maybe', emoji: '🤔', color: 'from-amber-500 to-yellow-500', percentage: 50 },
  [ConfidenceLevel.LEANING_NO]: { th: 'น่าจะไม่', en: 'Leaning No', emoji: '👎', color: 'from-orange-500 to-red-400', percentage: 25 },
  [ConfidenceLevel.STRONG_NO]: { th: 'ไม่แน่นอน', en: 'Strong No', emoji: '❌', color: 'from-red-500 to-rose-600', percentage: 5 },
};

export const ANSWER_LABELS: Record<YesNoAnswer, { th: string; en: string; emoji: string; color: string }> = {
  yes: { th: 'ใช่', en: 'Yes', emoji: '✅', color: 'from-green-500 to-emerald-600' },
  no: { th: 'ไม่', en: 'No', emoji: '❌', color: 'from-red-500 to-rose-600' },
  maybe: { th: 'อาจจะ', en: 'Maybe', emoji: '🤔', color: 'from-amber-500 to-yellow-500' },
};

export interface YesNoResult {
  answer: YesNoAnswer;
  confidence: ConfidenceLevel;
  explanation: string;
  shortExplanation: string;
}

const MAJOR_ARCANA_MAPPING: Record<number, { upright: ConfidenceLevel; reversed: ConfidenceLevel }> = {
  0: { upright: ConfidenceLevel.MAYBE, reversed: ConfidenceLevel.LEANING_NO },
  1: { upright: ConfidenceLevel.STRONG_YES, reversed: ConfidenceLevel.LEANING_NO },
  2: { upright: ConfidenceLevel.MAYBE, reversed: ConfidenceLevel.LEANING_NO },
  3: { upright: ConfidenceLevel.LEANING_YES, reversed: ConfidenceLevel.MAYBE },
  4: { upright: ConfidenceLevel.LEANING_YES, reversed: ConfidenceLevel.LEANING_NO },
  5: { upright: ConfidenceLevel.LEANING_YES, reversed: ConfidenceLevel.MAYBE },
  6: { upright: ConfidenceLevel.LEANING_YES, reversed: ConfidenceLevel.LEANING_NO },
  7: { upright: ConfidenceLevel.STRONG_YES, reversed: ConfidenceLevel.LEANING_NO },
  8: { upright: ConfidenceLevel.LEANING_YES, reversed: ConfidenceLevel.MAYBE },
  9: { upright: ConfidenceLevel.MAYBE, reversed: ConfidenceLevel.LEANING_NO },
  10: { upright: ConfidenceLevel.LEANING_YES, reversed: ConfidenceLevel.MAYBE },
  11: { upright: ConfidenceLevel.LEANING_YES, reversed: ConfidenceLevel.LEANING_NO },
  12: { upright: ConfidenceLevel.MAYBE, reversed: ConfidenceLevel.LEANING_NO },
  13: { upright: ConfidenceLevel.MAYBE, reversed: ConfidenceLevel.LEANING_NO },
  14: { upright: ConfidenceLevel.LEANING_YES, reversed: ConfidenceLevel.MAYBE },
  15: { upright: ConfidenceLevel.STRONG_NO, reversed: ConfidenceLevel.MAYBE },
  16: { upright: ConfidenceLevel.STRONG_NO, reversed: ConfidenceLevel.MAYBE },
  17: { upright: ConfidenceLevel.STRONG_YES, reversed: ConfidenceLevel.LEANING_YES },
  18: { upright: ConfidenceLevel.MAYBE, reversed: ConfidenceLevel.LEANING_NO },
  19: { upright: ConfidenceLevel.STRONG_YES, reversed: ConfidenceLevel.LEANING_YES },
  20: { upright: ConfidenceLevel.LEANING_YES, reversed: ConfidenceLevel.MAYBE },
  21: { upright: ConfidenceLevel.STRONG_YES, reversed: ConfidenceLevel.LEANING_YES },
};

const WANDS_CHALLENGES = [3, 5, 7, 10];
const CUPS_CHALLENGES = [5, 8];
const SWORDS_POSITIVE = [1, 6, 11, 12];
const PENTACLES_CHALLENGES = [5];

function getMinorArcanaConfidence(suit: Suit, number: number, isReversed: boolean): ConfidenceLevel {
  switch (suit) {
    case 'wands':
      if (WANDS_CHALLENGES.includes(number)) {
        return isReversed ? ConfidenceLevel.MAYBE : ConfidenceLevel.LEANING_NO;
      }
      return isReversed ? ConfidenceLevel.MAYBE : ConfidenceLevel.LEANING_YES;
    case 'cups':
      if (CUPS_CHALLENGES.includes(number)) {
        return isReversed ? ConfidenceLevel.MAYBE : ConfidenceLevel.LEANING_NO;
      }
      return isReversed ? ConfidenceLevel.MAYBE : ConfidenceLevel.LEANING_YES;
    case 'swords':
      if (SWORDS_POSITIVE.includes(number)) {
        return isReversed ? ConfidenceLevel.MAYBE : ConfidenceLevel.LEANING_YES;
      }
      return isReversed ? ConfidenceLevel.MAYBE : ConfidenceLevel.LEANING_NO;
    case 'pentacles':
      if (PENTACLES_CHALLENGES.includes(number)) {
        return isReversed ? ConfidenceLevel.MAYBE : ConfidenceLevel.LEANING_NO;
      }
      return isReversed ? ConfidenceLevel.MAYBE : ConfidenceLevel.LEANING_YES;
    default:
      return ConfidenceLevel.MAYBE;
  }
}

function confidenceToAnswer(confidence: ConfidenceLevel): YesNoAnswer {
  switch (confidence) {
    case ConfidenceLevel.STRONG_YES:
    case ConfidenceLevel.LEANING_YES:
      return 'yes';
    case ConfidenceLevel.STRONG_NO:
    case ConfidenceLevel.LEANING_NO:
      return 'no';
    case ConfidenceLevel.MAYBE:
    default:
      return 'maybe';
  }
}

function generateExplanation(
  card: TarotCardData,
  isReversed: boolean,
  answer: YesNoAnswer,
  confidence: ConfidenceLevel
): { full: string; short: string } {
  const cardName = card.nameTh || card.name;
  const reversedText = isReversed ? '(กลับหัว)' : '';
  const confidenceLabel = CONFIDENCE_LABELS[confidence];
  const answerLabel = ANSWER_LABELS[answer];
  let short = '';
  let full = '';
  switch (answer) {
    case 'yes':
      short = `ไพ่ ${cardName} ${reversedText} บ่งบอกว่า "${answerLabel.th}"`;
      full = `ไพ่ ${cardName} ${reversedText} ให้คำตอบว่า "${answerLabel.th}" ด้วยความมั่นใจระดับ "${confidenceLabel.th}" ไพ่ใบนี้ส่งพลังงานเชิงบวกมาสู่คำถามของคุณ เป็นสัญญาณที่ดีในการเดินหน้าต่อ ความสำเร็จและผลลัพธ์ที่ดีรอคุณอยู่ข้างหน้า`;
      break;
    case 'no':
      short = `ไพ่ ${cardName} ${reversedText} บ่งบอกว่า "${answerLabel.th}"`;
      full = `ไพ่ ${cardName} ${reversedText} ให้คำตอบว่า "${answerLabel.th}" ด้วยความมั่นใจระดับ "${confidenceLabel.th}" ไพ่ใบนี้แนะนำให้คุณรอจังหวะที่เหมาะสมกว่านี้ อาจมีอุปสรรคหรือสิ่งที่ยังไม่พร้อม ลองทบทวนและวางแผนใหม่`;
      break;
    case 'maybe':
    default:
      short = `ไพ่ ${cardName} ${reversedText} บ่งบอกว่า "${answerLabel.th}"`;
      full = `ไพ่ ${cardName} ${reversedText} ให้คำตอบว่า "${answerLabel.th}" สถานการณ์ยังไม่ชัดเจนพอที่จะให้คำตอบแน่นอนได้ ลองพิจารณาปัจจัยต่างๆ รอบด้านและฟังเสียงภายในใจของคุณ คำตอบที่แท้จริงอาจต้องใช้เวลาในการเปิดเผย`;
      break;
  }
  return { full, short };
}

export function interpretCardAsYesNo(card: TarotCardData, isReversed: boolean): YesNoResult {
  let confidence: ConfidenceLevel;
  if (card.suit === 'major' || card.suit === null) {
    const cardNumber = card.number ?? 0;
    const mapping = MAJOR_ARCANA_MAPPING[cardNumber];
    confidence = mapping ? (isReversed ? mapping.reversed : mapping.upright) : ConfidenceLevel.MAYBE;
  } else {
    confidence = getMinorArcanaConfidence(card.suit, card.number ?? 1, isReversed);
  }
  const answer = confidenceToAnswer(confidence);
  const explanations = generateExplanation(card, isReversed, answer, confidence);
  return {
    answer,
    confidence,
    explanation: explanations.full,
    shortExplanation: explanations.short,
  };
}

export function getConfidencePercentage(confidence: ConfidenceLevel): number {
  return CONFIDENCE_LABELS[confidence].percentage;
}

export function drawYesNoCard(deck: TarotCardData[]): { card: TarotCardData; isReversed: boolean } {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  const card = shuffled[0];
  const isReversed = Math.random() < 0.5;
  return { card, isReversed };
}
