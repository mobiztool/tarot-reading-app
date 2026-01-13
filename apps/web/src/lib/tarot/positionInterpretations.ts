/**
 * Position-Specific Interpretations for Specialized Spreads
 * 
 * Provides context-aware guidance for each position in:
 * - Love & Relationships Spread (3 positions)
 * - Career & Money Spread (3 positions)
 * - Yes/No Spread (1 position with answer framework)
 */

// =============================================================================
// LOVE & RELATIONSHIPS SPREAD POSITIONS
// =============================================================================

export interface PositionContext {
  id: string;
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  focusAreas: string[];
  focusAreasTh: string[];
  interpretationGuide: string;
  interpretationGuideTh: string;
  exampleQuestions: string[];
  exampleQuestionsTh: string[];
}

export const LOVE_SPREAD_POSITIONS: Record<string, PositionContext> = {
  you: {
    id: 'you',
    name: 'You',
    nameTh: 'คุณ',
    description: 'Represents your current emotional state, desires, and energy in the relationship',
    descriptionTh: 'แสดงถึงสถานะอารมณ์ปัจจุบัน ความปรารถนา และพลังงานของคุณในความสัมพันธ์',
    focusAreas: [
      'Your emotional readiness',
      'What you bring to the relationship',
      'Your hidden desires',
      'Your fears and blocks',
      'Your love language',
    ],
    focusAreasTh: [
      'ความพร้อมทางอารมณ์ของคุณ',
      'สิ่งที่คุณนำมาสู่ความสัมพันธ์',
      'ความปรารถนาที่ซ่อนอยู่',
      'ความกลัวและอุปสรรคของคุณ',
      'ภาษารักของคุณ',
    ],
    interpretationGuide: 
      'When reading this position, focus on the querent\'s internal world. ' +
      'The card reveals what they truly feel, not just what they show. ' +
      'Look for patterns of self-sabotage or self-empowerment.',
    interpretationGuideTh:
      'เมื่ออ่านตำแหน่งนี้ ให้เน้นที่โลกภายในของผู้ถาม ' +
      'ไพ่เผยให้เห็นสิ่งที่พวกเขารู้สึกจริงๆ ไม่ใช่แค่สิ่งที่แสดงออก ' +
      'มองหารูปแบบการทำลายตัวเองหรือการเสริมพลังตัวเอง',
    exampleQuestions: [
      'How do I truly feel about this relationship?',
      'What am I contributing to this dynamic?',
      'What do I need to work on in myself?',
    ],
    exampleQuestionsTh: [
      'ฉันรู้สึกอย่างไรกับความสัมพันธ์นี้จริงๆ?',
      'ฉันมีส่วนร่วมอะไรบ้างกับพลวัตนี้?',
      'ฉันต้องปรับปรุงอะไรในตัวเอง?',
    ],
  },

  other: {
    id: 'other',
    name: 'The Other Person',
    nameTh: 'อีกฝ่าย',
    description: 'Represents your partner\'s or love interest\'s energy, feelings, and perspective',
    descriptionTh: 'แสดงถึงพลังงาน ความรู้สึก และมุมมองของคู่รักหรือคนที่คุณสนใจ',
    focusAreas: [
      'Their emotional state',
      'Their intentions',
      'Their perspective on you',
      'Their challenges in the relationship',
      'What they need from you',
    ],
    focusAreasTh: [
      'สถานะอารมณ์ของพวกเขา',
      'เจตนาของพวกเขา',
      'มุมมองที่มีต่อคุณ',
      'ความท้าทายของพวกเขาในความสัมพันธ์',
      'สิ่งที่พวกเขาต้องการจากคุณ',
    ],
    interpretationGuide:
      'This position offers insight into the other person\'s energy. ' +
      'Remember this is perception, not absolute truth. ' +
      'It shows their current state, which can change.',
    interpretationGuideTh:
      'ตำแหน่งนี้ให้ข้อมูลเชิงลึกเกี่ยวกับพลังงานของอีกฝ่าย ' +
      'จำไว้ว่านี่คือการรับรู้ ไม่ใช่ความจริงที่แน่นอน ' +
      'มันแสดงสถานะปัจจุบันของพวกเขา ซึ่งอาจเปลี่ยนแปลงได้',
    exampleQuestions: [
      'How does my partner feel about me?',
      'What are their intentions?',
      'What do they need from this relationship?',
    ],
    exampleQuestionsTh: [
      'คู่ของฉันรู้สึกอย่างไรกับฉัน?',
      'เจตนาของพวกเขาคืออะไร?',
      'พวกเขาต้องการอะไรจากความสัมพันธ์นี้?',
    ],
  },

  relationship_energy: {
    id: 'relationship_energy',
    name: 'Relationship Energy',
    nameTh: 'พลังงานความสัมพันธ์',
    description: 'The dynamic between you two - the energy of the connection itself',
    descriptionTh: 'พลวัตระหว่างคุณสองคน - พลังงานของความเชื่อมโยงนั้นเอง',
    focusAreas: [
      'The chemistry between you',
      'Challenges the relationship faces',
      'Growth potential',
      'What the relationship teaches',
      'Future trajectory',
    ],
    focusAreasTh: [
      'เคมีระหว่างคุณ',
      'ความท้าทายที่ความสัมพันธ์เผชิญ',
      'ศักยภาพในการเติบโต',
      'สิ่งที่ความสัมพันธ์สอน',
      'ทิศทางในอนาคต',
    ],
    interpretationGuide:
      'This position reveals the essence of the relationship itself, separate from the individuals. ' +
      'It shows what you create together. ' +
      'Look for lessons, karma, or destiny themes.',
    interpretationGuideTh:
      'ตำแหน่งนี้เผยให้เห็นแก่นแท้ของความสัมพันธ์ แยกจากบุคคลทั้งสอง ' +
      'มันแสดงสิ่งที่คุณสร้างร่วมกัน ' +
      'มองหาบทเรียน กรรม หรือธีมโชคชะตา',
    exampleQuestions: [
      'Where is this relationship heading?',
      'What is this relationship teaching us?',
      'What energy do we create together?',
    ],
    exampleQuestionsTh: [
      'ความสัมพันธ์นี้กำลังมุ่งหน้าไปไหน?',
      'ความสัมพันธ์นี้สอนอะไรเรา?',
      'เราสร้างพลังงานอะไรร่วมกัน?',
    ],
  },
};

