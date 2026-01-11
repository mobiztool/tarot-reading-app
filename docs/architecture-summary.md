# Web App ดูดวงไพ่ยิปซี - Architecture Executive Summary

**Document Version:** 1.0  
**Date:** December 30, 2025  
**Author:** Winston (Architect)  
**Status:** ✅ Approved - Ready for Implementation

---

## Executive Summary

This document provides a high-level overview of the technical architecture for the **Web App ดูดวงไพ่ยิปซี** (Tarot Reading Web Application). The complete technical specification is available in [`architecture.md`](./architecture.md) (~4,860 lines).

### Project Overview

**Goal:** Build a mobile-first, SEO-optimized tarot reading web application that enables users to perform daily readings and 3-card spreads, with optional user accounts for saving history.

**Target Users:**
- People who regularly practice tarot readings for guidance
- Working professionals seeking spiritual wellness and stress relief
- Thai market focus with potential for English localization

**Business Model:** Freemium (MVP: Free tier, Future: Premium features)

---

## Architecture Approach

### Core Strategy: **Jamstack + Serverless + BaaS**

```
┌─────────────────────────────────────────────────────────┐
│  Users (Mobile-first, 80% mobile traffic)              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Vercel Edge Network (Global CDN)                       │
│  - 300+ locations worldwide                             │
│  - <100ms response time for cached content              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Next.js 14+ (Frontend + Backend in one app)           │
│  - React Server Components                              │
│  - API Routes (Serverless Functions)                    │
│  - SSR/SSG/ISR for optimal SEO                         │
└───────┬──────────────────────────────┬─────────────────┘
        │                              │
        ▼                              ▼
┌───────────────────┐      ┌──────────────────────────────┐
│  Supabase (BaaS)  │      │  External Services           │
│  - PostgreSQL     │      │  - Google Analytics 4        │
│  - Auth (JWT+OAuth)│      │  - Meta Pixel                │
│  - Storage (S3)   │      │  - Hotjar                    │
│  - RLS Security   │      │  - Sentry                    │
└───────────────────┘      └──────────────────────────────┘
```

**Key Benefits:**
- ✅ **Rapid Development:** Managed services reduce DevOps by 80%
- ✅ **Zero Cost MVP:** All services have generous free tiers
- ✅ **Auto-scaling:** Handles traffic spikes automatically
- ✅ **Production-ready Security:** RLS, JWT, HTTPS by default

---

## Key Technical Decisions

### 1. Platform Choice: **Vercel + Supabase**

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Hosting** | Vercel | Zero-config Next.js deployment, global edge network |
| **Database** | Supabase (PostgreSQL) | Free tier covers MVP (50K users), built-in auth & storage |
| **Alternative Considered** | AWS Full Stack | ❌ Too complex for MVP, 3-5x higher cost |
| **Cost (MVP)** | **$0/month** | Both platforms have generous free tiers |

### 2. Tech Stack: **Next.js 14 + TypeScript + Tailwind**

**Frontend:**
- **Next.js 14+** (App Router with Server Components)
- **TypeScript** (strict mode for type safety)
- **Tailwind CSS** (rapid UI development, 40% smaller CSS)
- **Zustand** (lightweight state management, 1KB vs Redux 50KB)
- **Framer Motion** (smooth animations for card flip effects)

**Backend:**
- **Next.js API Routes** (serverless functions, no separate backend)
- **Prisma** (type-safe ORM, auto-generates TypeScript types)
- **Supabase Auth** (OAuth + email/password, JWT tokens)
- **Row Level Security** (database-level authorization)

**Why Not GraphQL/tRPC?**
- REST API simpler for AI agents to implement
- Better HTTP caching support
- Sufficient for MVP scope

### 3. Architecture Pattern: **Monolith (Serverless)**

```
┌─────────────────────────────────────────────┐
│         Single Next.js Application          │
│  ┌─────────────┐      ┌─────────────────┐  │
│  │   Frontend  │      │  Backend (API)  │  │
│  │  (Pages)    │◄────►│  (Serverless)   │  │
│  │  React/UI   │      │  Functions      │  │
│  └─────────────┘      └─────────────────┘  │
│           │                    │            │
│           └────────┬───────────┘            │
│                    ▼                        │
│            Shared Types (packages/shared)   │
└─────────────────────────────────────────────┘
                     │
                     ▼
              Supabase (BaaS)
         Database + Auth + Storage
```

