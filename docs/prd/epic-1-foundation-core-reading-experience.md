# Epic 1: Foundation & Core Reading Experience

**Epic Goal:** 

สร้างโครงสร้างพื้นฐานของโปรเจกต์ (Next.js app, Supabase database, deployment pipeline, analytics integration) และส่งมอบฟีเจอร์การดูดวงหลัก 2 รูปแบบ (Daily Reading และ 3-Card Spread) ที่ผู้ใช้สามารถเข้ามาใช้งานได้ทันทีผ่าน mobile และ desktop โดยไม่ต้องสมัครสมาชิก พร้อมทั้ง UI/UX ที่สวยงามตามที่ออกแบบไว้ (Dark Mode, Mystical aesthetic) และ performance ที่รวดเร็ว (<1 วินาที)

Epic นี้เป็น foundation สำคัญที่จะให้เราสามารถ validate product-market fit ได้เร็วที่สุด และเป็นฐานสำหรับ epics ถัดไปทั้งหมด

---

## Story 1.1: Project Setup & Infrastructure Foundation

**As a** developer,  
**I want** Next.js 14 project with TypeScript, Tailwind CSS, and essential tooling configured,  
**so that** the team has a solid foundation to build features efficiently with type safety and modern development practices.

### Acceptance Criteria

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

## Story 1.2: Database Schema & Supabase Integration

**As a** developer,  
**I want** Supabase project configured with database schema for cards and readings,  
**so that** the application can store and retrieve tarot card data and user readings efficiently.

### Acceptance Criteria

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

## Story 1.3: Analytics & Monitoring Setup

**As a** product manager,  
**I want** analytics and error tracking tools integrated from day one,  
**so that** we can measure user behavior, track conversions, and monitor application health from the MVP launch.

### Acceptance Criteria

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

## Story 1.4: Landing Page & Core Layout

**As a** first-time visitor,  
**I want** to see an attractive landing page that explains what the app does and invites me to try it,  
**so that** I understand the value and feel motivated to start my first tarot reading.

### Acceptance Criteria

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

## Story 1.5: Card Data Model & Image Assets

**As a** developer,  
**I want** card images optimized and accessible through the application,  
**so that** cards display beautifully and load quickly across all devices.

### Acceptance Criteria

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

## Story 1.6: Card Shuffle & Random Selection Logic

**As a** user,  
**I want** the card selection to feel random and fair,  
**so that** I trust the reading results are genuine and not predictable.

### Acceptance Criteria

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

## Story 1.7: Daily Reading Flow (1 Card)

**As a** user seeking quick daily guidance,  
**I want** to draw a single card and see its meaning,  
**so that** I can get a quick insight or reflection for my day.

### Acceptance Criteria

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

## Story 1.8: 3-Card Spread Flow (Past-Present-Future)

**As a** user wanting deeper insight,  
**I want** to draw three cards representing past, present, and future,  
**so that** I can understand the progression of my situation and what to expect.

### Acceptance Criteria

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

## Story 1.9: Reading Type Selection Page

**As a** user,  
**I want** to choose between Daily Reading and 3-Card Spread,  
**so that** I can select the reading type that matches my current need.

### Acceptance Criteria

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

## Story 1.10: Responsive UI Polish & Dark Mode

**As a** user on any device,  
**I want** the app to look beautiful and work smoothly whether I'm on mobile, tablet, or desktop,  
**so that** I have a premium experience regardless of how I access the app.

### Acceptance Criteria

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

## Story 1.11: Performance Optimization & SEO Foundation

**As a** product manager,  
**I want** the app to load blazingly fast and be discoverable by search engines,  
**so that** users have a great first impression and we can acquire organic traffic.

### Acceptance Criteria

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

## Story 1.12: Error Handling & User Feedback

**As a** user,  
**I want** clear feedback when something goes wrong or when actions are processing,  
**so that** I'm never confused about what's happening in the app.

### Acceptance Criteria

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

## Story 1.13: Basic CI/CD Pipeline

**As a** developer,  
**I want** automated testing and deployment pipeline,  
**so that** we can ship features confidently and quickly without manual deployment steps.

### Acceptance Criteria

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

## Story 1.14: Content Integration & Card Meanings

**As a** user,  
**I want** to see accurate and helpful tarot card interpretations,  
**so that** I can understand my reading and apply the insights to my life.

### Acceptance Criteria

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

## Story 1.15: MVP Testing & Bug Fixes

**As a** QA tester,  
**I want** all critical user flows tested and major bugs fixed,  
**so that** we ship a stable MVP that users can rely on.

### Acceptance Criteria

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