// =============================================================================
// CAREER & MONEY SPREAD POSITIONS
// =============================================================================

export const CAREER_SPREAD_POSITIONS: Record<string, PositionContext> = {
  current_situation: {
    id: 'current_situation',
    name: 'Current Situation',
    nameTh: 'สถานการณ์ปัจจุบัน',
    description: 'Your present career or financial state, including hidden dynamics',
    descriptionTh: 'สถานะอาชีพหรือการเงินปัจจุบันของคุณ รวมถึงพลวัตที่ซ่อนอยู่',
    focusAreas: [
      'Your current position',
      'Work environment energy',
      'Financial health',
      'Hidden influences at work',
      'Your professional reputation',
    ],
    focusAreasTh: [
      'ตำแหน่งปัจจุบันของคุณ',
      'พลังงานสภาพแวดล้อมการทำงาน',
      'สุขภาพทางการเงิน',
      'อิทธิพลที่ซ่อนอยู่ในที่ทำงาน',
      'ชื่อเสียงทางอาชีพของคุณ',
    ],
    interpretationGuide:
      'This position provides a snapshot of where you stand professionally. ' +
      'It may reveal factors you haven\'t noticed. ' +
      'Look for both strengths and vulnerabilities.',
    interpretationGuideTh:
      'ตำแหน่งนี้ให้ภาพรวมของตำแหน่งที่คุณยืนอยู่ในอาชีพ ' +
      'อาจเผยให้เห็นปัจจัยที่คุณไม่ได้สังเกต ' +
      'มองหาทั้งจุดแข็งและจุดอ่อน',
    exampleQuestions: [
      'Where do I currently stand in my career?',
      'What is the true state of my finances?',
      'What energy surrounds my work?',
    ],
    exampleQuestionsTh: [
      'ตอนนี้ฉันอยู่ตรงไหนในอาชีพ?',
      'สถานะการเงินที่แท้จริงเป็นอย่างไร?',
      'พลังงานอะไรล้อมรอบการทำงานของฉัน?',
    ],
  },

  challenge_opportunity: {
    id: 'challenge_opportunity',
    name: 'Challenge & Opportunity',
    nameTh: 'อุปสรรคและโอกาส',
    description: 'Obstacles to overcome or opportunities to seize in your career path',
    descriptionTh: 'อุปสรรคที่ต้องข้ามผ่านหรือโอกาสที่ต้องคว้าในเส้นทางอาชีพ',
    focusAreas: [
      'Immediate obstacles',
      'Hidden opportunities',
      'Skills to develop',
      'Relationships to nurture',
      'Timing considerations',
    ],
    focusAreasTh: [
      'อุปสรรคเฉพาะหน้า',
      'โอกาสที่ซ่อนอยู่',
      'ทักษะที่ต้องพัฒนา',
      'ความสัมพันธ์ที่ต้องดูแล',
      'ข้อพิจารณาด้านเวลา',
    ],
    interpretationGuide:
      'This position is dual-natured. ' +
      'Every challenge contains an opportunity. ' +
      'A seemingly negative card can reveal growth potential when read properly.',
    interpretationGuideTh:
      'ตำแหน่งนี้มีธรรมชาติสองด้าน ' +
      'ทุกความท้าทายมีโอกาสซ่อนอยู่ ' +
      'ไพ่ที่ดูเชิงลบอาจเผยศักยภาพในการเติบโตเมื่ออ่านอย่างถูกต้อง',
    exampleQuestions: [
      'What obstacles am I facing?',
      'What opportunities should I watch for?',
      'What do I need to overcome to succeed?',
    ],
    exampleQuestionsTh: [
      'ฉันกำลังเผชิญอุปสรรคอะไร?',
      'โอกาสอะไรที่ควรระวัง?',
      'ฉันต้องข้ามผ่านอะไรเพื่อประสบความสำเร็จ?',
    ],
  },

  outcome: {
    id: 'outcome',
    name: 'Outcome',
    nameTh: 'ผลลัพธ์',
    description: 'The likely outcome if you continue on your current path',
    descriptionTh: 'ผลลัพธ์ที่เป็นไปได้หากคุณเดินบนเส้นทางปัจจุบันต่อไป',
    focusAreas: [
      'Probable outcome',
      'Timeline indicators',
      'What success looks like',
      'Warning signs',
      'Actions to take',
    ],
    focusAreasTh: [
      'ผลลัพธ์ที่น่าจะเป็น',
      'ตัวบ่งชี้ระยะเวลา',
      'ความสำเร็จหน้าตาเป็นอย่างไร',
      'สัญญาณเตือน',
      'การดำเนินการที่ควรทำ',
    ],
    interpretationGuide:
      'This position shows the trajectory, not fixed destiny. ' +
      'The querent can change the outcome through action. ' +
      'Emphasize free will while acknowledging likely patterns.',
    interpretationGuideTh:
      'ตำแหน่งนี้แสดงเส้นทาง ไม่ใช่โชคชะตาที่ตายตัว ' +
      'ผู้ถามสามารถเปลี่ยนผลลัพธ์ผ่านการกระทำ ' +
      'เน้นเจตจำนงเสรีขณะยอมรับรูปแบบที่น่าจะเป็น',
    exampleQuestions: [
      'Where is my career heading?',
      'What will happen if I take this job?',
      'How will my financial situation evolve?',
    ],
    exampleQuestionsTh: [
      'อาชีพของฉันกำลังมุ่งหน้าไปไหน?',
      'จะเกิดอะไรขึ้นถ้าฉันรับงานนี้?',
      'สถานการณ์การเงินจะพัฒนาไปอย่างไร?',
    ],
  },
};