**Benefits:**
- Single deployment unit (simpler CI/CD)
- Shared types between frontend and backend
- Reduced latency (no network calls between services)
- Easier to develop and debug

**Trade-off:** If traffic exceeds 100K MAU, consider microservices

---

## Data Architecture

### Database: **PostgreSQL (6 Tables)**

```
users ─────┬───── readings ───── reading_cards ───── cards (78 cards)
           │           │
           ├───── favorite_cards ───── cards
           │
           └───── user_preferences (1:1)
```

**Key Features:**
- **UUID primary keys** (security, distributed-friendly)
- **Nullable user_id in readings** (anonymous users supported)
- **RLS policies** (users can only access own data)
- **17 indexes** (optimized queries, <10ms typical response)
- **Triggers** (auto-update timestamps, auto-create preferences)

### Storage Estimates (MVP)

| Data Type | Volume | Size |
|-----------|--------|------|
| Users | 10,000 | ~5 MB |
| Cards (reference) | 78 | ~156 KB |
| Readings | 50,000 | ~15 MB |
| **Total** | - | **~33 MB** |
| **Supabase Free Tier** | - | **500 MB** ✅ |

**Scalability:** Database can handle 15x growth before hitting free tier limit.

---

## API Design

### RESTful API (20+ Endpoints)

**Public Endpoints (No Auth):**
- `GET /api/cards` - List all 78 tarot cards
- `GET /api/cards/{slug}` - Get card by SEO-friendly slug
- `POST /api/readings` - Create reading (anonymous allowed)

**Authenticated Endpoints:**
- `GET /api/readings` - User's reading history
- `GET /api/users/me` - Current user profile
- `POST /api/favorites` - Bookmark favorite cards
- `PATCH /api/preferences` - Update user preferences

**Why REST over GraphQL?**
- ✅ Simpler for AI agents
- ✅ Better caching (GET requests cacheable)
- ✅ No additional dependencies
- ✅ Industry standard

---

## Security Architecture

### Multi-Layer Security

**1. Authentication: Supabase Auth**
- JWT tokens (1 hour expiry, 30 day refresh)
- OAuth providers: Google, Facebook
- Email/password with verification
- httpOnly cookies (XSS protection)

**2. Authorization: Row Level Security (RLS)**
```sql
-- Example: Users can only view own readings
CREATE POLICY "Users can view own readings"
    ON "readings" FOR SELECT
    USING (auth.uid() = user_id);
```

**Defense in Depth:**
- Middleware validates JWT
- RLS enforces at database level
- Even if API is bypassed, DB blocks unauthorized access

**3. Data Protection:**
- Encrypted at rest (Supabase default)
- HTTPS everywhere (Vercel automatic)
- Rate limiting (100 req/hour anonymous, 1000 req/hour authenticated)
- Input validation (Zod schemas)

---

## Performance Architecture

### Target Metrics

| Metric | Target | Strategy |
|--------|--------|----------|
| **Page Load Time** | <1 second | Server Components, CDN, ISR |
| **API Response Time** | <200ms (p95) | Indexed queries, connection pooling |
| **Core Web Vitals** | LCP <1.5s, FID <100ms | Code splitting, lazy loading |
| **Bundle Size** | <200KB (gzipped) | Tree shaking, dynamic imports |

### Caching Strategy

```
┌──────────────────────────────────────────────────┐
│  Vercel Edge Cache (Global)                     │
│  - Static assets: 1 year cache                  │
│  - ISR pages: Revalidate every 1 hour          │
│  - Card images: Immutable, long TTL            │
└──────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  Next.js Server (Vercel Functions)              │
│  - In-memory cache: 78 cards (rarely change)    │
│  - SWR: stale-while-revalidate for API calls   │
└──────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  Supabase (Database)                             │
│  - Connection pooling (prevent exhaustion)       │
│  - 17 indexes (fast queries)                    │
└──────────────────────────────────────────────────┘
```

