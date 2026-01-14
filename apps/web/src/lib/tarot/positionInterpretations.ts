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
// CELTIC CROSS SPREAD POSITIONS (10 Cards)
// =============================================================================

export const CELTIC_CROSS_POSITIONS: Record<string, PositionContext> = {
  cc_present: {
    id: 'cc_present',
    name: 'Present Situation',
    nameTh: 'สถานการณ์ปัจจุบัน',
    description: 'The central card representing your current state, the heart of the matter',
    descriptionTh: 'ไพ่กลางที่แสดงสถานะปัจจุบันของคุณ หัวใจของเรื่อง',
    focusAreas: [
      'Your current circumstances',
      'The core issue',
      'Present energy',
      'Where you stand now',
      'The main theme',
    ],
    focusAreasTh: [
      'สถานการณ์ปัจจุบันของคุณ',
      'ประเด็นหลัก',
      'พลังงานปัจจุบัน',
      'ตำแหน่งที่คุณยืนอยู่ตอนนี้',
      'ธีมหลัก',
    ],
    interpretationGuide:
      'This is the central significator showing exactly where you are. ' +
      'It sets the tone for the entire reading. ' +
      'All other cards relate back to this central theme.',
    interpretationGuideTh:
      'นี่คือไพ่กลางที่แสดงตำแหน่งที่คุณอยู่อย่างแม่นยำ ' +
      'มันตั้งโทนสำหรับการอ่านทั้งหมด ' +
      'ไพ่อื่นๆ ทั้งหมดเชื่อมโยงกลับมาที่ธีมกลางนี้',
    exampleQuestions: [
      'What is my current situation?',
      'What is the core of this matter?',
      'What energy surrounds me now?',
    ],
    exampleQuestionsTh: [
      'สถานการณ์ปัจจุบันของฉันคืออะไร?',
      'แก่นของเรื่องนี้คืออะไร?',
      'พลังงานอะไรล้อมรอบฉันตอนนี้?',
    ],
  },

  cc_challenge: {
    id: 'cc_challenge',
    name: 'Challenge/Crossing',
    nameTh: 'อุปสรรค/ความท้าทาย',
    description: 'The immediate obstacle or challenge you face, crossing your path',
    descriptionTh: 'อุปสรรคเฉพาะหน้าหรือความท้าทายที่คุณเผชิญ ขวางเส้นทางของคุณ',
    focusAreas: [
      'Main obstacle',
      'What blocks you',
      'Conflicts or tensions',
      'Internal struggles',
      'External challenges',
    ],
    focusAreasTh: [
      'อุปสรรคหลัก',
      'สิ่งที่ขวางกั้นคุณ',
      'ความขัดแย้งหรือความตึงเครียด',
      'การต่อสู้ภายใน',
      'ความท้าทายภายนอก',
    ],
    interpretationGuide:
      'This card crosses the present situation, showing what opposes you. ' +
      'Even positive cards here indicate something to overcome. ' +
      'It may also reveal hidden strengths through adversity.',
    interpretationGuideTh:
      'ไพ่นี้ขวางสถานการณ์ปัจจุบัน แสดงสิ่งที่ต่อต้านคุณ ' +
      'แม้ไพ่เชิงบวกที่นี่ก็บ่งบอกสิ่งที่ต้องข้ามผ่าน ' +
      'อาจเผยจุดแข็งที่ซ่อนอยู่ผ่านความทุกข์ยาก',
    exampleQuestions: [
      'What is blocking my progress?',
      'What challenge must I face?',
      'What opposition am I dealing with?',
    ],
    exampleQuestionsTh: [
      'อะไรขวางกั้นความก้าวหน้าของฉัน?',
      'ความท้าทายอะไรที่ฉันต้องเผชิญ?',
      'ฉันกำลังรับมือกับการต่อต้านอะไร?',
    ],
  },

  cc_past: {
    id: 'cc_past',
    name: 'Foundation/Past',
    nameTh: 'รากฐาน/อดีต',
    description: 'The foundation of the situation, recent past events that led here',
    descriptionTh: 'รากฐานของสถานการณ์ เหตุการณ์ในอดีตที่นำมาสู่ปัจจุบัน',
    focusAreas: [
      'Past influences',
      'Root causes',
      'How you got here',
      'Past patterns',
      'Foundation of current situation',
    ],
    focusAreasTh: [
      'อิทธิพลจากอดีต',
      'สาเหตุที่แท้จริง',
      'คุณมาถึงจุดนี้ได้อย่างไร',
      'รูปแบบจากอดีต',
      'รากฐานของสถานการณ์ปัจจุบัน',
    ],
    interpretationGuide:
      'This position reveals the foundation upon which everything rests. ' +
      'It shows past events or patterns still influencing today. ' +
      'Understanding this helps explain the present.',
    interpretationGuideTh:
      'ตำแหน่งนี้เผยรากฐานที่ทุกอย่างตั้งอยู่ ' +
      'แสดงเหตุการณ์หรือรูปแบบในอดีตที่ยังคงมีอิทธิพลต่อวันนี้ ' +
      'การเข้าใจสิ่งนี้ช่วยอธิบายปัจจุบัน',
    exampleQuestions: [
      'What from my past affects this?',
      'What patterns am I repeating?',
      'How did this situation develop?',
    ],
    exampleQuestionsTh: [
      'อะไรจากอดีตของฉันส่งผลต่อสิ่งนี้?',
      'ฉันกำลังทำซ้ำรูปแบบอะไร?',
      'สถานการณ์นี้พัฒนามาอย่างไร?',
    ],
  },

  cc_future: {
    id: 'cc_future',
    name: 'Near Future',
    nameTh: 'อนาคตอันใกล้',
    description: 'What is coming in the near future, the next phase of this journey',
    descriptionTh: 'สิ่งที่กำลังจะมาในอนาคตอันใกล้ ระยะถัดไปของการเดินทางนี้',
    focusAreas: [
      'Upcoming events',
      'Short-term developments',
      'What to expect soon',
      'Immediate trajectory',
      'Near-future energy',
    ],
    focusAreasTh: [
      'เหตุการณ์ที่จะมาถึง',
      'พัฒนาการระยะสั้น',
      'สิ่งที่ควรคาดหวังในเร็วๆ นี้',
      'ทิศทางเฉพาะหน้า',
      'พลังงานอนาคตอันใกล้',
    ],
    interpretationGuide:
      'This card shows what is likely to happen soon. ' +
      'It represents the next phase, usually within weeks to months. ' +
      'This energy is approaching and can still be influenced.',
    interpretationGuideTh:
      'ไพ่นี้แสดงสิ่งที่น่าจะเกิดขึ้นเร็วๆ นี้ ' +
      'แสดงระยะถัดไป โดยปกติภายในสัปดาห์ถึงเดือน ' +
      'พลังงานนี้กำลังเข้ามาและยังสามารถเปลี่ยนแปลงได้',
    exampleQuestions: [
      'What is coming my way?',
      'What should I expect soon?',
      'What is the next phase?',
    ],
    exampleQuestionsTh: [
      'อะไรกำลังจะมาหาฉัน?',
      'ควรคาดหวังอะไรในเร็วๆ นี้?',
      'ระยะถัดไปคืออะไร?',
    ],
  },

  cc_above: {
    id: 'cc_above',
    name: 'Goals/Aspirations',
    nameTh: 'เป้าหมาย/ความปรารถนา',
    description: 'Your conscious goals, what you are striving for, your best possible outcome',
    descriptionTh: 'เป้าหมายที่รู้ตัว สิ่งที่คุณมุ่งมั่น ผลลัพธ์ที่ดีที่สุดที่เป็นไปได้',
    focusAreas: [
      'Conscious goals',
      'What you want',
      'Ideal outcome',
      'Your aspirations',
      'Best-case scenario',
    ],
    focusAreasTh: [
      'เป้าหมายที่รู้ตัว',
      'สิ่งที่คุณต้องการ',
      'ผลลัพธ์ในอุดมคติ',
      'ความปรารถนาของคุณ',
      'สถานการณ์ที่ดีที่สุด',
    ],
    interpretationGuide:
      'This position crowns the reading, showing your highest aspirations. ' +
      'It reveals what you are consciously working toward. ' +
      'Compare this with the outcome to see if your goals align with destiny.',
    interpretationGuideTh:
      'ตำแหน่งนี้ครอบการอ่าน แสดงความปรารถนาสูงสุดของคุณ ' +
      'เผยให้เห็นสิ่งที่คุณกำลังทำงานอย่างมีสติ ' +
      'เปรียบเทียบกับผลลัพธ์เพื่อดูว่าเป้าหมายสอดคล้องกับโชคชะตาหรือไม่',
    exampleQuestions: [
      'What am I truly striving for?',
      'What is my best possible outcome?',
      'What do I consciously want?',
    ],
    exampleQuestionsTh: [
      'ฉันกำลังมุ่งมั่นเพื่ออะไรจริงๆ?',
      'ผลลัพธ์ที่ดีที่สุดของฉันคืออะไร?',
      'ฉันต้องการอะไรอย่างมีสติ?',
    ],
  },

  cc_below: {
    id: 'cc_below',
    name: 'Subconscious',
    nameTh: 'จิตใต้สำนึก',
    description: 'Your subconscious influences, hidden factors, underlying feelings',
    descriptionTh: 'อิทธิพลจิตใต้สำนึก ปัจจัยที่ซ่อนอยู่ ความรู้สึกที่ซ่อนเร้น',
    focusAreas: [
      'Hidden influences',
      'Subconscious patterns',
      'Underlying feelings',
      'Deep desires',
      'What you are not aware of',
    ],
    focusAreasTh: [
      'อิทธิพลที่ซ่อนอยู่',
      'รูปแบบจิตใต้สำนึก',
      'ความรู้สึกที่ซ่อนเร้น',
      'ความปรารถนาลึกๆ',
      'สิ่งที่คุณไม่รู้ตัว',
    ],
    interpretationGuide:
      'This position reveals what lies beneath the surface. ' +
      'It shows subconscious drives and hidden influences. ' +
      'This may reveal what you truly want or fear.',
    interpretationGuideTh:
      'ตำแหน่งนี้เผยสิ่งที่อยู่ใต้พื้นผิว ' +
      'แสดงแรงขับจิตใต้สำนึกและอิทธิพลที่ซ่อนอยู่ ' +
      'อาจเผยสิ่งที่คุณต้องการหรือกลัวจริงๆ',
    exampleQuestions: [
      'What am I not seeing?',
      'What subconscious patterns affect me?',
      'What do I truly feel inside?',
    ],
    exampleQuestionsTh: [
      'อะไรที่ฉันไม่เห็น?',
      'รูปแบบจิตใต้สำนึกอะไรส่งผลต่อฉัน?',
      'ฉันรู้สึกอะไรจริงๆ ภายใน?',
    ],
  },

  cc_advice: {
    id: 'cc_advice',
    name: 'Advice',
    nameTh: 'คำแนะนำ',
    description: 'The guidance and advice for handling this situation',
    descriptionTh: 'คำแนะนำและแนวทางในการจัดการสถานการณ์นี้',
    focusAreas: [
      'Recommended approach',
      'What to do',
      'Attitude to adopt',
      'Best strategy',
      'How to proceed',
    ],
    focusAreasTh: [
      'แนวทางที่แนะนำ',
      'ควรทำอะไร',
      'ทัศนคติที่ควรมี',
      'กลยุทธ์ที่ดีที่สุด',
      'ดำเนินการอย่างไร',
    ],
    interpretationGuide:
      'This card offers direct guidance on how to approach the situation. ' +
      'It suggests the attitude or action most helpful now. ' +
      'Consider this the wisdom of the cards speaking to you.',
    interpretationGuideTh:
      'ไพ่นี้ให้คำแนะนำโดยตรงเกี่ยวกับวิธีจัดการสถานการณ์ ' +
      'แนะนำทัศนคติหรือการกระทำที่เป็นประโยชน์มากที่สุดตอนนี้ ' +
      'ถือว่านี่คือปัญญาของไพ่ที่พูดกับคุณ',
    exampleQuestions: [
      'What should I do?',
      'How should I approach this?',
      'What attitude serves me best?',
    ],
    exampleQuestionsTh: [
      'ฉันควรทำอะไร?',
      'ควรจัดการเรื่องนี้อย่างไร?',
      'ทัศนคติอะไรที่ดีที่สุดสำหรับฉัน?',
    ],
  },

  cc_external: {
    id: 'cc_external',
    name: 'External Influences',
    nameTh: 'อิทธิพลภายนอก',
    description: 'Outside influences, other people, environment affecting the situation',
    descriptionTh: 'อิทธิพลภายนอก คนอื่นๆ สภาพแวดล้อมที่ส่งผลต่อสถานการณ์',
    focusAreas: [
      'Other people involved',
      'Environmental factors',
      'External pressures',
      'Social influences',
      'Outside circumstances',
    ],
    focusAreasTh: [
      'คนอื่นที่เกี่ยวข้อง',
      'ปัจจัยด้านสภาพแวดล้อม',
      'แรงกดดันภายนอก',
      'อิทธิพลทางสังคม',
      'สถานการณ์ภายนอก',
    ],
    interpretationGuide:
      'This position shows external factors beyond your control. ' +
      'It may represent other people, environment, or circumstances. ' +
      'Understanding these helps you navigate them.',
    interpretationGuideTh:
      'ตำแหน่งนี้แสดงปัจจัยภายนอกที่อยู่นอกเหนือการควบคุมของคุณ ' +
      'อาจแสดงถึงคนอื่น สภาพแวดล้อม หรือสถานการณ์ ' +
      'การเข้าใจสิ่งเหล่านี้ช่วยให้คุณนำทางผ่านได้',
    exampleQuestions: [
      'How do others affect this?',
      'What external factors should I know?',
      'What is the environment like?',
    ],
    exampleQuestionsTh: [
      'คนอื่นส่งผลต่อสิ่งนี้อย่างไร?',
      'ปัจจัยภายนอกอะไรที่ควรรู้?',
      'สภาพแวดล้อมเป็นอย่างไร?',
    ],
  },

  cc_hopes_fears: {
    id: 'cc_hopes_fears',
    name: 'Hopes & Fears',
    nameTh: 'ความหวังและความกลัว',
    description: 'Your hopes and fears about the situation, often intertwined',
    descriptionTh: 'ความหวังและความกลัวของคุณเกี่ยวกับสถานการณ์ มักพันกัน',
    focusAreas: [
      'What you hope for',
      'What you fear',
      'Inner conflicts',
      'Dual nature of desire',
      'Psychological state',
    ],
    focusAreasTh: [
      'สิ่งที่คุณหวัง',
      'สิ่งที่คุณกลัว',
      'ความขัดแย้งภายใน',
      'ธรรมชาติสองด้านของความปรารถนา',
      'สถานะทางจิตใจ',
    ],
    interpretationGuide:
      'This position reveals the duality of human nature. ' +
      'Often what we hope for and fear are two sides of the same coin. ' +
      'A positive card may show hope; challenging card may show fear.',
    interpretationGuideTh:
      'ตำแหน่งนี้เผยความเป็นสองด้านของธรรมชาติมนุษย์ ' +
      'บ่อยครั้งสิ่งที่เราหวังและกลัวเป็นสองด้านของเหรียญเดียวกัน ' +
      'ไพ่เชิงบวกอาจแสดงความหวัง ไพ่ท้าทายอาจแสดงความกลัว',
    exampleQuestions: [
      'What do I hope/fear about this?',
      'What are my inner conflicts?',
      'What secretly drives my decisions?',
    ],
    exampleQuestionsTh: [
      'ฉันหวัง/กลัวอะไรเกี่ยวกับสิ่งนี้?',
      'ความขัดแย้งภายในของฉันคืออะไร?',
      'อะไรขับเคลื่อนการตัดสินใจของฉันอย่างลับๆ?',
    ],
  },

  cc_outcome: {
    id: 'cc_outcome',
    name: 'Final Outcome',
    nameTh: 'ผลลัพธ์สุดท้าย',
    description: 'The likely final outcome if all energies continue as they are',
    descriptionTh: 'ผลลัพธ์สุดท้ายที่น่าจะเป็นหากพลังงานทั้งหมดดำเนินต่อไปเช่นนี้',
    focusAreas: [
      'Final outcome',
      'Where this is heading',
      'Ultimate resolution',
      'Long-term result',
      'Destiny potential',
    ],
    focusAreasTh: [
      'ผลลัพธ์สุดท้าย',
      'สิ่งนี้กำลังมุ่งหน้าไปไหน',
      'การแก้ไขขั้นสุดท้าย',
      'ผลลัพธ์ระยะยาว',
      'ศักยภาพโชคชะตา',
    ],
    interpretationGuide:
      'This is the culmination of all the energies in the reading. ' +
      'It shows the most probable outcome if things continue. ' +
      'Remember: the querent can always change the outcome through action.',
    interpretationGuideTh:
      'นี่คือจุดสุดยอดของพลังงานทั้งหมดในการอ่าน ' +
      'แสดงผลลัพธ์ที่น่าจะเป็นที่สุดหากสิ่งต่างๆ ดำเนินต่อไป ' +
      'จำไว้: ผู้ถามสามารถเปลี่ยนผลลัพธ์ได้เสมอผ่านการกระทำ',
    exampleQuestions: [
      'Where is this ultimately heading?',
      'What is the final outcome?',
      'How will this resolve?',
    ],
    exampleQuestionsTh: [
      'สิ่งนี้กำลังมุ่งหน้าไปไหนในที่สุด?',
      'ผลลัพธ์สุดท้ายคืออะไร?',
      'สิ่งนี้จะคลี่คลายอย่างไร?',
    ],
  },
};

