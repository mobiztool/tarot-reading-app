-- Story 5.6: Add Position Contexts Table
-- This migration adds the position_contexts table for storing
-- position-specific interpretation content for specialized spreads

-- Add new position label for yes/no
ALTER TYPE "PositionLabel" ADD VALUE IF NOT EXISTS 'yes_no_answer';

-- Create position_contexts table
CREATE TABLE IF NOT EXISTS "position_contexts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "position_label" "PositionLabel" NOT NULL,
    "spread_type" "ReadingType" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "name_th" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "description_th" TEXT NOT NULL,
    "focus_areas" VARCHAR(200)[] NOT NULL,
    "focus_areas_th" VARCHAR(200)[] NOT NULL,
    "interpretation_guide" TEXT NOT NULL,
    "interpretation_guide_th" TEXT NOT NULL,
    "example_questions" VARCHAR(200)[] NOT NULL,
    "example_questions_th" VARCHAR(200)[] NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "position_contexts_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint on position_label
ALTER TABLE "position_contexts" ADD CONSTRAINT "position_contexts_position_label_key" UNIQUE ("position_label");

-- Add index on spread_type
CREATE INDEX IF NOT EXISTS "position_contexts_spread_type_idx" ON "position_contexts"("spread_type");

-- Insert position contexts data
INSERT INTO "position_contexts" (
    "position_label", "spread_type", "name", "name_th", 
    "description", "description_th",
    "focus_areas", "focus_areas_th",
    "interpretation_guide", "interpretation_guide_th",
    "example_questions", "example_questions_th"
) VALUES 
-- Love Spread: You
(
    'you', 'love_relationships', 'You', 'คุณ',
    'Represents your current emotional state, desires, and energy in the relationship',
    'แสดงถึงสถานะอารมณ์ปัจจุบัน ความปรารถนา และพลังงานของคุณในความสัมพันธ์',
    ARRAY['Your emotional readiness', 'What you bring to the relationship', 'Your hidden desires', 'Your fears and blocks', 'Your love language'],
    ARRAY['ความพร้อมทางอารมณ์ของคุณ', 'สิ่งที่คุณนำมาสู่ความสัมพันธ์', 'ความปรารถนาที่ซ่อนอยู่', 'ความกลัวและอุปสรรคของคุณ', 'ภาษารักของคุณ'],
    'When reading this position, focus on the querent''s internal world. The card reveals what they truly feel, not just what they show.',
    'เมื่ออ่านตำแหน่งนี้ ให้เน้นที่โลกภายในของผู้ถาม ไพ่เผยให้เห็นสิ่งที่พวกเขารู้สึกจริงๆ ไม่ใช่แค่สิ่งที่แสดงออก',
    ARRAY['How do I truly feel about this relationship?', 'What am I contributing to this dynamic?', 'What do I need to work on in myself?'],
    ARRAY['ฉันรู้สึกอย่างไรกับความสัมพันธ์นี้จริงๆ?', 'ฉันมีส่วนร่วมอะไรบ้างกับพลวัตนี้?', 'ฉันต้องปรับปรุงอะไรในตัวเอง?']
),
-- Love Spread: Other
(
    'other', 'love_relationships', 'The Other Person', 'อีกฝ่าย',
    'Represents your partner''s or love interest''s energy, feelings, and perspective',
    'แสดงถึงพลังงาน ความรู้สึก และมุมมองของคู่รักหรือคนที่คุณสนใจ',
    ARRAY['Their emotional state', 'Their intentions', 'Their perspective on you', 'Their challenges in the relationship', 'What they need from you'],
    ARRAY['สถานะอารมณ์ของพวกเขา', 'เจตนาของพวกเขา', 'มุมมองที่มีต่อคุณ', 'ความท้าทายของพวกเขาในความสัมพันธ์', 'สิ่งที่พวกเขาต้องการจากคุณ'],
    'This position offers insight into the other person''s energy. Remember this is perception, not absolute truth.',
    'ตำแหน่งนี้ให้ข้อมูลเชิงลึกเกี่ยวกับพลังงานของอีกฝ่าย จำไว้ว่านี่คือการรับรู้ ไม่ใช่ความจริงที่แน่นอน',
    ARRAY['How does my partner feel about me?', 'What are their intentions?', 'What do they need from this relationship?'],
    ARRAY['คู่ของฉันรู้สึกอย่างไรกับฉัน?', 'เจตนาของพวกเขาคืออะไร?', 'พวกเขาต้องการอะไรจากความสัมพันธ์นี้?']
),
-- Love Spread: Relationship Energy
(
    'relationship_energy', 'love_relationships', 'Relationship Energy', 'พลังงานความสัมพันธ์',
    'The dynamic between you two - the energy of the connection itself',
    'พลวัตระหว่างคุณสองคน - พลังงานของความเชื่อมโยงนั้นเอง',
    ARRAY['The chemistry between you', 'Challenges the relationship faces', 'Growth potential', 'What the relationship teaches', 'Future trajectory'],
    ARRAY['เคมีระหว่างคุณ', 'ความท้าทายที่ความสัมพันธ์เผชิญ', 'ศักยภาพในการเติบโต', 'สิ่งที่ความสัมพันธ์สอน', 'ทิศทางในอนาคต'],
    'This position reveals the essence of the relationship itself, separate from the individuals.',
    'ตำแหน่งนี้เผยให้เห็นแก่นแท้ของความสัมพันธ์ แยกจากบุคคลทั้งสอง',
    ARRAY['Where is this relationship heading?', 'What is this relationship teaching us?', 'What energy do we create together?'],
    ARRAY['ความสัมพันธ์นี้กำลังมุ่งหน้าไปไหน?', 'ความสัมพันธ์นี้สอนอะไรเรา?', 'เราสร้างพลังงานอะไรร่วมกัน?']
),
-- Career Spread: Current Situation
(
    'current_situation', 'career_money', 'Current Situation', 'สถานการณ์ปัจจุบัน',
    'Your present career or financial state, including hidden dynamics',
    'สถานะอาชีพหรือการเงินปัจจุบันของคุณ รวมถึงพลวัตที่ซ่อนอยู่',
    ARRAY['Your current position', 'Work environment energy', 'Financial health', 'Hidden influences at work', 'Your professional reputation'],
    ARRAY['ตำแหน่งปัจจุบันของคุณ', 'พลังงานสภาพแวดล้อมการทำงาน', 'สุขภาพทางการเงิน', 'อิทธิพลที่ซ่อนอยู่ในที่ทำงาน', 'ชื่อเสียงทางอาชีพของคุณ'],
    'This position provides a snapshot of where you stand professionally.',
    'ตำแหน่งนี้ให้ภาพรวมของตำแหน่งที่คุณยืนอยู่ในอาชีพ',
    ARRAY['Where do I currently stand in my career?', 'What is the true state of my finances?', 'What energy surrounds my work?'],
    ARRAY['ตอนนี้ฉันอยู่ตรงไหนในอาชีพ?', 'สถานะการเงินที่แท้จริงเป็นอย่างไร?', 'พลังงานอะไรล้อมรอบการทำงานของฉัน?']
),
-- Career Spread: Challenge & Opportunity
(
    'challenge_opportunity', 'career_money', 'Challenge & Opportunity', 'อุปสรรคและโอกาส',
    'Obstacles to overcome or opportunities to seize in your career path',
    'อุปสรรคที่ต้องข้ามผ่านหรือโอกาสที่ต้องคว้าในเส้นทางอาชีพ',
    ARRAY['Immediate obstacles', 'Hidden opportunities', 'Skills to develop', 'Relationships to nurture', 'Timing considerations'],
    ARRAY['อุปสรรคเฉพาะหน้า', 'โอกาสที่ซ่อนอยู่', 'ทักษะที่ต้องพัฒนา', 'ความสัมพันธ์ที่ต้องดูแล', 'ข้อพิจารณาด้านเวลา'],
    'This position is dual-natured. Every challenge contains an opportunity.',
    'ตำแหน่งนี้มีธรรมชาติสองด้าน ทุกความท้าทายมีโอกาสซ่อนอยู่',
    ARRAY['What obstacles am I facing?', 'What opportunities should I watch for?', 'What do I need to overcome to succeed?'],
    ARRAY['ฉันกำลังเผชิญอุปสรรคอะไร?', 'โอกาสอะไรที่ควรระวัง?', 'ฉันต้องข้ามผ่านอะไรเพื่อประสบความสำเร็จ?']
),
-- Career Spread: Outcome
(
    'outcome', 'career_money', 'Outcome', 'ผลลัพธ์',
    'The likely outcome if you continue on your current path',
    'ผลลัพธ์ที่เป็นไปได้หากคุณเดินบนเส้นทางปัจจุบันต่อไป',
    ARRAY['Probable outcome', 'Timeline indicators', 'What success looks like', 'Warning signs', 'Actions to take'],
    ARRAY['ผลลัพธ์ที่น่าจะเป็น', 'ตัวบ่งชี้ระยะเวลา', 'ความสำเร็จหน้าตาเป็นอย่างไร', 'สัญญาณเตือน', 'การดำเนินการที่ควรทำ'],
    'This position shows the trajectory, not fixed destiny. The querent can change the outcome through action.',
    'ตำแหน่งนี้แสดงเส้นทาง ไม่ใช่โชคชะตาที่ตายตัว ผู้ถามสามารถเปลี่ยนผลลัพธ์ผ่านการกระทำ',
    ARRAY['Where is my career heading?', 'What will happen if I take this job?', 'How will my financial situation evolve?'],
    ARRAY['อาชีพของฉันกำลังมุ่งหน้าไปไหน?', 'จะเกิดอะไรขึ้นถ้าฉันรับงานนี้?', 'สถานการณ์การเงินจะพัฒนาไปอย่างไร?']
),
-- Yes/No Position
(
    'yes_no_answer', 'yes_no', 'Yes/No Answer', 'คำตอบใช่/ไม่',
    'A single card drawn to answer a specific yes/no question with confidence level',
    'ไพ่ใบเดียวที่จั่วเพื่อตอบคำถามใช่/ไม่เฉพาะเจาะจงพร้อมระดับความมั่นใจ',
    ARRAY['Direct answer', 'Confidence level', 'Hidden factors', 'Timing considerations', 'Action advice'],
    ARRAY['คำตอบโดยตรง', 'ระดับความมั่นใจ', 'ปัจจัยที่ซ่อนอยู่', 'ข้อพิจารณาด้านเวลา', 'คำแนะนำในการดำเนินการ'],
    'For Yes/No readings, the card energy determines the answer. Positive cards lean towards Yes, challenging cards towards No.',
    'สำหรับการอ่าน Yes/No พลังงานของไพ่เป็นตัวกำหนดคำตอบ ไพ่เชิงบวกโน้มเอียงไปทาง ใช่ ไพ่ท้าทายไปทาง ไม่',
    ARRAY['Should I accept this offer?', 'Is this person right for me?', 'Will I get the promotion?'],
    ARRAY['ควรรับข้อเสนอนี้ไหม?', 'คนนี้เหมาะกับฉันไหม?', 'ฉันจะได้เลื่อนตำแหน่งไหม?']
)
ON CONFLICT ("position_label") DO UPDATE SET
    "spread_type" = EXCLUDED."spread_type",
    "name" = EXCLUDED."name",
    "name_th" = EXCLUDED."name_th",
    "description" = EXCLUDED."description",
    "description_th" = EXCLUDED."description_th",
    "focus_areas" = EXCLUDED."focus_areas",
    "focus_areas_th" = EXCLUDED."focus_areas_th",
    "interpretation_guide" = EXCLUDED."interpretation_guide",
    "interpretation_guide_th" = EXCLUDED."interpretation_guide_th",
    "example_questions" = EXCLUDED."example_questions",
    "example_questions_th" = EXCLUDED."example_questions_th",
    "updated_at" = CURRENT_TIMESTAMP;

