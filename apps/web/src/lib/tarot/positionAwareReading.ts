/**
 * Position-Aware Reading Generator
 * 
 * Generates contextual interpretations based on:
 * - The card drawn
 * - The position in the spread
 * - Whether the card is reversed
 * - The spread type (love, career, yes/no)
 */

import { TarotCardData, DrawnCard } from '@/types/card';
import { generateDetailedPrediction, DetailedMeaning } from './cardMeanings';
import {
  LOVE_SPREAD_POSITIONS,
  CAREER_SPREAD_POSITIONS,
  YES_NO_POSITION,
  PositionContext,
} from './positionInterpretations';

// =============================================================================
// TYPES
// =============================================================================

export interface PositionAwareReading {
  position: string;
  positionName: string;
  positionNameTh: string;
  card: TarotCardData;
  isReversed: boolean;
  interpretation: {
    positionContext: string;
    cardMeaning: DetailedMeaning;
    combinedReading: string;
    actionAdvice: string;
  };
}

export interface SpreadReading {
  spreadType: 'love' | 'career' | 'yes_no';
  question?: string;
  positions: PositionAwareReading[];
  overallAdvice: string;
  createdAt: Date;
}

// =============================================================================
// LOVE SPREAD INTERPRETATIONS
// =============================================================================

const LOVE_POSITION_CONTEXTS: Record<string, (card: TarotCardData, isReversed: boolean) => string> = {
  you: (card, isReversed) => {
    const direction = isReversed ? 'กลับหัว' : 'หงาย';
    return `ไพ่ ${card.nameTh} ${direction} ในตำแหน่ง "คุณ" เผยให้เห็นสิ่งที่คุณนำมาสู่ความสัมพันธ์ ` +
      `พลังงานภายในของคุณ และความพร้อมทางอารมณ์ในการรับรักและให้รัก`;
  },
  other: (card, isReversed) => {
    const direction = isReversed ? 'กลับหัว' : 'หงาย';
    return `ไพ่ ${card.nameTh} ${direction} ในตำแหน่ง "อีกฝ่าย" สะท้อนพลังงานและความรู้สึกของคนที่คุณสนใจ ` +
      `มุมมองของเขาหรือเธอที่มีต่อคุณและความสัมพันธ์`;
  },
  relationship_energy: (card, isReversed) => {
    const direction = isReversed ? 'กลับหัว' : 'หงาย';
    return `ไพ่ ${card.nameTh} ${direction} ในตำแหน่ง "พลังงานความสัมพันธ์" แสดงถึงพลวัตและเคมีระหว่างคุณสองคน ` +
      `ทิศทางที่ความสัมพันธ์กำลังมุ่งไป และบทเรียนที่คุณทั้งสองจะได้เรียนรู้ร่วมกัน`;
  },
};

function generateLovePositionReading(
  drawnCard: DrawnCard,
  position: 'you' | 'other' | 'relationship_energy'
): PositionAwareReading {
  const { card, isReversed } = drawnCard;
  const positionInfo = LOVE_SPREAD_POSITIONS[position];
  
  // Get base card meaning
  const cardMeaning = generateDetailedPrediction(
    card.slug,
    isReversed,
    card.suit,
    card.number,
    card.nameTh
  );

  // Generate position context
  const positionContext = LOVE_POSITION_CONTEXTS[position](card, isReversed);

  // Combine for love-specific reading
  const loveKeywords = isReversed 
    ? ['ควรระวัง', 'อาจต้องปรับตัว', 'ความท้าทาย']
    : ['โอกาส', 'พลังบวก', 'ความก้าวหน้า'];
  
  const combinedReading = `${positionContext}\n\n` +
    `ในด้านความรัก: ${cardMeaning.love}\n\n` +
    `สิ่งที่ควรใส่ใจ: ${loveKeywords.join(', ')}`;

  // Generate action advice
  let actionAdvice = '';
  if (position === 'you') {
    actionAdvice = isReversed 
      ? 'ให้เวลากับตัวเอง ทบทวนความต้องการที่แท้จริง อย่าเร่งรีบตัดสินใจ'
      : 'เชื่อมั่นในตัวเอง เปิดใจรับความรัก แสดงความรู้สึกอย่างจริงใจ';
  } else if (position === 'other') {
    actionAdvice = isReversed
      ? 'สังเกตและรอดูก่อน อย่าคาดหวังสูงเกินไป ให้โอกาสทั้งตัวเองและอีกฝ่าย'
      : 'สื่อสารอย่างเปิดเผย สร้างความไว้วางใจ ให้เวลาในการทำความรู้จัก';
  } else {
    actionAdvice = isReversed
      ? 'ทบทวนทิศทางความสัมพันธ์ พูดคุยเรื่องสำคัญอย่างจริงจัง รับฟังซึ่งกันและกัน'
      : 'ดูแลความสัมพันธ์ให้ดี สร้างความทรงจำดีๆ ร่วมกัน ก้าวไปข้างหน้าด้วยกัน';
  }

  return {
    position,
    positionName: positionInfo.name,
    positionNameTh: positionInfo.nameTh,
    card,
    isReversed,
    interpretation: {
      positionContext,
      cardMeaning,
      combinedReading,
      actionAdvice,
    },
  };
}

