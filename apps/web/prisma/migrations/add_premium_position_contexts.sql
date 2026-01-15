-- Story 7.6: Premium Spread Content Creation
-- This migration adds position contexts for premium spreads:
-- Celtic Cross (10 positions), Decision Making (5), Self Discovery (5), Relationship Deep Dive (7)
-- Total: 27 premium position contexts

-- Insert premium position contexts data
INSERT INTO "position_contexts" (
    "position_label", "spread_type", "name", "name_th", 
    "description", "description_th",
    "focus_areas", "focus_areas_th",
    "interpretation_guide", "interpretation_guide_th",
    "example_questions", "example_questions_th"
) VALUES 

-- =============================================================================
-- CELTIC CROSS SPREAD (10 positions)
-- =============================================================================

-- Celtic Cross: Present Situation
(
    'cc_present', 'celtic_cross', 'Present Situation', 'สถานการณ์ปัจจุบัน',
    'The central card representing your current state, the heart of the matter',
    'ไพ่กลางที่แสดงสถานะปัจจุบันของคุณ หัวใจของเรื่อง',
    ARRAY['Your current circumstances', 'The core issue', 'Present energy', 'Where you stand now', 'The main theme'],
    ARRAY['สถานการณ์ปัจจุบันของคุณ', 'ประเด็นหลัก', 'พลังงานปัจจุบัน', 'ตำแหน่งที่คุณยืนอยู่ตอนนี้', 'ธีมหลัก'],
    'This is the central significator showing exactly where you are. It sets the tone for the entire reading. All other cards relate back to this central theme.',
    'นี่คือไพ่กลางที่แสดงตำแหน่งที่คุณอยู่อย่างแม่นยำ มันตั้งโทนสำหรับการอ่านทั้งหมด ไพ่อื่นๆ ทั้งหมดเชื่อมโยงกลับมาที่ธีมกลางนี้',
    ARRAY['What is my current situation?', 'What is the core of this matter?', 'What energy surrounds me now?'],
    ARRAY['สถานการณ์ปัจจุบันของฉันคืออะไร?', 'แก่นของเรื่องนี้คืออะไร?', 'พลังงานอะไรล้อมรอบฉันตอนนี้?']
),

-- Celtic Cross: Challenge/Crossing
(
    'cc_challenge', 'celtic_cross', 'Challenge/Crossing', 'อุปสรรค/ความท้าทาย',
    'The immediate obstacle or challenge you face, crossing your path',
    'อุปสรรคเฉพาะหน้าหรือความท้าทายที่คุณเผชิญ ขวางเส้นทางของคุณ',
    ARRAY['Main obstacle', 'What blocks you', 'Conflicts or tensions', 'Internal struggles', 'External challenges'],
    ARRAY['อุปสรรคหลัก', 'สิ่งที่ขวางกั้นคุณ', 'ความขัดแย้งหรือความตึงเครียด', 'การต่อสู้ภายใน', 'ความท้าทายภายนอก'],
    'This card crosses the present situation, showing what opposes you. Even positive cards here indicate something to overcome. It may also reveal hidden strengths through adversity.',
    'ไพ่นี้ขวางสถานการณ์ปัจจุบัน แสดงสิ่งที่ต่อต้านคุณ แม้ไพ่เชิงบวกที่นี่ก็บ่งบอกสิ่งที่ต้องข้ามผ่าน อาจเผยจุดแข็งที่ซ่อนอยู่ผ่านความทุกข์ยาก',
    ARRAY['What is blocking my progress?', 'What challenge must I face?', 'What opposition am I dealing with?'],
    ARRAY['อะไรขวางกั้นความก้าวหน้าของฉัน?', 'ความท้าทายอะไรที่ฉันต้องเผชิญ?', 'ฉันกำลังรับมือกับการต่อต้านอะไร?']
),

-- Celtic Cross: Foundation/Past
(
    'cc_past', 'celtic_cross', 'Foundation/Past', 'รากฐาน/อดีต',
    'The foundation of the situation, recent past events that led here',
    'รากฐานของสถานการณ์ เหตุการณ์ในอดีตที่นำมาสู่ปัจจุบัน',
    ARRAY['Past influences', 'Root causes', 'How you got here', 'Past patterns', 'Foundation of current situation'],
    ARRAY['อิทธิพลจากอดีต', 'สาเหตุที่แท้จริง', 'คุณมาถึงจุดนี้ได้อย่างไร', 'รูปแบบจากอดีต', 'รากฐานของสถานการณ์ปัจจุบัน'],
    'This position reveals the foundation upon which everything rests. It shows past events or patterns still influencing today. Understanding this helps explain the present.',
    'ตำแหน่งนี้เผยรากฐานที่ทุกอย่างตั้งอยู่ แสดงเหตุการณ์หรือรูปแบบในอดีตที่ยังคงมีอิทธิพลต่อวันนี้ การเข้าใจสิ่งนี้ช่วยอธิบายปัจจุบัน',
    ARRAY['What from my past affects this?', 'What patterns am I repeating?', 'How did this situation develop?'],
    ARRAY['อะไรจากอดีตของฉันส่งผลต่อสิ่งนี้?', 'ฉันกำลังทำซ้ำรูปแบบอะไร?', 'สถานการณ์นี้พัฒนามาอย่างไร?']
),

-- Celtic Cross: Near Future
(
    'cc_future', 'celtic_cross', 'Near Future', 'อนาคตอันใกล้',
    'What is coming in the near future, the next phase of this journey',
    'สิ่งที่กำลังจะมาในอนาคตอันใกล้ ระยะถัดไปของการเดินทางนี้',
    ARRAY['Upcoming events', 'Short-term developments', 'What to expect soon', 'Immediate trajectory', 'Near-future energy'],
    ARRAY['เหตุการณ์ที่จะมาถึง', 'พัฒนาการระยะสั้น', 'สิ่งที่ควรคาดหวังในเร็วๆ นี้', 'ทิศทางเฉพาะหน้า', 'พลังงานอนาคตอันใกล้'],
    'This card shows what is likely to happen soon. It represents the next phase, usually within weeks to months. This energy is approaching and can still be influenced.',
    'ไพ่นี้แสดงสิ่งที่น่าจะเกิดขึ้นเร็วๆ นี้ แสดงระยะถัดไป โดยปกติภายในสัปดาห์ถึงเดือน พลังงานนี้กำลังเข้ามาและยังสามารถเปลี่ยนแปลงได้',
    ARRAY['What is coming my way?', 'What should I expect soon?', 'What is the next phase?'],
    ARRAY['อะไรกำลังจะมาหาฉัน?', 'ควรคาดหวังอะไรในเร็วๆ นี้?', 'ระยะถัดไปคืออะไร?']
),

