import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate card data
const generateMinorArcanaCard = (
  suit: string,
  suitThai: string,
  number: number,
  element: string
) => {
  const cardNames: Record<number, { en: string; th: string }> = {
    1: { en: 'Ace', th: 'เอซ' },
    11: { en: 'Page', th: 'พลทหาร' },
    12: { en: 'Knight', th: 'อัศวิน' },
    13: { en: 'Queen', th: 'ราชินี' },
    14: { en: 'King', th: 'กษัตริย์' },
  };

  const name =
    number <= 10
      ? `${number === 1 ? cardNames[1].en : number} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`
      : `${cardNames[number].en} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`;

  const nameTh =
    number <= 10
      ? `${number === 1 ? cardNames[1].th : number}${suitThai}`
      : `${cardNames[number].th}${suitThai}`;

  const slug = name.toLowerCase().replace(/ /g, '-');

  return {
    number,
    name,
    name_th: nameTh,
    suit,
    arcana: 'minor',
    slug,
    image_url: `/cards/${suit}/${slug}.webp`,
    meaning_upright: `ความหมายของ${nameTh}หงายขึ้น - พลังงานของ${suitThai}ระดับ${number}`,
    meaning_reversed: `ความหมายของ${nameTh}กลับหัว - พลังงานของ${suitThai}ที่ถูกบล็อก`,
    keywords_upright: [`${suitThai}`, 'เริ่มต้น', 'พลังงาน', 'ความก้าวหน้า'],
    keywords_reversed: [`${suitThai}บล็อก`, 'ความล่าช้า', 'ปัญหา'],
    symbolism: `${name} symbolism to be detailed`,
    advice: `คำแนะนำสำหรับ${nameTh}`,
    element,
  };
};