---

## Development & Deployment

### Repository Structure: **Monorepo (pnpm workspaces)**

```
tarot-app/
├── apps/
│   └── web/              # Next.js app (frontend + API)
├── packages/
│   ├── shared/           # Types, constants, utilities
│   ├── ui/               # Shared components (future)
│   └── config/           # ESLint, TypeScript, Tailwind
├── docs/
│   ├── prd.md
│   └── architecture.md
└── package.json          # Root workspace config
```

### CI/CD Pipeline: **GitHub Actions + Vercel**

```
┌─────────────┐
│  Git Push   │
└──────┬──────┘
       │
       ▼
┌────────────────────────────────────────┐
│  GitHub Actions (CI)                   │
│  - Lint (ESLint)                       │
│  - Type check (TypeScript)             │
│  - Test (Unit + Integration)           │
│  - E2E (Playwright)                    │
└──────┬─────────────────────────────────┘
       │ ✅ Pass
       ▼
┌────────────────────────────────────────┐
│  Vercel (CD)                           │
│  - Build Next.js app                   │
│  - Deploy to edge network              │
│  - Run database migrations             │
│  - Update environment variables        │
└────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  Production (Live)                     │
│  - Global CDN distribution             │
│  - Automatic SSL                       │
│  - Analytics enabled                   │
└────────────────────────────────────────┘
```

**Deployment Time:** ~2-3 minutes from push to live

### Environments

| Environment | URL | Purpose | Auto-deploy |
|-------------|-----|---------|-------------|
| **Development** | localhost:3000 | Local coding | Manual |
| **Staging** | staging.tarot-app.vercel.app | Pre-production | On push to `develop` |
| **Production** | tarot-app.com | Live users | On push to `main` |

---

## Testing Strategy

### Testing Pyramid (70% Unit, 20% Integration, 10% E2E)

```
        E2E Tests
       /          \       (Playwright)
    Integration Tests     (Vitest + MSW)
   /                  \
Frontend Unit    Backend Unit  (Vitest + React Testing Library)
```

**Coverage Targets:**
- Overall: >70%
- Critical paths (auth, readings, DB): >90%
- UI components: >60%

**Test Execution:**
- Unit tests: <10 seconds
- Integration tests: <30 seconds
- E2E tests: 2-3 minutes
- Total CI time: ~5 minutes

---

## Analytics & Monitoring

### Analytics Stack

| Service | Purpose | Free Tier | Critical for MVP |
|---------|---------|-----------|------------------|
| **Google Analytics 4** | User behavior, funnels | Unlimited | ✅ Yes |
| **Meta Pixel** | Ad conversion tracking | Unlimited | ✅ Yes |
| **Hotjar** | Heatmaps, session recordings | 35 sessions/day | ✅ Yes |
| **Vercel Analytics** | Web Vitals, RUM | 100K events | ✅ Yes |
| **Sentry** | Error tracking | 5K errors/month | ✅ Yes |

**Key Metrics Tracked:**
- Reading completed (by type)
- User signups (by method)
- Share actions (by platform)
- Page load performance
- API errors and latency

---

## Risk Assessment & Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Supabase outage** | Low | High | Monitor status, implement retry logic, plan migration path |
| **Free tier limits exceeded** | Medium | Medium | Monitor usage at 80%, upgrade plan proactively |
| **Performance degradation** | Medium | High | Load testing, CDN caching, query optimization |
| **Security breach** | Low | High | RLS policies, rate limiting, input validation, security audits |
| **OAuth provider issues** | Low | Medium | Email/password fallback, clear error messages |

### Business Risks

| Risk | Mitigation |
|------|------------|
| **Low user adoption** | SEO optimization, content marketing, social sharing features |
| **High churn rate** | User accounts, reading history, personalization features |
| **Content quality issues** | Expert review of tarot card interpretations, user feedback |
| **Competition** | Unique UX (mystical design), mobile-first, Thai language focus |

---

## Resource Requirements

### Development Team (Recommended)