-- Celtic Cross: Goals/Aspirations
(
    'cc_above', 'celtic_cross', 'Goals/Aspirations', 'เป้าหมาย/ความปรารถนา',
    'Your conscious goals, what you are striving for, your best possible outcome',
    'เป้าหมายที่รู้ตัว สิ่งที่คุณมุ่งมั่น ผลลัพธ์ที่ดีที่สุดที่เป็นไปได้',
    ARRAY['Conscious goals', 'What you want', 'Ideal outcome', 'Your aspirations', 'Best-case scenario'],
    ARRAY['เป้าหมายที่รู้ตัว', 'สิ่งที่คุณต้องการ', 'ผลลัพธ์ในอุดมคติ', 'ความปรารถนาของคุณ', 'สถานการณ์ที่ดีที่สุด'],
    'This position crowns the reading, showing your highest aspirations. It reveals what you are consciously working toward. Compare this with the outcome to see if your goals align with destiny.',
    'ตำแหน่งนี้ครอบการอ่าน แสดงความปรารถนาสูงสุดของคุณ เผยให้เห็นสิ่งที่คุณกำลังทำงานอย่างมีสติ เปรียบเทียบกับผลลัพธ์เพื่อดูว่าเป้าหมายสอดคล้องกับโชคชะตาหรือไม่',
    ARRAY['What am I truly striving for?', 'What is my best possible outcome?', 'What do I consciously want?'],
    ARRAY['ฉันกำลังมุ่งมั่นเพื่ออะไรจริงๆ?', 'ผลลัพธ์ที่ดีที่สุดของฉันคืออะไร?', 'ฉันต้องการอะไรอย่างมีสติ?']
),

-- Celtic Cross: Subconscious
(
    'cc_below', 'celtic_cross', 'Subconscious', 'จิตใต้สำนึก',
    'Your subconscious influences, hidden factors, underlying feelings',
    'อิทธิพลจิตใต้สำนึก ปัจจัยที่ซ่อนอยู่ ความรู้สึกที่ซ่อนเร้น',
    ARRAY['Hidden influences', 'Subconscious patterns', 'Underlying feelings', 'Deep desires', 'What you are not aware of'],
    ARRAY['อิทธิพลที่ซ่อนอยู่', 'รูปแบบจิตใต้สำนึก', 'ความรู้สึกที่ซ่อนเร้น', 'ความปรารถนาลึกๆ', 'สิ่งที่คุณไม่รู้ตัว'],
    'This position reveals what lies beneath the surface. It shows subconscious drives and hidden influences. This may reveal what you truly want or fear.',
    'ตำแหน่งนี้เผยสิ่งที่อยู่ใต้พื้นผิว แสดงแรงขับจิตใต้สำนึกและอิทธิพลที่ซ่อนอยู่ อาจเผยสิ่งที่คุณต้องการหรือกลัวจริงๆ',
    ARRAY['What am I not seeing?', 'What subconscious patterns affect me?', 'What do I truly feel inside?'],
    ARRAY['อะไรที่ฉันไม่เห็น?', 'รูปแบบจิตใต้สำนึกอะไรส่งผลต่อฉัน?', 'ฉันรู้สึกอะไรจริงๆ ภายใน?']
),

-- Celtic Cross: Advice
(
    'cc_advice', 'celtic_cross', 'Advice', 'คำแนะนำ',
    'The guidance and advice for handling this situation',
    'คำแนะนำและแนวทางในการจัดการสถานการณ์นี้',
    ARRAY['Recommended approach', 'What to do', 'Attitude to adopt', 'Best strategy', 'How to proceed'],
    ARRAY['แนวทางที่แนะนำ', 'ควรทำอะไร', 'ทัศนคติที่ควรมี', 'กลยุทธ์ที่ดีที่สุด', 'ดำเนินการอย่างไร'],
    'This card offers direct guidance on how to approach the situation. It suggests the attitude or action most helpful now. Consider this the wisdom of the cards speaking to you.',
    'ไพ่นี้ให้คำแนะนำโดยตรงเกี่ยวกับวิธีจัดการสถานการณ์ แนะนำทัศนคติหรือการกระทำที่เป็นประโยชน์มากที่สุดตอนนี้ ถือว่านี่คือปัญญาของไพ่ที่พูดกับคุณ',
    ARRAY['What should I do?', 'How should I approach this?', 'What attitude serves me best?'],
    ARRAY['ฉันควรทำอะไร?', 'ควรจัดการเรื่องนี้อย่างไร?', 'ทัศนคติอะไรที่ดีที่สุดสำหรับฉัน?']
),

-- Celtic Cross: External Influences
(
    'cc_external', 'celtic_cross', 'External Influences', 'อิทธิพลภายนอก',
    'Outside influences, other people, environment affecting the situation',
    'อิทธิพลภายนอก คนอื่นๆ สภาพแวดล้อมที่ส่งผลต่อสถานการณ์',
    ARRAY['Other people involved', 'Environmental factors', 'External pressures', 'Social influences', 'Outside circumstances'],
    ARRAY['คนอื่นที่เกี่ยวข้อง', 'ปัจจัยด้านสภาพแวดล้อม', 'แรงกดดันภายนอก', 'อิทธิพลทางสังคม', 'สถานการณ์ภายนอก'],
    'This position shows external factors beyond your control. It may represent other people, environment, or circumstances. Understanding these helps you navigate them.',
    'ตำแหน่งนี้แสดงปัจจัยภายนอกที่อยู่นอกเหนือการควบคุมของคุณ อาจแสดงถึงคนอื่น สภาพแวดล้อม หรือสถานการณ์ การเข้าใจสิ่งเหล่านี้ช่วยให้คุณนำทางผ่านได้',
    ARRAY['How do others affect this?', 'What external factors should I know?', 'What is the environment like?'],
    ARRAY['คนอื่นส่งผลต่อสิ่งนี้อย่างไร?', 'ปัจจัยภายนอกอะไรที่ควรรู้?', 'สภาพแวดล้อมเป็นอย่างไร?']
),