async function main(): Promise<void> {
  console.log('🌟 Starting database seed with 78 Tarot cards...\n');

  // Full 78 cards will be generated - this is intensive so showing structure
  console.log('Generating all 78 tarot cards with Thai meanings...\n');

  const allCards = [];

  // MAJOR ARCANA - All 22 cards
  const majorArcanaData = [
    { number: 0, name: 'The Fool', nameTh: 'คนบ้า', keywords: ['เริ่มต้น', 'ผจญภัย', 'ศักยภาพ'] },
    {
      number: 1,
      name: 'The Magician',
      nameTh: 'นักมายากล',
      keywords: ['พลัง', 'ทักษะ', 'สร้างสรรค์'],
    },
    {
      number: 2,
      name: 'The High Priestess',
      nameTh: 'นักพรตหญิง',
      keywords: ['สัญชาตญาณ', 'ความลึกลับ', 'ภูมิปัญญา'],
    },
    {
      number: 3,
      name: 'The Empress',
      nameTh: 'จักรพรรดินี',
      keywords: ['อุดมสมบูรณ์', 'เลี้ยงดู', 'ธรรมชาติ'],
    },
    {
      number: 4,
      name: 'The Emperor',
      nameTh: 'จักรพรรดิ',
      keywords: ['อำนาจ', 'โครงสร้าง', 'ผู้นำ'],
    },
    {
      number: 5,
      name: 'The Hierophant',
      nameTh: 'พระสันตะปาปา',
      keywords: ['ประเพณี', 'ความเชื่อ', 'การศึกษา'],
    },
    {
      number: 6,
      name: 'The Lovers',
      nameTh: 'คนรัก',
      keywords: ['ความรัก', 'ทางเลือก', 'ความสามัคคี'],
    },
    { number: 7, name: 'The Chariot', nameTh: 'รถรบ', keywords: ['ชัยชนะ', 'ควบคุม', 'มุ่งมั่น'] },
    {
      number: 8,
      name: 'Strength',
      nameTh: 'ความเข้มแข็ง',
      keywords: ['แข็งแกร่ง', 'อดทน', 'เมตตา'],
    },
    {
      number: 9,
      name: 'The Hermit',
      nameTh: 'ฤาษี',
      keywords: ['ค้นหาภายใน', 'ภูมิปัญญา', 'สะท้อนคิด'],
    },
    {
      number: 10,
      name: 'Wheel of Fortune',
      nameTh: 'กงล้อแห่งโชคชะตา',
      keywords: ['วัฏจักร', 'โชคชะตา', 'เปลี่ยนแปลง'],
    },
    {
      number: 11,
      name: 'Justice',
      nameTh: 'ความยุติธรรม',
      keywords: ['ยุติธรรม', 'สมดุล', 'ความจริง'],
    },
    {
      number: 12,
      name: 'The Hanged Man',
      nameTh: 'คนแขวนคอ',
      keywords: ['ยอมจำนน', 'มุมมองใหม่', 'ปล่อยวาง'],
    },
    {
      number: 13,
      name: 'Death',
      nameTh: 'ความตาย',
      keywords: ['เปลี่ยนแปลง', 'สิ้นสุด', 'เริ่มต้นใหม่'],
    },
    {
      number: 14,
      name: 'Temperance',
      nameTh: 'ความพอประมาณ',
      keywords: ['สมดุล', 'พอประมาณ', 'ประสานกัน'],
    },
    {
      number: 15,
      name: 'The Devil',
      nameTh: 'ปีศาจ',
      keywords: ['ถูกผูกมัด', 'หมกมุ่น', 'ข้อจำกัด'],
    },
    {
      number: 16,
      name: 'The Tower',
      nameTh: 'หอคอย',
      keywords: ['พังทลาย', 'เปลี่ยนแปลงกะทันหัน', 'วิกฤต'],
    },
    {
      number: 17,
      name: 'The Star',
      nameTh: 'ดวงดาว',
      keywords: ['ความหวัง', 'เยียวยา', 'แรงบันดาลใจ'],
    },
    {
      number: 18,
      name: 'The Moon',
      nameTh: 'ดวงจันทร์',
      keywords: ['ภาพลวงตา', 'ความกลัว', 'จิตใต้สำนึก'],
    },
    {
      number: 19,
      name: 'The Sun',
      nameTh: 'ดวงอาทิตย์',
      keywords: ['ความสุข', 'สำเร็จ', 'เฉลิมฉลอง'],
    },
    {
      number: 20,
      name: 'Judgement',
      nameTh: 'การพิพากษา',
      keywords: ['ฟื้นคืนชีพ', 'ตัดสิน', 'ระดับใหม่'],
    },
    { number: 21, name: 'The World', nameTh: 'โลก', keywords: ['สมบูรณ์', 'สำเร็จ', 'บรรลุ'] },
  ];

  // Generate all 78 cards
  for (const data of majorArcanaData) {
    const card = {
      number: data.number,
      name: data.name,
      name_th: data.nameTh,
      suit: 'major_arcana',
      arcana: 'major',
      slug: data.name.toLowerCase().replace(/ /g, '-'),
      image_url: `/cards/major/${String(data.number).padStart(2, '0')}-${data.name.toLowerCase().replace(/ /g, '-')}.webp`,
      meaning_upright: `${data.nameTh} แสดงถึง${data.keywords.join(' ')} นี่คือไพ่แห่งพลังงานบวกที่เกี่ยวข้องกับ${data.keywords[0]}และการเติบโตส่วนบุคคล`,
      meaning_reversed: `${data.nameTh}กลับหัว บ่งบอกถึงพลังงานของ${data.keywords[0]}ที่ถูกบล็อกหรือใช้ในทางที่ไม่สมดุล ต้องระวังและหาทางแก้ไข`,
      keywords_upright: data.keywords,
      keywords_reversed: data.keywords.map((k) => k + 'ผิดทาง'),
      symbolism: `${data.name} represents ${data.keywords.join(', ')}`,
      advice: `ใช้พลังของ${data.nameTh}ในทางที่ถูกต้อง มีสติและความสมดุล`,
      element: null,
    };
    allCards.push(card);
  }

  // MINOR ARCANA - All 56 cards (4 suits × 14 cards)
  const suits = [
    { suit: 'wands', thai: 'ไม้', element: 'fire' },
    { suit: 'cups', thai: 'ถ้วย', element: 'water' },
    { suit: 'swords', thai: 'ดาบ', element: 'air' },
    { suit: 'pentacles', thai: 'เหรียญ', element: 'earth' },
  ];

  for (const { suit, thai, element } of suits) {
    for (let num = 1; num <= 14; num++) {
      const card = generateMinorArcanaCard(suit, thai, num, element);
      allCards.push(card);
    }
  }

  console.log(`📊 Total cards to seed: ${allCards.length}`);
  console.log('💾 Seeding all cards to database...\n');

  for (const card of allCards) {
    await prisma.card.upsert({
      where: { slug: card.slug },
      update: card as never,
      create: card as never,
    });
  }

  const totalCards = await prisma.card.count();
  console.log(`\n✅ Total cards in database: ${totalCards}/78`);

  // ============================================================================
  // POSITION CONTEXTS (Story 5.6 - Login Tier Content)
  // ============================================================================
  console.log('\n📍 Seeding position contexts for specialized spreads...');

  const positionContexts = [
    // LOVE SPREAD POSITIONS
    {
      position_label: 'you',
      spread_type: 'love_relationships',
      name: 'You',
      name_th: 'คุณ',
      description: "Represents your current emotional state, desires, and energy in the relationship",
      description_th: 'แสดงถึงสถานะอารมณ์ปัจจุบัน ความปรารถนา และพลังงานของคุณในความสัมพันธ์',
      focus_areas: [
        'Your emotional readiness',
        'What you bring to the relationship',
        'Your hidden desires',
        'Your fears and blocks',
        'Your love language',
      ],
      focus_areas_th: [
        'ความพร้อมทางอารมณ์ของคุณ',
        'สิ่งที่คุณนำมาสู่ความสัมพันธ์',
        'ความปรารถนาที่ซ่อนอยู่',
        'ความกลัวและอุปสรรคของคุณ',
        'ภาษารักของคุณ',
      ],
      interpretation_guide: "When reading this position, focus on the querent's internal world. The card reveals what they truly feel, not just what they show.",
      interpretation_guide_th: 'เมื่ออ่านตำแหน่งนี้ ให้เน้นที่โลกภายในของผู้ถาม ไพ่เผยให้เห็นสิ่งที่พวกเขารู้สึกจริงๆ ไม่ใช่แค่สิ่งที่แสดงออก',
      example_questions: [
        'How do I truly feel about this relationship?',
        'What am I contributing to this dynamic?',
        'What do I need to work on in myself?',
      ],
      example_questions_th: [
        'ฉันรู้สึกอย่างไรกับความสัมพันธ์นี้จริงๆ?',
        'ฉันมีส่วนร่วมอะไรบ้างกับพลวัตนี้?',
        'ฉันต้องปรับปรุงอะไรในตัวเอง?',
      ],
    },
    {
      position_label: 'other',
      spread_type: 'love_relationships',
      name: 'The Other Person',
      name_th: 'อีกฝ่าย',
      description: "Represents your partner's or love interest's energy, feelings, and perspective",
      description_th: 'แสดงถึงพลังงาน ความรู้สึก และมุมมองของคู่รักหรือคนที่คุณสนใจ',
      focus_areas: [
        'Their emotional state',
        'Their intentions',
        'Their perspective on you',
        'Their challenges in the relationship',
        'What they need from you',
      ],
      focus_areas_th: [
        'สถานะอารมณ์ของพวกเขา',
        'เจตนาของพวกเขา',
        'มุมมองที่มีต่อคุณ',
        'ความท้าทายของพวกเขาในความสัมพันธ์',
        'สิ่งที่พวกเขาต้องการจากคุณ',
      ],
      interpretation_guide: "This position offers insight into the other person's energy. Remember this is perception, not absolute truth.",
      interpretation_guide_th: 'ตำแหน่งนี้ให้ข้อมูลเชิงลึกเกี่ยวกับพลังงานของอีกฝ่าย จำไว้ว่านี่คือการรับรู้ ไม่ใช่ความจริงที่แน่นอน',
      example_questions: [
        'How does my partner feel about me?',
        'What are their intentions?',
        'What do they need from this relationship?',
      ],
      example_questions_th: [
        'คู่ของฉันรู้สึกอย่างไรกับฉัน?',
        'เจตนาของพวกเขาคืออะไร?',
        'พวกเขาต้องการอะไรจากความสัมพันธ์นี้?',
      ],
    },
    {
      position_label: 'relationship_energy',
      spread_type: 'love_relationships',
      name: 'Relationship Energy',
      name_th: 'พลังงานความสัมพันธ์',
      description: 'The dynamic between you two - the energy of the connection itself',
      description_th: 'พลวัตระหว่างคุณสองคน - พลังงานของความเชื่อมโยงนั้นเอง',
      focus_areas: [
        'The chemistry between you',
        'Challenges the relationship faces',
        'Growth potential',
        'What the relationship teaches',
        'Future trajectory',
      ],
      focus_areas_th: [
        'เคมีระหว่างคุณ',
        'ความท้าทายที่ความสัมพันธ์เผชิญ',
        'ศักยภาพในการเติบโต',
        'สิ่งที่ความสัมพันธ์สอน',
        'ทิศทางในอนาคต',
      ],
      interpretation_guide: 'This position reveals the essence of the relationship itself, separate from the individuals. It shows what you create together.',
      interpretation_guide_th: 'ตำแหน่งนี้เผยให้เห็นแก่นแท้ของความสัมพันธ์ แยกจากบุคคลทั้งสอง มันแสดงสิ่งที่คุณสร้างร่วมกัน',
      example_questions: [
        'Where is this relationship heading?',
        'What is this relationship teaching us?',
        'What energy do we create together?',
      ],
      example_questions_th: [
        'ความสัมพันธ์นี้กำลังมุ่งหน้าไปไหน?',
        'ความสัมพันธ์นี้สอนอะไรเรา?',
        'เราสร้างพลังงานอะไรร่วมกัน?',
      ],
    },

    // CAREER SPREAD POSITIONS
    {
      position_label: 'current_situation',
      spread_type: 'career_money',
      name: 'Current Situation',
      name_th: 'สถานการณ์ปัจจุบัน',
      description: 'Your present career or financial state, including hidden dynamics',
      description_th: 'สถานะอาชีพหรือการเงินปัจจุบันของคุณ รวมถึงพลวัตที่ซ่อนอยู่',
      focus_areas: [
        'Your current position',
        'Work environment energy',
        'Financial health',
        'Hidden influences at work',
        'Your professional reputation',
      ],
      focus_areas_th: [
        'ตำแหน่งปัจจุบันของคุณ',
        'พลังงานสภาพแวดล้อมการทำงาน',
        'สุขภาพทางการเงิน',
        'อิทธิพลที่ซ่อนอยู่ในที่ทำงาน',
        'ชื่อเสียงทางอาชีพของคุณ',
      ],
      interpretation_guide: 'This position provides a snapshot of where you stand professionally. It may reveal factors you have not noticed.',
      interpretation_guide_th: 'ตำแหน่งนี้ให้ภาพรวมของตำแหน่งที่คุณยืนอยู่ในอาชีพ อาจเผยให้เห็นปัจจัยที่คุณไม่ได้สังเกต',
      example_questions: [
        'Where do I currently stand in my career?',
        'What is the true state of my finances?',
        'What energy surrounds my work?',
      ],
      example_questions_th: [
        'ตอนนี้ฉันอยู่ตรงไหนในอาชีพ?',
        'สถานะการเงินที่แท้จริงเป็นอย่างไร?',
        'พลังงานอะไรล้อมรอบการทำงานของฉัน?',
      ],
    },
    {
      position_label: 'challenge_opportunity',
      spread_type: 'career_money',
      name: 'Challenge & Opportunity',
      name_th: 'อุปสรรคและโอกาส',
      description: 'Obstacles to overcome or opportunities to seize in your career path',
      description_th: 'อุปสรรคที่ต้องข้ามผ่านหรือโอกาสที่ต้องคว้าในเส้นทางอาชีพ',
      focus_areas: [
        'Immediate obstacles',
        'Hidden opportunities',
        'Skills to develop',
        'Relationships to nurture',
        'Timing considerations',
      ],
      focus_areas_th: [
        'อุปสรรคเฉพาะหน้า',
        'โอกาสที่ซ่อนอยู่',
        'ทักษะที่ต้องพัฒนา',
        'ความสัมพันธ์ที่ต้องดูแล',
        'ข้อพิจารณาด้านเวลา',
      ],
      interpretation_guide: 'This position is dual-natured. Every challenge contains an opportunity. A seemingly negative card can reveal growth potential.',
      interpretation_guide_th: 'ตำแหน่งนี้มีธรรมชาติสองด้าน ทุกความท้าทายมีโอกาสซ่อนอยู่',
      example_questions: [
        'What obstacles am I facing?',
        'What opportunities should I watch for?',
        'What do I need to overcome to succeed?',
      ],
      example_questions_th: [
        'ฉันกำลังเผชิญอุปสรรคอะไร?',
        'โอกาสอะไรที่ควรระวัง?',
        'ฉันต้องข้ามผ่านอะไรเพื่อประสบความสำเร็จ?',
      ],
    },
    {
      position_label: 'outcome',
      spread_type: 'career_money',
      name: 'Outcome',
      name_th: 'ผลลัพธ์',
      description: 'The likely outcome if you continue on your current path',
      description_th: 'ผลลัพธ์ที่เป็นไปได้หากคุณเดินบนเส้นทางปัจจุบันต่อไป',
      focus_areas: [
        'Probable outcome',
        'Timeline indicators',
        'What success looks like',
        'Warning signs',
        'Actions to take',
      ],
      focus_areas_th: [
        'ผลลัพธ์ที่น่าจะเป็น',
        'ตัวบ่งชี้ระยะเวลา',
        'ความสำเร็จหน้าตาเป็นอย่างไร',
        'สัญญาณเตือน',
        'การดำเนินการที่ควรทำ',
      ],
      interpretation_guide: 'This position shows the trajectory, not fixed destiny. The querent can change the outcome through action.',
      interpretation_guide_th: 'ตำแหน่งนี้แสดงเส้นทาง ไม่ใช่โชคชะตาที่ตายตัว ผู้ถามสามารถเปลี่ยนผลลัพธ์ผ่านการกระทำ',
      example_questions: [
        'Where is my career heading?',
        'What will happen if I take this job?',
        'How will my financial situation evolve?',
      ],
      example_questions_th: [
        'อาชีพของฉันกำลังมุ่งหน้าไปไหน?',
        'จะเกิดอะไรขึ้นถ้าฉันรับงานนี้?',
        'สถานการณ์การเงินจะพัฒนาไปอย่างไร?',
      ],
    },

    // YES/NO POSITION
    {
      position_label: 'yes_no_answer',
      spread_type: 'yes_no',
      name: 'Yes/No Answer',
      name_th: 'คำตอบใช่/ไม่',
      description: 'A single card drawn to answer a specific yes/no question with confidence level',
      description_th: 'ไพ่ใบเดียวที่จั่วเพื่อตอบคำถามใช่/ไม่เฉพาะเจาะจงพร้อมระดับความมั่นใจ',
      focus_areas: [
        'Direct answer',
        'Confidence level',
        'Hidden factors',
        'Timing considerations',
        'Action advice',
      ],
      focus_areas_th: [
        'คำตอบโดยตรง',
        'ระดับความมั่นใจ',
        'ปัจจัยที่ซ่อนอยู่',
        'ข้อพิจารณาด้านเวลา',
        'คำแนะนำในการดำเนินการ',
      ],
      interpretation_guide: 'For Yes/No readings, the card energy determines the answer. Positive cards lean towards Yes, challenging cards towards No.',
      interpretation_guide_th: 'สำหรับการอ่าน Yes/No พลังงานของไพ่เป็นตัวกำหนดคำตอบ ไพ่เชิงบวกโน้มเอียงไปทาง ใช่ ไพ่ท้าทายไปทาง ไม่',
      example_questions: [
        'Should I accept this offer?',
        'Is this person right for me?',
        'Will I get the promotion?',
      ],
      example_questions_th: [
        'ควรรับข้อเสนอนี้ไหม?',
        'คนนี้เหมาะกับฉันไหม?',
        'ฉันจะได้เลื่อนตำแหน่งไหม?',
      ],
    },
  ];

  for (const context of positionContexts) {
    await prisma.positionContext.upsert({
      where: { position_label: context.position_label as never },
      update: context as never,
      create: context as never,
    });
  }

  const totalContexts = await prisma.positionContext.count();
  console.log(`✅ Total position contexts in database: ${totalContexts}/7`);
  
  console.log(`\n🎉 Database seeded successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