| Role | Count | Responsibility |
|------|-------|----------------|
| **Full-Stack Developer** | 1-2 | Next.js, TypeScript, Prisma, Supabase |
| **UI/UX Designer** | 1 | Mystical theme, mobile-first design, animations |
| **Content Writer** | 1 | Tarot card meanings (Thai), SEO content |
| **QA Engineer** | 0.5 | Testing, quality assurance |

**Minimum Viable Team:** 1 full-stack developer + 1 designer (10-12 weeks)

### Infrastructure Costs

| Service | Free Tier | Paid Tier | Upgrade Trigger |
|---------|-----------|-----------|-----------------|
| **Vercel** | 100GB bandwidth | $20/mo (1TB) | 80GB used |
| **Supabase** | 50K MAU, 500MB DB | $25/mo (100K MAU, 8GB) | 40K users |
| **Hotjar** | 35 sessions/day | $39/mo (100/day) | Need more data |
| **Sentry** | 5K errors/month | $26/mo (50K) | 4K errors |
| **Total (MVP)** | **$0/month** | **$110/month** (at scale) | 3-6 months post-launch |

---

## Implementation Timeline

### Phase 1: Foundation (Weeks 1-3)

**Epic 1: Foundation & Core Reading Experience**
- Setup: Next.js, Supabase, Vercel, CI/CD
- Database: Schema, migrations, seed 78 cards
- Core features: Daily Reading, 3-Card Spread
- Analytics: GA4, Meta Pixel, Hotjar integration
- **Deliverable:** Working MVP (anonymous readings)

### Phase 2: User Accounts (Weeks 4-5)

**Epic 2: User Account & Reading History**
- Authentication: OAuth (Google, Facebook), email/password
- User profile: View, edit, settings
- Reading history: View past readings, delete
- Email: Welcome emails, password reset
- **Deliverable:** User authentication system

### Phase 3: Social & Content (Weeks 6-7)

**Epic 3: Social Sharing & Content Discovery**
- Share: Generate social media images
- SEO: Card encyclopedia (78 pages)
- Content: Blog posts for organic traffic
- Open Graph: Social media meta tags
- **Deliverable:** Growth engine (sharing + SEO)

### Phase 4: Personalization (Weeks 8-9)

**Epic 4: Personalization & Enhanced UX**
- Themes: 4 theme options
- Favorites: Bookmark cards
- Preferences: Notifications, sound effects
- Notes: Add personal notes to readings
- **Deliverable:** Personalized experience

**Total Duration:** 7-9 weeks (full MVP with all 4 epics)  
**Minimum Viable:** 3-4 weeks (Epic 1 + Epic 2 only)

---

## Success Criteria

### Technical Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load Time** | <1 second | Lighthouse, Vercel Analytics |
| **API Response Time** | <200ms (p95) | Sentry Performance |
| **Uptime** | >99.5% | Vercel status, Sentry |
| **Error Rate** | <1% | Sentry error tracking |
| **Test Coverage** | >70% | Vitest coverage report |

### Business Success Metrics (3 months post-launch)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Monthly Active Users** | 1,000+ | Google Analytics 4 |
| **User Retention (30-day)** | >20% | GA4 cohort analysis |
| **Signup Conversion** | >5% | GA4 conversion funnel |
| **Organic Traffic** | >500/month | Google Search Console |
| **Reading Completion Rate** | >80% | GA4 event tracking |

---

## Key Advantages of This Architecture

### ✅ **Speed to Market**
- Managed services = 80% less infrastructure work
- Monolith = simpler deployment
- AI-friendly patterns = faster development
- **Result:** 7-9 weeks to full MVP

### ✅ **Cost Efficiency**
- $0/month for MVP (free tiers)
- Auto-scaling (no over-provisioning)
- Serverless (pay per execution)
- **Result:** Minimal upfront investment

### ✅ **Performance**
- Global edge network (<100ms)
- Server Components (less JavaScript)
- CDN caching (static assets)
- **Result:** <1s page load time

### ✅ **Security**
- RLS at database level
- JWT + OAuth authentication
- HTTPS everywhere
- **Result:** Production-ready security

### ✅ **Scalability**
- Serverless auto-scales
- Database connection pooling
- CDN for static content
- **Result:** Handles traffic spikes