-- Celtic Cross: Hopes & Fears
(
    'cc_hopes_fears', 'celtic_cross', 'Hopes & Fears', 'ความหวังและความกลัว',
    'Your hopes and fears about the situation, often intertwined',
    'ความหวังและความกลัวของคุณเกี่ยวกับสถานการณ์ มักพันกัน',
    ARRAY['What you hope for', 'What you fear', 'Inner conflicts', 'Dual nature of desire', 'Psychological state'],
    ARRAY['สิ่งที่คุณหวัง', 'สิ่งที่คุณกลัว', 'ความขัดแย้งภายใน', 'ธรรมชาติสองด้านของความปรารถนา', 'สถานะทางจิตใจ'],
    'This position reveals the duality of human nature. Often what we hope for and fear are two sides of the same coin. A positive card may show hope; challenging card may show fear.',
    'ตำแหน่งนี้เผยความเป็นสองด้านของธรรมชาติมนุษย์ บ่อยครั้งสิ่งที่เราหวังและกลัวเป็นสองด้านของเหรียญเดียวกัน ไพ่เชิงบวกอาจแสดงความหวัง ไพ่ท้าทายอาจแสดงความกลัว',
    ARRAY['What do I hope/fear about this?', 'What are my inner conflicts?', 'What secretly drives my decisions?'],
    ARRAY['ฉันหวัง/กลัวอะไรเกี่ยวกับสิ่งนี้?', 'ความขัดแย้งภายในของฉันคืออะไร?', 'อะไรขับเคลื่อนการตัดสินใจของฉันอย่างลับๆ?']
),

-- Celtic Cross: Final Outcome
(
    'cc_outcome', 'celtic_cross', 'Final Outcome', 'ผลลัพธ์สุดท้าย',
    'The likely final outcome if all energies continue as they are',
    'ผลลัพธ์สุดท้ายที่น่าจะเป็นหากพลังงานทั้งหมดดำเนินต่อไปเช่นนี้',
    ARRAY['Final outcome', 'Where this is heading', 'Ultimate resolution', 'Long-term result', 'Destiny potential'],
    ARRAY['ผลลัพธ์สุดท้าย', 'สิ่งนี้กำลังมุ่งหน้าไปไหน', 'การแก้ไขขั้นสุดท้าย', 'ผลลัพธ์ระยะยาว', 'ศักยภาพโชคชะตา'],
    'This is the culmination of all the energies in the reading. It shows the most probable outcome if things continue. Remember: the querent can always change the outcome through action.',
    'นี่คือจุดสุดยอดของพลังงานทั้งหมดในการอ่าน แสดงผลลัพธ์ที่น่าจะเป็นที่สุดหากสิ่งต่างๆ ดำเนินต่อไป จำไว้: ผู้ถามสามารถเปลี่ยนผลลัพธ์ได้เสมอผ่านการกระทำ',
    ARRAY['Where is this ultimately heading?', 'What is the final outcome?', 'How will this resolve?'],
    ARRAY['สิ่งนี้กำลังมุ่งหน้าไปไหนในที่สุด?', 'ผลลัพธ์สุดท้ายคืออะไร?', 'สิ่งนี้จะคลี่คลายอย่างไร?']
),

-- =============================================================================
-- DECISION MAKING SPREAD (5 positions)
-- =============================================================================

-- Decision Making: Option A Pros
(
    'dm_option_a_pros', 'decision_making', 'Option A Pros', 'ข้อดีของตัวเลือก A',
    'The positive aspects, benefits, and advantages of choosing Option A',
    'แง่บวก ประโยชน์ และข้อได้เปรียบของการเลือกตัวเลือก A',
    ARRAY['Benefits of this choice', 'Positive outcomes', 'What you gain', 'Strengths of this path', 'Opportunities it opens'],
    ARRAY['ประโยชน์ของตัวเลือกนี้', 'ผลลัพธ์เชิงบวก', 'สิ่งที่คุณได้รับ', 'จุดแข็งของเส้นทางนี้', 'โอกาสที่เปิดออก'],
    'This card shows what works in favor of Option A. Even a challenging card here may reveal hidden advantages. Look for growth potential and positive energy.',
    'ไพ่นี้แสดงสิ่งที่เอื้อประโยชน์ต่อตัวเลือก A แม้ไพ่ท้าทายที่นี่อาจเผยข้อได้เปรียบที่ซ่อนอยู่ มองหาศักยภาพในการเติบโตและพลังงานเชิงบวก',
    ARRAY['What good comes from choosing this?', 'What are the advantages?', 'How does this benefit me?'],
    ARRAY['อะไรดีที่มาจากการเลือกนี้?', 'ข้อได้เปรียบคืออะไร?', 'สิ่งนี้เป็นประโยชน์ต่อฉันอย่างไร?']
),

