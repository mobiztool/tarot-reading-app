# Web App ดูดวงไพ่ยิปซี Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- สร้าง Web App ดูดวงไพ่ยิปซีที่รวดเร็ว ใช้งานง่าย และให้ประสบการณ์ที่ดีแก่ผู้ใช้
- พัฒนา MVP ที่มีฟีเจอร์หลัก (Daily Reading + 3-Card Spread) เพื่อ validate product-market fit
- สร้างแพลตฟอร์มที่รองรับ SEO และ Content Marketing เพื่อ organic growth ระยะยาว
- ออกแบบระบบที่สามารถ track และวัด conversion ได้อย่างมีประสิทธิภาพ
- สร้าง user experience ที่มีเอกลักษณ์ด้วย Mystical/Spiritual aesthetic และ Dark Mode
- วางรากฐานสำหรับ Freemium business model ที่ยั่งยืนและมีรายได้หลากหลายช่องทาง
- เป็น Mobile-first application ที่ตอบโจทย์กลุ่มเป้าหมายที่ใช้งานผ่านมือถือเป็นหลัก

### Background Context

Web App ดูดวงไพ่ยิปซีนี้เกิดจากการเห็นโอกาสในตลาด spiritual และ wellness ที่กำลังเติบโตในประเทศไทย โดยกลุ่มเป้าหมายหลักคือ (1) คนที่ชอบดูดวงเป็นประจำและใช้เป็นเครื่องมือในการตัดสินใจ และ (2) คนทำงานที่เครียดและต้องการหาคำตอบหรือความสบายใจ

ปัจจุบันแอปพลิเคชันดูดวงไพ่ยิปซีส่วนใหญ่ยังขาดการออกแบบ UX/UI ที่ดี มีปัญหาด้านความเร็ว และไม่ได้ optimize สำหรับ SEO ทำให้การค้นหาและเข้าถึงผู้ใช้ใหม่ทำได้ยาก โปรเจกต์นี้จึงมุ่งเน้นการสร้างประสบการณ์ที่รวดเร็ว สวยงาม และเข้าถึงง่ายผ่าน Content Marketing และ Digital-first strategy

โปรเจกต์จะใช้ Next.js 14+ กับ Vercel เป็น technology stack หลักเพื่อรับประกันความเร็วและ SEO capabilities ที่เหนือกว่า พร้อมทั้งติดตั้ง analytics tools (GA4, Meta Pixel, Hotjar) ตั้งแต่เริ่มต้นเพื่อวัดผลและปรับปรุงอย่างต่อเนื่อง

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-07 | 0.3 | Added "MVP Scope & Out of Scope" section with 16 post-MVP spreads deferred to Product Roadmap; Created docs/product-roadmap.md covering Phase 2-5; Addressed PM Checklist HIGH PRIORITY issue #4 | John (PM) |
| 2025-12-30 | 0.2 | Updated Story 1.14 with 4-stage Quality Gate Framework; Added Anthropic Claude API section in Technical Assumptions; Aligned with QA Content Quality Assurance Strategy | John (PM) |
| 2025-12-29 | 0.1 | Initial PRD draft from brainstorming session | John (PM) |

## Requirements

### Functional

- **FR1:** ระบบต้องรองรับการเลือกไพ่แบบ Daily Reading (สุ่มเลือก 1 ใบ) พร้อมแสดงผลการดูดวงทันที
- **FR2:** ระบบต้องรองรับการเลือกไพ่แบบ 3-Card Spread (Past-Present-Future) พร้อมตีความแต่ละตำแหน่ง
- **FR3:** ผู้ใช้สามารถพลิกไพ่ด้วย animation แบบ 3D และมี interaction ที่ smooth
- **FR4:** ระบบต้องแสดงผลการดูดวง (reading result) พร้อมคำอธิบายความหมายของไพ่แต่ละใบ
- **FR5:** ผู้ใช้สามารถสร้างบัญชีและ login เพื่อเข้าถึงฟีเจอร์เพิ่มเติม (optional สำหรับ free users)
- **FR6:** ผู้ใช้ที่ login แล้วสามารถดูประวัติการดูดวงย้อนหลังได้ทั้งหมด
- **FR7:** ผู้ใช้สามารถแชร์ผลการดูดวงไปยัง social media (Instagram, Twitter, Facebook) ในรูปแบบภาพที่สวยงาม
- **FR8:** ระบบต้องมีหน้า landing page ที่อธิบาย product value และ call-to-action ชัดเจน
- **FR9:** ระบบต้องมีคู่มือไพ่ยิปซีทั้ง 78 ใบ พร้อมคำอธิบายความหมาย (Tarot guide/encyclopedia)
- **FR10:** ผู้ใช้สามารถเลือกธีมสีหรือสไตล์การ์ดได้ (personalization)
- **FR11:** ระบบต้องมี tutorial/onboarding สั้นๆ (ไม่เกิน 30 วินาที) สำหรับผู้ใช้ใหม่ และสามารถ skip ได้
- **FR12:** ผู้ใช้สามารถตั้งคำถามก่อนเลือกไพ่ได้ (optional question input) เพื่อให้การดูดวงมี context

### Non Functional

- **NFR1:** หน้าเว็บต้องโหลดเสร็จภายใน 1 วินาที (First Contentful Paint < 1s) บน mobile 4G
- **NFR2:** ระบบต้องรองรับ SEO อย่างเต็มรูปแบบ (meta tags, structured data, sitemap, server-side rendering)
- **NFR3:** ระบบต้องติดตั้ง conversion tracking tools อย่างน้อย 3 ระบบ: Google Analytics 4, Meta Pixel, และ Hotjar
- **NFR4:** UI/UX ต้องเป็น Dark Mode เป็นหลัก พร้อม Mystical/Spiritual aesthetic
- **NFR5:** ระบบต้องเป็น Progressive Web App (PWA) ที่สามารถติดตั้งบน home screen ได้
- **NFR6:** รูปภาพทั้งหมดต้องใช้ lazy loading และ optimization เพื่อลดเวลาโหลด
- **NFR7:** ระบบต้อง responsive และทำงานได้ดีบนทุก device (mobile-first approach)
- **NFR8:** ระบบต้องรักษาความเป็นส่วนตัวของผู้ใช้ โดยข้อมูลการดูดวงต้องเข้ารหัสและปลอดภัย
- **NFR9:** Animation และ transition ต้องมี smooth performance (60fps) และไม่ทำให้ระบบช้า
- **NFR10:** ระบบต้องสามารถ scale ได้เมื่อมีผู้ใช้เพิ่มขึ้น (ใช้ Vercel serverless architecture)

## User Interface Design Goals

### Overall UX Vision

สร้างประสบการณ์การดูดวงที่รู้สึก **intimate, mystical, และ calming** ให้กับผู้ใช้ โดยผสมผสานความลึกลับแบบ spiritual กับความทันสมัยและใช้งานง่าย เหมือนการมีที่ปรึกษาส่วนตัวที่เข้าใจและให้กำลังใจตลอดเวลา

**Core UX Pillars:**
- **Emotional Connection:** สร้างความรู้สึกใกล้ชิด อบอุ่น และปลอดภัย ไม่ใช่แค่เครื่องมือ แต่เป็น personal companion
- **Effortless Simplicity:** ใช้งานได้ทันทีโดยไม่ต้องเรียนรู้ เหมือน intuitive natural ตั้งแต่ครั้งแรก
- **Visual Delight:** ทุก interaction มี craft และ attention to detail ที่ทำให้รู้สึก premium และพิเศษ
- **Respectful Speed:** รวดเร็วแต่ไม่รีบร้อน มี rhythm ที่เหมาะสมกับ moment of reflection

### Key Interaction Paradigms

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

### Core Screens and Views

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

### Accessibility: WCAG AA

เป้าหมายคือ **WCAG 2.1 Level AA** เพื่อให้ผู้ใช้ทุกคนเข้าถึงได้

**Key Considerations:**
- Color contrast ratio ≥ 4.5:1 สำหรับ text (แม้ใน Dark Mode)
- Keyboard navigation สำหรับทุก interaction
- Screen reader friendly (ARIA labels, semantic HTML)
- Focus indicators ชัดเจน
- Alternative text สำหรับรูปภาพทุกรูป
- ไม่ใช้สีเพียงอย่างเดียวในการสื่อความหมาย

**Rationale:** Level AA เป็น industry standard และทำได้โดยไม่กระทบ design มากนัก, เพิ่ม audience reach

### Branding

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

### Target Device and Platforms: Web Responsive (Mobile-First)

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

## Technical Assumptions

### Repository Structure: Monorepo

**Decision:** ใช้ **Monorepo** structure สำหรับโปรเจกต์นี้

**Rationale:**
- MVP มีเพียง web app เดียว ไม่มี mobile app หรือ backend services แยกกัน
- Monorepo ช่วยให้ manage dependencies และ shared code ง่ายขึ้น
- ในอนาคตถ้ามี admin dashboard หรือ API services แยก สามารถอยู่ใน repo เดียวกันได้
- Next.js App Router รองรับ monorepo structure ได้ดีด้วย Turborepo หรือ pnpm workspaces

**Structure Preview:**
```
/
├── apps/
│   └── web/          # Next.js web app (main product)
├── packages/
│   ├── ui/           # Shared UI components
│   ├── config/       # Shared configs (ESLint, TypeScript)
│   └── types/        # Shared TypeScript types
└── package.json      # Root package.json
```

### Service Architecture: Monolith (Serverless Functions)

**Decision:** **Monolithic application** ที่ใช้ **Serverless Functions** บน Vercel

**Rationale:**
- MVP ไม่ซับซ้อนพอที่จะต้อง microservices หรือ services แยกกัน
- Next.js App Router + API Routes ให้ full-stack capabilities ภายใน codebase เดียว
- Vercel Serverless Functions scale automatically โดยไม่ต้อง manage infrastructure
- ลด operational complexity และค่าใช้จ่ายในช่วงเริ่มต้น
- Database (Supabase) เป็น managed service แยกต่างหาก

**Architecture Components:**
- **Frontend:** Next.js 14+ (App Router) with React Server Components
- **API Layer:** Next.js API Routes (serverless functions)
- **Database:** Supabase (PostgreSQL managed service)
- **File Storage:** Supabase Storage สำหรับ card images
- **Authentication:** Supabase Auth (รองรับ social login, email/password)

**Trade-off:** ถ้าในอนาคตโปรเจกต์เติบโตมาก อาจต้อง refactor ไปเป็น microservices แต่ตอนนี้ monolith เหมาะสมกว่า

### Testing Requirements: Unit + Integration Tests

**Decision:** **Unit Testing + Integration Testing** สำหรับ MVP

**Test Coverage Strategy:**
- **Unit Tests (60%):** 
  - Business logic functions
  - Utility functions (card shuffle, reading interpretation)
  - React component logic (ไม่รวม visual)
  - Target: >70% code coverage
  
- **Integration Tests (30%):**
  - API endpoints (Next.js API routes)
  - Database operations (CRUD for readings, users)
  - Authentication flows
  - Critical user journeys
  
- **E2E Tests (10%):**
  - Happy path: Landing → Select reading → Get result
  - User signup and login
  - รัน E2E บน CI/CD ก่อน deploy production

