// Detailed Card Meanings for Tarot Reading
// คำทำนายละเอียดสำหรับไพ่ทาโรต์ทั้ง 78 ใบ

import { MAJOR_ARCANA, WANDS, CUPS, SWORDS, PENTACLES } from './meanings';

export interface DetailedMeaning {
  prediction: string;
  love: string;
  career: string;
  advice: string;
}

export interface CardDetailedMeanings {
  upright: DetailedMeaning;
  reversed: DetailedMeaning;
}

// Combine all meanings into one object
export const ALL_CARD_MEANINGS: Record<string, CardDetailedMeanings> = {
  ...MAJOR_ARCANA,
  ...WANDS,
  ...CUPS,
  ...SWORDS,
  ...PENTACLES,
};

// Minor Arcana suit info for fallback generation
const SUIT_INFO: Record<string, { element: string; theme: string; thName: string }> = {
  wands: { element: 'ไฟ', theme: 'ความคิดสร้างสรรค์ พลังงาน และการดำเนินการ', thName: 'ไม้เท้า' },
  cups: { element: 'น้ำ', theme: 'อารมณ์ ความรัก และความสัมพันธ์', thName: 'ถ้วย' },
  swords: { element: 'ลม', theme: 'ความคิด การสื่อสาร และความท้าทาย', thName: 'ดาบ' },
  pentacles: { element: 'ดิน', theme: 'การเงิน ความมั่นคง และการงาน', thName: 'เหรียญ' },
};

// Court card personalities for fallback
const COURT_INFO: Record<string, { role: string; character: string }> = {
  page: { role: 'พลทหาร', character: 'ความอยากรู้อยากเห็น การเรียนรู้ใหม่ ข่าวสารที่มา' },
  knight: { role: 'อัศวิน', character: 'การดำเนินการ ความมุ่งมั่น การเดินทาง' },
  queen: { role: 'ราชินี', character: 'ความเข้าใจลึกซึ้ง การดูแลเอาใจใส่ ความอ่อนโยน' },
  king: { role: 'กษัตริย์', character: 'ความเป็นผู้นำ อำนาจ ความรับผิดชอบ' },
};

// Number meanings for fallback
const NUMBER_INFO: Record<number, { theme: string; energy: string }> = {
  1: { theme: 'จุดเริ่มต้น', energy: 'พลังงานใหม่ โอกาสใหม่ ศักยภาพที่ยังไม่ถูกใช้' },
  2: { theme: 'ความสมดุล', energy: 'การเลือก ความร่วมมือ การตัดสินใจ' },
  3: { theme: 'การเติบโต', energy: 'ความคืบหน้า การขยายตัว ผลลัพธ์เริ่มต้น' },
  4: { theme: 'ความมั่นคง', energy: 'โครงสร้าง ความปลอดภัย การหยุดพัก' },
  5: { theme: 'ความท้าทาย', energy: 'ความขัดแย้ง การเปลี่ยนแปลง บทเรียน' },
  6: { theme: 'ความสมานฉันท์', energy: 'ความสามัคคี การแบ่งปัน ความสำเร็จ' },
  7: { theme: 'การสะท้อน', energy: 'การประเมิน ความอดทน การรอคอย' },
  8: { theme: 'การเคลื่อนไหว', energy: 'ความก้าวหน้า พลังงานสูง การเปลี่ยนแปลงรวดเร็ว' },
  9: { theme: 'ความสำเร็จ', energy: 'ผลลัพธ์ ความพอใจ การบรรลุเป้าหมาย' },
  10: { theme: 'การสิ้นสุด', energy: 'การเสร็จสมบูรณ์ มรดก การเปลี่ยนผ่าน' },
};

/**
 * Generate fallback prediction when detailed meaning is not available
 */