### ✅ **Developer Experience**
- TypeScript end-to-end
- Type-safe database (Prisma)
- Hot reload, fast builds
- **Result:** Productive development

---

## Comparison with Alternatives

### vs. Traditional MERN Stack

| Aspect | This Architecture | MERN Stack |
|--------|-------------------|------------|
| **Deployment** | Zero-config (Vercel) | Complex (servers, load balancers) |
| **Scaling** | Automatic | Manual configuration |
| **Cost (MVP)** | $0 | $50-100/month (servers) |
| **SEO** | Built-in (Next.js SSR) | Requires additional setup |
| **Auth** | Supabase (ready) | Build from scratch |
| **Time to MVP** | 7-9 weeks | 12-16 weeks |

### vs. Firebase + React

| Aspect | This Architecture | Firebase |
|--------|-------------------|----------|
| **Database** | PostgreSQL (relational) | Firestore (NoSQL) |
| **Query Flexibility** | SQL (complex queries) | Limited filtering |
| **Type Safety** | Prisma auto-generates types | Manual typing |
| **Vendor Lock-in** | Lower (PostgreSQL standard) | Higher (Firebase-specific) |
| **Cost at Scale** | More predictable | Can spike unexpectedly |

---

## Recommendations

### Immediate Actions (Week 1)

1. **Infrastructure Setup**
   - [ ] Create Supabase project (Singapore region)
   - [ ] Create Vercel project (link to GitHub)
   - [ ] Setup custom domain (if available)
   - [ ] Configure environment variables

2. **Repository Initialization**
   - [ ] Initialize monorepo with pnpm workspaces
   - [ ] Setup Next.js 14 with App Router
   - [ ] Configure Tailwind CSS with custom theme
   - [ ] Setup ESLint, Prettier, Husky

3. **Database Setup**
   - [ ] Create Prisma schema
   - [ ] Run initial migration
   - [ ] Seed 78 tarot cards
   - [ ] Configure RLS policies

4. **Analytics Setup**
   - [ ] Create GA4 property
   - [ ] Create Meta Pixel
   - [ ] Create Hotjar site
   - [ ] Setup Sentry project

### Post-MVP Enhancements (Months 3-6)

- **Performance:** Add Redis caching layer
- **Content:** Expand blog content (SEO)
- **Features:** Advanced spreads (Celtic Cross)
- **Monetization:** Premium subscriptions
- **Localization:** English language support
- **Platform:** iOS/Android apps (React Native)

---

## Approval & Sign-off

### Architecture Review Status

| Stakeholder | Role | Status | Date |
|-------------|------|--------|------|
| Winston | Architect | ✅ Approved | 2025-12-30 |
| [Product Owner] | Product | ⏳ Pending Review | - |
| [Tech Lead] | Engineering | ⏳ Pending Review | - |
| [Security Lead] | Security | ⏳ Pending Review | - |

### Go/No-Go Decision

**Current Status:** ✅ **READY FOR IMPLEMENTATION**

**Reasoning:**
- ✅ All technical decisions documented and justified
- ✅ Architecture covers all 55 user stories (4 epics)
- ✅ Cost structure validated ($0 for MVP)
- ✅ Timeline realistic (7-9 weeks)
- ✅ Risks identified with mitigation plans
- ✅ Team can start development immediately

**Next Step:** Begin Epic 1 implementation (Foundation & Core Reading Experience)

---

## Contact & Documentation

### Key Documents

- **Full Architecture:** [`architecture.md`](./architecture.md) (4,860 lines, technical detail)
- **Product Requirements:** [`prd.md`](./prd.md) (1,855 lines, business requirements)
- **This Document:** Architecture Executive Summary (for stakeholders)

### Questions?

For technical questions or clarifications, contact the architecture team or refer to the complete architecture document.

---

**Document Version:** 1.0  
**Last Updated:** December 30, 2025  
**Total Pages:** ~15 pages  
**Read Time:** ~10 minutes  

---

_This executive summary provides a high-level overview. For complete technical specifications, API contracts, code examples, and implementation details, refer to the full [`architecture.md`](./architecture.md) document._