**Testing Tools:**
- **Unit:** Vitest (fast, modern, compatible with Next.js)
- **Integration:** Vitest + MSW (Mock Service Worker) for API mocking
- **E2E:** Playwright (cross-browser, reliable)
- **Component Testing:** React Testing Library

**Rationale:**
- MVP ต้องมี confidence ว่า core features work correctly
- Unit + Integration tests ให้ balance ระหว่าง coverage กับ development speed
- ไม่ทำ full testing pyramid (100% coverage) เพราะจะช้าเกินไป แต่ focus ที่ critical paths
- E2E tests จำกัดเฉพาะ happy paths เพราะ maintain ยาก

**Manual Testing:**
- Browser compatibility testing (Safari, Chrome, Firefox)
- Mobile device testing (iOS, Android)
- Accessibility testing (keyboard nav, screen readers)

### Additional Technical Assumptions and Requests

**Frontend Framework & Language:**
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS Modules สำหรับ component-specific styles
- **State Management:** React Context + Zustand (lightweight, no Redux overhead)
- **Form Handling:** React Hook Form + Zod (type-safe validation)

**Why Next.js 14+?**
- ✅ SSR & Static Generation → SEO optimization
- ✅ React Server Components → Performance (less JavaScript)
- ✅ Built-in Image Optimization → Fast loading
- ✅ API Routes → Full-stack capability
- ✅ Vercel deployment → Zero-config, automatic scaling
- ✅ Active community, extensive documentation

**Backend & Database:**
- **Database:** Supabase (PostgreSQL + Realtime subscriptions)
- **ORM:** Prisma (type-safe database client)
- **API Design:** RESTful API via Next.js API Routes
- **Authentication:** Supabase Auth (JWT-based)
- **File Storage:** Supabase Storage (S3-compatible)

**Why Supabase?**
- ✅ Free tier เหมาะกับ MVP (50,000 monthly active users)
- ✅ PostgreSQL → Robust, scalable relational database
- ✅ Built-in auth, storage, realtime → All-in-one
- ✅ Type-safe with Prisma
- ✅ Row Level Security → Data privacy out-of-the-box
- ❌ Alternative: Firebase (NoSQL) แต่ PostgreSQL ดีกว่าสำหรับ relational data

**Performance & Optimization:**
- **Image Optimization:** Next.js Image component + WebP format
- **Code Splitting:** Automatic with Next.js App Router
- **Caching Strategy:** 
  - Static pages: ISR (Incremental Static Regeneration)
  - Dynamic data: SWR (stale-while-revalidate)
  - Card content: CDN caching (immutable, long TTL)
- **Bundle Size:** Keep JavaScript < 200KB (initial load)

**Analytics & Monitoring:**
- **Core Analytics:** Google Analytics 4 (GA4)
- **Conversion Tracking:** Meta Pixel (Facebook/Instagram ads)
- **User Behavior:** Hotjar (heatmaps, session recordings)
- **Performance Monitoring:** Vercel Analytics (Web Vitals)
- **Error Tracking:** Sentry (client & server errors)
- **Product Analytics:** PostHog (self-hosted option, GDPR-friendly)

**SEO & Content:**
- **Meta Tags:** Next.js Metadata API
- **Structured Data:** JSON-LD for rich snippets
- **Sitemap:** Auto-generated with next-sitemap
- **Robots.txt:** Custom config for crawlers
- **Open Graph:** Social sharing previews (Twitter, Facebook)

**DevOps & Deployment:**
- **Hosting:** Vercel (primary choice)
- **Domain:** Custom domain with SSL (Vercel managed)
- **CI/CD:** Vercel Git integration (auto-deploy on push)
- **Environment:** Development, Staging, Production
- **Secrets Management:** Vercel Environment Variables

**Third-Party Services:**
- **Payment Gateway (Future):** Stripe (subscription management)
- **Email Service (Future):** SendGrid หรือ Resend (transactional emails)
- **CDN:** Vercel Edge Network (automatic)
- **AI Content Generation:** Anthropic Claude API (Claude 3.5 Sonnet)

**AI Content Generation (Anthropic Claude API):**
- **Purpose:** Generate 78 tarot card content in Thai language with human-verified quality
- **Model:** Claude 3.5 Sonnet (superior Thai language capabilities, context-aware generation)
- **Usage:** One-time content generation during MVP development (Epic 1, Story 1.14)
- **Cost:** ~฿32 for 78 cards (~฿0.41 per card) - extremely cost-effective
- **Quality Assurance:** 4-stage Quality Gate Framework with mandatory expert review
- **Timeline:** Content generation in <20 minutes, full quality review in 2-3 days, total 5 days
- **Why Claude over GPT-4:** Superior Thai language quality, better cultural understanding, more natural tone
- **Alternative:** Manual content writing (estimated 40-60 hours at ฿500-1,000/hour = ฿20,000-60,000)
- **Risk Mitigation:** Human experts review 100% of AI-generated content before production deployment
- **Pipeline:** `pnpm generate:tarot-content` → automated validation → expert review → `pnpm prisma:seed`

**Development Tools:**
- **Package Manager:** pnpm (faster than npm/yarn)
- **Code Quality:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged (pre-commit checks)
- **Version Control:** Git + GitHub
- **Documentation:** README.md + Storybook (component docs)

**Browser & Device Support:**
- **Minimum Versions:**
  - iOS Safari 14+
  - Android Chrome 90+
  - Desktop Chrome/Firefox/Safari/Edge (last 2 versions)
- **Progressive Enhancement:** Core functionality works without JavaScript (minimal)
- **Graceful Degradation:** Fallbacks สำหรับ animations และ advanced features

**Constraints & Considerations:**
- **Budget:** Target ค่าใช้จ่าย < $50/month ในช่วง MVP (ใช้ free tiers)
- **Development Timeline:** 2-4 สัปดาห์ สำหรับ MVP
- **Team Size:** 1-2 developers, 1 designer, 1 content writer
- **Data Privacy:** PDPA compliance (Thailand) - ต้องมี privacy policy และ consent mechanism
- **Localization:** Thai language เป็นหลัก, English secondary (future)

## Epic List

**Note:** This PRD covers **Phase 1 (MVP)** with 4 epics delivering 2 guest spreads. For post-MVP features including 16 additional spreads (Login tier + Premium tier) and future innovations, see **[Product Roadmap](./product-roadmap.md)**.

### Epic 1: Foundation & Core Reading Experience
Establish project infrastructure (Next.js app, Supabase, deployment pipeline, analytics) และส่งมอบ core tarot reading functionality (Daily Reading + 3-Card Spread) ที่ใช้งานได้จริงพร้อม basic UI และ mobile-responsive design

### Epic 2: User Account & Reading History
Enable user authentication (signup/login) และระบบจัดเก็บประวัติการดูดวง เพื่อให้ผู้ใช้สามารถกลับมาดูผลการดูดวงย้อนหลังได้ และเป็น foundation สำหรับ freemium model ในอนาคต

### Epic 3: Social Sharing & Content Discovery
เพิ่มความสามารถในการแชร์ผลการดูดวงไปยัง social media พร้อมระบบ Tarot Encyclopedia สำหรับ SEO และ content marketing เพื่อ organic growth

### Epic 4: Personalization & Enhanced UX
เพิ่ม personalization features (theme selection, daily reminders, question input) และปรับปรุง UX/UI ให้มี polish และ animations ที่สมบูรณ์ตามที่ออกแบบไว้

## MVP Scope & Out of Scope

### ✅ In Scope (Phase 1 - This PRD)

**Core Features:**
- 2 tarot spreads: Daily Reading (1 card) + 3-Card Spread (Past-Present-Future)
- Anonymous usage (no login required)
- Optional user accounts with reading history
- Social sharing capabilities
- Tarot encyclopedia (78 cards)
- Blog/content marketing foundation
- Personalization (themes, reminders, notes, favorites)
- Progressive Web App (PWA)

**Platform:**
- Web responsive (mobile-first)
- Modern browsers support
- Dark mode UI with mystical aesthetic

**Timeline:** 11-14 weeks (3-3.5 months)

### ❌ Out of Scope (Post-MVP - See Product Roadmap)

**Login Tier Spreads (Phase 2):**
- Love & Relationships spread (3 cards)
- Career & Money spread (3 cards)
- Yes/No Question spread (1 card)

**Premium Spreads (Phase 3-4):**
- Celtic Cross (10 cards)
- Decision Making (5 cards)
- Self Discovery (5 cards)
- Shadow Work (7 cards)
- Chakra Alignment (7 cards)
- Relationship Deep Dive (7 cards)
- Friendship Reading (4 cards)
- Career Path (6 cards)
- Financial Abundance (5 cards)
- Monthly Forecast (4 cards)
- Year Ahead (13 cards)
- Elemental Balance (4 cards)
- Zodiac Wheel (12 cards)

**Payment & Monetization (Phase 3):**
- Subscription system (3 tiers: Basic/Pro/VIP)
- Payment gateway integration (Stripe)
- Feature gating by subscription tier
- Billing and invoice management

**Advanced Features (Phase 4-5):**
- AI-powered personalized interpretations
- Spread recommendation engine
- Reading pattern analysis
- Advanced analytics dashboard
- Community platform
- Mobile native apps (iOS/Android)

**Moonshots (Phase 5):**
- Voice-activated tarot reading
- AR tarot card experience
- Personalized AI tarot coach
- Platform expansion (Oracle cards, I-Ching, Astrology)

**Rationale for Deferral:**
- MVP focuses on core value validation (2 spreads sufficient)
- 18-spread portfolio requires phased rollout (content + complexity)
- Payment system needs proven user demand first
- Advanced features need user data and feedback
- Moonshots require R&D investment and market validation

**Reference:** See [Product Roadmap](./product-roadmap.md) for Phase 2-5 detailed planning

## Epic 1: Foundation & Core Reading Experience

**Epic Goal:** 

สร้างโครงสร้างพื้นฐานของโปรเจกต์ (Next.js app, Supabase database, deployment pipeline, analytics integration) และส่งมอบฟีเจอร์การดูดวงหลัก 2 รูปแบบ (Daily Reading และ 3-Card Spread) ที่ผู้ใช้สามารถเข้ามาใช้งานได้ทันทีผ่าน mobile และ desktop โดยไม่ต้องสมัครสมาชิก พร้อมทั้ง UI/UX ที่สวยงามตามที่ออกแบบไว้ (Dark Mode, Mystical aesthetic) และ performance ที่รวดเร็ว (<1 วินาที)

Epic นี้เป็น foundation สำคัญที่จะให้เราสามารถ validate product-market fit ได้เร็วที่สุด และเป็นฐานสำหรับ epics ถัดไปทั้งหมด

---

### Story 1.1: Project Setup & Infrastructure Foundation

**As a** developer,  
**I want** Next.js 14 project with TypeScript, Tailwind CSS, and essential tooling configured,  
**so that** the team has a solid foundation to build features efficiently with type safety and modern development practices.

#### Acceptance Criteria