// =============================================================================
// CAREER SPREAD INTERPRETATIONS
// =============================================================================

const CAREER_POSITION_CONTEXTS: Record<string, (card: TarotCardData, isReversed: boolean) => string> = {
  current_situation: (card, isReversed) => {
    const direction = isReversed ? 'กลับหัว' : 'หงาย';
    return `ไพ่ ${card.nameTh} ${direction} ในตำแหน่ง "สถานการณ์ปัจจุบัน" เผยให้เห็นตำแหน่งที่คุณยืนอยู่ในอาชีพ ` +
      `พลังงานรอบตัวคุณในที่ทำงาน และสถานะการเงินที่แท้จริง`;
  },
  challenge_opportunity: (card, isReversed) => {
    const direction = isReversed ? 'กลับหัว' : 'หงาย';
    return `ไพ่ ${card.nameTh} ${direction} ในตำแหน่ง "อุปสรรคและโอกาส" ชี้ให้เห็นความท้าทายที่คุณต้องเผชิญ ` +
      `และโอกาสที่ซ่อนอยู่ที่รอให้คุณค้นพบและคว้าไว้`;
  },
  outcome: (card, isReversed) => {
    const direction = isReversed ? 'กลับหัว' : 'หงาย';
    return `ไพ่ ${card.nameTh} ${direction} ในตำแหน่ง "ผลลัพธ์" บ่งบอกถึงทิศทางที่เส้นทางอาชีพของคุณกำลังมุ่งไป ` +
      `หากคุณเดินตามเส้นทางปัจจุบัน จำไว้ว่าอนาคตไม่ได้ตายตัว คุณมีอำนาจในการเปลี่ยนแปลง`;
  },
};

function generateCareerPositionReading(
  drawnCard: DrawnCard,
  position: 'current_situation' | 'challenge_opportunity' | 'outcome'
): PositionAwareReading {
  const { card, isReversed } = drawnCard;
  const positionInfo = CAREER_SPREAD_POSITIONS[position];
  
  // Get base card meaning
  const cardMeaning = generateDetailedPrediction(
    card.slug,
    isReversed,
    card.suit,
    card.number,
    card.nameTh
  );

  // Generate position context
  const positionContext = CAREER_POSITION_CONTEXTS[position](card, isReversed);

  // Combine for career-specific reading
  const combinedReading = `${positionContext}\n\n` +
    `ในด้านการงาน: ${cardMeaning.career}\n\n` +
    `คำแนะนำ: ${cardMeaning.advice}`;

  // Generate action advice based on position
  let actionAdvice = '';
  if (position === 'current_situation') {
    actionAdvice = isReversed 
      ? 'ประเมินสถานการณ์อย่างซื่อสัตย์ มองหาจุดที่ต้องปรับปรุง อย่ากลัวที่จะเผชิญความจริง'
      : 'ใช้ประโยชน์จากตำแหน่งที่คุณมี สร้างเครือข่าย พัฒนาทักษะที่คุณมีอยู่';
  } else if (position === 'challenge_opportunity') {
    actionAdvice = isReversed
      ? 'อย่าหลีกเลี่ยงปัญหา เผชิญหน้าอย่างกล้าหาญ ทุกอุปสรรคคือบทเรียน'
      : 'คว้าโอกาสเมื่อมันมา อย่าลังเล เตรียมตัวให้พร้อมสำหรับการเปลี่ยนแปลง';
  } else {
    actionAdvice = isReversed
      ? 'ทบทวนเส้นทางและเป้าหมาย อย่ากลัวที่จะปรับแผน ความยืดหยุ่นคือกุญแจ'
      : 'ก้าวไปข้างหน้าอย่างมั่นใจ เชื่อในความสามารถของตัวเอง ความสำเร็จรออยู่ข้างหน้า';
  }

  return {
    position,
    positionName: positionInfo.name,
    positionNameTh: positionInfo.nameTh,
    card,
    isReversed,
    interpretation: {
      positionContext,
      cardMeaning,
      combinedReading,
      actionAdvice,
    },
  };
}

// =============================================================================
// YES/NO SPREAD INTERPRETATION
// =============================================================================

