/**
 * Tarot Card Shuffle & Random Selection Logic
 * Uses cryptographically secure randomization for fair card draws
 */

import { TarotCardData, DrawnCard, Suit, PositionLabel } from '@/types/card';

/**
 * Generate a cryptographically secure random number between 0 and 1
 * Falls back to Math.random() if crypto API is not available
 */
function secureRandom(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  // Fallback for environments without crypto API
  return Math.random();
}

/**
 * Generate a random integer between min (inclusive) and max (exclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(secureRandom() * (max - min)) + min;
}

/**
 * Shuffle an array using Fisher-Yates algorithm with secure randomization
 * Returns a new shuffled array without modifying the original
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Shuffle the entire tarot deck (78 cards)
 * Returns a new shuffled array of cards
 */
export function shuffleDeck(deck: TarotCardData[]): TarotCardData[] {
  return shuffleArray(deck);
}

/**
 * Determine if a card should be reversed (50% chance)
 */
export function shouldBeReversed(): boolean {
  return secureRandom() < 0.5;
}

/**
 * Draw a specified number of unique cards from the deck
 * Each card has a 50% chance of being reversed
 *
 * @param deck - The full deck of cards
 * @param count - Number of cards to draw
 * @param positions - Optional position labels for each card
 * @returns Array of drawn cards with reversed status
 */
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

/**
 * Draw a single card for daily reading
 */
export function drawDailyCard(deck: TarotCardData[]): DrawnCard {
  const [card] = drawCards(deck, 1);
  return card;
}

/**
 * Draw three cards for Past-Present-Future spread
 */
export function drawThreeCardSpread(deck: TarotCardData[]): DrawnCard[] {
  return drawCards(deck, 3, ['past', 'present', 'future']);
}

/**
 * Draw three cards for Love & Relationships spread
 * Position 0: You (คุณ) - Your feelings and attitudes
 * Position 1: Other (คู่ของคุณ) - The other person's perspective
 * Position 2: Relationship Energy (พลังความสัมพันธ์) - The dynamic between you
 */
export function drawLoveSpread(deck: TarotCardData[]): DrawnCard[] {
  return drawCards(deck, 3, ['you', 'other', 'relationship_energy']);
}

/**
 * Draw three cards for Career & Money spread
 * Position 0: Current Situation (สถานการณ์ปัจจุบัน) - Present job/financial state
 * Position 1: Challenge/Opportunity (อุปสรรคและโอกาส) - What to overcome or seize
 * Position 2: Outcome (ผลลัพธ์) - Career/financial trajectory
 */
export function drawCareerSpread(deck: TarotCardData[]): DrawnCard[] {
  return drawCards(deck, 3, ['current_situation', 'challenge_opportunity', 'outcome']);
}

/**
 * Generate a unique reading session ID
 * Format: reading_[timestamp]_[random]
 */
export function generateReadingSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `reading_${timestamp}_${randomPart}`;
}

/**
 * Draw ten cards for Celtic Cross spread
 * Position 0: Present Situation (สถานการณ์ปัจจุบัน)
 * Position 1: Challenge (อุปสรรค/ความท้าทาย)
 * Position 2: Past/Foundation (รากฐาน/อดีต)
 * Position 3: Future (อนาคตอันใกล้)
 * Position 4: Above (เป้าหมาย/ความปรารถนา)
 * Position 5: Below (จิตใต้สำนึก)
 * Position 6: Advice (คำแนะนำ)
 * Position 7: External Influences (อิทธิพลภายนอก)
 * Position 8: Hopes & Fears (ความหวัง/ความกลัว)
 * Position 9: Final Outcome (ผลลัพธ์สุดท้าย)
 */
export function drawCelticCrossSpread(deck: TarotCardData[]): DrawnCard[] {
  return drawCards(deck, 10, [
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
  ]);
}