1. Next.js 14+ project initialized with App Router and TypeScript strict mode enabled
2. Tailwind CSS configured with custom theme (purple, blue, gold color palette from branding section)
3. Project structure organized: `/app`, `/components`, `/lib`, `/types`, `/public`
4. ESLint + Prettier configured with consistent code style rules
5. Git repository initialized with `.gitignore` for Next.js projects
6. pnpm configured as package manager with `pnpm-workspace.yaml` for monorepo support
7. Environment variables template (`.env.example`) created with placeholders for Supabase, analytics keys
8. README.md includes setup instructions and project overview
9. Vercel project created and connected to Git repository
10. Development server runs successfully on `localhost:3000`

---

### Story 1.2: Database Schema & Supabase Integration

**As a** developer,  
**I want** Supabase project configured with database schema for cards and readings,  
**so that** the application can store and retrieve tarot card data and user readings efficiently.

#### Acceptance Criteria

1. Supabase project created with PostgreSQL database
2. Prisma ORM installed and configured with Supabase connection
3. Database schema includes tables: `cards` (78 tarot cards), `readings` (reading sessions), `reading_cards` (cards in each reading)
4. `cards` table schema: `id`, `name`, `name_th`, `suit`, `number`, `meaning_upright`, `meaning_reversed`, `image_url`, `created_at`
5. `readings` table schema: `id`, `reading_type`, `question`, `cards_drawn`, `created_at`, `user_id` (nullable for anonymous)
6. `reading_cards` table schema: `id`, `reading_id`, `card_id`, `position`, `is_reversed`
7. Database seeded with all 78 tarot cards data (Major Arcana 22 cards + Minor Arcana 56 cards) in Thai and English
8. Prisma Client generated and tested with basic CRUD operations
9. Connection pooling configured for optimal performance
10. Database accessible from Next.js API routes with successful test query

---

### Story 1.3: Analytics & Monitoring Setup

**As a** product manager,  
**I want** analytics and error tracking tools integrated from day one,  
**so that** we can measure user behavior, track conversions, and monitor application health from the MVP launch.

#### Acceptance Criteria

1. Google Analytics 4 (GA4) integrated with Next.js App Router using `gtag.js`
2. GA4 tracking: page views, custom events (card_selected, reading_completed, reading_type)
3. Meta Pixel (Facebook/Instagram) integrated for future ad campaigns
4. Hotjar script installed for heatmaps and session recordings (targeting production only)
5. Vercel Analytics enabled for Web Vitals monitoring (LCP, FID, CLS)
6. Sentry installed for client-side and server-side error tracking
7. Environment-based tracking: analytics disabled in development, enabled in production
8. Cookie consent banner implemented for PDPA compliance (simple version)
9. All tracking scripts loaded asynchronously to not block page rendering
10. Analytics verified working in production with test events visible in GA4 DebugView

---

### Story 1.4: Landing Page & Core Layout

**As a** first-time visitor,  
**I want** to see an attractive landing page that explains what the app does and invites me to try it,  
**so that** I understand the value and feel motivated to start my first tarot reading.

#### Acceptance Criteria

1. Landing page (`/`) created with hero section showing app value proposition in Thai
2. Hero section includes: catchy headline, short description, prominent CTA button "เริ่มดูดวง"
3. Dark mode UI implemented with mystical/spiritual aesthetic (deep purple background, soft gradients)
4. Responsive layout: mobile-first design that adapts to tablet and desktop
5. Navigation header includes: logo/app name, "ดูดวง", "คู่มือไพ่" (placeholder link)
6. Footer includes: copyright, privacy policy link (placeholder), social links (placeholder)
7. Typography uses defined font families: serif for headings, sans-serif for body text
8. Page loads in <1 second on 4G mobile (verified with Lighthouse)
9. SEO meta tags: title, description, Open Graph tags for social sharing
10. Landing page accessible via keyboard navigation and screen reader friendly

---

### Story 1.5: Card Data Model & Image Assets

**As a** developer,  
**I want** card images optimized and accessible through the application,  
**so that** cards display beautifully and load quickly across all devices.

#### Acceptance Criteria

1. All 78 tarot card images sourced or created (front side images)
2. Card back image designed with mystical theme consistent with branding
3. Images optimized: WebP format, multiple sizes (thumbnail, medium, large)
4. Images stored in `/public/cards/` directory with consistent naming: `{suit}-{number}.webp`
5. Next.js Image component wrapper created for card images with lazy loading
6. Card component created: displays card image, handles flip animation, responsive sizing
7. Image alt text generated for accessibility (e.g., "The Fool tarot card")
8. Fallback image handling: if card image fails to load, show placeholder
9. Images tested on mobile and desktop with acceptable load times
10. Card images total size optimized to <5MB for all 78 cards combined

---

### Story 1.6: Card Shuffle & Random Selection Logic

**As a** user,  
**I want** the card selection to feel random and fair,  
**so that** I trust the reading results are genuine and not predictable.

#### Acceptance Criteria

1. Card shuffle algorithm implemented using cryptographically secure randomization
2. Function `shuffleDeck()` returns randomized array of all 78 cards
3. Function `drawCards(count)` selects specified number of unique cards from shuffled deck
4. Each card has 50% chance to be reversed (upside down) independently
5. Card selection state managed: prevents drawing same card twice in one reading session
6. Unit tests verify: cards are truly random, no duplicate cards in single reading, distribution is fair over many iterations
7. Shuffle animation visualization (subtle UI feedback) when cards are being shuffled
8. Seed-based randomization option for testing/debugging purposes (dev environment only)
9. Reading session ID generated for tracking which cards were drawn together
10. Performance: shuffle and draw operations complete in <50ms

---

### Story 1.7: Daily Reading Flow (1 Card)

**As a** user seeking quick daily guidance,  
**I want** to draw a single card and see its meaning,  
**so that** I can get a quick insight or reflection for my day.

#### Acceptance Criteria