-- Decision Making: Option A Cons
(
    'dm_option_a_cons', 'decision_making', 'Option A Cons', 'ข้อเสียของตัวเลือก A',
    'The challenges, risks, and drawbacks of choosing Option A',
    'ความท้าทาย ความเสี่ยง และข้อเสียของการเลือกตัวเลือก A',
    ARRAY['Risks involved', 'Potential problems', 'What you might lose', 'Challenges to overcome', 'Hidden costs'],
    ARRAY['ความเสี่ยงที่เกี่ยวข้อง', 'ปัญหาที่อาจเกิดขึ้น', 'สิ่งที่คุณอาจสูญเสีย', 'ความท้าทายที่ต้องข้ามผ่าน', 'ต้นทุนที่ซ่อนอยู่'],
    'This card reveals what to watch out for with Option A. A positive card here may mean minor concerns. A challenging card signals significant obstacles.',
    'ไพ่นี้เผยสิ่งที่ต้องระวังกับตัวเลือก A ไพ่เชิงบวกที่นี่อาจหมายถึงข้อกังวลเล็กน้อย ไพ่ท้าทายบ่งบอกอุปสรรคสำคัญ',
    ARRAY['What are the risks?', 'What could go wrong?', 'What am I sacrificing?'],
    ARRAY['ความเสี่ยงคืออะไร?', 'อะไรอาจผิดพลาดได้?', 'ฉันกำลังเสียสละอะไร?']
),

-- Decision Making: Option B Pros
(
    'dm_option_b_pros', 'decision_making', 'Option B Pros', 'ข้อดีของตัวเลือก B',
    'The positive aspects, benefits, and advantages of choosing Option B',
    'แง่บวก ประโยชน์ และข้อได้เปรียบของการเลือกตัวเลือก B',
    ARRAY['Benefits of this choice', 'Positive outcomes', 'What you gain', 'Strengths of this path', 'Opportunities it opens'],
    ARRAY['ประโยชน์ของตัวเลือกนี้', 'ผลลัพธ์เชิงบวก', 'สิ่งที่คุณได้รับ', 'จุดแข็งของเส้นทางนี้', 'โอกาสที่เปิดออก'],
    'This card shows what works in favor of Option B. Compare this with Option A pros to weigh advantages. Look for unique benefits this path offers.',
    'ไพ่นี้แสดงสิ่งที่เอื้อประโยชน์ต่อตัวเลือก B เปรียบเทียบกับข้อดีของตัวเลือก A เพื่อชั่งน้ำหนักข้อได้เปรียบ มองหาประโยชน์เฉพาะที่เส้นทางนี้มอบให้',
    ARRAY['What good comes from choosing this?', 'What are the advantages?', 'How does this benefit me?'],
    ARRAY['อะไรดีที่มาจากการเลือกนี้?', 'ข้อได้เปรียบคืออะไร?', 'สิ่งนี้เป็นประโยชน์ต่อฉันอย่างไร?']
),

-- Decision Making: Option B Cons
(
    'dm_option_b_cons', 'decision_making', 'Option B Cons', 'ข้อเสียของตัวเลือก B',
    'The challenges, risks, and drawbacks of choosing Option B',
    'ความท้าทาย ความเสี่ยง และข้อเสียของการเลือกตัวเลือก B',
    ARRAY['Risks involved', 'Potential problems', 'What you might lose', 'Challenges to overcome', 'Hidden costs'],
    ARRAY['ความเสี่ยงที่เกี่ยวข้อง', 'ปัญหาที่อาจเกิดขึ้น', 'สิ่งที่คุณอาจสูญเสีย', 'ความท้าทายที่ต้องข้ามผ่าน', 'ต้นทุนที่ซ่อนอยู่'],
    'This card reveals what to watch out for with Option B. Compare with Option A cons to see which path has fewer obstacles. Consider if these challenges are manageable.',
    'ไพ่นี้เผยสิ่งที่ต้องระวังกับตัวเลือก B เปรียบเทียบกับข้อเสียของตัวเลือก A เพื่อดูว่าเส้นทางใดมีอุปสรรคน้อยกว่า พิจารณาว่าความท้าทายเหล่านี้จัดการได้หรือไม่',
    ARRAY['What are the risks?', 'What could go wrong?', 'What am I sacrificing?'],
    ARRAY['ความเสี่ยงคืออะไร?', 'อะไรอาจผิดพลาดได้?', 'ฉันกำลังเสียสละอะไร?']
),

-- Decision Making: Best Path
(
    'dm_best_path', 'decision_making', 'Best Path', 'เส้นทางที่ดีที่สุด',
    'The overall guidance and recommended direction for your decision',
    'คำแนะนำโดยรวมและทิศทางที่แนะนำสำหรับการตัดสินใจของคุณ',
    ARRAY['Overall recommendation', 'Higher guidance', 'What serves you best', 'The wisest choice', 'Long-term perspective'],
    ARRAY['คำแนะนำโดยรวม', 'การนำทางที่สูงกว่า', 'สิ่งที่ดีที่สุดสำหรับคุณ', 'ทางเลือกที่ฉลาดที่สุด', 'มุมมองระยะยาว'],
    'This card synthesizes the entire reading. It may point to one option, or suggest a third way. Consider this as wisdom from your higher self.',
    'ไพ่นี้สังเคราะห์การอ่านทั้งหมด อาจชี้ไปที่ตัวเลือกหนึ่ง หรือแนะนำทางที่สาม พิจารณานี่เป็นปัญญาจากตัวตนที่สูงกว่าของคุณ',
    ARRAY['Which path is best for me?', 'What should I ultimately choose?', 'What does my higher self advise?'],
    ARRAY['เส้นทางใดดีที่สุดสำหรับฉัน?', 'ในที่สุดฉันควรเลือกอะไร?', 'ตัวตนที่สูงกว่าของฉันแนะนำอะไร?']
),

-- =============================================================================
-- SELF DISCOVERY SPREAD (5 positions)
-- =============================================================================

