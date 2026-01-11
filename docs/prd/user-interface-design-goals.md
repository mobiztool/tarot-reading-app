# User Interface Design Goals

## Overall UX Vision

สร้างประสบการณ์การดูดวงที่รู้สึก **intimate, mystical, และ calming** ให้กับผู้ใช้ โดยผสมผสานความลึกลับแบบ spiritual กับความทันสมัยและใช้งานง่าย เหมือนการมีที่ปรึกษาส่วนตัวที่เข้าใจและให้กำลังใจตลอดเวลา

**Core UX Pillars:**
- **Emotional Connection:** สร้างความรู้สึกใกล้ชิด อบอุ่น และปลอดภัย ไม่ใช่แค่เครื่องมือ แต่เป็น personal companion
- **Effortless Simplicity:** ใช้งานได้ทันทีโดยไม่ต้องเรียนรู้ เหมือน intuitive natural ตั้งแต่ครั้งแรก
- **Visual Delight:** ทุก interaction มี craft และ attention to detail ที่ทำให้รู้สึก premium และพิเศษ
- **Respectful Speed:** รวดเร็วแต่ไม่รีบร้อน มี rhythm ที่เหมาะสมกับ moment of reflection

## Key Interaction Paradigms

**1. Card Selection Experience:**
- ผู้ใช้เห็นไพ่หงายหลังกระจายเป็นวงโค้งบนหน้าจอ (fan layout)
- ลากนิ้วซ้าย-ขวาเพื่อเลื่อนดูไพ่ (smooth swipe gesture)
- แตะเลือกไพ่ที่รู้สึก "ถูกใจ" หรือ "โดนใจ" โดยอาศัยสัญชาตญาณ
- ไพ่ที่เลือกจะมี subtle glow หรือ highlight เบาๆ

**2. Card Reveal Animation:**
- พลิกไพ่ด้วย 3D flip animation ที่นุ่มนวล (duration ~800ms)
- มี particle effects เบาๆ เมื่อไพ่เปิด (mystical sparkles)
- เสียงประกอบเบาๆ (optional, can be muted) เช่น soft chime หรือ whoosh
- Haptic feedback เบาๆ บนมือถือขณะพลิกไพ่

**3. Reading Flow:**
- Progressive disclosure: แสดงไพ่ทีละใบพร้อมคำอธิบาย (ไม่รีบ, ให้เวลาอ่านและรับรู้)
- Scroll เพื่ออ่านรายละเอียด โดยมี visual hierarchy ชัดเจน
- Sticky card image ที่มุมบนขณะ scroll อ่านรายละเอียด (context awareness)

**4. Personalization Touch:**
- Save favorite readings ด้วย heart icon
- Quick access จาก profile page
- Subtle micro-interactions ทุกที่ (button press, hover states, transitions)

## Core Screens and Views

**Product Perspective - Critical Screens สำหรับ MVP:**

1. **Landing/Home Page**
   - Hero section แสดง value proposition ชัดเจน
   - CTA: "เริ่มดูดวง" หรือ "ดึงไพ่วันนี้"
   - Preview ตัวอย่างไพ่และ UI
   - Social proof (testimonials, number of readings done)

2. **Reading Type Selection**
   - แสดงตัวเลือก: Daily Reading (1 card) vs 3-Card Spread
   - อธิบายสั้นๆ ว่าแต่ละแบบเหมาะกับอะไร
   - Optional: ช่องใส่คำถามก่อนเริ่มดู

3. **Card Selection Screen**
   - Main interaction screen: เลือกไพ่
   - แสดงไพ่หงายหลังให้เลือก
   - Calm background, minimal distraction
   - Progress indicator (แบบ subtle)

4. **Reading Results Screen**
   - แสดงไพ่ที่เปิดพร้อมคำทำนาย
   - แยกเป็น sections: card meaning, interpretation, advice
   - CTA: แชร์, บันทึก, ดูอีกครั้ง