// =============================================================================
// DECISION MAKING SPREAD POSITIONS (5 Cards)
// =============================================================================

export const DECISION_MAKING_POSITIONS: Record<string, PositionContext> = {
  dm_option_a_pros: {
    id: 'dm_option_a_pros',
    name: 'Option A Pros',
    nameTh: 'ข้อดีของตัวเลือก A',
    description: 'The positive aspects, benefits, and advantages of choosing Option A',
    descriptionTh: 'แง่บวก ประโยชน์ และข้อได้เปรียบของการเลือกตัวเลือก A',
    focusAreas: [
      'Benefits of this choice',
      'Positive outcomes',
      'What you gain',
      'Strengths of this path',
      'Opportunities it opens',
    ],
    focusAreasTh: [
      'ประโยชน์ของตัวเลือกนี้',
      'ผลลัพธ์เชิงบวก',
      'สิ่งที่คุณได้รับ',
      'จุดแข็งของเส้นทางนี้',
      'โอกาสที่เปิดออก',
    ],
    interpretationGuide:
      'This card shows what works in favor of Option A. ' +
      'Even a challenging card here may reveal hidden advantages. ' +
      'Look for growth potential and positive energy.',
    interpretationGuideTh:
      'ไพ่นี้แสดงสิ่งที่เอื้อประโยชน์ต่อตัวเลือก A ' +
      'แม้ไพ่ท้าทายที่นี่อาจเผยข้อได้เปรียบที่ซ่อนอยู่ ' +
      'มองหาศักยภาพในการเติบโตและพลังงานเชิงบวก',
    exampleQuestions: [
      'What good comes from choosing this?',
      'What are the advantages?',
      'How does this benefit me?',
    ],
    exampleQuestionsTh: [
      'อะไรดีที่มาจากการเลือกนี้?',
      'ข้อได้เปรียบคืออะไร?',
      'สิ่งนี้เป็นประโยชน์ต่อฉันอย่างไร?',
    ],
  },

  dm_option_a_cons: {
    id: 'dm_option_a_cons',
    name: 'Option A Cons',
    nameTh: 'ข้อเสียของตัวเลือก A',
    description: 'The challenges, risks, and drawbacks of choosing Option A',
    descriptionTh: 'ความท้าทาย ความเสี่ยง และข้อเสียของการเลือกตัวเลือก A',
    focusAreas: [
      'Risks involved',
      'Potential problems',
      'What you might lose',
      'Challenges to overcome',
      'Hidden costs',
    ],
    focusAreasTh: [
      'ความเสี่ยงที่เกี่ยวข้อง',
      'ปัญหาที่อาจเกิดขึ้น',
      'สิ่งที่คุณอาจสูญเสีย',
      'ความท้าทายที่ต้องข้ามผ่าน',
      'ต้นทุนที่ซ่อนอยู่',
    ],
    interpretationGuide:
      'This card reveals what to watch out for with Option A. ' +
      'A positive card here may mean minor concerns. ' +
      'A challenging card signals significant obstacles.',
    interpretationGuideTh:
      'ไพ่นี้เผยสิ่งที่ต้องระวังกับตัวเลือก A ' +
      'ไพ่เชิงบวกที่นี่อาจหมายถึงข้อกังวลเล็กน้อย ' +
      'ไพ่ท้าทายบ่งบอกอุปสรรคสำคัญ',
    exampleQuestions: [
      'What are the risks?',
      'What could go wrong?',
      'What am I sacrificing?',
    ],
    exampleQuestionsTh: [
      'ความเสี่ยงคืออะไร?',
      'อะไรอาจผิดพลาดได้?',
      'ฉันกำลังเสียสละอะไร?',
    ],
  },

  dm_option_b_pros: {
    id: 'dm_option_b_pros',
    name: 'Option B Pros',
    nameTh: 'ข้อดีของตัวเลือก B',
    description: 'The positive aspects, benefits, and advantages of choosing Option B',
    descriptionTh: 'แง่บวก ประโยชน์ และข้อได้เปรียบของการเลือกตัวเลือก B',
    focusAreas: [
      'Benefits of this choice',
      'Positive outcomes',
      'What you gain',
      'Strengths of this path',
      'Opportunities it opens',
    ],
    focusAreasTh: [
      'ประโยชน์ของตัวเลือกนี้',
      'ผลลัพธ์เชิงบวก',
      'สิ่งที่คุณได้รับ',
      'จุดแข็งของเส้นทางนี้',
      'โอกาสที่เปิดออก',
    ],
    interpretationGuide:
      'This card shows what works in favor of Option B. ' +
      'Compare this with Option A pros to weigh advantages. ' +
      'Look for unique benefits this path offers.',
    interpretationGuideTh:
      'ไพ่นี้แสดงสิ่งที่เอื้อประโยชน์ต่อตัวเลือก B ' +
      'เปรียบเทียบกับข้อดีของตัวเลือก A เพื่อชั่งน้ำหนักข้อได้เปรียบ ' +
      'มองหาประโยชน์เฉพาะที่เส้นทางนี้มอบให้',
    exampleQuestions: [
      'What good comes from choosing this?',
      'What are the advantages?',
      'How does this benefit me?',
    ],
    exampleQuestionsTh: [
      'อะไรดีที่มาจากการเลือกนี้?',
      'ข้อได้เปรียบคืออะไร?',
      'สิ่งนี้เป็นประโยชน์ต่อฉันอย่างไร?',
    ],
  },

  dm_option_b_cons: {
    id: 'dm_option_b_cons',
    name: 'Option B Cons',
    nameTh: 'ข้อเสียของตัวเลือก B',
    description: 'The challenges, risks, and drawbacks of choosing Option B',
    descriptionTh: 'ความท้าทาย ความเสี่ยง และข้อเสียของการเลือกตัวเลือก B',
    focusAreas: [
      'Risks involved',
      'Potential problems',
      'What you might lose',
      'Challenges to overcome',
      'Hidden costs',
    ],
    focusAreasTh: [
      'ความเสี่ยงที่เกี่ยวข้อง',
      'ปัญหาที่อาจเกิดขึ้น',
      'สิ่งที่คุณอาจสูญเสีย',
      'ความท้าทายที่ต้องข้ามผ่าน',
      'ต้นทุนที่ซ่อนอยู่',
    ],
    interpretationGuide:
      'This card reveals what to watch out for with Option B. ' +
      'Compare with Option A cons to see which path has fewer obstacles. ' +
      'Consider if these challenges are manageable.',
    interpretationGuideTh:
      'ไพ่นี้เผยสิ่งที่ต้องระวังกับตัวเลือก B ' +
      'เปรียบเทียบกับข้อเสียของตัวเลือก A เพื่อดูว่าเส้นทางใดมีอุปสรรคน้อยกว่า ' +
      'พิจารณาว่าความท้าทายเหล่านี้จัดการได้หรือไม่',
    exampleQuestions: [
      'What are the risks?',
      'What could go wrong?',
      'What am I sacrificing?',
    ],
    exampleQuestionsTh: [
      'ความเสี่ยงคืออะไร?',
      'อะไรอาจผิดพลาดได้?',
      'ฉันกำลังเสียสละอะไร?',
    ],
  },

  dm_best_path: {
    id: 'dm_best_path',
    name: 'Best Path',
    nameTh: 'เส้นทางที่ดีที่สุด',
    description: 'The overall guidance and recommended direction for your decision',
    descriptionTh: 'คำแนะนำโดยรวมและทิศทางที่แนะนำสำหรับการตัดสินใจของคุณ',
    focusAreas: [
      'Overall recommendation',
      'Higher guidance',
      'What serves you best',
      'The wisest choice',
      'Long-term perspective',
    ],
    focusAreasTh: [
      'คำแนะนำโดยรวม',
      'การนำทางที่สูงกว่า',
      'สิ่งที่ดีที่สุดสำหรับคุณ',
      'ทางเลือกที่ฉลาดที่สุด',
      'มุมมองระยะยาว',
    ],
    interpretationGuide:
      'This card synthesizes the entire reading. ' +
      'It may point to one option, or suggest a third way. ' +
      'Consider this as wisdom from your higher self.',
    interpretationGuideTh:
      'ไพ่นี้สังเคราะห์การอ่านทั้งหมด ' +
      'อาจชี้ไปที่ตัวเลือกหนึ่ง หรือแนะนำทางที่สาม ' +
      'พิจารณานี่เป็นปัญญาจากตัวตนที่สูงกว่าของคุณ',
    exampleQuestions: [
      'Which path is best for me?',
      'What should I ultimately choose?',
      'What does my higher self advise?',
    ],
    exampleQuestionsTh: [
      'เส้นทางใดดีที่สุดสำหรับฉัน?',
      'ในที่สุดฉันควรเลือกอะไร?',
      'ตัวตนที่สูงกว่าของฉันแนะนำอะไร?',
    ],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get position context for a Decision Making spread position
 */
export function getDecisionMakingPositionContext(position: string): PositionContext | undefined {
  return DECISION_MAKING_POSITIONS[position];
}

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
 * Get position context for a Celtic Cross spread position
 */
export function getCelticCrossPositionContext(position: string): PositionContext | undefined {
  return CELTIC_CROSS_POSITIONS[position];
}

/**
 * Get all position contexts for a spread type
 */
export function getSpreadPositions(spreadType: 'love' | 'career' | 'yes_no' | 'celtic_cross' | 'decision_making'): PositionContext[] {
  switch (spreadType) {
    case 'love':
      return Object.values(LOVE_SPREAD_POSITIONS);
    case 'career':
      return Object.values(CAREER_SPREAD_POSITIONS);
    case 'yes_no':
      return [YES_NO_POSITION];
    case 'celtic_cross':
      return Object.values(CELTIC_CROSS_POSITIONS);
    case 'decision_making':
      return Object.values(DECISION_MAKING_POSITIONS);
    default:
      return [];
  }
}

/**
 * Generate position-aware interpretation prefix
 * Use this to contextualize card meanings based on position
 */
export function getPositionInterpretationPrefix(
  spreadType: 'love' | 'career' | 'yes_no' | 'celtic_cross' | 'decision_making',
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
  } else if (spreadType === 'celtic_cross') {
    context = CELTIC_CROSS_POSITIONS[position];
  } else if (spreadType === 'decision_making') {
    context = DECISION_MAKING_POSITIONS[position];
  }

  if (!context) return '';

  const reversedText = isReversed ? ' (ในลักษณะกลับหัว)' : '';

  return `ในตำแหน่ง "${context.nameTh}"${reversedText}: `;
}