-- Self Discovery: Core Self
(
    'sd_core_self', 'self_discovery', 'Core Self', 'ตัวตนแท้จริง',
    'Your authentic essence - who you truly are beneath all roles and masks',
    'แก่นแท้ของคุณ - ตัวตนที่แท้จริงใต้บทบาทและหน้ากากทั้งหมด',
    ARRAY['Your authentic identity', 'Core values and beliefs', 'Essential nature', 'What makes you unique', 'Your spiritual essence'],
    ARRAY['ตัวตนที่แท้จริงของคุณ', 'ค่านิยมและความเชื่อหลัก', 'ธรรมชาติที่แท้จริง', 'สิ่งที่ทำให้คุณพิเศษ', 'แก่นแท้ทางจิตวิญญาณ'],
    'This is the heart of the reading, representing your true nature stripped of external influences. The card here reveals your innermost self - your authentic desires, natural inclinations, and core identity. This is who you are when no one is watching, your soul''s blueprint. Understanding this position helps you align your life with your true purpose.',
    'นี่คือหัวใจของการอ่าน แสดงถึงธรรมชาติแท้จริงของคุณที่ปราศจากอิทธิพลภายนอก ไพ่ที่นี่เผยตัวตนลึกที่สุด - ความปรารถนาที่แท้จริง แนวโน้มตามธรรมชาติ และตัวตนหลัก นี่คือตัวคุณเมื่อไม่มีใครมองเห็น พิมพ์เขียวของจิตวิญญาณ การเข้าใจตำแหน่งนี้ช่วยให้คุณปรับชีวิตให้สอดคล้องกับเป้าหมายที่แท้จริง',
    ARRAY['Who am I at my core?', 'What is my true nature?', 'What defines my authentic self?'],
    ARRAY['ฉันเป็นใครในแก่นแท้?', 'ธรรมชาติแท้จริงของฉันคืออะไร?', 'อะไรกำหนดตัวตนที่แท้จริงของฉัน?']
),

-- Self Discovery: Your Strengths
(
    'sd_strengths', 'self_discovery', 'Your Strengths', 'จุดแข็งของคุณ',
    'Your natural gifts, talents, and innate abilities that empower you',
    'พรสวรรค์ ความสามารถตามธรรมชาติ และพลังที่ติดตัวคุณมา',
    ARRAY['Natural talents', 'Developed skills', 'Personality strengths', 'Resources you possess', 'What others admire in you'],
    ARRAY['พรสวรรค์ตามธรรมชาติ', 'ทักษะที่พัฒนาแล้ว', 'จุดแข็งด้านบุคลิกภาพ', 'ทรัพยากรที่คุณมี', 'สิ่งที่ผู้อื่นชื่นชมในตัวคุณ'],
    'This position illuminates the gifts you may take for granted. These are your superpowers - abilities that come naturally but are often overlooked. The card reveals resources you already possess to overcome challenges. Lean into these strengths when facing difficulties; they are your foundation for success.',
    'ตำแหน่งนี้ส่องสว่างพรสวรรค์ที่คุณอาจมองข้าม เหล่านี้คือพลังพิเศษของคุณ - ความสามารถที่มาตามธรรมชาติแต่มักถูกมองข้าม ไพ่เผยทรัพยากรที่คุณมีอยู่แล้วเพื่อเอาชนะความท้าทาย พึ่งพาจุดแข็งเหล่านี้เมื่อเผชิญความยากลำบาก พวกมันคือรากฐานแห่งความสำเร็จของคุณ',
    ARRAY['What are my greatest strengths?', 'What gifts should I cultivate?', 'What makes me powerful?'],
    ARRAY['จุดแข็งที่ยิ่งใหญ่ที่สุดของฉันคืออะไร?', 'พรสวรรค์อะไรที่ควรพัฒนา?', 'อะไรทำให้ฉันทรงพลัง?']
),

-- Self Discovery: Your Challenges
(
    'sd_challenges', 'self_discovery', 'Your Challenges', 'ความท้าทายของคุณ',
    'Areas of growth, patterns to break, and obstacles within yourself',
    'พื้นที่สำหรับการเติบโต รูปแบบที่ต้องทำลาย และอุปสรรคภายในตัวคุณ',
    ARRAY['Growth areas', 'Self-limiting beliefs', 'Patterns to break', 'Inner obstacles', 'Shadow aspects'],
    ARRAY['พื้นที่สำหรับการเติบโต', 'ความเชื่อที่จำกัดตัวเอง', 'รูปแบบที่ต้องทำลาย', 'อุปสรรคภายใน', 'ด้านมืดที่ซ่อนอยู่'],
    'This position reveals the internal blocks standing between you and your fullest self. These are not failures but opportunities for profound transformation. The card shows patterns you repeat unconsciously, beliefs that limit you, or fears that hold you back. Acknowledging these challenges is the first step toward healing and growth.',
    'ตำแหน่งนี้เผยสิ่งกีดขวางภายในที่ขวางกั้นระหว่างคุณกับตัวตนที่สมบูรณ์ที่สุด สิ่งเหล่านี้ไม่ใช่ความล้มเหลว แต่เป็นโอกาสสำหรับการเปลี่ยนแปลงอย่างลึกซึ้ง ไพ่แสดงรูปแบบที่คุณทำซ้ำโดยไม่รู้ตัว ความเชื่อที่จำกัดคุณ หรือความกลัวที่ยึดคุณไว้ การยอมรับความท้าทายเหล่านี้เป็นก้าวแรกสู่การเยียวยาและการเติบโต',
    ARRAY['What patterns hold me back?', 'What within me needs healing?', 'What challenges must I face?'],
    ARRAY['รูปแบบอะไรที่ยึดฉันไว้?', 'อะไรในตัวฉันที่ต้องการการเยียวยา?', 'ความท้าทายอะไรที่ฉันต้องเผชิญ?']
),

