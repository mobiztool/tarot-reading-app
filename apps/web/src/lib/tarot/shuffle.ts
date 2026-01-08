/**
 * Tarot Card Shuffle & Random Selection Logic
 */

import { TarotCardData, DrawnCard, Suit, PositionLabel } from '@/types/card';

function secureRandom(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  return Math.random();
}

function randomInt(min: number, max: number): number {
  return Math.floor(secureRandom() * (max - min)) + min;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function shuffleDeck(deck: TarotCardData[]): TarotCardData[] {
  return shuffleArray(deck);
}

export function shouldBeReversed(): boolean {
  return secureRandom() < 0.5;
}

export function drawCards(
  deck: TarotCardData[],
  count: number,
  positions?: Array<PositionLabel>
): DrawnCard[] {
  if (count > deck.length) {
    throw new Error(`Cannot draw ${count} cards from a deck of ${deck.length}`);
  }
  const shuffled = shuffleDeck(deck);
  const drawn: DrawnCard[] = [];
  for (let i = 0; i < count; i++) {
    drawn.push({
      card: shuffled[i],
      isReversed: shouldBeReversed(),
      position: positions?.[i],
    });
  }
  return drawn;
}

export function drawDailyCard(deck: TarotCardData[]): DrawnCard {
  const [card] = drawCards(deck, 1);
  return card;
}

export function drawThreeCardSpread(deck: TarotCardData[]): DrawnCard[] {
  return drawCards(deck, 3, ['past', 'present', 'future']);
}

export function drawLoveSpread(deck: TarotCardData[]): DrawnCard[] {
  return drawCards(deck, 3, ['you', 'other', 'relationship_energy']);
}

export function drawCareerSpread(deck: TarotCardData[]): DrawnCard[] {
  return drawCards(deck, 3, ['current_situation', 'challenge_opportunity', 'outcome']);
}

export function generateReadingSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `reading_${timestamp}_${randomPart}`;
}

export type ReadingSessionType = 'daily' | 'three-card' | 'love' | 'career';

export interface ReadingSession {
  id: string;
  type: ReadingSessionType;
  drawnCards: DrawnCard[];
  question?: string;
  createdAt: Date;
}

export function createReadingSession(
  type: ReadingSessionType,
  deck: TarotCardData[],
  question?: string
): ReadingSession {
  let drawnCards: DrawnCard[];
  switch (type) {
    case 'daily':
      drawnCards = [drawDailyCard(deck)];
      break;
    case 'love':
      drawnCards = drawLoveSpread(deck);
      break;
    case 'career':
      drawnCards = drawCareerSpread(deck);
      break;
    case 'three-card':
    default:
      drawnCards = drawThreeCardSpread(deck);
      break;
  }
  return {
    id: generateReadingSessionId(),
    type,
    drawnCards,
    question,
    createdAt: new Date(),
  };
}

export function getShuffleStats(
  iterations: number,
  deck: TarotCardData[]
): {
  reversedPercentage: number;
  positionDistribution: Map<string, number>;
} {
  let reversedCount = 0;
  const positionDistribution = new Map<string, number>();
  for (let i = 0; i < iterations; i++) {
    const [drawn] = drawCards(deck, 1);
    if (drawn.isReversed) {
      reversedCount++;
    }
    const cardId = drawn.card.id;
    positionDistribution.set(cardId, (positionDistribution.get(cardId) || 0) + 1);
  }
  return {
    reversedPercentage: (reversedCount / iterations) * 100,
    positionDistribution,
  };
}

export function createMockDeck(): TarotCardData[] {
  const deck: TarotCardData[] = [];
  const majorArcanaNames = [
    { en: 'The Fool', th: 'คนโง่' },
    { en: 'The Magician', th: 'นักมายากล' },
    { en: 'The High Priestess', th: 'นักบวชหญิง' },
    { en: 'The Empress', th: 'จักรพรรดินี' },
    { en: 'The Emperor', th: 'จักรพรรดิ' },
    { en: 'The Hierophant', th: 'สันตะปาปา' },
    { en: 'The Lovers', th: 'คู่รัก' },
    { en: 'The Chariot', th: 'รถศึก' },
    { en: 'Strength', th: 'พลัง' },
    { en: 'The Hermit', th: 'ฤาษี' },
    { en: 'Wheel of Fortune', th: 'วงล้อโชคชะตา' },
    { en: 'Justice', th: 'ความยุติธรรม' },
    { en: 'The Hanged Man', th: 'ชายถูกแขวน' },
    { en: 'Death', th: 'ความตาย' },
    { en: 'Temperance', th: 'ความพอดี' },
    { en: 'The Devil', th: 'ปีศาจ' },
    { en: 'The Tower', th: 'หอคอย' },
    { en: 'The Star', th: 'ดวงดาว' },
    { en: 'The Moon', th: 'ดวงจันทร์' },
    { en: 'The Sun', th: 'ดวงอาทิตย์' },
    { en: 'Judgement', th: 'การพิพากษา' },
    { en: 'The World', th: 'โลก' },
  ];
  majorArcanaNames.forEach((name, index) => {
    deck.push({
      id: `major-${index}`,
      slug: name.en.toLowerCase().replace(/\s+/g, '-'),
      name: name.en,
      nameTh: name.th,
      number: index,
      suit: 'major' as Suit,
      arcana: 'major',
      imageUrl: `/cards/major/${index.toString().padStart(2, '0')}.webp`,
      keywords: ['wisdom', 'journey'],
      keywordsTh: ['ปัญญา', 'การเดินทาง'],
      meaningUpright: `${name.en} upright meaning`,
      meaningReversed: `${name.en} reversed meaning`,
      advice: `Advice for ${name.en}`,
    });
  });
  const suits: Array<{ suit: Suit; th: string }> = [
    { suit: 'wands', th: 'ไม้เท้า' },
    { suit: 'cups', th: 'ถ้วย' },
    { suit: 'swords', th: 'ดาบ' },
    { suit: 'pentacles', th: 'เหรียญ' },
  ];
  const cardNames = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
  suits.forEach(({ suit, th }) => {
    cardNames.forEach((cardName, index) => {
      const number = index + 1;
      deck.push({
        id: `${suit}-${number}`,
        slug: `${cardName.toLowerCase()}-of-${suit}`,
        name: `${cardName} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
        nameTh: `${cardName} แห่ง${th}`,
        number,
        suit,
        arcana: 'minor',
        imageUrl: `/cards/${suit}/${number.toString().padStart(2, '0')}.webp`,
        keywords: ['action', 'energy'],
        keywordsTh: ['การกระทำ', 'พลังงาน'],
        meaningUpright: `${cardName} of ${suit} upright meaning`,
        meaningReversed: `${cardName} of ${suit} reversed meaning`,
        advice: `Advice for ${cardName} of ${suit}`,
      });
    });
  });
  return deck;
}