5. **User Profile/History Page** (สำหรับ logged-in users)
   - รายการการดูดวงย้อนหลัง (timeline view)
   - Saved readings
   - Settings: personalization options

6. **Tarot Guide/Encyclopedia Page**
   - รายการไพ่ทั้ง 78 ใบ (grid layout)
   - Search และ filter
   - Detail page สำหรับแต่ละไพ่

7. **Onboarding/Tutorial Overlay**
   - แสดงครั้งแรกที่เข้าใช้
   - สั้นๆ 3-4 steps, skip ได้
   - Highlight key features

## Accessibility: WCAG AA

เป้าหมายคือ **WCAG 2.1 Level AA** เพื่อให้ผู้ใช้ทุกคนเข้าถึงได้

**Key Considerations:**
- Color contrast ratio ≥ 4.5:1 สำหรับ text (แม้ใน Dark Mode)
- Keyboard navigation สำหรับทุก interaction
- Screen reader friendly (ARIA labels, semantic HTML)
- Focus indicators ชัดเจน
- Alternative text สำหรับรูปภาพทุกรูป
- ไม่ใช้สีเพียงอย่างเดียวในการสื่อความหมาย

**Rationale:** Level AA เป็น industry standard และทำได้โดยไม่กระทบ design มากนัก, เพิ่ม audience reach

## Branding

**Visual Identity & Style Guide:**

- **Color Palette:**
  - Primary: Deep purple (#6B46C1) - mystical, spiritual
  - Secondary: Midnight blue (#1E293B) - calm, trust
  - Accent: Gold (#F59E0B) - luxury, enlightenment
  - Background: Dark charcoal (#0F172A) - sophisticated dark mode
  - Text: Soft white (#F1F5F9) - readable, gentle on eyes

- **Typography:**
  - Headings: Serif font (elegant, mystical) - เช่น Playfair Display หรือ Cinzel
  - Body: Sans-serif font (readable) - เช่น Inter หรือ Nunito Sans
  - Card names: Script/Calligraphy font (mystical accent) - เช่น Pinyon Script

- **Visual Elements:**
  - Mystical symbols เบาๆ เป็น background patterns (stars, moons, sacred geometry)
  - Gradient overlays ที่นุ่มนวล (purple to blue)
  - Soft glow effects รอบๆ cards และ important elements
  - Rounded corners ทุกที่ (softer, more welcoming)

- **Animation Style:**
  - Ease-in-out curves (natural, organic)
  - Duration: 300-800ms (not too fast, not too slow)
  - Subtle particle effects (mystical but not distracting)
  - Smooth transitions ระหว่างหน้า (fade, slide)

**Mood Reference:** เหมือนการเข้า cozy bookshop ที่มีหนังสือเก่าแก่และเทียนไข คลาสสิคแต่ไม่ล้าสมัย อบอุ่นแต่ลึกลับ

## Target Device and Platforms: Web Responsive (Mobile-First)

**Primary Focus:** **Mobile web (iOS Safari & Android Chrome)** - 80% ของ traffic คาดว่าจะมาจาก mobile

**Supported Platforms:**
- 📱 **Mobile:** 320px - 767px (primary focus)
  - Optimize สำหรับ one-hand use
  - Touch target ≥ 44x44px
  - Thumb-friendly zone layout
  
- 📱 **Tablet:** 768px - 1023px (secondary)
  - Larger cards, more breathing room
  - Two-column layouts where appropriate
  
- 💻 **Desktop:** 1024px+ (tertiary)
  - Centered content, max-width ~1200px
  - Mouse hover states
  - Keyboard shortcuts

**Progressive Web App (PWA):**
- ติดตั้งบน home screen ได้
- Offline mode สำหรับ Tarot guide (ข้อมูลไพ่)
- Push notifications สำหรับ daily reading reminder

**Browser Support:**
- Modern evergreen browsers (last 2 versions)
- iOS Safari 14+
- Android Chrome 90+
- Desktop: Chrome, Firefox, Safari, Edge
