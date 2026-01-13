# Technical Assumptions

## Repository Structure: Monorepo

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

## Service Architecture: Monolith (Serverless Functions)

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

## Testing Requirements: Unit + Integration Tests

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

## Additional Technical Assumptions and Requests

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