1. Daily Reading selection page (`/reading/daily`) created with simple, calming UI
2. User sees: brief explanation of Daily Reading (1 card for today's guidance), optional question input field
3. "เลือกไพ่" button triggers card selection flow
4. Card selection screen displays: fan of face-down cards (visual representation, not interactive yet - simplified for MVP)
5. User taps screen or clicks button to "draw" one random card
6. Card flip animation (3D transform) reveals the drawn card smoothly (~800ms duration)
7. Reading result page displays: card image (large), card name (Thai + English), upright/reversed indicator
8. Reading interpretation shown: meaning text (upright or reversed based on draw), advice section
9. Action buttons: "แชร์" (placeholder for Epic 3), "ดูอีกครั้ง", "กลับหน้าแรก"
10. Reading saved to database (readings table) for anonymous user (no login required)
11. Full flow: selection → draw → reveal → result works smoothly on mobile and desktop
12. Analytics event tracked: `reading_started`, `reading_completed`, `reading_type: daily`

---

### Story 1.8: 3-Card Spread Flow (Past-Present-Future)

**As a** user wanting deeper insight,  
**I want** to draw three cards representing past, present, and future,  
**so that** I can understand the progression of my situation and what to expect.

#### Acceptance Criteria

1. 3-Card Spread selection page (`/reading/three-card`) created with explanation of spread
2. User sees: description of Past-Present-Future positions, optional question input field
3. "เลือกไพ่" button triggers 3-card selection flow
4. Card selection screen displays fan of face-down cards (simplified MVP version)
5. User draws 3 cards sequentially (visual feedback showing position being filled)
6. Cards flip one by one with staggered timing: first card → second card → third card (~2.5s total)
7. Reading result page displays: 3 cards horizontally on desktop, stacked vertically on mobile
8. Each card position labeled: "อดีต (Past)", "ปัจจุบัน (Present)", "อนาคต (Future)"
9. Each card shows: image, name, position-specific interpretation
10. Summary section combines insights from all 3 cards with cohesive narrative
11. Action buttons: "แชร์", "ดูอีกครั้ง", "กลับหน้าแรก"
12. Reading saved to database with all 3 cards and positions recorded
13. Analytics events tracked: `reading_type: three_card`, positions tracked separately

---

### Story 1.9: Reading Type Selection Page

**As a** user,  
**I want** to choose between Daily Reading and 3-Card Spread,  
**so that** I can select the reading type that matches my current need.

#### Acceptance Criteria

1. Reading selection page (`/reading`) created as gateway to reading types
2. Page displays two clear options: "ดูดวงประจำวัน (Daily Reading)" and "ไพ่ 3 ใบ (3-Card Spread)"
3. Each option shows: icon/visual, name, short description (1-2 sentences), estimated time
4. Cards displayed as interactive buttons/cards with hover effects
5. Clicking option navigates to respective reading flow (`/reading/daily` or `/reading/three-card`)
6. Mobile: options stacked vertically with thumb-friendly tap targets (≥44x44px)
7. Desktop: options side-by-side with hover states
8. Back button or link to return to home page
9. Page loads quickly (<500ms) with smooth navigation transitions
10. Analytics tracked: which reading type selected, time spent on selection page

---

### Story 1.10: Responsive UI Polish & Dark Mode

**As a** user on any device,  
**I want** the app to look beautiful and work smoothly whether I'm on mobile, tablet, or desktop,  
**so that** I have a premium experience regardless of how I access the app.

#### Acceptance Criteria

1. All pages responsive: tested on iPhone SE (320px), iPad (768px), Desktop (1280px+)
2. Dark mode fully implemented: all pages use dark charcoal background (#0F172A), soft white text (#F1F5F9)
3. Color contrast ratios meet WCAG AA standards (≥4.5:1 for normal text)
4. Touch targets on mobile ≥44x44px for buttons and interactive elements
5. Typography scales appropriately: larger text on desktop, comfortable reading size on mobile
6. Images responsive: Next.js Image component used with responsive sizes
7. Navigation optimized: hamburger menu on mobile (if needed), full nav on desktop
8. Animations perform at 60fps on mobile devices (tested on actual iPhone and Android)
9. Loading states: skeleton screens or spinners during data fetching
10. Error states: friendly error messages with recovery actions (e.g., "Something went wrong, try again")
11. Accessibility: keyboard navigation works, focus indicators visible, ARIA labels where needed
12. Cross-browser tested: Safari iOS 14+, Chrome Android 90+, Desktop browsers (Chrome, Firefox, Safari, Edge)

---

### Story 1.11: Performance Optimization & SEO Foundation

**As a** product manager,  
**I want** the app to load blazingly fast and be discoverable by search engines,  
**so that** users have a great first impression and we can acquire organic traffic.

#### Acceptance Criteria

1. Lighthouse Performance score ≥90 on mobile, ≥95 on desktop
2. Core Web Vitals: LCP <1.5s, FID <100ms, CLS <0.1
3. All images lazy-loaded except hero section images
4. Code splitting: only load JavaScript needed for current page
5. Fonts optimized: use `next/font` for automatic font optimization
6. Critical CSS inlined, non-critical CSS loaded asynchronously
7. Service Worker registered for PWA (basic caching strategy)
8. Sitemap.xml generated with all public pages
9. Robots.txt configured to allow search engine crawling
10. Each page has unique meta title and description (SEO-optimized, includes keywords)
11. Structured data (JSON-LD) added for Organization and WebSite schemas
12. Open Graph tags for social sharing: og:image, og:title, og:description on all pages

---

### Story 1.12: Error Handling & User Feedback

**As a** user,  
**I want** clear feedback when something goes wrong or when actions are processing,  
**so that** I'm never confused about what's happening in the app.

#### Acceptance Criteria

1. Toast notification system implemented for success/error messages
2. Loading states: spinner or skeleton screen shown during card drawing, data fetching
3. Error boundaries catch React errors and display friendly fallback UI
4. API error handling: network errors, database errors show user-friendly messages
5. Form validation: input fields show inline validation errors (e.g., question too long)
6. 404 page designed: "Page not found" with link back to home
7. 500 error page: "Something went wrong" with option to report issue or retry
8. Empty states: when no data available, show helpful empty state with CTA
9. Offline handling: if offline, show message "Please check your internet connection"
10. All errors logged to Sentry for debugging, with appropriate context (user action, page, error details)

---

### Story 1.13: Basic CI/CD Pipeline

**As a** developer,  
**I want** automated testing and deployment pipeline,  
**so that** we can ship features confidently and quickly without manual deployment steps.

#### Acceptance Criteria

1. Vercel Git integration configured: auto-deploy on push to `main` branch
2. Preview deployments created automatically for pull requests
3. Environment variables configured in Vercel: production, preview, development
4. Build process: TypeScript type-checking passes before deployment
5. Lint check runs in CI: ESLint must pass with no errors
6. Unit tests run in CI: Vitest tests must pass (even if test coverage minimal at this stage)
7. Deployment notifications: team notified in Slack/Discord when deployment succeeds or fails (optional but nice)
8. Production URL secured with HTTPS (automatic with Vercel)
9. Custom domain connected (if available) or using Vercel subdomain
10. Rollback capability: previous deployment version can be restored quickly through Vercel dashboard

---

### Story 1.14: Content Integration & Card Meanings

**As a** user,  
**I want** to see accurate and helpful tarot card interpretations,  
**so that** I can understand my reading and apply the insights to my life.

#### Acceptance Criteria

**Content Generation & Quality Assurance:**

1. All 78 tarot cards content generated using AI (Anthropic Claude 3.5 Sonnet) with mandatory human verification
2. Content passes 4-stage Quality Gate Framework:
   - **Gate 1 (Automated):** Structural validation, length checks, language detection, content safety (100% pass rate required)
   - **Gate 2 (Tarot Accuracy):** Expert review for traditional Rider-Waite accuracy (≥4.5/5 rating, ≥95% approval rate)
   - **Gate 3 (Thai Language):** Native speaker review for grammar, naturalness, cultural appropriateness (≥4.5/5 rating)
   - **Gate 4 (Final Approval):** PM + QA sign-off with technical and business validation
3. Content includes complete fields: name (Thai + English), upright meaning (200-1000 words), reversed meaning (200-1000 words), keywords (5-10 each), advice (100-500 words)
4. Thai language quality: conversational and accessible tone, no literal translation artifacts, culturally appropriate
5. Content accuracy verified: meanings align with traditional tarot interpretations (Rider-Waite standard)

**Technical Implementation:**

6. Content stored in database (`cards` table) via Prisma schema
7. Content generation pipeline implemented: `pnpm generate:tarot-content` → automated validation → expert review → import to DB
8. Export formats available: CSV (human review), JSON (database import)
9. Position-specific interpretations for 3-Card Spread: Past, Present, Future contexts included in advice
10. Content displayable on reading result pages with proper Thai font rendering and mobile-responsive formatting

**Documentation & Audit Trail:**

11. Quality gate evidence documented: automated test results, expert review sheets, sign-offs
12. Expert credentials documented: Tarot expert and Thai proofreader qualifications on file
13. Revision history tracked: all content changes versioned in git with review comments in PR
14. Content approved by Tarot expert, Thai proofreader, QA lead, and product owner before Epic 1 completion

**Timeline & Budget:**

15. Content generation and approval completed within 5 days
16. Budget within limits: ฿7,500-11,700 (API costs ฿30-75 + expert review ฿3,000-6,000 + proofreading ฿2,000-3,200)

**Success Criteria:**

17. Zero P0 bugs related to content in production
18. User complaints about content accuracy <1% of total readings
19. Reading completion rate ≥80% (users read full interpretation)
20. Average time-on-page ≥2 minutes (indicating engagement with content)

---

### Story 1.15: MVP Testing & Bug Fixes

**As a** QA tester,  
**I want** all critical user flows tested and major bugs fixed,  
**so that** we ship a stable MVP that users can rely on.

#### Acceptance Criteria

1. Full regression testing completed: all user stories in Epic 1 tested on mobile and desktop
2. Critical path E2E test: Land on homepage → Select reading type → Draw cards → View results (automated with Playwright)
3. Cross-browser testing: Verified working on Safari iOS, Chrome Android, Chrome/Firefox/Safari Desktop
4. Analytics verification: All GA4 events firing correctly in production (verified with GA4 DebugView)
5. Performance testing: Lighthouse scores meet targets (≥90 mobile, ≥95 desktop)
6. Accessibility testing: Keyboard navigation works, screen reader announces content properly
7. All P0 (critical) and P1 (high) bugs fixed before launch
8. P2 (medium) bugs documented for future fixes
9. Known issues documented in release notes
10. Smoke test checklist created for quick verification after deployments

---

## Epic 2: User Account & Reading History

**Epic Goal:**

เพิ่มความสามารถในการสร้างบัญชีผู้ใช้และ login เข้าสู่ระบบ เพื่อให้ผู้ใช้สามารถบันทึกและเข้าถึงประวัติการดูดวงทั้งหมดได้ทุกที่ทุกเวลา สร้าง user retention และเป็น foundation สำหรับ freemium model ในอนาคต โดยรักษาประสบการณ์ที่ราบรื่น - anonymous users ยังคงใช้ได้ตามปกติ และสามารถสมัครสมาชิกได้เมื่อต้องการเก็บประวัติ

Epic นี้เพิ่ม value ให้ผู้ใช้ที่ต้องการติดตามการดูดวงย้อนหลัง เปรียบเทียบผล และสร้าง engagement ระยะยาว

---

### Story 2.1: User Authentication with Supabase Auth

**As a** new user,  
**I want** to sign up for an account easily using email or social login,  
**so that** I can save my readings and access them later from any device.

#### Acceptance Criteria

1. Supabase Auth configured with email/password authentication enabled
2. Sign up page (`/auth/signup`) created with form: email, password, confirm password, terms acceptance checkbox
3. Email validation: proper format, not already registered
4. Password validation: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
5. Password strength indicator displayed (weak/medium/strong)
6. "Sign up with Google" button integrated (Supabase OAuth Google provider)
7. "Sign up with Facebook" button integrated (Supabase OAuth Facebook provider)
8. Email verification: Supabase sends confirmation email, user must verify before full access
9. Sign up success: user redirected to profile page or previous page they were on
10. Error handling: display clear messages for duplicate email, weak password, network errors
11. Terms of service and privacy policy links included (placeholder pages)
12. PDPA compliance: consent checkbox for data collection
13. Analytics tracked: `signup_started`, `signup_completed`, `signup_method` (email/google/facebook)

---

### Story 2.2: User Login & Session Management

**As a** returning user,  
**I want** to login quickly and stay logged in,  
**so that** I don't have to re-authenticate every time I visit the app.

#### Acceptance Criteria

1. Login page (`/auth/login`) created with form: email, password
2. "Login with Google" and "Login with Facebook" buttons available
3. "Remember me" checkbox keeps user logged in for 30 days
4. "Forgot password?" link navigates to password reset flow
5. Successful login: user redirected to previous page or home page
6. Session persisted using Supabase Auth tokens (stored in localStorage or cookies)
7. Session refresh: automatically refresh token before expiration (no logout)
8. Error handling: invalid credentials show "Email or password incorrect" message
9. Rate limiting: prevent brute force attacks (max 5 attempts per 15 minutes)
10. Logout functionality: "Logout" button in navigation, clears session and redirects to home
11. Protected routes: redirect to login if user tries to access history/profile without authentication
12. Auto-login: if user has valid session, skip login and show logged-in state
13. Analytics tracked: `login_completed`, `login_method`, `logout_completed`

---

### Story 2.3: Password Reset Flow

**As a** user who forgot my password,  
**I want** to reset it via email,  
**so that** I can regain access to my account without contacting support.

#### Acceptance Criteria

1. Password reset request page (`/auth/forgot-password`) created with email input field
2. User submits email, Supabase sends password reset email
3. Success message: "Password reset link sent to your email" (even if email not found - security)
4. Reset email contains magic link valid for 1 hour
5. Clicking link redirects to password reset page (`/auth/reset-password`) with token
6. Reset password page: new password input, confirm password input, submit button
7. Password validation: same rules as signup (8+ chars, mixed case, number)
8. Successful reset: password updated, user auto-logged in, redirected to profile
9. Expired token: show "Reset link expired, request a new one" message
10. Analytics tracked: `password_reset_requested`, `password_reset_completed`

---

### Story 2.4: User Profile Page & Settings

**As a** logged-in user,  
**I want** to view and edit my profile information,  
**so that** I can keep my account details up to date.

#### Acceptance Criteria

1. Profile page (`/profile`) created with user information display
2. Displays: profile picture (placeholder or from OAuth), name, email, account created date
3. Edit profile form: update name, upload profile picture (optional)
4. Profile picture upload: max 2MB, formats: JPG, PNG, stored in Supabase Storage
5. Email change: requires re-verification (security measure)
6. Password change: current password, new password, confirm password fields
7. Account deletion option: "Delete my account" button with confirmation modal
8. Account deletion: permanently delete user data, readings, and logout
9. Settings section: email preferences (daily reminder - placeholder for Epic 4)
10. Success messages: "Profile updated successfully"
11. Validation: proper error messages for invalid inputs
12. Mobile responsive: profile page works well on all screen sizes
13. Analytics tracked: `profile_updated`, `account_deleted`

---

### Story 2.5: Database Schema for Users & Readings Association

**As a** developer,  
**I want** user readings properly associated with user accounts,  
**so that** we can retrieve user-specific reading history efficiently.

#### Acceptance Criteria

1. `users` table schema: `id` (UUID from Supabase Auth), `email`, `name`, `profile_picture_url`, `created_at`, `last_login_at`
2. `readings` table updated: `user_id` (foreign key to users, nullable for anonymous)
3. Database migration created and applied to add user_id column to existing readings
4. Prisma schema updated with User model and relationships
5. Row Level Security (RLS) policies: users can only read/write their own data
6. Index created on `readings.user_id` for fast queries
7. Cascade delete rule: if user deleted, associated readings also deleted (or anonymized)
8. Anonymous readings: readings created before login have `user_id = NULL`
9. Reading claiming: when anonymous user signs up, option to claim previous readings (bonus feature)
10. Database queries tested: fetch user readings, create reading with user_id, update user profile

---

### Story 2.6: Reading History Page

**As a** logged-in user,  
**I want** to see all my past readings in one place,  
**so that** I can review previous insights and track patterns over time.

#### Acceptance Criteria

1. Reading History page (`/history`) created, accessible only to logged-in users
2. Displays list of all user's readings in reverse chronological order (newest first)
3. Each reading item shows: date, reading type (Daily/3-Card), question (if provided), thumbnail of first card
4. Pagination or infinite scroll: load 20 readings at a time for performance
5. Filter options: "All readings", "Daily readings", "3-Card spreads"
6. Date range filter: "Last 7 days", "Last 30 days", "All time"
7. Search functionality: search by question text (future enhancement - basic version)
8. Empty state: if no readings, show "You haven't done any readings yet" with CTA button
9. Clicking reading item navigates to reading detail page
10. Mobile responsive: list view optimized for mobile with swipe gestures (optional)
11. Loading state: skeleton screens while fetching readings
12. Analytics tracked: `history_viewed`, `history_filter_used`, `reading_reopened`

---

### Story 2.7: Reading Detail Page for Past Readings

**As a** logged-in user,  
**I want** to view full details of any past reading,  
**so that** I can revisit the interpretation and reflect on the guidance.

#### Acceptance Criteria

1. Reading detail page (`/reading/[id]`) displays full reading with same layout as original result page
2. Shows: date and time of reading, reading type, question (if provided), all cards drawn
3. Cards displayed with full interpretations as shown originally
4. Immutable view: cannot re-draw or change cards (this is historical record)
5. Action buttons: "Share" (Epic 3), "Delete reading", "Back to history"
6. Delete reading: confirmation modal, permanently removes reading from history
7. URL shareable: can copy link and access from different device (if logged in)
8. 404 error: if reading ID doesn't exist or doesn't belong to user
9. Permission check: users can only view their own readings (RLS enforced)
10. Analytics tracked: `reading_detail_viewed`, `reading_deleted`

---

### Story 2.8: Onboarding Flow for New Sign-ups

**As a** new user who just signed up,  
**I want** a brief welcome experience,  
**so that** I understand what benefits I get from having an account.

#### Acceptance Criteria

1. Post-signup welcome screen or modal shows after first login
2. Welcome message: "Welcome to [App Name]! Your readings are now saved automatically."
3. Benefit highlights: "Access your readings anytime", "Track your journey", "Unlock premium features soon"
4. Optional profile completion: "Add your name and profile picture" (skippable)
5. CTA button: "Start my first reading" navigates to reading selection
6. Onboarding shown only once: flag stored in user profile or localStorage
7. Skip option: "Skip for now" closes onboarding, can access later from profile
8. Mobile friendly: onboarding works well on mobile screens
9. Analytics tracked: `onboarding_completed`, `onboarding_skipped`

---

### Story 2.9: Anonymous to Authenticated User Conversion

**As an** anonymous user who has already done readings,  
**I want** to be prompted to sign up to save my readings,  
**so that** I don't lose my reading history.

#### Acceptance Criteria

1. After 2nd or 3rd reading, show signup prompt: "Sign up to save your readings"
2. Prompt displayed as modal or banner (non-intrusive)
3. Dismiss option: user can close prompt and continue as anonymous
4. Prompt frequency: show maximum once per day (don't annoy users)
5. CTA buttons: "Sign up now" (navigates to signup), "Maybe later" (dismisses)
6. Value proposition clear: "Don't lose your readings. Sign up for free."
7. If user signs up, attempt to claim previous anonymous readings (match by device/session)
8. Reading claiming: update `user_id` for readings from same browser session
9. Claimed readings appear in user's history immediately after signup
10. Analytics tracked: `signup_prompt_shown`, `signup_from_prompt`, `readings_claimed_count`

---

### Story 2.10: Navigation & User State Display

**As a** user (logged in or anonymous),  
**I want** to see my login status in the navigation,  
**so that** I can easily access my profile or login when needed.

#### Acceptance Criteria

1. Navigation header updated: shows different state for logged-in vs anonymous users
2. Anonymous user: "Login" and "Sign up" buttons in header
3. Logged-in user: profile icon/avatar with dropdown menu
4. Dropdown menu items: "Profile", "History", "Settings", "Logout"
5. Profile icon shows first letter of name or profile picture if uploaded
6. Mobile: hamburger menu includes auth-related items appropriately
7. Active state: current page highlighted in navigation
8. Smooth transitions: login state updates immediately after authentication (no page refresh)
9. Persistent across pages: auth state maintained during navigation
10. Loading state: skeleton or placeholder while checking auth status on initial load

---

### Story 2.11: Reading Permissions & Privacy

**As a** user,  
**I want** my readings to be private and secure,  
**so that** no one else can access my personal tarot reading history.

#### Acceptance Criteria

1. Row Level Security (RLS) policies enabled on Supabase for `readings` and `users` tables
2. RLS policy: users can only SELECT, UPDATE, DELETE their own readings (`user_id = auth.uid()`)
3. Anonymous readings (user_id = NULL) readable by anyone with reading ID (if needed for sharing)
4. API routes validate authentication: return 401 Unauthorized for protected endpoints
5. Reading URLs: `/reading/[id]` checks ownership before displaying
6. Database queries: always filter by user_id when fetching readings
7. Security testing: attempt to access other user's reading → receives 403 Forbidden
8. Privacy policy updated: explain data collection, storage, and user rights (PDPA compliance)
9. User data encryption: sensitive fields encrypted at rest (Supabase handles this)
10. No data leakage: error messages don't reveal information about other users

---

### Story 2.12: User Analytics & Retention Metrics

**As a** product manager,  
**I want** to track user behavior and retention,  
**so that** we can measure the success of the authentication feature and optimize for growth.

#### Acceptance Criteria

1. Analytics events implemented for all user actions: signup, login, logout, profile update
2. Cohort tracking: new users tagged by signup date for retention analysis
3. User properties in GA4: user_id (hashed), signup_method, account_age, readings_count
4. Funnel tracking: landing → signup prompt → signup → first reading as logged-in user
5. Retention metrics: track DAU (Daily Active Users), WAU, MAU for logged-in users
6. Engagement metrics: readings per user, days since last reading, reading frequency
7. Conversion rate: anonymous users → signed up users (%)
8. Privacy compliant: no PII (personally identifiable information) sent to analytics
9. Dashboard (future): Vercel Analytics or PostHog dashboard showing key metrics
10. A/B test ready: infrastructure to test different signup prompts or flows (foundation only)

---

### Story 2.13: Email Notifications Setup (Foundation)

**As a** developer,  
**I want** email notification infrastructure in place,  
**so that** we can send transactional emails and future marketing emails.

#### Acceptance Criteria

1. Email service integrated: Supabase Email (default) or SendGrid/Resend for better deliverability
2. Email templates created: welcome email, password reset, email verification
3. Email templates branded: includes app logo, mystical theme colors, consistent styling
4. Welcome email sent automatically after signup: "Welcome to [App Name]"
5. Email verification email: includes magic link to confirm email address
6. Password reset email: includes secure reset link valid for 1 hour
7. Email deliverability tested: emails land in inbox, not spam
8. Unsubscribe link included in all emails (future marketing emails)
9. Email tracking: open rates, click rates tracked via SendGrid/Resend (optional)
10. Foundation for Epic 4: daily reminder emails (infrastructure ready, not yet implemented)

---

### Story 2.14: Performance & Security Optimization

**As a** developer,  
**I want** authentication to be fast and secure,  
**so that** users have a smooth experience and their data is protected.

#### Acceptance Criteria

1. Auth state persistence: use secure HTTP-only cookies for token storage (more secure than localStorage)
2. Token refresh logic: automatically refresh access token before expiration
3. Session timeout: inactive users logged out after 30 days (configurable)
4. HTTPS enforced: all authentication endpoints use HTTPS in production
5. CORS properly configured: only allow requests from app domain
6. Rate limiting on auth endpoints: prevent brute force attacks (max 5 login attempts per 15 min)
7. Input sanitization: prevent SQL injection, XSS attacks on all form inputs
8. Password hashing: Supabase uses bcrypt (verify configuration)
9. Auth performance: login completes in <1 second, no noticeable delay
10. Error logging: all auth errors logged to Sentry for monitoring and debugging

---

### Story 2.15: Epic 2 Testing & Quality Assurance

**As a** QA tester,  
**I want** comprehensive testing of all authentication and history features,  
**so that** we ship a stable, secure feature set that users can trust.

#### Acceptance Criteria

1. Functional testing: all user stories tested manually on mobile and desktop
2. E2E tests: critical flows automated with Playwright:
   - Full signup flow (email + password)
   - Login and logout flow
   - Password reset flow
   - View reading history
   - Delete reading
3. Security testing: attempt unauthorized access, test RLS policies, verify token security
4. Cross-browser testing: Safari iOS, Chrome Android, Desktop browsers
5. Accessibility testing: forms usable with keyboard, screen reader compatible
6. Performance testing: auth operations complete in <1s, history loads quickly
7. Edge cases tested: weak passwords, duplicate emails, expired tokens, network failures
8. Integration testing: Supabase Auth integration verified in staging environment
9. Email deliverability: test emails received and formatted correctly
10. Regression testing: Epic 1 features still work correctly with Epic 2 changes
11. All P0 and P1 bugs fixed before shipping
12. Known issues documented and prioritized for future fixes

---

## Epic 3: Social Sharing & Content Discovery

**Epic Goal:**

เพิ่มความสามารถในการแชร์ผลการดูดวงไปยัง social media platforms (Instagram, Facebook, Twitter) ในรูปแบบที่สวยงามและน่าสนใจ พร้อมสร้าง Tarot Encyclopedia ที่เป็น SEO-friendly content hub สำหรับ organic growth ระยะยาว

Epic นี้เน้นการสร้าง growth engine ผ่าน 2 channels หลัก: (1) Viral social sharing ที่ทำให้ users กลายเป็น brand ambassadors และ (2) SEO content ที่ดึง organic traffic จาก search engines เข้ามาสู่ app

---

### Story 3.1: Social Share Image Generation

**As a** user who just completed a reading,  
**I want** to share my reading result as a beautiful image on social media,  
**so that** I can share my insights with friends and showcase the app.

#### Acceptance Criteria

1. Share image generator function created using HTML Canvas API or server-side image generation
2. Image template designed: mystical background, card image(s), short interpretation text, app branding/logo
3. Daily Reading share image: shows 1 card, card name, brief meaning, subtle app watermark
4. 3-Card Spread share image: shows 3 cards horizontally, position labels (Past-Present-Future)
5. Image dimensions: 1080×1080px (Instagram square), 1200×630px (Facebook/Twitter) - generate both
6. Privacy protection: automatically exclude user's question text or personal details from share image
7. Image quality: high-res, properly compressed (< 500KB per image)
8. Color scheme: consistent with app branding (purple, gold, mystical aesthetic)
9. Typography: readable fonts, proper contrast for social media viewing
10. Image generation performance: creates image in < 2 seconds
11. Mobile optimization: works smoothly on mobile devices
12. Preview before sharing: show generated image before user confirms share

---

### Story 3.2: Social Media Share Buttons & Integration

**As a** user,  
**I want** easy-to-use share buttons after my reading,  
**so that** I can quickly post to my preferred social platform.

#### Acceptance Criteria

1. Share buttons added to reading result page: Instagram, Facebook, Twitter, Copy Link
2. Instagram share: downloads image to device (Instagram doesn't support web sharing API)
3. Facebook share: opens Facebook share dialog with pre-generated image and text
4. Twitter share: opens Twitter compose with image and customizable tweet text
5. Copy Link share: copies reading URL to clipboard with success toast notification
6. Default share text template: "[App Name] revealed [Card Name] for me today ✨ Discover your cards too!"
7. Share text customizable: user can edit text before posting (on supported platforms)
8. Share image attached automatically to share actions
9. Share analytics tracked: platform chosen, share completed, share cancelled
10. Mobile native share: use Web Share API when available for better UX
11. Fallback: if share fails, show instructions to screenshot and share manually
12. Share button styling: prominent, clear icons, consistent with app design

---

### Story 3.3: Open Graph & Social Media Meta Tags

**As a** marketer,  
**I want** proper social media meta tags on all pages,  
**so that** when users share links, they display beautifully with images and descriptions.

#### Acceptance Criteria

1. Open Graph (OG) tags implemented on all public pages: og:title, og:description, og:image, og:url, og:type
2. Twitter Card tags: twitter:card, twitter:title, twitter:description, twitter:image
3. Homepage OG image: attractive hero image showcasing app features
4. Reading result pages: dynamic OG image based on cards drawn (if shareable)
5. Encyclopedia pages: each card has unique OG image and description
6. OG image requirements: 1200×630px, < 1MB, properly hosted on CDN
7. Meta descriptions: SEO-optimized, 150-160 characters, includes keywords
8. Facebook Sharing Debugger tested: OG tags validate successfully
9. Twitter Card Validator tested: Twitter cards display correctly
10. Dynamic meta tags: Next.js Metadata API used for page-specific tags
11. Fallback image: if specific OG image not available, use default branded image

---

### Story 3.4: Tarot Encyclopedia - Card Database Page

**As a** user interested in learning about tarot,  
**I want** to browse all 78 tarot cards and their meanings,  
**so that** I can deepen my understanding and discover new insights.

#### Acceptance Criteria

1. Encyclopedia main page (`/cards`) created with all 78 cards displayed
2. Card grid layout: responsive grid (3-4 cards per row on desktop, 2 on mobile)
3. Each card thumbnail shows: card image, card name (Thai + English)
4. Cards organized by suit: Major Arcana (22 cards), Wands, Cups, Swords, Pentacles (14 cards each)
5. Tab navigation or sections: switch between suits easily
6. Card thumbnails clickable: navigate to individual card detail page
7. Visual hierarchy: Major Arcana highlighted as special (different styling)
8. Lazy loading: card images load progressively as user scrolls
9. Search functionality (basic): search box filters cards by name
10. Filter options: "All cards", "Major Arcana", "Minor Arcana", by suit
11. SEO optimized: page title "Tarot Card Encyclopedia | 78 Cards Meanings", proper heading structure
12. Breadcrumbs: Home > Encyclopedia
13. Mobile friendly: grid adapts to mobile screens, touch-friendly
14. Loading state: skeleton screens while cards load

---

### Story 3.5: Tarot Encyclopedia - Individual Card Pages

**As a** user,  
**I want** to read detailed information about each tarot card,  
**so that** I can understand its symbolism and apply it to my life.

#### Acceptance Criteria

1. Card detail page (`/cards/[slug]`) created for each of 78 cards
2. URL structure: SEO-friendly slugs (e.g., `/cards/the-fool`, `/cards/ace-of-cups`)
3. Page content includes:
   - Large card image (high quality)
   - Card name (Thai + English)
   - Card number and suit
   - Upright meaning (3-4 paragraphs, detailed)
   - Reversed meaning (3-4 paragraphs)
   - Keywords (upright and reversed)
   - Symbolism explanation (visual elements in card)
   - Advice section (how to apply this card's wisdom)
4. Related cards section: "Cards often drawn together" or "Similar energy cards"
5. CTA button: "Get your reading with this card" links to reading selection page
6. Breadcrumbs: Home > Encyclopedia > [Card Name]
7. Navigation: Previous/Next card buttons for browsing
8. Mobile responsive: all content readable and well-formatted on mobile
9. SEO optimized:
   - Page title: "[Card Name] Tarot Card Meaning - [App Name]"
   - Meta description: first 160 characters of upright meaning
   - H1: Card name, H2: sections (Upright, Reversed, Symbolism, etc.)
   - Structured data: Article schema with card information
10. Social sharing: Share buttons on card pages for educational content
11. Internal linking: link to related reading types or other cards where relevant
12. Print-friendly: CSS print styles for users who want to print card meanings

---

### Story 3.6: Encyclopedia Search & Filter Enhancement

**As a** user,  
**I want** advanced search and filtering options,  
**so that** I can quickly find specific cards or cards with certain characteristics.

#### Acceptance Criteria

1. Search functionality: real-time search as user types (debounced)
2. Search matches: card name (Thai + English), keywords, meanings
3. Search results highlighted: matching text highlighted in results
4. Filter by suit: Major Arcana, Wands, Cups, Swords, Pentacles, All
5. Filter by element (Minor Arcana): Fire (Wands), Water (Cups), Air (Swords), Earth (Pentacles)
6. Filter by card type: Court cards (Page, Knight, Queen, King), Numbered cards, Major Arcana
7. Sort options: alphabetical, by suit, by number
8. Filter persistence: selected filters saved in URL query params (shareable, bookmarkable)
9. Clear filters button: reset all filters and search
10. Results count: "Showing X of 78 cards"
11. Empty state: "No cards found" with suggestion to clear filters
12. Mobile filters: collapsible filter panel on mobile, bottom sheet or modal
13. Performance: filtering and search instant, no lag

---

### Story 3.7: SEO Content Strategy Implementation

**As a** SEO specialist,  
**I want** comprehensive on-page SEO for encyclopedia pages,  
**so that** we rank well in search engines for tarot-related queries.

#### Acceptance Criteria

1. Keyword research completed: identify high-volume, low-competition keywords (e.g., "ความหมายไพ่ยิปซี", "tarot card meanings")
2. Target keywords integrated naturally into card page content
3. Internal linking strategy: link related cards, reading types, homepage
4. Structured data (JSON-LD): Article, BreadcrumbList, WebSite schemas implemented
5. Image alt text: descriptive alt text for all card images (accessibility + SEO)
6. Page speed optimized: Lighthouse SEO score ≥95
7. Mobile-friendly: passes Google Mobile-Friendly Test
8. XML sitemap: updated to include all encyclopedia pages
9. Robots.txt: allow crawling of /cards/* pages
10. Canonical URLs: prevent duplicate content issues
11. Schema markup tested: Google Rich Results Test validates schemas
12. SEO analytics: Google Search Console configured, track impressions, clicks, rankings

---

### Story 3.8: Content Marketing Blog Foundation

**As a** content marketer,  
**I want** a blog section for educational tarot content,  
**so that** we can attract organic traffic and establish thought leadership.

#### Acceptance Criteria

1. Blog main page (`/blog`) created with list of blog posts
2. Blog post template: title, author, publish date, featured image, content, tags
3. Initial blog posts (3-5 posts):
   - "How to Read Tarot Cards for Beginners"
   - "Daily Tarot Reading: Benefits and How to Start"
   - "Understanding the Major Arcana: A Complete Guide"
   - "3-Card Spread Explained: Past, Present, Future"
   - "Top 5 Tarot Cards for Guidance in Love and Career"
4. Blog post page (`/blog/[slug]`) with full content, SEO-optimized
5. Category tags: Beginners, Advanced, Spreads, Card Meanings, Spiritual Growth
6. Related posts section: show 3 related articles at bottom
7. CTA in posts: "Try your reading now" links to reading selection
8. Author bio: brief info about content creator (builds trust)
9. Social share buttons on blog posts
10. SEO optimized: proper headings, meta descriptions, keywords, structured data (Article)
11. Blog RSS feed: `/blog/feed.xml` for subscribers
12. Comment system (optional future): Disqus or custom comments for engagement

---

### Story 3.9: Landing Page SEO & Conversion Optimization

**As a** growth marketer,  
**I want** the landing page optimized for both SEO and conversions,  
**so that** organic traffic converts into active users.

#### Acceptance Criteria

1. Hero section optimized: clear value proposition, keywords included naturally
2. Primary CTA prominent: "เริ่มดูดวงฟรี" (Start Free Reading) above the fold
3. Secondary CTAs: "เรียนรู้เพิ่มเติม" (Learn More), "ดูคู่มือไพ่" (View Card Guide)
4. Social proof section: "X users trusted us" or testimonials (if available)
5. Feature highlights: 3-4 key features with icons (Free, Fast, Accurate, Save History)
6. How it works section: 3-step visual guide (Select → Draw → Discover)
7. FAQ section: 5-7 common questions about tarot, app usage, privacy
8. Trust signals: privacy badge, secure icon, PDPA compliance note
9. SEO optimized:
   - H1: Main keyword "ดูดวงไพ่ยิปซีออนไลน์ฟรี" or similar
   - Meta title: "ดูดวงไพ่ยิปซีออนไลน์ | [App Name] - ฟรี แม่นยำ"
   - Meta description: compelling, includes keywords, call-to-action
10. A/B test ready: structure allows testing different headlines, CTAs
11. Conversion tracking: GA4 events for CTA clicks, scroll depth, time on page
12. Mobile optimized: all sections work perfectly on mobile, thumb-friendly CTAs

---

### Story 3.10: Analytics & Growth Metrics Dashboard

**As a** product manager,  
**I want** visibility into content performance and sharing metrics,  
**so that** we can optimize our growth strategy based on data.

#### Acceptance Criteria

1. GA4 events for social sharing: share_initiated, share_completed, platform (Instagram/Facebook/Twitter)
2. Encyclopedia analytics: page views per card, most viewed cards, search queries
3. Blog analytics: post views, read time, scroll depth, exit rate
4. Referral tracking: track traffic from social media shares (UTM parameters)
5. Conversion funnel: encyclopedia/blog visitor → reading user → signed up user
6. SEO metrics: organic traffic, top landing pages, keyword rankings (via Search Console)
7. Engagement metrics: bounce rate, pages per session, average session duration
8. Content performance report: which cards/posts drive most traffic and conversions
9. Share virality metric: shares per reading, viral coefficient calculation
10. Dashboard view: PostHog or Vercel Analytics dashboard showing key growth metrics
11. Weekly/monthly reports: automated email or Slack report with key metrics (future)
12. A/B testing infrastructure: ability to test different share images, CTAs, content formats

---

### Story 3.11: Share Incentives & Gamification

**As a** user,  
**I want** to feel rewarded when I share readings,  
**so that** I'm motivated to spread the word about the app.

#### Acceptance Criteria

1. Share prompt after reading: "Love your reading? Share it with friends!" (subtle, not pushy)
2. Share badge: after first share, unlock "Sharer" badge in profile (gamification)
3. Social proof: "X people shared their readings today" shown somewhere (FOMO)
4. Thank you message after share: "Thank you for sharing! Your friends will love this too ✨"
5. Referral foundation (future monetization): track if new users came from shared link (cookie or URL param)
6. Sharing stats in profile: "You've shared X readings" (for logged-in users)
7. Share streaks (future): encourage consistent sharing
8. Leaderboard (future consideration): top sharers (only if appropriate for brand)
9. No spam: never auto-post to social media, always user-initiated
10. Respectful UX: sharing is encouraged but never forced, user can dismiss prompts

---

### Story 3.12: Encyclopedia Content Quality Assurance

**As a** content manager,  
**I want** all tarot card content reviewed for accuracy and consistency,  
**so that** users trust our interpretations and find them helpful.

#### Acceptance Criteria

1. All 78 cards content written and reviewed by tarot expert
2. Content style guide followed: tone, length, structure consistent across all cards
3. Thai language quality: grammatically correct, natural flow, no literal translations
4. Accuracy check: meanings align with traditional tarot interpretations (Rider-Waite or chosen deck)
5. Completeness: every card has upright, reversed, keywords, symbolism, advice sections
6. Readability: Flesch reading ease score appropriate for target audience (not too complex)
7. Unique content: not copied from other sources (plagiarism check)
8. SEO keywords naturally integrated: not keyword-stuffed, reads naturally
9. Internal consistency: related cards referenced correctly, no contradictions
10. User testing: 5-10 users read sample card pages, provide feedback on clarity and helpfulness
11. Revision based on feedback: content updated if users find it confusing or unhelpful
12. Final approval: content writer and product owner sign off before launch

---

### Story 3.13: Epic 3 Testing & Quality Assurance

**As a** QA tester,  
**I want** thorough testing of sharing and encyclopedia features,  
**so that** we ship high-quality content and smooth sharing experiences.

#### Acceptance Criteria

1. Social sharing tested on actual devices: iPhone (Instagram, Facebook, Twitter), Android
2. Share image generation: verify images look good, proper dimensions, no cut-off text
3. Cross-platform sharing: test on multiple social platforms, verify posts appear correctly
4. Encyclopedia navigation: all 78 cards accessible, no broken links
5. Search and filter testing: verify results accurate, no errors with edge cases
6. SEO validation: Google Rich Results Test passes for all card pages and blog posts
7. Mobile responsiveness: all encyclopedia and blog pages work perfectly on mobile
8. Content proofreading: spell check, grammar check on all copy
9. Link checking: all internal and external links work (no 404s)
10. Analytics verification: all tracking events fire correctly
11. Performance testing: encyclopedia pages load quickly (< 2s)
12. Accessibility testing: screen reader compatible, keyboard navigable
13. Cross-browser testing: Safari, Chrome, Firefox on desktop and mobile
14. All P0 and P1 bugs fixed before shipping

---

## Epic 4: Personalization & Enhanced UX

**Epic Goal:**

ปรับปรุงประสบการณ์ผู้ใช้ให้มี polish และ delight ผ่าน personalization features (theme selection, daily reminders, question input) และ enhance UX/UI ด้วย animations และ micro-interactions ที่สมบูรณ์ตามที่ออกแบบไว้ ทำให้ app รู้สึก premium และตอบสนองความต้องการส่วนบุคคลของแต่ละ user

Epic นี้เน้นการสร้าง emotional connection และ engagement ระยะยาวผ่าน personalized experiences ที่ทำให้ users รู้สึกว่า app "เข้าใจ" พวกเขา

---

### Story 4.1: Theme & Color Customization

**As a** user,  
**I want** to personalize the app's appearance,  
**so that** it feels more "mine" and matches my aesthetic preferences.

#### Acceptance Criteria

1. Theme settings page (`/settings/theme`) or modal accessible from profile
2. Theme options: Dark Mystical (default), Light Ethereal, Deep Ocean, Cosmic Purple
3. Each theme includes: background colors, accent colors, card back designs
4. Theme preview: show sample cards and UI in each theme before applying
5. Theme persisted: saved in user profile (logged-in) or localStorage (anonymous)
6. Theme applies instantly: no page refresh needed, smooth transition
7. All pages support themes: consistent theming across entire app
8. Accessibility maintained: all themes meet WCAG AA contrast requirements
9. Theme selection analytics: track which themes most popular
10. Custom theme (future): allow users to pick custom accent color (color picker)

---

### Story 4.2: Daily Reading Reminder & Push Notifications

**As a** user,  
**I want** daily reminders to do my tarot reading,  
**so that** I build a consistent practice and stay engaged with the app.

#### Acceptance Criteria

1. Reminder settings in user profile: toggle on/off, set preferred time
2. Time picker: user selects reminder time (e.g., 9:00 AM)
3. Timezone handling: reminders sent in user's local timezone
4. PWA push notifications: request permission, show notification at set time
5. Notification content: "[App Name]: Your daily card awaits ✨ Draw your card now"
6. Notification click: opens app directly to daily reading page
7. Notification frequency: once per day at specified time
8. Snooze option: "Remind me in 1 hour" (optional)
9. Notification analytics: track delivery rate, click-through rate, conversion to reading
10. Graceful degradation: if notifications not supported (iOS < 16.4), show in-app reminder instead
11. Unsubscribe easy: user can disable notifications anytime in settings
12. Email fallback: if push not available, offer email daily reminder (uses Epic 2 email infrastructure)

---

### Story 4.3: Question Input & Contextualized Readings

**As a** user,  
**I want** to ask a specific question before my reading,  
**so that** the interpretation feels more relevant to my situation.

#### Acceptance Criteria

1. Question input field added to reading selection page (optional)
2. Placeholder text: "What guidance do you seek? (optional)"
3. Character limit: 500 characters max with counter
4. Question saved with reading: stored in database, shown in reading result and history
5. Contextualized interpretation: reading result page shows question at top
6. AI-enhanced interpretation (future): use question to provide more targeted advice (foundation ready)
7. Question privacy: only visible to user, never shared publicly
8. Question examples: show sample questions to inspire users ("Will I find love?", "Should I change careers?")
9. Skip option: question always optional, users can proceed without entering question
10. Question editing: in history, allow users to edit question for past readings
11. Analytics: track % of readings with questions, common question themes (NLP analysis future)

---

### Story 4.4: Advanced Card Animations & Micro-interactions

**As a** user,  
**I want** smooth, delightful animations throughout the app,  
**so that** the experience feels magical and premium.

#### Acceptance Criteria

1. Card flip animation enhanced: 3D perspective, realistic flip with shadow
2. Card selection animation: cards gently float and shimmer when hovered/tapped
3. Page transitions: smooth fade or slide transitions between pages
4. Loading animations: mystical spinner or particle effects during loading
5. Button interactions: scale, color change, subtle glow on hover/press
6. Success animations: celebration confetti when reading completed (subtle)
7. Toast notifications: slide in from top with bounce effect
8. Scroll animations: parallax effect on landing page, fade-in on scroll
9. Haptic feedback: vibration on card selection, drawing, and important actions (mobile)
10. Performance: all animations 60fps, no jank on mid-range devices
11. Reduced motion: respect `prefers-reduced-motion` for accessibility (disable animations)
12. Animation library: use Framer Motion for React animation consistency
13. Subtle sound effects (optional): soft chime when card flips (can be muted in settings)

---

### Story 4.5: Enhanced Card Selection Experience

**As a** user,  
**I want** a more interactive and engaging card selection process,  
**so that** choosing cards feels meaningful and connected to my intuition.

#### Acceptance Criteria

1. Fan layout: cards spread in arc/fan formation (desktop: full arc, mobile: partial)
2. Drag-to-select: user can drag card from deck to selection area
3. Swipe gestures: swipe left/right to browse through card deck (mobile)
4. Card hover effects: card lifts slightly and glows when hovered (desktop)
5. Selection feedback: selected card highlights with golden glow
6. Shuffle animation: deck shuffles visually before selection (optional, can skip)
7. Sound option: soft shuffling sound during shuffle (toggle on/off)
8. Guided selection: tooltip suggests "Choose the card that calls to you"
9. Selection timer (optional): gentle timer showing how long user has been selecting (no pressure)
10. Undo selection: allow user to deselect and choose different card
11. Multiple selection modes: tap to select OR drag-and-drop (user preference)
12. Performance: smooth on mobile devices, optimized touch interactions

---

### Story 4.6: Reading Journal & Personal Notes

**As a** logged-in user,  
**I want** to add personal notes to my readings,  
**so that** I can reflect on how the reading relates to my life.

#### Acceptance Criteria

1. Notes section added to reading result page: text area below interpretation
2. Notes auto-save: save as user types (debounced, no manual save button)
3. Notes persist: saved to database, visible when reviewing past readings
4. Notes private: only user can see their notes (RLS enforced)
5. Rich text editing (basic): bold, italic, bullet points, links
6. Character limit: 2000 characters for notes
7. Edit notes anytime: can edit notes on historical readings
8. Notes search: in history page, search readings by note content
9. Export option: export reading with notes as PDF (future)
10. Notes analytics: track % of users who add notes (engagement metric)

---

### Story 4.7: Favorite Cards & Bookmarking

**As a** user,  
**I want** to bookmark favorite readings and cards,  
**so that** I can easily return to meaningful insights.

#### Acceptance Criteria

1. Favorite/bookmark button on reading result pages: heart icon
2. Favorite button on card encyclopedia pages: bookmark specific cards
3. Favorites collection in profile: "My Favorites" section
4. Favorites list shows: bookmarked readings and cards, chronological or by date favorited
5. Unfavorite option: remove from favorites anytime
6. Favorites count: show "X favorites" in profile
7. Quick access: favorited items easily accessible from profile menu
8. Favorites analytics: most favorited cards, insights on user preferences
9. Favorites limit: no limit for logged-in users, encourage signup for anonymous users
10. Share favorites: "Share my favorite card" feature

---

### Story 4.8: Onboarding Tutorial Enhancement

**As a** first-time user,  
**I want** an interactive tutorial that shows me how to use the app,  
**so that** I feel confident and excited to start.

#### Acceptance Criteria

1. Interactive tutorial: tooltip-based walkthrough on first visit
2. Tutorial steps (5 steps max):
   - Step 1: Welcome message
   - Step 2: "Choose your reading type"
   - Step 3: "Select your cards intuitively"
   - Step 4: "Discover your insights"
   - Step 5: "Save and share your readings"
3. Tooltips highlight: relevant UI elements as tutorial progresses
4. Skip option: "Skip tutorial" button visible at all times
5. Tutorial progress: dots showing progress (step 2/5)
6. Tutorial replay: "Replay tutorial" option in settings/help
7. Tutorial completion: "You're all set! ✨" final message
8. Tutorial analytics: track completion rate, drop-off points
9. Adaptive tutorial: different tutorial for logged-in vs anonymous users
10. Mobile optimized: tutorial works seamlessly on mobile devices

---

### Story 4.9: Accessibility Enhancements

**As a** user with accessibility needs,  
**I want** the app to be fully accessible,  
**so that** I can use all features regardless of my abilities.

#### Acceptance Criteria

1. Keyboard navigation: all interactive elements accessible via Tab key
2. Focus indicators: visible focus outline on all focusable elements
3. Screen reader support: ARIA labels on all buttons, images, sections
4. Semantic HTML: proper heading hierarchy (H1, H2, H3), landmarks (nav, main, aside)
5. Alt text: all images have descriptive alt text
6. Color contrast: all text meets WCAG AA standards (4.5:1 for normal, 3:1 for large)
7. Form labels: all input fields have proper labels
8. Error messages: clear, descriptive error messages announced by screen readers
9. Skip links: "Skip to main content" link for keyboard users
10. Reduced motion: animations disabled when `prefers-reduced-motion` set
11. Text resizing: app remains usable when text size increased to 200%
12. Touch targets: all buttons/links ≥44×44px for easy tapping
13. Accessibility audit: passes WAVE and axe DevTools audits with no errors
14. User testing: test with actual users who use assistive technologies

---

### Story 4.10: Performance & Polish Final Pass

**As a** user,  
**I want** the app to feel fast, smooth, and polished in every interaction,  
**so that** my experience is consistently excellent.

#### Acceptance Criteria

1. Lighthouse scores: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥95 (all pages)
2. Core Web Vitals: LCP <1.5s, FID <100ms, CLS <0.1 (all pages meet targets)
3. Animation performance: all animations 60fps, no dropped frames
4. Image optimization: all images WebP, properly sized, lazy loaded
5. Code splitting optimized: minimal JavaScript on initial load
6. Bundle size: JavaScript bundle <200KB gzipped
7. Font loading: fonts load without FOUT/FOIT (flash of unstyled/invisible text)
8. Error handling polish: all error states have friendly messages and recovery options
9. Empty states polish: all empty states have helpful illustrations and CTAs
10. Loading states polish: consistent loading indicators throughout app
11. Visual consistency: UI components consistent across all pages (spacing, colors, typography)
12. Cross-browser testing: works perfectly on all supported browsers
13. Mobile gestures: swipe, pinch, scroll all work naturally
14. Production-ready: no console errors or warnings in production build

---

### Story 4.11: Help Center & Documentation

**As a** user who needs help,  
**I want** easy access to support resources,  
**so that** I can solve problems quickly without frustration.

#### Acceptance Criteria

1. Help Center page (`/help`) with common topics and FAQs
2. FAQ categories: Getting Started, Account, Readings, Privacy, Technical Issues
3. 15-20 FAQ entries covering most common questions
4. Search FAQs: find relevant help articles quickly
5. Contact support: form or email link for issues not covered in FAQs
6. Video tutorials (optional): short videos showing how to use key features
7. Troubleshooting guide: common issues and solutions
8. Privacy policy page: comprehensive, PDPA-compliant privacy policy
9. Terms of service page: clear terms and conditions
10. Help button: accessible from all pages (footer or floating button)
11. Contextual help: tooltips and help icons next to confusing features
12. Help analytics: track most viewed help articles, search queries
13. Feedback option: "Was this helpful?" on each FAQ

---

### Story 4.12: Epic 4 Testing & Quality Assurance

**As a** QA tester,  
**I want** comprehensive testing of all personalization and UX enhancements,  
**so that** we ship a polished, delightful final product.

#### Acceptance Criteria

1. Full regression testing: all features from Epics 1-4 tested
2. Theme testing: verify all themes work correctly, no visual glitches
3. Animation testing: verify animations smooth on various devices (iPhone 12, Pixel 6, etc.)
4. Notification testing: push notifications deliver correctly, respect user preferences
5. Accessibility testing: WCAG AA compliance verified with automated tools and manual testing
6. Performance testing: Lighthouse audits pass on all major pages
7. Cross-device testing: iPhone, Android, tablets, desktop browsers
8. Usability testing: 5-10 users test new features, provide feedback
9. Edge case testing: test with various user settings combinations
10. Analytics verification: all new tracking events fire correctly
11. All P0, P1, and P2 bugs fixed before shipping
12. Final QA sign-off: QA lead approves release
13. Smoke test: quick verification of critical paths after deployment
14. User acceptance testing: product owner approves all features

---

## Checklist Results Report

### Executive Summary

**Overall PRD Completeness:** 88% (Very Good)

**MVP Scope Appropriateness:** ⚠️ Slightly Too Large - 4 epics with 55 stories is more than typical MVP but well-structured and can be reduced if necessary

**Readiness for Architecture Phase:** ✅ READY - PRD provides sufficient clarity for Architect to begin work, though some gaps exist they are not blocking

**Most Critical Concerns:**
1. Missing quantified problem impact and market size data
2. MVP scope may be too large (55 stories = 3-4 months, not 2-4 weeks as mentioned in brainstorming)
3. Lacks baseline metrics and specific timeframe for success criteria
4. Content readiness (78 cards) is critical dependency but timeline unclear

### Category Analysis

| Category | Status | Completion | Critical Issues |
|----------|--------|------------|-----------------|
| Problem Definition & Context | ⚠️ PARTIAL | 75% | Missing quantified impact, baseline metrics, competitive analysis details |
| MVP Scope Definition | ⚠️ PARTIAL | 70% | MVP scope too large, lacks clear out-of-scope list, timeline not realistic |
| User Experience Requirements | ✅ PASS | 95% | Very comprehensive - includes UI goals, flows, accessibility |
| Functional Requirements | ✅ PASS | 92% | Excellent - clear, testable, well-structured |
| Non-Functional Requirements | ✅ PASS | 90% | Good coverage - performance, security, compliance |
| Epic & Story Structure | ✅ PASS | 95% | Outstanding - sequential, clear ACs, appropriately sized |
| Technical Guidance | ✅ PASS | 88% | Good - clear stack, constraints, trade-offs documented |
| Cross-Functional Requirements | ⚠️ PARTIAL | 80% | Data schema mentioned but not detailed, deployment expectations unclear |
| Clarity & Communication | ✅ PASS | 93% | Excellent writing - clear, organized, consistent terminology |

**Overall Score: 88/100** ✅ READY FOR ARCHITECT (with minor refinements recommended)

### Key Findings

**Strengths:**
- 🌟 Excellent epic and story structure with clear acceptance criteria
- 🌟 Comprehensive UX requirements including accessibility (WCAG AA)
- 🌟 Clear technical direction (Next.js 14+, Supabase, Vercel)
- 🌟 Well-written and organized with consistent terminology
- 🌟 Detailed user stories sized appropriately for AI agent execution

**Areas for Improvement:**
- ⚠️ MVP scope ambitious (55 stories = 11-14 weeks vs. "2-4 weeks" mentioned in goals)
- ⚠️ Missing specific success metrics and KPIs with target numbers
- ⚠️ Content dependency (78 tarot cards) needs tracking and timeline
- ⚠️ No explicit out-of-scope section
- ⚠️ Limited competitive analysis (no specific competitor names)

### Priority Issues

**🟡 HIGH PRIORITY (Should Address):**

1. **Timeline Expectations Mismatch**
   - Issue: Goals mention "2-4 weeks" but actual estimate is 11-14 weeks for all 4 epics
   - Impact: Stakeholder expectations misaligned
   - Recommendation: Update Goals section to "3-4 months for full MVP" or re-scope to Epic 1+2 only

2. **Missing Quantified Success Criteria**
   - Issue: Goals defined but no specific KPIs or target numbers
   - Impact: Cannot measure success objectively
   - Recommendation: Add success metrics (e.g., "1000 MAU, 20% retention, 5% conversion by month 3")

3. **Content Preparation Not Tracked**
   - Issue: 78 cards content is critical dependency but no timeline or owner
   - Impact: May block Epic 1 Story 1.14 and entire Epic 3
   - Recommendation: Create content preparation timeline, assign owner, start immediately

**🟢 MEDIUM PRIORITY (Would Improve):**

4. Add explicit "Out of Scope" section (Celtic Cross, AI features, mobile apps, etc.)
5. Include brief competitive analysis (2-3 competitor names with feature comparison)
6. Document data retention and operational policies

### MVP Scope Recommendations

**For "True MVP" (6-8 weeks):**
- Keep: Epic 1 (Foundation) + Epic 2 (User Accounts)
- Defer: Epic 3 (Social & Content) + Epic 4 (Personalization & Polish)
- Result: Core reading functionality + user retention, ~25 stories instead of 55

**For "Full Featured MVP" (11-14 weeks):**
- Keep all 4 epics as currently defined
- Update timeline expectations in Goals section
- Ensure content and design assets prepared in parallel

### Technical Readiness Assessment

**✅ Architect Can Start Immediately**

Architect has sufficient information to:
- Design system architecture
- Define database schema
- Design API endpoints
- Choose implementation patterns
- Estimate technical effort
- Identify technical risks

**Architect Should Investigate:**
1. Detailed database schema (tables, relationships, indexes, migrations)
2. API endpoint definitions (REST patterns, error codes, rate limits)
3. Caching strategy specifics (ISR intervals, SWR config, CDN rules)
4. Performance optimization approaches (bundle splitting, code splitting)
5. Security implementation details (RLS policies, auth patterns)

### Final Verdict

**✅ READY FOR ARCHITECT**

The PRD provides comprehensive requirements and clear technical direction. While some improvements are recommended (especially timeline alignment and success metrics), they are not blockers for architecture work to begin. The identified gaps can be addressed in parallel during the architecture phase.

**Recommendation:** PROCEED to architecture design. Address high-priority improvements in next PRD revision.

---

## Next Steps

### UX Expert Prompt

You are the UX Expert. Please review the PRD document (`docs/prd.md`) focusing on the "User Interface Design Goals" section and all user stories across the 4 epics.

Your task is to create a comprehensive UX/UI Architecture document that includes:

1. **Design System Specification** - Define the complete visual design system (colors, typography, spacing, components) based on the Mystical/Spiritual aesthetic and Dark Mode requirements specified in the PRD

2. **Detailed User Flows** - Map out all critical user journeys from landing page through reading completion, including edge cases and error states

3. **Wireframes & Mockups** - Create wireframes for all 7 core screens identified in the PRD, ensuring mobile-first responsive design

4. **Component Library Specification** - Define all reusable UI components needed across the application with their states and variants

5. **Interaction Patterns** - Detail all animations, transitions, and micro-interactions specified in the PRD (card flip, hover effects, loading states)

6. **Accessibility Guidelines** - Ensure all designs meet WCAG AA standards with specific guidance for implementation

Please start by reviewing the PRD and creating a UX Architecture document that the development team can implement directly.

### Architect Prompt

You are the Software Architect. Please review the complete PRD document (`docs/prd.md`) with focus on the Technical Assumptions section, all functional and non-functional requirements, and the 4 epics with 55 user stories.

Your task is to create a comprehensive Software Architecture document that includes:

1. **System Architecture Overview** - Define the overall system architecture (Next.js 14+ App Router, Supabase, Vercel) with detailed component interactions and data flow diagrams

2. **Database Schema Design** - Create detailed database schema for all entities (users, readings, reading_cards, cards) with relationships, indexes, constraints, and migration strategy

3. **API Design** - Define all REST API endpoints, request/response formats, error handling patterns, authentication flows, and rate limiting strategies

4. **Performance Architecture** - Detail caching strategies (ISR, SWR, CDN), code splitting approach, image optimization pipeline to meet <1s load time requirement

5. **Security Architecture** - Specify Row Level Security (RLS) policies, authentication patterns, data encryption, PDPA compliance implementation

6. **Testing Strategy** - Define unit, integration, and E2E testing approach with specific tools (Vitest, Playwright, React Testing Library) and coverage targets (70-30-10)

7. **Deployment & DevOps** - Detail CI/CD pipeline, environment setup (dev/staging/prod), monitoring and alerting strategy (Sentry, Vercel Analytics)

8. **Technical Risk Mitigation** - Address identified technical risks and provide implementation guidance for complex features (3D animations, analytics integration, PWA)

Please start by reviewing the PRD and creating an Architecture document that provides clear technical direction for the development team to implement all 4 epics successfully.