function generateYesNoReading(drawnCard: DrawnCard): PositionAwareReading {
  const { card, isReversed } = drawnCard;
  const positionInfo = YES_NO_POSITION;
  
  // Get base card meaning
  const cardMeaning = generateDetailedPrediction(
    card.slug,
    isReversed,
    card.suit,
    card.number,
    card.nameTh
  );

  const direction = isReversed ? 'กลับหัว' : 'หงาย';
  const positionContext = `ไพ่ ${card.nameTh} ${direction} ถูกจั่วขึ้นมาเพื่อตอบคำถามของคุณ ` +
    `พลังงานของไพ่ใบนี้จะบ่งบอกทิศทางของคำตอบ`;

  // The actual yes/no interpretation is done by yesNoInterpretation.ts
  const combinedReading = `${positionContext}\n\n` +
    `คำทำนาย: ${cardMeaning.prediction}\n\n` +
    `คำแนะนำ: ${cardMeaning.advice}`;

  const actionAdvice = isReversed
    ? 'รอจังหวะที่เหมาะสมกว่านี้ หรือทบทวนสิ่งที่คุณกำลังพิจารณาอีกครั้ง'
    : 'ไพ่ให้ทิศทางที่ชัดเจน ฟังสัญชาตญาณของคุณและตัดสินใจด้วยความมั่นใจ';

  return {
    position: 'yes_no_answer',
    positionName: positionInfo.name,
    positionNameTh: positionInfo.nameTh,
    card,
    isReversed,
    interpretation: {
      positionContext,
      cardMeaning,
      combinedReading,
      actionAdvice,
    },
  };
}

// =============================================================================
// OVERALL ADVICE GENERATORS
// =============================================================================

function generateLoveOverallAdvice(readings: PositionAwareReading[]): string {
  const reversedCount = readings.filter(r => r.isReversed).length;
  
  if (reversedCount === 0) {
    return '🌟 พลังงานรักของคุณกำลังไหลอย่างราบรื่น นี่คือช่วงเวลาที่ดีสำหรับความสัมพันธ์ ' +
      'เปิดใจ สื่อสาร และให้เวลากับคนที่คุณรัก';
  } else if (reversedCount === 3) {
    return '⚠️ มีบางสิ่งที่ต้องใส่ใจในความสัมพันธ์ ไม่ใช่เรื่องร้าย แต่เป็นโอกาสในการเติบโต ' +
      'ทบทวน สื่อสาร และอย่ากลัวที่จะเผชิญความจริง';
  } else {
    return '💫 ความสัมพันธ์ของคุณมีทั้งจุดแข็งและจุดที่ต้องพัฒนา ' +
      'ให้ความสนใจกับไพ่ที่กลับหัว เพราะมันชี้ให้เห็นสิ่งที่ต้องปรับปรุง';
  }
}

function generateCareerOverallAdvice(readings: PositionAwareReading[]): string {
  const reversedCount = readings.filter(r => r.isReversed).length;
  
  if (reversedCount === 0) {
    return '💼 เส้นทางอาชีพของคุณกำลังไปได้ดี พลังงานเชิงบวกล้อมรอบการทำงาน ' +
      'ใช้โอกาสนี้ให้เต็มที่ ก้าวหน้าอย่างมั่นใจ';
  } else if (reversedCount === 3) {
    return '🔍 ถึงเวลาทบทวนเส้นทางอาชีพอย่างจริงจัง อาจมีอุปสรรค แต่ทุกความท้าทายคือโอกาสในการเติบโต ' +
      'มองหาทางออกใหม่ๆ อย่ายึดติดกับแนวทางเดิม';
  } else {
    return '⚡ มีทั้งโอกาสและความท้าทายในเส้นทางอาชีพ ' +
      'ใช้จุดแข็งของคุณ และทำงานกับจุดที่ต้องพัฒนา ความสมดุลคือกุญแจ';
  }
}

// =============================================================================
// MAIN FUNCTIONS
// =============================================================================

/**
 * Generate complete love spread reading with position-aware interpretations
 */
export function generateLoveSpreadReading(
  drawnCards: DrawnCard[],
  question?: string
): SpreadReading {
  if (drawnCards.length !== 3) {
    throw new Error('Love spread requires exactly 3 cards');
  }

  const positions: Array<'you' | 'other' | 'relationship_energy'> = [
    'you', 'other', 'relationship_energy'
  ];

  const readings = drawnCards.map((card, index) =>
    generateLovePositionReading(card, positions[index])
  );

  return {
    spreadType: 'love',
    question,
    positions: readings,
    overallAdvice: generateLoveOverallAdvice(readings),
    createdAt: new Date(),
  };
}

/**
 * Generate complete career spread reading with position-aware interpretations
 */
export function generateCareerSpreadReading(
  drawnCards: DrawnCard[],
  question?: string
): SpreadReading {
  if (drawnCards.length !== 3) {
    throw new Error('Career spread requires exactly 3 cards');
  }

  const positions: Array<'current_situation' | 'challenge_opportunity' | 'outcome'> = [
    'current_situation', 'challenge_opportunity', 'outcome'
  ];

  const readings = drawnCards.map((card, index) =>
    generateCareerPositionReading(card, positions[index])
  );

  return {
    spreadType: 'career',
    question,
    positions: readings,
    overallAdvice: generateCareerOverallAdvice(readings),
    createdAt: new Date(),
  };
}

/**
 * Generate yes/no spread reading
 */
export function generateYesNoSpreadReading(
  drawnCard: DrawnCard,
  question: string
): SpreadReading {
  const reading = generateYesNoReading(drawnCard);

  return {
    spreadType: 'yes_no',
    question,
    positions: [reading],
    overallAdvice: reading.interpretation.actionAdvice,
    createdAt: new Date(),
  };
}