-- Self Discovery: Hidden Potential
(
    'sd_hidden_potential', 'self_discovery', 'Hidden Potential', 'ศักยภาพที่ซ่อนอยู่',
    'Untapped abilities and dormant gifts waiting to be awakened',
    'ความสามารถที่ยังไม่ได้ใช้และพรสวรรค์ที่หลับใหลรอการปลุก',
    ARRAY['Dormant talents', 'Undeveloped aspects', 'Future possibilities', 'What you could become', 'Sleeping powers'],
    ARRAY['พรสวรรค์ที่หลับใหล', 'ด้านที่ยังไม่พัฒนา', 'ความเป็นไปได้ในอนาคต', 'สิ่งที่คุณอาจกลายเป็น', 'พลังที่ซ่อนเร้น'],
    'This exciting position reveals the treasure within that you haven''t yet discovered. It shows abilities and qualities that are waiting to emerge when the time is right. The card points to your unrealized potential - the person you are becoming. This is your future self calling you forward to embrace more of who you can be.',
    'ตำแหน่งที่น่าตื่นเต้นนี้เผยสมบัติภายในที่คุณยังไม่ได้ค้นพบ แสดงความสามารถและคุณสมบัติที่รอเวลาที่เหมาะสมจะปรากฏ ไพ่ชี้ไปที่ศักยภาพที่ยังไม่ได้ใช้ - ตัวตนที่คุณกำลังจะกลายเป็น นี่คือตัวตนในอนาคตที่เรียกคุณไปข้างหน้าเพื่อโอบรับความเป็นตัวคุณให้มากขึ้น',
    ARRAY['What potential lies dormant in me?', 'What abilities am I not yet using?', 'What could I become?'],
    ARRAY['ศักยภาพอะไรที่หลับใหลอยู่ในตัวฉัน?', 'ความสามารถอะไรที่ฉันยังไม่ได้ใช้?', 'ฉันอาจกลายเป็นอะไรได้บ้าง?']
),

-- Self Discovery: Path Forward
(
    'sd_path_forward', 'self_discovery', 'Path Forward', 'เส้นทางข้างหน้า',
    'Guidance for your personal growth journey and next steps',
    'คำแนะนำสำหรับการเดินทางเติบโตส่วนบุคคลและก้าวต่อไป',
    ARRAY['Recommended actions', 'Growth direction', 'Next steps', 'How to integrate insights', 'Practical guidance'],
    ARRAY['การกระทำที่แนะนำ', 'ทิศทางการเติบโต', 'ก้าวต่อไป', 'วิธีบูรณาการความเข้าใจ', 'คำแนะนำเชิงปฏิบัติ'],
    'This final position synthesizes the entire reading into actionable guidance. It shows the direction for your personal evolution and the next step on your journey. The card offers wisdom on how to apply the insights from this reading to your daily life. Consider this your compass pointing toward greater self-actualization and fulfillment.',
    'ตำแหน่งสุดท้ายนี้สังเคราะห์การอ่านทั้งหมดเป็นคำแนะนำที่ปฏิบัติได้ แสดงทิศทางสำหรับวิวัฒนาการส่วนบุคคลและก้าวต่อไปในการเดินทาง ไพ่ให้ปัญญาเกี่ยวกับวิธีนำความเข้าใจจากการอ่านนี้ไปใช้ในชีวิตประจำวัน ถือว่านี่คือเข็มทิศที่ชี้ไปสู่การบรรลุตนเองและความสมบูรณ์ที่ยิ่งใหญ่กว่า',
    ARRAY['What is my next step in growth?', 'How should I move forward?', 'What direction should I take?'],
    ARRAY['ก้าวต่อไปในการเติบโตของฉันคืออะไร?', 'ฉันควรเดินหน้าอย่างไร?', 'ฉันควรไปในทิศทางใด?']
),

-- =============================================================================
-- RELATIONSHIP DEEP DIVE SPREAD (7 positions)
-- =============================================================================

-- Relationship Deep Dive: You
(
    'rdd_you', 'relationship_deep_dive', 'You in the Relationship', 'คุณในความสัมพันธ์',
    'Your energy, role, and contribution to this relationship dynamic',
    'พลังงาน บทบาท และการมีส่วนร่วมของคุณในพลวัตความสัมพันธ์นี้',
    ARRAY['Your emotional state', 'What you bring', 'Your expectations', 'Your needs in the relationship', 'How you show up'],
    ARRAY['สถานะอารมณ์ของคุณ', 'สิ่งที่คุณนำมา', 'ความคาดหวังของคุณ', 'ความต้องการของคุณในความสัมพันธ์', 'คุณปรากฏตัวอย่างไร'],
    'This position reveals your authentic presence in the relationship - not who you pretend to be, but who you truly are. The card shows your emotional investment, your patterns, and the energy you contribute to the dynamic. It may reveal both conscious and unconscious behaviors that affect your connection. Understanding this helps you see your role clearly and take responsibility for your part.',
    'ตำแหน่งนี้เผยการปรากฏตัวที่แท้จริงของคุณในความสัมพันธ์ - ไม่ใช่ที่คุณแกล้งทำ แต่ตัวตนที่แท้จริง ไพ่แสดงการลงทุนทางอารมณ์ รูปแบบของคุณ และพลังงานที่คุณมีส่วนร่วมกับพลวัต อาจเผยทั้งพฤติกรรมที่รู้ตัวและไม่รู้ตัวที่ส่งผลต่อการเชื่อมต่อ การเข้าใจสิ่งนี้ช่วยให้คุณเห็นบทบาทชัดเจนและรับผิดชอบต่อส่วนของคุณ',
    ARRAY['What energy do I bring to this relationship?', 'How do I really show up for my partner?', 'What is my role in this dynamic?'],
    ARRAY['ฉันนำพลังงานอะไรมาสู่ความสัมพันธ์นี้?', 'ฉันปรากฏตัวต่อคู่รักอย่างไรจริงๆ?', 'บทบาทของฉันในพลวัตนี้คืออะไร?']
),