// =============================================================================
// YES/NO SPREAD POSITION (Single Card with Answer Framework)
// =============================================================================

export interface YesNoPositionContext extends PositionContext {
  answerFramework: {
    yes: {
      indicators: string[];
      indicatorsTh: string[];
    };
    no: {
      indicators: string[];
      indicatorsTh: string[];
    };
    maybe: {
      indicators: string[];
      indicatorsTh: string[];
    };
  };
}

export const YES_NO_POSITION: YesNoPositionContext = {
  id: 'yes_no_answer',
  name: 'Yes/No Answer',
  nameTh: 'คำตอบใช่/ไม่',
  description: 'A single card drawn to answer a specific yes/no question with confidence level',
  descriptionTh: 'ไพ่ใบเดียวที่จั่วเพื่อตอบคำถามใช่/ไม่เฉพาะเจาะจงพร้อมระดับความมั่นใจ',
  focusAreas: [
    'Direct answer',
    'Confidence level',
    'Hidden factors',
    'Timing considerations',
    'Action advice',
  ],
  focusAreasTh: [
    'คำตอบโดยตรง',
    'ระดับความมั่นใจ',
    'ปัจจัยที่ซ่อนอยู่',
    'ข้อพิจารณาด้านเวลา',
    'คำแนะนำในการดำเนินการ',
  ],
  interpretationGuide:
    'For Yes/No readings, the card\'s energy determines the answer. ' +
    'Positive cards lean towards Yes, challenging cards towards No. ' +
    'Neutral or transformative cards often mean Maybe or "not yet".',
  interpretationGuideTh:
    'สำหรับการอ่าน Yes/No พลังงานของไพ่เป็นตัวกำหนดคำตอบ ' +
    'ไพ่เชิงบวกโน้มเอียงไปทาง ใช่ ไพ่ท้าทายไปทาง ไม่ ' +
    'ไพ่ที่เป็นกลางหรือเปลี่ยนแปลงมักหมายถึง อาจจะ หรือ "ยังไม่ถึงเวลา"',
  exampleQuestions: [
    'Should I accept this offer?',
    'Is this person right for me?',
    'Will I get the promotion?',
  ],
  exampleQuestionsTh: [
    'ควรรับข้อเสนอนี้ไหม?',
    'คนนี้เหมาะกับฉันไหม?',
    'ฉันจะได้เลื่อนตำแหน่งไหม?',
  ],
  answerFramework: {
    yes: {
      indicators: [
        'Card\'s energy is expansive, positive, or affirming',
        'Major Arcana cards of manifestation (Sun, Star, World)',
        'Aces and Pages (new beginnings)',
        'Cards of completion (10s) in positive context',
        'Upright cards with clear positive symbolism',
      ],
      indicatorsTh: [
        'พลังงานของไพ่ขยาย บวก หรือยืนยัน',
        'ไพ่ Major Arcana ของการปรากฏ (Sun, Star, World)',
        'เอซและ Pages (จุดเริ่มต้นใหม่)',
        'ไพ่แห่งความสำเร็จ (10) ในบริบทเชิงบวก',
        'ไพ่หงายที่มีสัญลักษณ์เชิงบวกชัดเจน',
      ],
    },
    no: {
      indicators: [
        'Card\'s energy is contracting, blocking, or warning',
        'Tower, Devil, 5 of Cups - clear caution',
        'Reversed cards with blocked energy',
        'Swords suit (often conflict)',
        'Cards showing delay or endings',
      ],
      indicatorsTh: [
        'พลังงานของไพ่หดตัว บล็อก หรือเตือน',
        'Tower, Devil, 5 of Cups - เตือนชัดเจน',
        'ไพ่กลับหัวที่มีพลังงานถูกบล็อก',
        'ชุดดาบ (มักเป็นความขัดแย้ง)',
        'ไพ่ที่แสดงความล่าช้าหรือการสิ้นสุด',
      ],
    },
    maybe: {
      indicators: [
        'Card suggests transformation or transition',
        'Death, Hanged Man, Wheel of Fortune - change is coming',
        'Moon - things are not clear yet',
        '2s (choice/balance needed)',
        'Hermit - more reflection required',
      ],
      indicatorsTh: [
        'ไพ่บ่งบอกการเปลี่ยนแปลงหรือการเปลี่ยนผ่าน',
        'Death, Hanged Man, Wheel of Fortune - การเปลี่ยนแปลงกำลังมา',
        'Moon - สิ่งต่างๆ ยังไม่ชัดเจน',
        'เลข 2 (ต้องเลือก/สมดุล)',
        'Hermit - ต้องไตร่ตรองเพิ่มเติม',
      ],
    },
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get position context for a love spread position
 */
export function getLovePositionContext(position: 'you' | 'other' | 'relationship_energy'): PositionContext {
  return LOVE_SPREAD_POSITIONS[position];
}

/**
 * Get position context for a career spread position
 */
export function getCareerPositionContext(position: 'current_situation' | 'challenge_opportunity' | 'outcome'): PositionContext {
  return CAREER_SPREAD_POSITIONS[position];
}

/**
 * Get yes/no position context
 */
export function getYesNoPositionContext(): YesNoPositionContext {
  return YES_NO_POSITION;
}

/**
 * Get all position contexts for a spread type
 */
export function getSpreadPositions(spreadType: 'love' | 'career' | 'yes_no'): PositionContext[] {
  switch (spreadType) {
    case 'love':
      return Object.values(LOVE_SPREAD_POSITIONS);
    case 'career':
      return Object.values(CAREER_SPREAD_POSITIONS);
    case 'yes_no':
      return [YES_NO_POSITION];
    default:
      return [];
  }
}

/**
 * Generate position-aware interpretation prefix
 * Use this to contextualize card meanings based on position
 */
export function getPositionInterpretationPrefix(
  spreadType: 'love' | 'career' | 'yes_no',
  position: string,
  isReversed: boolean
): string {
  let context: PositionContext | undefined;

  if (spreadType === 'love') {
    context = LOVE_SPREAD_POSITIONS[position];
  } else if (spreadType === 'career') {
    context = CAREER_SPREAD_POSITIONS[position];
  } else if (spreadType === 'yes_no') {
    context = YES_NO_POSITION;
  }

  if (!context) return '';

  const reversedText = isReversed ? ' (ในลักษณะกลับหัว)' : '';

  return `ในตำแหน่ง "${context.nameTh}"${reversedText}: `;
}

