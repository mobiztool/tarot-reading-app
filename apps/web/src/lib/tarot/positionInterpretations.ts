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
// SELF DISCOVERY SPREAD POSITIONS (5 Cards)
// =============================================================================

export const SELF_DISCOVERY_POSITIONS: Record<string, PositionContext> = {
  sd_core_self: {
    id: 'sd_core_self',
    name: 'Core Self',
    nameTh: 'ตัวตนแท้จริง',
    description: 'Your authentic essence - who you truly are beneath all roles and masks',
    descriptionTh: 'แก่นแท้ของคุณ - ตัวตนที่แท้จริงใต้บทบาทและหน้ากากทั้งหมด',
    focusAreas: [
      'Your authentic identity',
      'Core values and beliefs',
      'Essential nature',
      'What makes you unique',
      'Your spiritual essence',
    ],
    focusAreasTh: [
      'ตัวตนที่แท้จริงของคุณ',
      'ค่านิยมและความเชื่อหลัก',
      'ธรรมชาติที่แท้จริง',
      'สิ่งที่ทำให้คุณพิเศษ',
      'แก่นแท้ทางจิตวิญญาณ',
    ],
    interpretationGuide:
      'This is the heart of the reading, representing your true nature stripped of external influences. ' +
      'The card here reveals your innermost self - your authentic desires, natural inclinations, and core identity. ' +
      'This is who you are when no one is watching, your soul\'s blueprint. ' +
      'Understanding this position helps you align your life with your true purpose.',
    interpretationGuideTh:
      'นี่คือหัวใจของการอ่าน แสดงถึงธรรมชาติแท้จริงของคุณที่ปราศจากอิทธิพลภายนอก ' +
      'ไพ่ที่นี่เผยตัวตนลึกที่สุด - ความปรารถนาที่แท้จริง แนวโน้มตามธรรมชาติ และตัวตนหลัก ' +
      'นี่คือตัวคุณเมื่อไม่มีใครมองเห็น พิมพ์เขียวของจิตวิญญาณ ' +
      'การเข้าใจตำแหน่งนี้ช่วยให้คุณปรับชีวิตให้สอดคล้องกับเป้าหมายที่แท้จริง',
    exampleQuestions: [
      'Who am I at my core?',
      'What is my true nature?',
      'What defines my authentic self?',
    ],
    exampleQuestionsTh: [
      'ฉันเป็นใครในแก่นแท้?',
      'ธรรมชาติแท้จริงของฉันคืออะไร?',
      'อะไรกำหนดตัวตนที่แท้จริงของฉัน?',
    ],
  },

  sd_strengths: {
    id: 'sd_strengths',
    name: 'Your Strengths',
    nameTh: 'จุดแข็งของคุณ',
    description: 'Your natural gifts, talents, and innate abilities that empower you',
    descriptionTh: 'พรสวรรค์ ความสามารถตามธรรมชาติ และพลังที่ติดตัวคุณมา',
    focusAreas: [
      'Natural talents',
      'Developed skills',
      'Personality strengths',
      'Resources you possess',
      'What others admire in you',
    ],
    focusAreasTh: [
      'พรสวรรค์ตามธรรมชาติ',
      'ทักษะที่พัฒนาแล้ว',
      'จุดแข็งด้านบุคลิกภาพ',
      'ทรัพยากรที่คุณมี',
      'สิ่งที่ผู้อื่นชื่นชมในตัวคุณ',
    ],
    interpretationGuide:
      'This position illuminates the gifts you may take for granted. ' +
      'These are your superpowers - abilities that come naturally but are often overlooked. ' +
      'The card reveals resources you already possess to overcome challenges. ' +
      'Lean into these strengths when facing difficulties; they are your foundation for success.',
    interpretationGuideTh:
      'ตำแหน่งนี้ส่องสว่างพรสวรรค์ที่คุณอาจมองข้าม ' +
      'เหล่านี้คือพลังพิเศษของคุณ - ความสามารถที่มาตามธรรมชาติแต่มักถูกมองข้าม ' +
      'ไพ่เผยทรัพยากรที่คุณมีอยู่แล้วเพื่อเอาชนะความท้าทาย ' +
      'พึ่งพาจุดแข็งเหล่านี้เมื่อเผชิญความยากลำบาก พวกมันคือรากฐานแห่งความสำเร็จของคุณ',
    exampleQuestions: [
      'What are my greatest strengths?',
      'What gifts should I cultivate?',
      'What makes me powerful?',
    ],
    exampleQuestionsTh: [
      'จุดแข็งที่ยิ่งใหญ่ที่สุดของฉันคืออะไร?',
      'พรสวรรค์อะไรที่ควรพัฒนา?',
      'อะไรทำให้ฉันทรงพลัง?',
    ],
  },

  sd_challenges: {
    id: 'sd_challenges',
    name: 'Your Challenges',
    nameTh: 'ความท้าทายของคุณ',
    description: 'Areas of growth, patterns to break, and obstacles within yourself',
    descriptionTh: 'พื้นที่สำหรับการเติบโต รูปแบบที่ต้องทำลาย และอุปสรรคภายในตัวคุณ',
    focusAreas: [
      'Growth areas',
      'Self-limiting beliefs',
      'Patterns to break',
      'Inner obstacles',
      'Shadow aspects',
    ],
    focusAreasTh: [
      'พื้นที่สำหรับการเติบโต',
      'ความเชื่อที่จำกัดตัวเอง',
      'รูปแบบที่ต้องทำลาย',
      'อุปสรรคภายใน',
      'ด้านมืดที่ซ่อนอยู่',
    ],
    interpretationGuide:
      'This position reveals the internal blocks standing between you and your fullest self. ' +
      'These are not failures but opportunities for profound transformation. ' +
      'The card shows patterns you repeat unconsciously, beliefs that limit you, or fears that hold you back. ' +
      'Acknowledging these challenges is the first step toward healing and growth.',
    interpretationGuideTh:
      'ตำแหน่งนี้เผยสิ่งกีดขวางภายในที่ขวางกั้นระหว่างคุณกับตัวตนที่สมบูรณ์ที่สุด ' +
      'สิ่งเหล่านี้ไม่ใช่ความล้มเหลว แต่เป็นโอกาสสำหรับการเปลี่ยนแปลงอย่างลึกซึ้ง ' +
      'ไพ่แสดงรูปแบบที่คุณทำซ้ำโดยไม่รู้ตัว ความเชื่อที่จำกัดคุณ หรือความกลัวที่ยึดคุณไว้ ' +
      'การยอมรับความท้าทายเหล่านี้เป็นก้าวแรกสู่การเยียวยาและการเติบโต',
    exampleQuestions: [
      'What patterns hold me back?',
      'What within me needs healing?',
      'What challenges must I face?',
    ],
    exampleQuestionsTh: [
      'รูปแบบอะไรที่ยึดฉันไว้?',
      'อะไรในตัวฉันที่ต้องการการเยียวยา?',
      'ความท้าทายอะไรที่ฉันต้องเผชิญ?',
    ],
  },

  sd_hidden_potential: {
    id: 'sd_hidden_potential',
    name: 'Hidden Potential',
    nameTh: 'ศักยภาพที่ซ่อนอยู่',
    description: 'Untapped abilities and dormant gifts waiting to be awakened',
    descriptionTh: 'ความสามารถที่ยังไม่ได้ใช้และพรสวรรค์ที่หลับใหลรอการปลุก',
    focusAreas: [
      'Dormant talents',
      'Undeveloped aspects',
      'Future possibilities',
      'What you could become',
      'Sleeping powers',
    ],
    focusAreasTh: [
      'พรสวรรค์ที่หลับใหล',
      'ด้านที่ยังไม่พัฒนา',
      'ความเป็นไปได้ในอนาคต',
      'สิ่งที่คุณอาจกลายเป็น',
      'พลังที่ซ่อนเร้น',
    ],
    interpretationGuide:
      'This exciting position reveals the treasure within that you haven\'t yet discovered. ' +
      'It shows abilities and qualities that are waiting to emerge when the time is right. ' +
      'The card points to your unrealized potential - the person you are becoming. ' +
      'This is your future self calling you forward to embrace more of who you can be.',
    interpretationGuideTh:
      'ตำแหน่งที่น่าตื่นเต้นนี้เผยสมบัติภายในที่คุณยังไม่ได้ค้นพบ ' +
      'แสดงความสามารถและคุณสมบัติที่รอเวลาที่เหมาะสมจะปรากฏ ' +
      'ไพ่ชี้ไปที่ศักยภาพที่ยังไม่ได้ใช้ - ตัวตนที่คุณกำลังจะกลายเป็น ' +
      'นี่คือตัวตนในอนาคตที่เรียกคุณไปข้างหน้าเพื่อโอบรับความเป็นตัวคุณให้มากขึ้น',
    exampleQuestions: [
      'What potential lies dormant in me?',
      'What abilities am I not yet using?',
      'What could I become?',
    ],
    exampleQuestionsTh: [
      'ศักยภาพอะไรที่หลับใหลอยู่ในตัวฉัน?',
      'ความสามารถอะไรที่ฉันยังไม่ได้ใช้?',
      'ฉันอาจกลายเป็นอะไรได้บ้าง?',
    ],
  },

  sd_path_forward: {
    id: 'sd_path_forward',
    name: 'Path Forward',
    nameTh: 'เส้นทางข้างหน้า',
    description: 'Guidance for your personal growth journey and next steps',
    descriptionTh: 'คำแนะนำสำหรับการเดินทางเติบโตส่วนบุคคลและก้าวต่อไป',
    focusAreas: [
      'Recommended actions',
      'Growth direction',
      'Next steps',
      'How to integrate insights',
      'Practical guidance',
    ],
    focusAreasTh: [
      'การกระทำที่แนะนำ',
      'ทิศทางการเติบโต',
      'ก้าวต่อไป',
      'วิธีบูรณาการความเข้าใจ',
      'คำแนะนำเชิงปฏิบัติ',
    ],
    interpretationGuide:
      'This final position synthesizes the entire reading into actionable guidance. ' +
      'It shows the direction for your personal evolution and the next step on your journey. ' +
      'The card offers wisdom on how to apply the insights from this reading to your daily life. ' +
      'Consider this your compass pointing toward greater self-actualization and fulfillment.',
    interpretationGuideTh:
      'ตำแหน่งสุดท้ายนี้สังเคราะห์การอ่านทั้งหมดเป็นคำแนะนำที่ปฏิบัติได้ ' +
      'แสดงทิศทางสำหรับวิวัฒนาการส่วนบุคคลและก้าวต่อไปในการเดินทาง ' +
      'ไพ่ให้ปัญญาเกี่ยวกับวิธีนำความเข้าใจจากการอ่านนี้ไปใช้ในชีวิตประจำวัน ' +
      'ถือว่านี่คือเข็มทิศที่ชี้ไปสู่การบรรลุตนเองและความสมบูรณ์ที่ยิ่งใหญ่กว่า',
    exampleQuestions: [
      'What is my next step in growth?',
      'How should I move forward?',
      'What direction should I take?',
    ],
    exampleQuestionsTh: [
      'ก้าวต่อไปในการเติบโตของฉันคืออะไร?',
      'ฉันควรเดินหน้าอย่างไร?',
      'ฉันควรไปในทิศทางใด?',
    ],
  },
};