-- Relationship Deep Dive: Them
(
    'rdd_them', 'relationship_deep_dive', 'Them in the Relationship', 'เขาในความสัมพันธ์',
    'Your partner''s energy, perspective, and what they bring to the dynamic',
    'พลังงาน มุมมอง และสิ่งที่คู่รักนำมาสู่พลวัตนี้',
    ARRAY['Their emotional state', 'What they contribute', 'Their perspective on you', 'Their needs', 'How they engage'],
    ARRAY['สถานะอารมณ์ของพวกเขา', 'สิ่งที่พวกเขามีส่วนร่วม', 'มุมมองที่มีต่อคุณ', 'ความต้องการของพวกเขา', 'พวกเขามีส่วนร่วมอย่างไร'],
    'This card offers insight into your partner''s inner world and their experience of the relationship. Remember this is perception, not absolute truth - it shows their current energy and what they bring. The card may reveal their intentions, fears, hopes, or challenges in connecting with you. Use this understanding to develop empathy and improve communication.',
    'ไพ่นี้ให้ความเข้าใจเกี่ยวกับโลกภายในของคู่รักและประสบการณ์ในความสัมพันธ์ จำไว้ว่านี่คือการรับรู้ ไม่ใช่ความจริงที่แน่นอน - แสดงพลังงานปัจจุบันและสิ่งที่พวกเขานำมา ไพ่อาจเผยเจตนา ความกลัว ความหวัง หรือความท้าทายในการเชื่อมต่อกับคุณ ใช้ความเข้าใจนี้เพื่อพัฒนาความเห็นอกเห็นใจและปรับปรุงการสื่อสาร',
    ARRAY['What is my partner really feeling?', 'What do they bring to our relationship?', 'How do they experience our connection?'],
    ARRAY['คู่รักของฉันรู้สึกอะไรจริงๆ?', 'พวกเขานำอะไรมาสู่ความสัมพันธ์?', 'พวกเขาประสบการณ์การเชื่อมต่อของเราอย่างไร?']
),

-- Relationship Deep Dive: The Connection
(
    'rdd_connection', 'relationship_deep_dive', 'The Connection', 'การเชื่อมต่อ',
    'The bond between you - the relationship entity that you create together',
    'สายสัมพันธ์ระหว่างคุณ - ตัวตนของความสัมพันธ์ที่คุณสร้างร่วมกัน',
    ARRAY['Bond quality', 'Relationship chemistry', 'What you create together', 'The nature of your union', 'Karmic or spiritual connection'],
    ARRAY['คุณภาพของสายสัมพันธ์', 'เคมีของความสัมพันธ์', 'สิ่งที่คุณสร้างร่วมกัน', 'ธรรมชาติของการรวมกัน', 'การเชื่อมต่อทางกรรมหรือจิตวิญญาณ'],
    'This position reveals the third entity in any relationship - the bond itself, which is greater than either individual. The card shows the essence of what you create together, the invisible thread that connects you. It may reveal the purpose of this relationship, its lessons, or its destiny. Understanding this helps you appreciate what you have and what you are building.',
    'ตำแหน่งนี้เผยตัวตนที่สามในความสัมพันธ์ - สายสัมพันธ์เอง ซึ่งยิ่งใหญ่กว่าบุคคลใดบุคคลหนึ่ง ไพ่แสดงแก่นแท้ของสิ่งที่คุณสร้างร่วมกัน เส้นด้ายที่มองไม่เห็นที่เชื่อมต่อคุณ อาจเผยจุดประสงค์ของความสัมพันธ์นี้ บทเรียน หรือโชคชะตา การเข้าใจสิ่งนี้ช่วยให้คุณชื่นชมสิ่งที่มีและสิ่งที่กำลังสร้าง',
    ARRAY['What is the nature of our bond?', 'What do we create together?', 'What is our relationship meant to teach us?'],
    ARRAY['ธรรมชาติของสายสัมพันธ์ของเราคืออะไร?', 'เราสร้างอะไรร่วมกัน?', 'ความสัมพันธ์ของเราตั้งใจจะสอนอะไรเรา?']
),

-- Relationship Deep Dive: Your True Feelings
(
    'rdd_your_feelings', 'relationship_deep_dive', 'Your True Feelings', 'ความรู้สึกแท้จริงของคุณ',
    'Your deep, authentic emotions about this relationship - beyond surface feelings',
    'อารมณ์ที่ลึกและแท้จริงของคุณเกี่ยวกับความสัมพันธ์นี้ - เกินกว่าความรู้สึกผิวเผิน',
    ARRAY['Deep emotions', 'Hidden feelings', 'What you truly want', 'Unspoken desires', 'Authentic emotional state'],
    ARRAY['อารมณ์ที่ลึก', 'ความรู้สึกที่ซ่อนอยู่', 'สิ่งที่คุณต้องการจริงๆ', 'ความปรารถนาที่ไม่ได้พูด', 'สถานะอารมณ์ที่แท้จริง'],
    'This position dives beneath the surface to reveal feelings you may not fully acknowledge, even to yourself. The card shows your genuine emotional truth - desires, fears, loves, and frustrations you may suppress. Understanding your authentic feelings is essential for relationship honesty. This insight helps you communicate your needs and make conscious choices.',
    'ตำแหน่งนี้ดำดิ่งใต้พื้นผิวเพื่อเผยความรู้สึกที่คุณอาจไม่ยอมรับอย่างเต็มที่ แม้กับตัวเอง ไพ่แสดงความจริงทางอารมณ์ของคุณ - ความปรารถนา ความกลัว ความรัก และความหงุดหงิดที่คุณอาจกดไว้ การเข้าใจความรู้สึกที่แท้จริงเป็นสิ่งจำเป็นสำหรับความซื่อสัตย์ในความสัมพันธ์ ความเข้าใจนี้ช่วยให้คุณสื่อสารความต้องการและตัดสินใจอย่างมีสติ',
    ARRAY['What do I really feel about this relationship?', 'What am I not admitting to myself?', 'What does my heart truly want?'],
    ARRAY['ฉันรู้สึกอะไรจริงๆ เกี่ยวกับความสัมพันธ์นี้?', 'อะไรที่ฉันไม่ยอมรับกับตัวเอง?', 'หัวใจของฉันต้องการอะไรจริงๆ?']
),

