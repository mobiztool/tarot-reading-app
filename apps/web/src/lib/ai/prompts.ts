/**
 * AI Prompt Engineering
 * Story 9.2: AI-Powered Personalized Interpretations
 * 
 * Crafted prompts for Thai tarot interpretation with Claude
 */

import { AICardInfo, ReadingHistoryItem } from './types';

/**
 * System prompt for tarot interpretation
 */
export const TAROT_SYSTEM_PROMPT = `คุณคือนักดูไพ่ทาโรต์ผู้เชี่ยวชาญชาวไทย มีประสบการณ์มากกว่า 20 ปี คุณมีความสามารถในการตีความไพ่อย่างลึกซึ้ง และให้คำแนะนำที่เป็นประโยชน์ต่อชีวิตจริง

หลักการในการตีความ:
1. ตีความไพ่ตามตำแหน่งและความหมายที่แท้จริง
2. ใช้ภาษาไทยที่เป็นธรรมชาติ สุภาพ และเข้าใจง่าย
3. ให้คำแนะนำที่ปฏิบัติได้จริงและเป็นประโยชน์
4. สร้างแรงบันดาลใจและความหวัง แต่ไม่โอ้อวดเกินจริง
5. เคารพความเชื่อและวัฒนธรรมไทย
6. หลีกเลี่ยงการทำนายเหตุการณ์ที่รุนแรงหรือน่ากลัว
7. ไม่ให้คำแนะนำทางการแพทย์ กฎหมาย หรือการเงินโดยเฉพาะเจาะจง

รูปแบบการตอบ:
- เริ่มด้วยภาพรวมของการดูดวงครั้งนี้
- อธิบายความหมายของแต่ละไพ่ในตำแหน่งนั้นๆ
- เชื่อมโยงไพ่ทุกใบเข้าด้วยกันเป็นเรื่องราว
- จบด้วยคำแนะนำที่ทำได้จริงและข้อความให้กำลังใจ

ความยาวของคำตอบ: 200-300 คำ`;

/**
 * Position labels in Thai
 */
export const POSITION_LABELS_TH: Record<string, string> = {
  // Basic spreads
  past: 'อดีต',
  present: 'ปัจจุบัน',
  future: 'อนาคต',
  you: 'ตัวคุณ',
  other: 'อีกฝ่าย',
  relationship_energy: 'พลังงานความสัมพันธ์',
  current_situation: 'สถานการณ์ปัจจุบัน',
  challenge_opportunity: 'อุปสรรคและโอกาส',
  outcome: 'ผลลัพธ์',
  yes_no_answer: 'คำตอบใช่/ไม่ใช่',
  
  // Celtic Cross
  cc_present: 'สถานการณ์ปัจจุบัน',
  cc_challenge: 'ความท้าทาย',
  cc_past: 'อดีต',
  cc_future: 'อนาคตอันใกล้',
  cc_above: 'เป้าหมาย/อุดมคติ',
  cc_below: 'รากฐาน',
  cc_advice: 'คำแนะนำ',
  cc_external: 'สภาพแวดล้อม',
  cc_hopes_fears: 'ความหวังและความกลัว',
  cc_outcome: 'ผลลัพธ์สุดท้าย',
  
  // Decision Making
  dm_option_a_pros: 'ข้อดีของทางเลือก A',
  dm_option_a_cons: 'ข้อเสียของทางเลือก A',
  dm_option_b_pros: 'ข้อดีของทางเลือก B',
  dm_option_b_cons: 'ข้อเสียของทางเลือก B',
  dm_best_path: 'เส้นทางที่ดีที่สุด',
  
  // Self Discovery
  sd_core_self: 'ตัวตนที่แท้จริง',
  sd_strengths: 'จุดแข็ง',
  sd_challenges: 'ความท้าทาย',
  sd_hidden_potential: 'ศักยภาพที่ซ่อนอยู่',
  sd_path_forward: 'เส้นทางข้างหน้า',
  
  // Chakra
  ca_root: 'จักระฐาน (ความมั่นคง)',
  ca_sacral: 'จักระสะโพก (ความคิดสร้างสรรค์)',
  ca_solar_plexus: 'จักระหน้าท้อง (พลังและความมั่นใจ)',
  ca_heart: 'จักระหัวใจ (ความรักและความเมตตา)',
  ca_throat: 'จักระลำคอ (การสื่อสาร)',
  ca_third_eye: 'จักระตาที่สาม (สัญชาตญาณ)',
  ca_crown: 'จักระยอดศีรษะ (จิตวิญญาณ)',
};

/**
 * Reading type labels in Thai
 */