function generateFallbackPrediction(
  isReversed: boolean,
  suit: string | null,
  number: number | null,
  nameTh: string
): DetailedMeaning {
  const suitInfo = suit ? SUIT_INFO[suit] : null;
  const numberInfo = number && number <= 10 ? NUMBER_INFO[number] : null;
  const courtInfo = number && number > 10 
    ? COURT_INFO[number === 11 ? 'page' : number === 12 ? 'knight' : number === 13 ? 'queen' : 'king']
    : null;

  const direction = isReversed ? 'กลับหัว' : 'หงาย';
  const suitTheme = suitInfo?.theme || 'พลังงานแห่งจักรวาล';
  const element = suitInfo?.element || 'ธาตุ';

  let prediction = '';
  let love = '';
  let career = '';
  let advice = '';

  if (courtInfo) {
    prediction = `ไพ่${nameTh}${direction}บ่งบอกถึง${courtInfo.character} ในบริบทของ${suitTheme} ${isReversed 
      ? 'พลังงานของบุคคลนี้อาจถูกบล็อกหรือใช้ในทางที่ไม่เหมาะสม ควรระวังและปรับตัว' 
      : 'บุคคลที่มีลักษณะเช่นนี้อาจเข้ามาในชีวิตของคุณ หรือคุณเองกำลังแสดงคุณสมบัติเหล่านี้ออกมา'}`;
    love = isReversed 
      ? `ในความรัก อาจมีบุคคลที่ใช้พลังงานของตนในทางที่ไม่สร้างสรรค์ ควรสังเกตพฤติกรรมและระวังตัว`
      : `ในความรัก บุคคลที่มีคุณสมบัติของ${nameTh}อาจปรากฏในชีวิตคุณ หรือคุณเองกำลังเติบโตในด้านนี้`;
    career = isReversed
      ? `ในการงาน อาจพบกับผู้ร่วมงานที่มีปัญหาในการใช้อำนาจหรือความสามารถ ควรระวังและวางตัวให้เหมาะสม`
      : `ในการงาน คุณสมบัติของ${courtInfo.role}จะช่วยให้คุณประสบความสำเร็จ ใช้ศักยภาพเหล่านี้อย่างเต็มที่`;
    advice = isReversed
      ? `ควรทบทวนการใช้พลังงานและอำนาจของตัวเอง อย่าปล่อยให้ด้านลบมาครอบงำ`
      : `จงเรียนรู้และพัฒนาคุณสมบัติของ${courtInfo.role} ใช้มันในทางที่สร้างสรรค์`;
  } else if (numberInfo) {
    prediction = `ไพ่${nameTh}${direction}นำพา${numberInfo.theme}มาสู่ด้าน${suitTheme} ${isReversed 
      ? `พลังงานของ${numberInfo.energy}อาจถูกขัดขวางหรือล่าช้า ต้องใช้ความพยายามมากขึ้นเพื่อเอาชนะอุปสรรค` 
      : `${numberInfo.energy} ช่วงเวลานี้เหมาะสำหรับการ${numberInfo.theme}ในด้าน${suitTheme}`}`;
    love = isReversed
      ? `ในความรัก อาจพบอุปสรรคที่เกี่ยวกับ${numberInfo.theme} ต้องใช้ความอดทนและความเข้าใจ`
      : `ในความรัก ${numberInfo.theme}กำลังเกิดขึ้น เปิดใจรับพลังงานบวก`;
    career = isReversed
      ? `ในการงาน ${numberInfo.theme}อาจถูกขัดขวาง ควรหาทางแก้ไขปัญหาอย่างรอบคอบ`
      : `ในการงาน นี่คือช่วงเวลาของ${numberInfo.theme} ใช้โอกาสนี้ให้เป็นประโยชน์`;
    advice = isReversed
      ? `อย่าท้อแท้กับอุปสรรค ทุกความท้าทายคือบทเรียน จงมีความอดทนและมุ่งมั่น`
      : `ยอมรับพลังงานของ${numberInfo.theme} และใช้มันในการพัฒนาตัวเองและสถานการณ์รอบข้าง`;
  } else {
    prediction = `ไพ่${nameTh}${direction}นำพลังงานของ${element}มาสู่ชีวิตคุณ ${isReversed 
      ? 'พลังงานนี้อาจถูกบล็อกหรือต้องการการปรับสมดุล' 
      : 'พลังงานนี้กำลังไหลอย่างราบรื่นและสนับสนุนคุณ'}`;
    love = `ในความรัก พลังงานของ${element}กำลังส่งผลต่อความสัมพันธ์ของคุณ`;
    career = `ในการงาน พลังงานของ${element}กำลังส่งผลต่อเส้นทางอาชีพของคุณ`;
    advice = `จงเปิดใจรับพลังงานของ${element}และใช้มันในทางที่สร้างสรรค์`;
  }

  return { prediction, love, career, advice };
}

/**
 * Get detailed prediction for any card
 * Returns the full detailed meaning with prediction, love, career, and advice
 */
export function generateDetailedPrediction(
  cardSlug: string,
  isReversed: boolean,
  suit: string | null,
  number: number | null,
  nameTh: string
): DetailedMeaning {
  // Try to find in our complete meanings database
  if (ALL_CARD_MEANINGS[cardSlug]) {
    return isReversed
      ? ALL_CARD_MEANINGS[cardSlug].reversed
      : ALL_CARD_MEANINGS[cardSlug].upright;
  }

  // Fallback for any card not in our database
  return generateFallbackPrediction(isReversed, suit, number, nameTh);
}

/**
 * Check if a card has detailed meaning
 */
export function hasDetailedMeaning(cardSlug: string): boolean {
  return cardSlug in ALL_CARD_MEANINGS;
}

/**
 * Get the count of cards with detailed meanings
 */
export function getDetailedMeaningsCount(): number {
  return Object.keys(ALL_CARD_MEANINGS).length;
}