-- Relationship Deep Dive: Their True Feelings
(
    'rdd_their_feelings', 'relationship_deep_dive', 'Their True Feelings', 'ความรู้สึกแท้จริงของเขา',
    'Your partner''s genuine emotions about you and the relationship',
    'อารมณ์ที่แท้จริงของคู่รักเกี่ยวกับคุณและความสัมพันธ์',
    ARRAY['Their deep feelings', 'Hidden emotions', 'Their true desires', 'Unexpressed sentiments', 'Authentic emotional investment'],
    ARRAY['ความรู้สึกลึกๆ ของพวกเขา', 'อารมณ์ที่ซ่อนอยู่', 'ความปรารถนาที่แท้จริง', 'ความรู้สึกที่ไม่ได้แสดงออก', 'การลงทุนทางอารมณ์ที่แท้จริง'],
    'This card offers a glimpse into your partner''s authentic emotional world regarding you and the relationship. It reveals feelings they may not express openly - whether love, doubt, longing, or fear. Remember, this is intuitive insight, not mind-reading; use it to foster understanding, not assumptions. This knowledge can help you respond to their unspoken needs with compassion.',
    'ไพ่นี้ให้ภาพของโลกอารมณ์ที่แท้จริงของคู่รักเกี่ยวกับคุณและความสัมพันธ์ เผยความรู้สึกที่พวกเขาอาจไม่แสดงออกอย่างเปิดเผย - ไม่ว่าจะเป็นความรัก ความสงสัย ความปรารถนา หรือความกลัว จำไว้ นี่คือความเข้าใจโดยสัญชาตญาณ ไม่ใช่การอ่านใจ ใช้เพื่อส่งเสริมความเข้าใจ ไม่ใช่สมมติฐาน ความรู้นี้สามารถช่วยให้คุณตอบสนองต่อความต้องการที่ไม่ได้พูดด้วยความเห็นอกเห็นใจ',
    ARRAY['How does my partner truly feel about me?', 'What are they not saying?', 'What does their heart want?'],
    ARRAY['คู่รักของฉันรู้สึกอะไรจริงๆ เกี่ยวกับฉัน?', 'อะไรที่พวกเขาไม่ได้พูด?', 'หัวใจของพวกเขาต้องการอะไร?']
),

-- Relationship Deep Dive: Challenges
(
    'rdd_challenges', 'relationship_deep_dive', 'Relationship Challenges', 'ความท้าทายในความสัมพันธ์',
    'The obstacles, tensions, and growth areas in your relationship',
    'อุปสรรค ความตึงเครียด และพื้นที่สำหรับการเติบโตในความสัมพันธ์',
    ARRAY['Areas of conflict', 'Recurring issues', 'Growth opportunities', 'What needs attention', 'Patterns to transform'],
    ARRAY['พื้นที่ของความขัดแย้ง', 'ปัญหาที่เกิดซ้ำ', 'โอกาสในการเติบโต', 'สิ่งที่ต้องการความสนใจ', 'รูปแบบที่ต้องเปลี่ยน'],
    'Every relationship has challenges - this position illuminates yours with compassion, not judgment. The card reveals the areas where work is needed: communication blocks, trust issues, unmet needs, or recurring conflicts. View these not as problems but as invitations for deeper intimacy and growth. Addressing these challenges together can strengthen your bond significantly.',
    'ทุกความสัมพันธ์มีความท้าทาย - ตำแหน่งนี้ส่องสว่างของคุณด้วยความเห็นอกเห็นใจ ไม่ใช่การตัดสิน ไพ่เผยพื้นที่ที่ต้องการการทำงาน: อุปสรรคในการสื่อสาร ปัญหาความไว้วางใจ ความต้องการที่ไม่ได้รับการตอบสนอง หรือความขัดแย้งที่เกิดซ้ำ มองสิ่งเหล่านี้ไม่ใช่ปัญหา แต่เป็นคำเชิญสู่ความใกล้ชิดและการเติบโตที่ลึกซึ้งยิ่งขึ้น การจัดการความท้าทายเหล่านี้ร่วมกันสามารถเสริมสายสัมพันธ์ได้อย่างมาก',
    ARRAY['What challenges do we need to address?', 'Where is our relationship struggling?', 'What patterns need to change?'],
    ARRAY['ความท้าทายอะไรที่เราต้องจัดการ?', 'ความสัมพันธ์ของเราดิ้นรนที่ไหน?', 'รูปแบบอะไรที่ต้องเปลี่ยน?']
),

-- Relationship Deep Dive: Future Potential
(
    'rdd_future_potential', 'relationship_deep_dive', 'Future Potential', 'ศักยภาพในอนาคต',
    'The possible future and where this relationship could go',
    'อนาคตที่เป็นไปได้และทิศทางที่ความสัมพันธ์นี้อาจไป',
    ARRAY['Future trajectory', 'Relationship potential', 'What could develop', 'Long-term possibilities', 'Outcome if you continue'],
    ARRAY['ทิศทางในอนาคต', 'ศักยภาพความสัมพันธ์', 'สิ่งที่อาจพัฒนา', 'ความเป็นไปได้ระยะยาว', 'ผลลัพธ์หากดำเนินต่อไป'],
    'This culminating position reveals where your relationship is heading if current energies continue. The card shows the potential you are building together - whether that is deep commitment, necessary separation, or continued growth. Remember, the future is not fixed; this is the probable trajectory based on present circumstances. Use this insight to consciously co-create the future you both desire.',
    'ตำแหน่งสุดท้ายนี้เผยว่าความสัมพันธ์กำลังมุ่งหน้าไปไหนหากพลังงานปัจจุบันดำเนินต่อไป ไพ่แสดงศักยภาพที่คุณกำลังสร้างร่วมกัน - ไม่ว่าจะเป็นความมุ่งมั่นลึกซึ้ง การแยกทางที่จำเป็น หรือการเติบโตต่อเนื่อง จำไว้ อนาคตไม่ได้ถูกกำหนดตายตัว นี่คือทิศทางที่น่าจะเป็นตามสถานการณ์ปัจจุบัน ใช้ความเข้าใจนี้เพื่อร่วมสร้างอนาคตที่คุณทั้งคู่ปรารถนาอย่างมีสติ',
    ARRAY['Where is our relationship heading?', 'What is the potential of this union?', 'What future are we building together?'],
    ARRAY['ความสัมพันธ์ของเรากำลังมุ่งหน้าไปไหน?', 'ศักยภาพของการรวมกันนี้คืออะไร?', 'อนาคตอะไรที่เรากำลังสร้างร่วมกัน?']
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