export const READING_TYPE_LABELS_TH: Record<string, string> = {
  daily: 'ไพ่ประจำวัน',
  three_card: 'ไพ่ 3 ใบ (อดีต-ปัจจุบัน-อนาคต)',
  love_relationships: 'ความรักและความสัมพันธ์',
  career_money: 'การงานและการเงิน',
  yes_no: 'ใช่หรือไม่ใช่',
  celtic_cross: 'เซลติกครอส (10 ใบ)',
  decision_making: 'การตัดสินใจ',
  self_discovery: 'ค้นพบตัวเอง',
  relationship_deep_dive: 'วิเคราะห์ความสัมพันธ์เชิงลึก',
  shadow_work: 'สำรวจเงามืด',
  chakra_alignment: 'สมดุลจักระ',
  friendship: 'มิตรภาพ',
  career_path: 'เส้นทางอาชีพ',
  financial_abundance: 'ความมั่งคั่งทางการเงิน',
  monthly_forecast: 'พยากรณ์รายเดือน',
  year_ahead: 'พยากรณ์ปีนี้',
  elemental_balance: 'สมดุลธาตุ',
  zodiac_wheel: 'วงล้อจักรราศี',
};

/**
 * Build the user prompt for interpretation
 */
export function buildInterpretationPrompt(
  cards: AICardInfo[],
  readingType: string,
  question?: string,
  readingHistory?: ReadingHistoryItem[]
): string {
  const readingTypeTh = READING_TYPE_LABELS_TH[readingType] || readingType;
  
  let prompt = `# การดูดวงครั้งนี้\n`;
  prompt += `**รูปแบบ:** ${readingTypeTh}\n`;
  
  if (question) {
    prompt += `**คำถามของผู้ดู:** "${question}"\n`;
  }
  
  prompt += `\n## ไพ่ที่จั่วได้\n`;
  
  cards.forEach((card, index) => {
    const positionTh = card.positionLabelTh || 
                       POSITION_LABELS_TH[card.positionLabel] || 
                       `ตำแหน่งที่ ${index + 1}`;
    const direction = card.isReversed ? '(กลับหัว)' : '(ตั้งตรง)';
    
    prompt += `\n### ${index + 1}. ${positionTh}\n`;
    prompt += `- **ไพ่:** ${card.nameTh} / ${card.name} ${direction}\n`;
    
    if (card.keywords && card.keywords.length > 0) {
      prompt += `- **คีย์เวิร์ด:** ${card.keywords.join(', ')}\n`;
    }
    
    if (card.isReversed && card.meaningReversed) {
      prompt += `- **ความหมาย (กลับหัว):** ${card.meaningReversed}\n`;
    } else if (!card.isReversed && card.meaningUpright) {
      prompt += `- **ความหมาย (ตั้งตรง):** ${card.meaningUpright}\n`;
    }
  });
  
  // Add reading history context if available
  if (readingHistory && readingHistory.length > 0) {
    prompt += `\n## บริบทจากการดูดวงก่อนหน้า\n`;
    prompt += `ผู้ดูเคยดูดวงมาก่อน ${readingHistory.length} ครั้ง:\n`;
    
    readingHistory.slice(0, 3).forEach((hist, idx) => {
      prompt += `- ${idx + 1}. ${hist.readingType}`;
      if (hist.question) {
        prompt += ` (คำถาม: "${hist.question}")`;
      }
      prompt += `\n`;
    });
    
    prompt += `\nโปรดพิจารณาบริบทนี้ในการตีความ\n`;
  }
  
  prompt += `\n## คำขอ\n`;
  prompt += `กรุณาให้คำทำนายที่ลึกซึ้งและเป็นส่วนตัวสำหรับการดูดวงครั้งนี้ `;
  prompt += `เชื่อมโยงไพ่ทุกใบเข้าด้วยกัน `;
  
  if (question) {
    prompt += `และตอบคำถาม "${question}" `;
  }
  
  prompt += `จบด้วยคำแนะนำที่ปฏิบัติได้จริง`;
  
  return prompt;
}

/**
 * Safety check prompts to ensure appropriate content
 */
export const SAFETY_GUIDELINES = `
ข้อห้ามในการตอบ:
- ไม่ทำนายความตาย โรคร้าย หรืออุบัติเหตุ
- ไม่ให้คำแนะนำทางการแพทย์
- ไม่แนะนำการลงทุนหรือการเงินเฉพาะเจาะจง
- ไม่ให้คำปรึกษาทางกฎหมาย
- ไม่พูดถึงการทำร้ายตัวเองหรือผู้อื่น
- ไม่ใช้ภาษาหยาบคายหรือไม่เหมาะสม
`;