// =============================================================================
// RELATIONSHIP DEEP DIVE SPREAD POSITIONS (7 Cards)
// =============================================================================

export const RELATIONSHIP_DEEP_DIVE_POSITIONS: Record<string, PositionContext> = {
  rdd_you: {
    id: 'rdd_you',
    name: 'You in the Relationship',
    nameTh: 'คุณในความสัมพันธ์',
    description: 'Your energy, role, and contribution to this relationship dynamic',
    descriptionTh: 'พลังงาน บทบาท และการมีส่วนร่วมของคุณในพลวัตความสัมพันธ์นี้',
    focusAreas: [
      'Your emotional state',
      'What you bring',
      'Your expectations',
      'Your needs in the relationship',
      'How you show up',
    ],
    focusAreasTh: [
      'สถานะอารมณ์ของคุณ',
      'สิ่งที่คุณนำมา',
      'ความคาดหวังของคุณ',
      'ความต้องการของคุณในความสัมพันธ์',
      'คุณปรากฏตัวอย่างไร',
    ],
    interpretationGuide:
      'This position reveals your authentic presence in the relationship - not who you pretend to be, but who you truly are. ' +
      'The card shows your emotional investment, your patterns, and the energy you contribute to the dynamic. ' +
      'It may reveal both conscious and unconscious behaviors that affect your connection. ' +
      'Understanding this helps you see your role clearly and take responsibility for your part.',
    interpretationGuideTh:
      'ตำแหน่งนี้เผยการปรากฏตัวที่แท้จริงของคุณในความสัมพันธ์ - ไม่ใช่ที่คุณแกล้งทำ แต่ตัวตนที่แท้จริง ' +
      'ไพ่แสดงการลงทุนทางอารมณ์ รูปแบบของคุณ และพลังงานที่คุณมีส่วนร่วมกับพลวัต ' +
      'อาจเผยทั้งพฤติกรรมที่รู้ตัวและไม่รู้ตัวที่ส่งผลต่อการเชื่อมต่อ ' +
      'การเข้าใจสิ่งนี้ช่วยให้คุณเห็นบทบาทชัดเจนและรับผิดชอบต่อส่วนของคุณ',
    exampleQuestions: [
      'What energy do I bring to this relationship?',
      'How do I really show up for my partner?',
      'What is my role in this dynamic?',
    ],
    exampleQuestionsTh: [
      'ฉันนำพลังงานอะไรมาสู่ความสัมพันธ์นี้?',
      'ฉันปรากฏตัวต่อคู่รักอย่างไรจริงๆ?',
      'บทบาทของฉันในพลวัตนี้คืออะไร?',
    ],
  },

  rdd_them: {
    id: 'rdd_them',
    name: 'Them in the Relationship',
    nameTh: 'เขาในความสัมพันธ์',
    description: 'Your partner\'s energy, perspective, and what they bring to the dynamic',
    descriptionTh: 'พลังงาน มุมมอง และสิ่งที่คู่รักนำมาสู่พลวัตนี้',
    focusAreas: [
      'Their emotional state',
      'What they contribute',
      'Their perspective on you',
      'Their needs',
      'How they engage',
    ],
    focusAreasTh: [
      'สถานะอารมณ์ของพวกเขา',
      'สิ่งที่พวกเขามีส่วนร่วม',
      'มุมมองที่มีต่อคุณ',
      'ความต้องการของพวกเขา',
      'พวกเขามีส่วนร่วมอย่างไร',
    ],
    interpretationGuide:
      'This card offers insight into your partner\'s inner world and their experience of the relationship. ' +
      'Remember this is perception, not absolute truth - it shows their current energy and what they bring. ' +
      'The card may reveal their intentions, fears, hopes, or challenges in connecting with you. ' +
      'Use this understanding to develop empathy and improve communication.',
    interpretationGuideTh:
      'ไพ่นี้ให้ความเข้าใจเกี่ยวกับโลกภายในของคู่รักและประสบการณ์ในความสัมพันธ์ ' +
      'จำไว้ว่านี่คือการรับรู้ ไม่ใช่ความจริงที่แน่นอน - แสดงพลังงานปัจจุบันและสิ่งที่พวกเขานำมา ' +
      'ไพ่อาจเผยเจตนา ความกลัว ความหวัง หรือความท้าทายในการเชื่อมต่อกับคุณ ' +
      'ใช้ความเข้าใจนี้เพื่อพัฒนาความเห็นอกเห็นใจและปรับปรุงการสื่อสาร',
    exampleQuestions: [
      'What is my partner really feeling?',
      'What do they bring to our relationship?',
      'How do they experience our connection?',
    ],
    exampleQuestionsTh: [
      'คู่รักของฉันรู้สึกอะไรจริงๆ?',
      'พวกเขานำอะไรมาสู่ความสัมพันธ์?',
      'พวกเขาประสบการณ์การเชื่อมต่อของเราอย่างไร?',
    ],
  },

  rdd_connection: {
    id: 'rdd_connection',
    name: 'The Connection',
    nameTh: 'การเชื่อมต่อ',
    description: 'The bond between you - the relationship entity that you create together',
    descriptionTh: 'สายสัมพันธ์ระหว่างคุณ - ตัวตนของความสัมพันธ์ที่คุณสร้างร่วมกัน',
    focusAreas: [
      'Bond quality',
      'Relationship chemistry',
      'What you create together',
      'The nature of your union',
      'Karmic or spiritual connection',
    ],
    focusAreasTh: [
      'คุณภาพของสายสัมพันธ์',
      'เคมีของความสัมพันธ์',
      'สิ่งที่คุณสร้างร่วมกัน',
      'ธรรมชาติของการรวมกัน',
      'การเชื่อมต่อทางกรรมหรือจิตวิญญาณ',
    ],
    interpretationGuide:
      'This position reveals the third entity in any relationship - the bond itself, which is greater than either individual. ' +
      'The card shows the essence of what you create together, the invisible thread that connects you. ' +
      'It may reveal the purpose of this relationship, its lessons, or its destiny. ' +
      'Understanding this helps you appreciate what you have and what you are building.',
    interpretationGuideTh:
      'ตำแหน่งนี้เผยตัวตนที่สามในความสัมพันธ์ - สายสัมพันธ์เอง ซึ่งยิ่งใหญ่กว่าบุคคลใดบุคคลหนึ่ง ' +
      'ไพ่แสดงแก่นแท้ของสิ่งที่คุณสร้างร่วมกัน เส้นด้ายที่มองไม่เห็นที่เชื่อมต่อคุณ ' +
      'อาจเผยจุดประสงค์ของความสัมพันธ์นี้ บทเรียน หรือโชคชะตา ' +
      'การเข้าใจสิ่งนี้ช่วยให้คุณชื่นชมสิ่งที่มีและสิ่งที่กำลังสร้าง',
    exampleQuestions: [
      'What is the nature of our bond?',
      'What do we create together?',
      'What is our relationship meant to teach us?',
    ],
    exampleQuestionsTh: [
      'ธรรมชาติของสายสัมพันธ์ของเราคืออะไร?',
      'เราสร้างอะไรร่วมกัน?',
      'ความสัมพันธ์ของเราตั้งใจจะสอนอะไรเรา?',
    ],
  },

  rdd_your_feelings: {
    id: 'rdd_your_feelings',
    name: 'Your True Feelings',
    nameTh: 'ความรู้สึกแท้จริงของคุณ',
    description: 'Your deep, authentic emotions about this relationship - beyond surface feelings',
    descriptionTh: 'อารมณ์ที่ลึกและแท้จริงของคุณเกี่ยวกับความสัมพันธ์นี้ - เกินกว่าความรู้สึกผิวเผิน',
    focusAreas: [
      'Deep emotions',
      'Hidden feelings',
      'What you truly want',
      'Unspoken desires',
      'Authentic emotional state',
    ],
    focusAreasTh: [
      'อารมณ์ที่ลึก',
      'ความรู้สึกที่ซ่อนอยู่',
      'สิ่งที่คุณต้องการจริงๆ',
      'ความปรารถนาที่ไม่ได้พูด',
      'สถานะอารมณ์ที่แท้จริง',
    ],
    interpretationGuide:
      'This position dives beneath the surface to reveal feelings you may not fully acknowledge, even to yourself. ' +
      'The card shows your genuine emotional truth - desires, fears, loves, and frustrations you may suppress. ' +
      'Understanding your authentic feelings is essential for relationship honesty. ' +
      'This insight helps you communicate your needs and make conscious choices.',
    interpretationGuideTh:
      'ตำแหน่งนี้ดำดิ่งใต้พื้นผิวเพื่อเผยความรู้สึกที่คุณอาจไม่ยอมรับอย่างเต็มที่ แม้กับตัวเอง ' +
      'ไพ่แสดงความจริงทางอารมณ์ของคุณ - ความปรารถนา ความกลัว ความรัก และความหงุดหงิดที่คุณอาจกดไว้ ' +
      'การเข้าใจความรู้สึกที่แท้จริงเป็นสิ่งจำเป็นสำหรับความซื่อสัตย์ในความสัมพันธ์ ' +
      'ความเข้าใจนี้ช่วยให้คุณสื่อสารความต้องการและตัดสินใจอย่างมีสติ',
    exampleQuestions: [
      'What do I really feel about this relationship?',
      'What am I not admitting to myself?',
      'What does my heart truly want?',
    ],
    exampleQuestionsTh: [
      'ฉันรู้สึกอะไรจริงๆ เกี่ยวกับความสัมพันธ์นี้?',
      'อะไรที่ฉันไม่ยอมรับกับตัวเอง?',
      'หัวใจของฉันต้องการอะไรจริงๆ?',
    ],
  },

  rdd_their_feelings: {
    id: 'rdd_their_feelings',
    name: 'Their True Feelings',
    nameTh: 'ความรู้สึกแท้จริงของเขา',
    description: 'Your partner\'s genuine emotions about you and the relationship',
    descriptionTh: 'อารมณ์ที่แท้จริงของคู่รักเกี่ยวกับคุณและความสัมพันธ์',
    focusAreas: [
      'Their deep feelings',
      'Hidden emotions',
      'Their true desires',
      'Unexpressed sentiments',
      'Authentic emotional investment',
    ],
    focusAreasTh: [
      'ความรู้สึกลึกๆ ของพวกเขา',
      'อารมณ์ที่ซ่อนอยู่',
      'ความปรารถนาที่แท้จริง',
      'ความรู้สึกที่ไม่ได้แสดงออก',
      'การลงทุนทางอารมณ์ที่แท้จริง',
    ],
    interpretationGuide:
      'This card offers a glimpse into your partner\'s authentic emotional world regarding you and the relationship. ' +
      'It reveals feelings they may not express openly - whether love, doubt, longing, or fear. ' +
      'Remember, this is intuitive insight, not mind-reading; use it to foster understanding, not assumptions. ' +
      'This knowledge can help you respond to their unspoken needs with compassion.',
    interpretationGuideTh:
      'ไพ่นี้ให้ภาพของโลกอารมณ์ที่แท้จริงของคู่รักเกี่ยวกับคุณและความสัมพันธ์ ' +
      'เผยความรู้สึกที่พวกเขาอาจไม่แสดงออกอย่างเปิดเผย - ไม่ว่าจะเป็นความรัก ความสงสัย ความปรารถนา หรือความกลัว ' +
      'จำไว้ นี่คือความเข้าใจโดยสัญชาตญาณ ไม่ใช่การอ่านใจ ใช้เพื่อส่งเสริมความเข้าใจ ไม่ใช่สมมติฐาน ' +
      'ความรู้นี้สามารถช่วยให้คุณตอบสนองต่อความต้องการที่ไม่ได้พูดด้วยความเห็นอกเห็นใจ',
    exampleQuestions: [
      'How does my partner truly feel about me?',
      'What are they not saying?',
      'What does their heart want?',
    ],
    exampleQuestionsTh: [
      'คู่รักของฉันรู้สึกอะไรจริงๆ เกี่ยวกับฉัน?',
      'อะไรที่พวกเขาไม่ได้พูด?',
      'หัวใจของพวกเขาต้องการอะไร?',
    ],
  },

  rdd_challenges: {
    id: 'rdd_challenges',
    name: 'Relationship Challenges',
    nameTh: 'ความท้าทายในความสัมพันธ์',
    description: 'The obstacles, tensions, and growth areas in your relationship',
    descriptionTh: 'อุปสรรค ความตึงเครียด และพื้นที่สำหรับการเติบโตในความสัมพันธ์',
    focusAreas: [
      'Areas of conflict',
      'Recurring issues',
      'Growth opportunities',
      'What needs attention',
      'Patterns to transform',
    ],
    focusAreasTh: [
      'พื้นที่ของความขัดแย้ง',
      'ปัญหาที่เกิดซ้ำ',
      'โอกาสในการเติบโต',
      'สิ่งที่ต้องการความสนใจ',
      'รูปแบบที่ต้องเปลี่ยน',
    ],
    interpretationGuide:
      'Every relationship has challenges - this position illuminates yours with compassion, not judgment. ' +
      'The card reveals the areas where work is needed: communication blocks, trust issues, unmet needs, or recurring conflicts. ' +
      'View these not as problems but as invitations for deeper intimacy and growth. ' +
      'Addressing these challenges together can strengthen your bond significantly.',
    interpretationGuideTh:
      'ทุกความสัมพันธ์มีความท้าทาย - ตำแหน่งนี้ส่องสว่างของคุณด้วยความเห็นอกเห็นใจ ไม่ใช่การตัดสิน ' +
      'ไพ่เผยพื้นที่ที่ต้องการการทำงาน: อุปสรรคในการสื่อสาร ปัญหาความไว้วางใจ ความต้องการที่ไม่ได้รับการตอบสนอง หรือความขัดแย้งที่เกิดซ้ำ ' +
      'มองสิ่งเหล่านี้ไม่ใช่ปัญหา แต่เป็นคำเชิญสู่ความใกล้ชิดและการเติบโตที่ลึกซึ้งยิ่งขึ้น ' +
      'การจัดการความท้าทายเหล่านี้ร่วมกันสามารถเสริมสายสัมพันธ์ได้อย่างมาก',
    exampleQuestions: [
      'What challenges do we need to address?',
      'Where is our relationship struggling?',
      'What patterns need to change?',
    ],
    exampleQuestionsTh: [
      'ความท้าทายอะไรที่เราต้องจัดการ?',
      'ความสัมพันธ์ของเราดิ้นรนที่ไหน?',
      'รูปแบบอะไรที่ต้องเปลี่ยน?',
    ],
  },

  rdd_future_potential: {
    id: 'rdd_future_potential',
    name: 'Future Potential',
    nameTh: 'ศักยภาพในอนาคต',
    description: 'The possible future and where this relationship could go',
    descriptionTh: 'อนาคตที่เป็นไปได้และทิศทางที่ความสัมพันธ์นี้อาจไป',
    focusAreas: [
      'Future trajectory',
      'Relationship potential',
      'What could develop',
      'Long-term possibilities',
      'Outcome if you continue',
    ],
    focusAreasTh: [
      'ทิศทางในอนาคต',
      'ศักยภาพความสัมพันธ์',
      'สิ่งที่อาจพัฒนา',
      'ความเป็นไปได้ระยะยาว',
      'ผลลัพธ์หากดำเนินต่อไป',
    ],
    interpretationGuide:
      'This culminating position reveals where your relationship is heading if current energies continue. ' +
      'The card shows the potential you are building together - whether that is deep commitment, necessary separation, or continued growth. ' +
      'Remember, the future is not fixed; this is the probable trajectory based on present circumstances. ' +
      'Use this insight to consciously co-create the future you both desire.',
    interpretationGuideTh:
      'ตำแหน่งสุดท้ายนี้เผยว่าความสัมพันธ์กำลังมุ่งหน้าไปไหนหากพลังงานปัจจุบันดำเนินต่อไป ' +
      'ไพ่แสดงศักยภาพที่คุณกำลังสร้างร่วมกัน - ไม่ว่าจะเป็นความมุ่งมั่นลึกซึ้ง การแยกทางที่จำเป็น หรือการเติบโตต่อเนื่อง ' +
      'จำไว้ อนาคตไม่ได้ถูกกำหนดตายตัว นี่คือทิศทางที่น่าจะเป็นตามสถานการณ์ปัจจุบัน ' +
      'ใช้ความเข้าใจนี้เพื่อร่วมสร้างอนาคตที่คุณทั้งคู่ปรารถนาอย่างมีสติ',
    exampleQuestions: [
      'Where is our relationship heading?',
      'What is the potential of this union?',
      'What future are we building together?',
    ],
    exampleQuestionsTh: [
      'ความสัมพันธ์ของเรากำลังมุ่งหน้าไปไหน?',
      'ศักยภาพของการรวมกันนี้คืออะไร?',
      'อนาคตอะไรที่เรากำลังสร้างร่วมกัน?',
    ],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get position context for a Self Discovery spread position
 */
export function getSelfDiscoveryPositionContext(position: string): PositionContext | undefined {
  return SELF_DISCOVERY_POSITIONS[position];
}

/**
 * Get position context for a Relationship Deep Dive spread position
 */
export function getRelationshipDeepDivePositionContext(position: string): PositionContext | undefined {
  return RELATIONSHIP_DEEP_DIVE_POSITIONS[position];
}

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
export function getSpreadPositions(spreadType: 'love' | 'career' | 'yes_no' | 'celtic_cross' | 'decision_making' | 'self_discovery' | 'relationship_deep_dive'): PositionContext[] {
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
    case 'self_discovery':
      return Object.values(SELF_DISCOVERY_POSITIONS);
    case 'relationship_deep_dive':
      return Object.values(RELATIONSHIP_DEEP_DIVE_POSITIONS);
    default:
      return [];
  }
}

/**
 * Generate position-aware interpretation prefix
 * Use this to contextualize card meanings based on position
 */
export function getPositionInterpretationPrefix(
  spreadType: 'love' | 'career' | 'yes_no' | 'celtic_cross' | 'decision_making' | 'self_discovery' | 'relationship_deep_dive',
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
  } else if (spreadType === 'self_discovery') {
    context = SELF_DISCOVERY_POSITIONS[position];
  } else if (spreadType === 'relationship_deep_dive') {
    context = RELATIONSHIP_DEEP_DIVE_POSITIONS[position];
  }

  if (!context) return '';

  const reversedText = isReversed ? ' (ในลักษณะกลับหัว)' : '';

  return `ในตำแหน่ง "${context.nameTh}"${reversedText}: `;
}