/**
 * Draw five cards for Decision Making spread
 * Position 0: Option A Pros (ข้อดีของตัวเลือก A)
 * Position 1: Option A Cons (ข้อเสียของตัวเลือก A)
 * Position 2: Option B Pros (ข้อดีของตัวเลือก B)
 * Position 3: Option B Cons (ข้อเสียของตัวเลือก B)
 * Position 4: Best Path (เส้นทางที่ดีที่สุด)
 */
export function drawDecisionMakingSpread(deck: TarotCardData[]): DrawnCard[] {
  return drawCards(deck, 5, [
    'dm_option_a_pros',
    'dm_option_a_cons',
    'dm_option_b_pros',
    'dm_option_b_cons',
    'dm_best_path',
  ]);
}

/**
 * Draw five cards for Self Discovery spread
 * Position 0: Core Self (ตัวตนแท้จริง) - Who you are now
 * Position 1: Strengths (จุดแข็ง) - What empowers you
 * Position 2: Challenges (ความท้าทาย) - What holds you back
 * Position 3: Hidden Potential (ศักยภาพซ่อนเร้น) - Undiscovered gifts
 * Position 4: Path Forward (เส้นทางข้างหน้า) - Next steps
 */
export function drawSelfDiscoverySpread(deck: TarotCardData[]): DrawnCard[] {
  return drawCards(deck, 5, [
    'sd_core_self',
    'sd_strengths',
    'sd_challenges',
    'sd_hidden_potential',
    'sd_path_forward',
  ]);
}

/**
 * Draw seven cards for Relationship Deep Dive spread
 * Position 0: You (คุณ) - Your current state in the relationship
 * Position 1: Them (อีกฝ่าย) - Their current state in the relationship
 * Position 2: Connection (เชื่อมโยง) - The dynamic between you
 * Position 3: Your Feelings (ความรู้สึกของคุณ) - Your true feelings
 * Position 4: Their Feelings (ความรู้สึกของอีกฝ่าย) - Their true feelings
 * Position 5: Challenges (ความท้าทาย) - What needs work
 * Position 6: Future Potential (อนาคต) - Where this is heading
 */
export function drawRelationshipDeepDiveSpread(deck: TarotCardData[]): DrawnCard[] {
  return drawCards(deck, 7, [
    'rdd_you',
    'rdd_them',
    'rdd_connection',
    'rdd_your_feelings',
    'rdd_their_feelings',
    'rdd_challenges',
    'rdd_future_potential',
  ]);
}

/**
 * Reading session type for tracking
 */
export type ReadingSessionType = 'daily' | 'three-card' | 'love' | 'career' | 'celtic-cross' | 'decision' | 'self-discovery' | 'relationship-deep-dive';

export interface ReadingSession {
  id: string;
  type: ReadingSessionType;
  drawnCards: DrawnCard[];
  question?: string;
  createdAt: Date;
}

/**
 * Create a new reading session with drawn cards
 */
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
    case 'celtic-cross':
      drawnCards = drawCelticCrossSpread(deck);
      break;
    case 'decision':
      drawnCards = drawDecisionMakingSpread(deck);
      break;
    case 'self-discovery':
      drawnCards = drawSelfDiscoverySpread(deck);
      break;
    case 'relationship-deep-dive':
      drawnCards = drawRelationshipDeepDiveSpread(deck);
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

/**
 * Get statistics about card distribution
 * Useful for verifying randomness in tests
 */
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

/**
 * Create a mock deck for testing/development
 * Generates 78 placeholder cards matching the standard tarot structure
 */
export function createMockDeck(): TarotCardData[] {
  const deck: TarotCardData[] = [];

  // Major Arcana (0-21)
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

  // Minor Arcana (Wands, Cups, Swords, Pentacles)
  const suits: Array<{ suit: Suit; th: string }> = [
    { suit: 'wands', th: 'ไม้เท้า' },
    { suit: 'cups', th: 'ถ้วย' },
    { suit: 'swords', th: 'ดาบ' },
    { suit: 'pentacles', th: 'เหรียญ' },
  ];

  const cardNames = [
    'Ace',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Page',
    'Knight',
    'Queen',
    'King',
  ];

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

