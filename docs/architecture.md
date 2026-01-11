# Web App ดูดวงไพ่ยิปซี Fullstack Architecture Document

## Introduction

This document outlines the complete fullstack architecture for **Web App ดูดวงไพ่ยิปซี**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template or Existing Project

**Decision:** Greenfield project - No starter template

**Rationale:** 
While there are excellent Next.js + Supabase starter templates available (e.g., Vercel's Next.js Supabase Starter), we've decided to build from scratch to:
1. Maintain full control over the architecture and avoid unnecessary boilerplate
2. Implement the exact tech stack specified in PRD without modifications
3. Optimize for the specific requirements of a tarot reading application (card animations, mystical UX, Thai language support)
4. Ensure clean codebase that AI agents can understand and extend without legacy code

The project will use industry-standard practices and patterns from Next.js 14 App Router and Supabase documentation, but built specifically for our use case.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-12-30 | 0.1 | Initial Architecture document draft | Winston (Architect) |
| 2025-12-30 | 1.0 | Complete fullstack architecture with all sections (20+ sections, 4,860 lines) | Winston (Architect) |
| 2025-12-30 | 1.1 | Added Content Quality Assurance Strategy (610 lines, 4-stage quality gates) | Quinn (QA) |
| 2025-12-30 | 1.2 | Added Content Pipeline Architecture + Anthropic Claude API to External APIs | Winston (Architect) |
| 2026-01-07 | 1.3 | Added Future Architecture Considerations (Product Roadmap integration, 18-Spread Strategy, Payment & AI enhancements, Scalability planning) | Winston (Architect) |

---

## High Level Architecture

### Technical Summary

The Web App ดูดวงไพ่ยิปซี follows a **modern Jamstack architecture with serverless backend**, deployed entirely on Vercel's edge network with Supabase as the managed backend-as-a-service (BaaS). The frontend leverages **Next.js 14+ App Router** with React Server Components for optimal performance and SEO, while the backend utilizes **Next.js API Routes** as serverless functions providing RESTful APIs. **Supabase** serves as the unified backend platform, providing PostgreSQL database, authentication (JWT-based), file storage (S3-compatible), and real-time capabilities. The entire stack is deployed to **Vercel**, enabling automatic scaling, edge caching, and sub-second global response times. This architecture achieves the PRD's core goals: <1s page load times, SEO optimization through SSR, mobile-first progressive web app capabilities, and a development experience optimized for rapid iteration and AI-driven development.

### Platform and Infrastructure Choice

Based on the PRD requirements for rapid MVP development, excellent SEO, mobile-first PWA capabilities, and budget constraints (<$50/month), we evaluated several options:

**Options Considered:**

1. **Vercel + Supabase** (Recommended ✅)
   - **Pros:** Zero-config Next.js deployment, excellent DX, generous free tiers, automatic edge caching, built-in analytics
   - **Cons:** Vendor lock-in (mitigated by standard tech stack), Supabase EU region may have slight latency for Thailand users
   - **Cost:** $0-20/month for MVP (both have generous free tiers)

2. **AWS Full Stack** (Lambda + API Gateway + RDS + Cognito + S3)
   - **Pros:** Maximum flexibility, Thailand region available, enterprise-grade
   - **Cons:** Complex setup, higher operational overhead, steeper learning curve, higher costs ($50-100/month minimum)
   - **Cost:** $50-150/month

3. **Google Cloud** (Cloud Run + Cloud SQL + Firebase Auth)
   - **Pros:** Good for ML/AI (future features), Thailand region available
   - **Cons:** More complex than Vercel, higher costs, less integrated DX
   - **Cost:** $40-80/month

**Decision: Vercel + Supabase** ✅

**Rationale:**
- **Perfect fit for Next.js 14 App Router** - Vercel built Next.js, zero-config deployment
- **Free tier covers MVP** - Vercel: 100GB bandwidth, Supabase: 50K MAU, 500MB database
- **Fastest time-to-market** - Managed services reduce DevOps overhead by ~80%
- **Excellent SEO & Performance** - Edge network, automatic image optimization, ISR support
- **AI-friendly architecture** - Simple, well-documented APIs that AI agents can work with easily

**Platform:** Vercel + Supabase  
**Key Services:**
- **Vercel:** Edge Network, Serverless Functions, Analytics, Web Vitals Monitoring
- **Supabase:** PostgreSQL Database, Authentication (JWT), Storage (S3-compatible), Row Level Security (RLS)
- **Vercel CDN:** Global edge caching for static assets and ISR pages
- **Additional Services:** Sentry (error tracking), Google Analytics 4, Meta Pixel, Hotjar

**Deployment Host and Regions:**
- **Frontend (Vercel):** Global Edge Network (300+ locations worldwide including Asia-Pacific)
- **Database (Supabase):** Singapore region (closest to Thailand, ~50-80ms latency)
- **CDN:** Vercel Edge Network with automatic geo-routing

### Repository Structure

**Structure:** Monorepo with pnpm workspaces  
**Monorepo Tool:** pnpm workspaces (native, no additional tool needed)  
**Package Organization:** Apps + Shared Packages pattern

**Rationale:**
- **Monorepo benefits for this project:**
  - Share TypeScript types between frontend and backend (type-safe API contracts)
  - Shared utilities (card shuffle logic, constants, validators)
  - Unified dependency management and build process
  - Simplified for AI agents - everything in one repository

- **pnpm workspaces over Turborepo/Nx:**
  - **Simpler for MVP** - No additional configuration or learning curve
  - **Sufficient for project size** - 1 Next.js app with shared packages
  - **Faster installs** - pnpm's efficient node_modules structure
  - **Can migrate to Turborepo later** if project grows to multiple apps

**Package Strategy:**
```
/
├── apps/
│   └── web/                 # Main Next.js application (frontend + API routes)
├── packages/
│   ├── shared/              # Shared types, constants, utilities
│   ├── ui/                  # Shared UI components (future: admin dashboard)
│   └── config/              # Shared configs (ESLint, TypeScript, Tailwind)
└── package.json             # Root workspace configuration
```

**Why single app for MVP:**
- PRD specifies web app only (no separate mobile app or admin dashboard in MVP)
- Backend is serverless functions within Next.js (no separate backend service)
- Future-ready: Can add `apps/admin/` or `apps/mobile/` when needed

### High Level Architecture Diagram

```mermaid
graph TB
    subgraph "Users"
        U1[Mobile Browser<br/>iOS Safari]
        U2[Mobile Browser<br/>Android Chrome]
        U3[Desktop Browser<br/>Chrome/Firefox/Safari]
    end

    subgraph "Vercel Edge Network - Global CDN"
        CDN[Edge Cache<br/>Static Assets + ISR Pages]
        EdgeFunc[Edge Middleware<br/>Auth Check, Redirects]
    end

    subgraph "Vercel - Next.js Application"
        direction TB
        Frontend[React Frontend<br/>Server Components + Client Components]
        API[API Routes<br/>Serverless Functions<br/>RESTful Endpoints]
        ISR[Incremental Static Regeneration<br/>Card Encyclopedia Pages]
    end

    subgraph "Supabase - Backend Services"
        direction TB
        DB[(PostgreSQL<br/>Users, Readings, Cards)]
        Auth[Supabase Auth<br/>JWT Tokens<br/>OAuth Providers]
        Storage[Supabase Storage<br/>Card Images<br/>Share Images]
        RLS[Row Level Security<br/>User Data Privacy]
    end

    subgraph "Third-Party Services"
        GA4[Google Analytics 4<br/>User Behavior Tracking]
        MetaPixel[Meta Pixel<br/>Conversion Tracking]
        Hotjar[Hotjar<br/>Heatmaps & Recordings]
        Sentry[Sentry<br/>Error Tracking]
    end

    U1 --> CDN
    U2 --> CDN
    U3 --> CDN
    
    CDN --> EdgeFunc
    EdgeFunc --> Frontend
    EdgeFunc --> ISR
    
    Frontend --> API
    ISR --> API
    
    API --> DB
    API --> Auth
    API --> Storage
    
    DB -.-> RLS
    Auth -.-> RLS
    
    Frontend --> GA4
    Frontend --> MetaPixel
    Frontend --> Hotjar
    API --> Sentry
    Frontend --> Sentry

    style Frontend fill:#6B46C1,color:#fff
    style API fill:#1E293B,color:#fff
    style DB fill:#F59E0B,color:#000
    style CDN fill:#10B981,color:#fff
```

### Architectural Patterns

The following architectural patterns guide both frontend and backend development:

- **Jamstack Architecture:** Static site generation with serverless APIs and edge caching for optimal performance and scalability - _Rationale:_ Perfect fit for content-heavy tarot encyclopedia with dynamic reading features; enables <1s load times and excellent SEO through pre-rendering.

- **Serverless Functions (FaaS):** Next.js API Routes deployed as Vercel serverless functions - _Rationale:_ Zero infrastructure management, automatic scaling, pay-per-execution pricing ideal for MVP with unpredictable traffic; eliminates DevOps complexity for AI-driven development.

- **Backend-as-a-Service (BaaS):** Supabase provides managed database, auth, and storage - _Rationale:_ Reduces backend development time by 60-70%, includes production-ready auth and security (RLS) out-of-the-box, allows team to focus on business logic.

- **Component-Based UI:** Reusable React components with TypeScript for type safety - _Rationale:_ Maintainability and consistency across 7+ screens; enables parallel development by AI agents; type safety prevents runtime errors during rapid iteration.

- **Server Components + Client Components (React 18):** Use Server Components by default, Client Components only when needed for interactivity - _Rationale:_ Reduces JavaScript bundle size by ~40%, improves Time to Interactive (TTI), automatic code splitting by Next.js App Router.

- **Repository Pattern:** Abstract database access through repository layer - _Rationale:_ Decouples business logic from database implementation, makes unit testing easier, enables future migration from Supabase if needed (though unlikely).

- **Row Level Security (RLS):** Postgres RLS policies enforce data access at database level - _Rationale:_ Defense in depth - even if API security is bypassed, database enforces authorization; Supabase makes RLS policies easy to implement and maintain.

- **Incremental Static Regeneration (ISR):** Pre-render pages at build time, revalidate in background - _Rationale:_ Encyclopedia pages (78 cards) benefit from static generation for SEO and performance, ISR allows content updates without full rebuilds.

- **Progressive Web App (PWA):** Service worker for offline capability and installability - _Rationale:_ PRD requirement for home screen installation, offline access to tarot guide improves UX for returning users, increases engagement through push notifications.

- **Mobile-First Responsive Design:** Design for mobile viewport first, enhance for larger screens - _Rationale:_ PRD specifies 80% mobile traffic, thumb-friendly UI with ≥44px touch targets, one-hand usability prioritized.

- **API Gateway Pattern:** Single entry point through Next.js API Routes with centralized error handling and auth - _Rationale:_ Simplified client code, consistent error responses, centralized logging and monitoring, easy to add rate limiting or caching middleware.

---

## Tech Stack

This is the **DEFINITIVE technology selection** for the entire project. All development must use these exact versions and tools. This table serves as the single source of truth for the technology stack.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.3+ | Type-safe JavaScript superset for frontend and backend | Eliminates entire class of runtime errors, excellent IDE support, enables AI agents to understand code contracts, catches bugs at compile time rather than runtime |
| **Frontend Framework** | Next.js (App Router) | 14.1+ | React meta-framework with SSR, SSG, ISR capabilities | Built-in SEO optimization, image optimization, automatic code splitting, React Server Components reduce bundle size, Vercel deployment is zero-config, extensive documentation |
| **UI Component Library** | Headless UI + Custom Components | 1.7+ | Unstyled, accessible UI primitives | Full design control for mystical aesthetic, built-in accessibility (WCAG AA), works seamlessly with Tailwind, lightweight (no opinionated styles to override) |
| **State Management** | Zustand | 4.4+ | Lightweight state management (<1KB) | Simpler than Redux, React Context sufficient for auth/user state, Zustand for complex UI state (card selection), minimal boilerplate, excellent TypeScript support |
| **Form Handling** | React Hook Form + Zod | 7.49+ / 3.22+ | Performant forms with schema validation | Uncontrolled components = better performance, Zod provides type-safe validation that works on both client and server, reduces re-renders by 40-60% vs controlled forms |
| **Backend Language** | TypeScript | 5.3+ | Shared language between frontend and backend | Code and type reuse, single language reduces context switching, Node.js runtime on Vercel serverless functions |
| **Backend Framework** | Next.js API Routes | 14.1+ | Serverless API endpoints within Next.js | No separate backend repo needed, automatic TypeScript support, deployed as Vercel serverless functions, built-in middleware support |
| **API Style** | REST (JSON) | N/A | RESTful APIs with JSON payloads | Industry standard, simple for AI agents to implement, works well with Supabase client, easier to cache than GraphQL, no additional dependencies |
| **Database** | PostgreSQL (Supabase) | 15+ | Relational database with JSON support | ACID compliance for transaction integrity, excellent for relational data (users, readings, cards), Supabase provides connection pooling, pgvector for future semantic search |
| **ORM/Query Builder** | Prisma | 5.8+ | Type-safe database client | Auto-generates TypeScript types from schema, migrations built-in, works perfectly with PostgreSQL, excellent DX, prevents SQL injection automatically |
| **Cache** | Vercel Edge Cache | N/A | CDN caching for static assets and ISR pages | Built into Vercel deployment, zero config, 300+ edge locations, automatic cache invalidation with ISR revalidation |
| **In-Memory Cache** | Node.js Cache (future) | N/A | Runtime caching for API responses | For MVP, rely on Vercel cache; add in-memory cache (node-cache) if needed for hot data like daily card selections |
| **File Storage** | Supabase Storage | N/A | S3-compatible object storage | Stores card images and user-generated share images, CDN integration, access control via RLS, free tier: 1GB storage |
| **Authentication** | Supabase Auth | N/A | JWT-based auth with OAuth providers | Built-in email/password, Google OAuth, Facebook OAuth, JWT tokens, refresh token rotation, RLS integration, GDPR compliant |
| **Frontend Testing** | Vitest | 1.2+ | Fast unit testing framework | 10x faster than Jest, native ESM support, compatible with Next.js, simple configuration, excellent TypeScript support |
| **Component Testing** | React Testing Library | 14.1+ | User-centric component testing | Tests user behavior not implementation details, works with Vitest, encourages accessible components, industry standard |
| **Backend Testing** | Vitest | 1.2+ | Unit and integration tests for API routes | Same tool as frontend (consistency), fast execution, MSW (Mock Service Worker) integration for API mocking |
| **E2E Testing** | Playwright | 1.41+ | Cross-browser end-to-end testing | Tests real user scenarios, supports Chrome/Safari/Firefox, parallel execution, auto-wait reduces flaky tests, screenshot/video on failure |
| **Package Manager** | pnpm | 8.14+ | Fast, disk-space efficient package manager | 3x faster than npm, strict by default, perfect for monorepos, flat node_modules saves disk space |
| **Build Tool** | Next.js Build | 14.1+ | Built-in Next.js compiler (Turbopack) | Zero config, optimized for Next.js, handles TypeScript, Tailwind, image optimization automatically |
| **Bundler** | Webpack (via Next.js) | 5+ | Module bundler (Next.js default) | Next.js 14 uses optimized Webpack config, automatic code splitting, tree shaking, will migrate to Turbopack when stable |
| **CSS Framework** | Tailwind CSS | 3.4+ | Utility-first CSS framework | Rapid development, consistent design system, PurgeCSS removes unused styles (small bundle), JIT compiler for custom values, dark mode built-in |
| **CSS-in-JS (Animations)** | Framer Motion | 11.0+ | Production-ready animation library | Declarative animations, gesture support, optimized performance (60fps), perfect for card flip and mystical effects, TypeScript support |
| **IaC Tool** | Vercel CLI + Supabase CLI | Latest | Infrastructure as code via CLI | Vercel handles infrastructure automatically, Supabase CLI for database migrations, no Terraform/Pulumi needed for MVP |
| **CI/CD** | Vercel Git Integration | N/A | Automatic deployments on git push | Zero config CI/CD, preview deployments for PRs, automatic production deploys on main branch merge, built-in rollbacks |
| **Linting** | ESLint | 8.56+ | Static code analysis | Catches errors before runtime, enforces code style consistency, Next.js provides optimized config, TypeScript-aware rules |
| **Code Formatting** | Prettier | 3.2+ | Opinionated code formatter | Eliminates style debates, automatic formatting on save, integrates with ESLint, consistent code style across team/AI agents |
| **Git Hooks** | Husky + lint-staged | 9.0+ / 15.2+ | Pre-commit quality checks | Prevents broken code from being committed, runs ESLint + Prettier + type check before commit, faster than full repo lint |
| **Error Tracking** | Sentry | 7.99+ | Real-time error monitoring | Captures frontend and backend errors, source map support, user context, alerts on Slack/email, free tier: 5K events/month |
| **Performance Monitoring** | Vercel Analytics | N/A | Real User Monitoring (RUM) and Web Vitals | Built into Vercel, tracks Core Web Vitals (LCP, FID, CLS), no configuration needed, privacy-friendly (no cookies) |
| **User Analytics** | Google Analytics 4 | Latest | User behavior and conversion tracking | Industry standard, event-based tracking, funnel analysis, integrates with Google Ads for future marketing |
| **Conversion Tracking** | Meta Pixel | Latest | Facebook/Instagram ad conversion tracking | Required for social media advertising, tracks signup and reading events, retargeting capabilities |
| **User Behavior Analytics** | Hotjar | Latest | Heatmaps and session recordings | Visual understanding of user behavior, identify UX issues, free tier: 35 sessions/day |
| **Logging** | Vercel Log Drain (future) | N/A | Centralized logging | For MVP, use Vercel dashboard logs; add log drain to Datadog/LogRocket if needed at scale |
| **API Documentation** | TypeScript Types + Comments | N/A | Type definitions serve as documentation | TypeScript interfaces document API contracts, JSDoc comments for complex logic, no separate OpenAPI spec needed for MVP |
| **Design Tokens** | Tailwind Config | 3.4+ | Centralized design system variables | Colors, spacing, typography defined in tailwind.config.js, ensures consistency, easy to update theme |
| **Icon Library** | Lucide React | 0.309+ | Feather icons for React | Beautiful, consistent icon set, tree-shakeable, TypeScript support, lightweight (only import used icons) |
| **Date/Time Handling** | date-fns | 3.2+ | Modern date utility library | Functional, immutable, tree-shakeable, smaller than moment.js, Thai locale support |
| **Environment Variables** | Dotenv (Next.js built-in) | N/A | Environment configuration | Next.js supports .env files natively, NEXT_PUBLIC_ prefix for client-side vars, type-safe env vars via TypeScript |
| **Database Migrations** | Prisma Migrate | 5.8+ | Version-controlled database schema changes | Creates and applies SQL migrations, tracks schema history, team collaboration on schema changes |
| **Code Generation** | Prisma Client | 5.8+ | Auto-generate TypeScript types from database | Keeps types in sync with database, regenerate after migrations, prevents type mismatches |

---

## Data Models

This section defines the core data models/entities that will be shared between frontend and backend. These models represent the business domain and form the foundation of our database schema and API contracts.

### User

**Purpose:** Represents registered users of the application. Users can create accounts to save reading history, personalize settings, and access premium features in the future.

**Key Attributes:**
- `id`: string (UUID) - Unique user identifier from Supabase Auth
- `email`: string - User's email address (unique, required)
- `name`: string | null - User's display name (optional)
- `profile_picture_url`: string | null - URL to user's profile picture (stored in Supabase Storage)
- `created_at`: Date - Account creation timestamp
- `updated_at`: Date - Last profile update timestamp
- `last_login_at`: Date | null - Last successful login timestamp
- `email_verified`: boolean - Email verification status (Supabase Auth)
- `auth_provider`: enum - Authentication provider used (email, google, facebook)

#### TypeScript Interface

```typescript
export interface User {
  id: string;
  email: string;
  name: string | null;
  profile_picture_url: string | null;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
  email_verified: boolean;
  auth_provider: 'email' | 'google' | 'facebook';
}

// Client-safe version (excludes sensitive data)
export type UserProfile = Omit<User, 'email_verified'>;
```

#### Relationships

- **One-to-Many with Reading:** A user can have multiple readings (history)
- **One-to-Many with FavoriteCard:** A user can favorite multiple cards (Epic 4)
- **One-to-Many with ReadingNote:** A user can add notes to their readings (Epic 4)

---

### Card

**Purpose:** Represents the 78 tarot cards in the deck (22 Major Arcana + 56 Minor Arcana). Cards are static reference data seeded at database initialization and referenced by readings.

**Key Attributes:**
- `id`: string (UUID) - Unique card identifier
- `number`: number - Card number within its suit (0-21 for Major Arcana, 1-14 for Minor)
- `name`: string - Card name in English (e.g., "The Fool", "Ace of Cups")
- `name_th`: string - Card name in Thai (e.g., "คนบ้า", "เอซถ้วย")
- `suit`: enum - Card suit (major_arcana, wands, cups, swords, pentacles)
- `arcana`: enum - Major or Minor Arcana (major, minor)
- `image_url`: string - URL to card front image (WebP format, stored in Supabase Storage)
- `image_back_url`: string - URL to card back image (shared across all cards)
- `meaning_upright`: string - Interpretation when card is upright (Thai, 2-3 paragraphs)
- `meaning_reversed`: string - Interpretation when card is reversed (Thai, 2-3 paragraphs)
- `keywords_upright`: string[] - Key concepts for upright position (Thai)
- `keywords_reversed`: string[] - Key concepts for reversed position (Thai)
- `symbolism`: string - Explanation of visual elements (Epic 3, optional for MVP)
- `advice`: string - Practical guidance (Thai, 1-2 paragraphs)
- `element`: enum | null - Associated element for Minor Arcana (fire, water, air, earth)
- `slug`: string - SEO-friendly URL slug (e.g., "the-fool", "ace-of-cups")
- `created_at`: Date - Record creation timestamp

#### TypeScript Interface

```typescript
export type Suit = 'major_arcana' | 'wands' | 'cups' | 'swords' | 'pentacles';
export type Arcana = 'major' | 'minor';
export type Element = 'fire' | 'water' | 'air' | 'earth';

export interface Card {
  id: string;
  number: number;
  name: string;
  name_th: string;
  suit: Suit;
  arcana: Arcana;
  image_url: string;
  image_back_url: string;
  meaning_upright: string;
  meaning_reversed: string;
  keywords_upright: string[];
  keywords_reversed: string[];
  symbolism: string | null;
  advice: string;
  element: Element | null;
  slug: string;
  created_at: Date;
}

// Lightweight version for lists and previews
export type CardSummary = Pick<Card, 'id' | 'name' | 'name_th' | 'suit' | 'image_url' | 'slug'>;
```

#### Relationships

- **Many-to-Many with Reading:** Cards appear in multiple readings through ReadingCard junction table
- **One-to-Many with FavoriteCard:** A card can be favorited by multiple users (Epic 4)

---

### Reading

**Purpose:** Represents a tarot reading session. Each reading captures the type (Daily or 3-Card Spread), the question asked (optional), and metadata about when and by whom it was performed.

**Key Attributes:**
- `id`: string (UUID) - Unique reading identifier
- `user_id`: string | null - Foreign key to User (null for anonymous readings)
- `reading_type`: enum - Type of reading performed (daily, three_card)
- `question`: string | null - User's question or intention (max 500 chars, optional)
- `created_at`: Date - Reading creation timestamp
- `updated_at`: Date - Last modification timestamp (for notes in Epic 4)
- `is_favorite`: boolean - Whether user marked this reading as favorite (Epic 4)
- `notes`: string | null - Personal notes added by user (Epic 4, max 2000 chars)

#### TypeScript Interface

```typescript
export type ReadingType = 'daily' | 'three_card';

export interface Reading {
  id: string;
  user_id: string | null;
  reading_type: ReadingType;
  question: string | null;
  created_at: Date;
  updated_at: Date;
  is_favorite: boolean;
  notes: string | null;
}

// Extended version with related data for display
export interface ReadingWithCards extends Reading {
  cards: ReadingCardWithDetails[];
}
```

#### Relationships

- **Many-to-One with User:** A reading belongs to one user (or null for anonymous)
- **One-to-Many with ReadingCard:** A reading contains 1-3 cards via ReadingCard junction table

---

### ReadingCard

**Purpose:** Junction table that links readings to cards. Stores position-specific information (Past/Present/Future for 3-Card Spread) and whether the card was drawn reversed (upside down).

**Key Attributes:**
- `id`: string (UUID) - Unique junction record identifier
- `reading_id`: string - Foreign key to Reading
- `card_id`: string - Foreign key to Card
- `position`: number - Card position in the spread (0 for Daily, 0-2 for 3-Card)
- `position_label`: enum | null - Semantic position label (past, present, future) for 3-Card Spread
- `is_reversed`: boolean - Whether card was drawn reversed (affects interpretation)
- `created_at`: Date - Record creation timestamp

#### TypeScript Interface

```typescript
export type PositionLabel = 'past' | 'present' | 'future';

export interface ReadingCard {
  id: string;
  reading_id: string;
  card_id: string;
  position: number;
  position_label: PositionLabel | null;
  is_reversed: boolean;
  created_at: Date;
}

// Extended version with full card details for display
export interface ReadingCardWithDetails extends ReadingCard {
  card: Card;
  // Computed property for display
  interpretation: string; // Returns meaning_upright or meaning_reversed based on is_reversed
}
```

#### Relationships

- **Many-to-One with Reading:** Multiple cards belong to one reading
- **Many-to-One with Card:** References the drawn card from the Card table

---

### FavoriteCard (Epic 4)

**Purpose:** Tracks which cards users have favorited for quick reference. Supports Epic 4 personalization features.

**Key Attributes:**
- `id`: string (UUID) - Unique favorite record identifier
- `user_id`: string - Foreign key to User
- `card_id`: string - Foreign key to Card
- `created_at`: Date - When card was favorited

#### TypeScript Interface

```typescript
export interface FavoriteCard {
  id: string;
  user_id: string;
  card_id: string;
  created_at: Date;
}

// Extended version for display
export interface FavoriteCardWithDetails extends FavoriteCard {
  card: Card;
}
```

#### Relationships

- **Many-to-One with User:** A favorite belongs to one user
- **Many-to-One with Card:** A favorite references one card
- **Unique Constraint:** (user_id, card_id) - User can't favorite same card twice

---

### UserPreferences (Epic 4)

**Purpose:** Stores user personalization settings such as theme choice, notification preferences, and display options.

**Key Attributes:**
- `id`: string (UUID) - Unique preferences record identifier
- `user_id`: string - Foreign key to User (unique - one preferences record per user)
- `theme`: enum - Selected UI theme (dark_mystical, light_ethereal, deep_ocean, cosmic_purple)
- `enable_notifications`: boolean - Push notification preference
- `notification_time`: string | null - Preferred daily reminder time (HH:mm format)
- `enable_sound_effects`: boolean - Whether to play sound effects (card flip, shuffle)
- `language`: enum - Interface language preference (th, en)
- `created_at`: Date - Record creation timestamp
- `updated_at`: Date - Last update timestamp

#### TypeScript Interface

```typescript
export type Theme = 'dark_mystical' | 'light_ethereal' | 'deep_ocean' | 'cosmic_purple';
export type Language = 'th' | 'en';

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: Theme;
  enable_notifications: boolean;
  notification_time: string | null;
  enable_sound_effects: boolean;
  language: Language;
  created_at: Date;
  updated_at: Date;
}
```

#### Relationships

- **One-to-One with User:** Each user has one preferences record

---

## Data Model Relationships Diagram

```mermaid
erDiagram
    User ||--o{ Reading : "has many"
    User ||--o{ FavoriteCard : "favorites"
    User ||--|| UserPreferences : "has one"
    
    Reading ||--|{ ReadingCard : "contains"
    Card ||--o{ ReadingCard : "drawn in"
    Card ||--o{ FavoriteCard : "favorited by"
    
    User {
        string id PK
        string email UK
        string name
        string profile_picture_url
        datetime created_at
        datetime updated_at
        datetime last_login_at
        boolean email_verified
        enum auth_provider
    }
    
    Card {
        string id PK
        int number
        string name
        string name_th
        enum suit
        enum arcana
        string image_url
        string meaning_upright
        string meaning_reversed
        string_array keywords_upright
        string_array keywords_reversed
        string advice
        enum element
        string slug UK
        datetime created_at
    }
    
    Reading {
        string id PK
        string user_id FK
        enum reading_type
        string question
        datetime created_at
        datetime updated_at
        boolean is_favorite
        string notes
    }
    
    ReadingCard {
        string id PK
        string reading_id FK
        string card_id FK
        int position
        enum position_label
        boolean is_reversed
        datetime created_at
    }
    
    FavoriteCard {
        string id PK
        string user_id FK
        string card_id FK
        datetime created_at
    }
    
    UserPreferences {
        string id PK
        string user_id FK
        enum theme
        boolean enable_notifications
        string notification_time
        boolean enable_sound_effects
        enum language
        datetime created_at
        datetime updated_at
    }
```

---

## API Specification

This section defines the complete REST API specification for the Web App ดูดวงไพ่ยิปซี. All API routes are implemented as Next.js API Routes deployed as Vercel serverless functions. The API follows RESTful conventions with JSON payloads.

### REST API Specification

```yaml
openapi: 3.0.0
info:
  title: Web App ดูดวงไพ่ยิปซี API
  version: 1.0.0
  description: |
    RESTful API for tarot card reading application. Provides endpoints for:
    - Card management and encyclopedia
    - Reading creation and history
    - User authentication and profiles
    - Favorites and personalization
    
    All endpoints return JSON responses and use JWT authentication where required.
  contact:
    name: API Support
    email: support@tarot-app.example.com

servers:
  - url: https://api.tarot-app.vercel.app
    description: Production API (Vercel)
  - url: http://localhost:3000
    description: Local Development

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Supabase JWT token obtained from authentication

  schemas:
    # Core Models
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: "123e4567-e89b-12d3-a456-426614174000"
        email:
          type: string
          format: email
          example: "user@example.com"
        name:
          type: string
          nullable: true
          example: "สมชาย ใจดี"
        profile_picture_url:
          type: string
          format: uri
          nullable: true
        created_at:
          type: string
          format: date-time
        last_login_at:
          type: string
          format: date-time
          nullable: true
        auth_provider:
          type: string
          enum: [email, google, facebook]

    Card:
      type: object
      properties:
        id:
          type: string
          format: uuid
        number:
          type: integer
          minimum: 0
          maximum: 21
        name:
          type: string
          example: "The Fool"
        name_th:
          type: string
          example: "คนบ้า"
        suit:
          type: string
          enum: [major_arcana, wands, cups, swords, pentacles]
        arcana:
          type: string
          enum: [major, minor]
        image_url:
          type: string
          format: uri
        meaning_upright:
          type: string
        meaning_reversed:
          type: string
        keywords_upright:
          type: array
          items:
            type: string
        keywords_reversed:
          type: array
          items:
            type: string
        advice:
          type: string
        element:
          type: string
          enum: [fire, water, air, earth]
          nullable: true
        slug:
          type: string
          example: "the-fool"

    Reading:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
          nullable: true
        reading_type:
          type: string
          enum: [daily, three_card]
        question:
          type: string
          maxLength: 500
          nullable: true
        created_at:
          type: string
          format: date-time
        is_favorite:
          type: boolean
          default: false
        notes:
          type: string
          maxLength: 2000
          nullable: true

    ReadingCard:
      type: object
      properties:
        id:
          type: string
          format: uuid
        reading_id:
          type: string
          format: uuid
        card_id:
          type: string
          format: uuid
        position:
          type: integer
          minimum: 0
          maximum: 2
        position_label:
          type: string
          enum: [past, present, future]
          nullable: true
        is_reversed:
          type: boolean

    ReadingWithCards:
      allOf:
        - $ref: '#/components/schemas/Reading'
        - type: object
          properties:
            cards:
              type: array
              items:
                allOf:
                  - $ref: '#/components/schemas/ReadingCard'
                  - type: object
                    properties:
                      card:
                        $ref: '#/components/schemas/Card'
                      interpretation:
                        type: string
                        description: "Computed field: upright or reversed meaning based on is_reversed"

    UserPreferences:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        theme:
          type: string
          enum: [dark_mystical, light_ethereal, deep_ocean, cosmic_purple]
          default: dark_mystical
        enable_notifications:
          type: boolean
          default: false
        notification_time:
          type: string
          pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
          nullable: true
          example: "09:00"
        enable_sound_effects:
          type: boolean
          default: true
        language:
          type: string
          enum: [th, en]
          default: th

    # Request/Response Models
    CreateReadingRequest:
      type: object
      required:
        - reading_type
      properties:
        reading_type:
          type: string
          enum: [daily, three_card]
        question:
          type: string
          maxLength: 500
        user_id:
          type: string
          format: uuid
          description: "Optional - if authenticated"

    CreateReadingResponse:
      type: object
      properties:
        reading:
          $ref: '#/components/schemas/ReadingWithCards'
        message:
          type: string
          example: "Reading created successfully"

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
              example: "VALIDATION_ERROR"
            message:
              type: string
              example: "Invalid input parameters"
            details:
              type: object
              additionalProperties: true
            timestamp:
              type: string
              format: date-time
            requestId:
              type: string
              format: uuid

  responses:
    UnauthorizedError:
      description: Access token is missing or invalid
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: "UNAUTHORIZED"
              message: "Authentication required"
              timestamp: "2025-12-30T10:30:00Z"
              requestId: "req_123456"

    NotFoundError:
      description: The specified resource was not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    ValidationError:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

paths:
  # ============================================================================
  # CARDS ENDPOINTS (Public)
  # ============================================================================
  /api/cards:
    get:
      summary: Get all tarot cards
      description: Returns list of all 78 tarot cards with optional filtering
      tags: [Cards]
      parameters:
        - name: suit
          in: query
          schema:
            type: string
            enum: [major_arcana, wands, cups, swords, pentacles]
          description: Filter by suit
        - name: arcana
          in: query
          schema:
            type: string
            enum: [major, minor]
          description: Filter by arcana type
        - name: search
          in: query
          schema:
            type: string
          description: Search card name (Thai or English)
        - name: limit
          in: query
          schema:
            type: integer
            default: 78
          description: Number of cards to return
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
          description: Pagination offset
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  cards:
                    type: array
                    items:
                      $ref: '#/components/schemas/Card'
                  total:
                    type: integer
                  limit:
                    type: integer
                  offset:
                    type: integer

  /api/cards/{slug}:
    get:
      summary: Get card by slug
      description: Returns detailed information for a specific card
      tags: [Cards]
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
          example: "the-fool"
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  card:
                    $ref: '#/components/schemas/Card'
        '404':
          $ref: '#/components/responses/NotFoundError'

  /api/cards/shuffle:
    get:
      summary: Shuffle deck and prepare for drawing
      description: Returns shuffled array of card IDs (no actual drawing)
      tags: [Cards]
      responses:
        '200':
          description: Shuffled deck
          content:
            application/json:
              schema:
                type: object
                properties:
                  shuffled_card_ids:
                    type: array
                    items:
                      type: string
                      format: uuid
                  shuffle_seed:
                    type: string
                    description: "Optional seed for reproducibility (dev only)"

  # ============================================================================
  # READINGS ENDPOINTS
  # ============================================================================
  /api/readings:
    post:
      summary: Create new reading
      description: |
        Draws cards and creates a new reading. Can be anonymous or authenticated.
        - Daily reading: draws 1 card
        - 3-Card Spread: draws 3 cards (Past-Present-Future)
      tags: [Readings]
      security:
        - BearerAuth: []
        - {} # Allow anonymous
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateReadingRequest'
            example:
              reading_type: "three_card"
              question: "จะเป็นอย่างไรกับอาชีพการงานของฉัน?"
      responses:
        '201':
          description: Reading created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateReadingResponse'
        '400':
          $ref: '#/components/responses/ValidationError'

    get:
      summary: Get reading history
      description: |
        Returns user's reading history (requires authentication).
        Anonymous readings not included unless claimed.
      tags: [Readings]
      security:
        - BearerAuth: []
      parameters:
        - name: reading_type
          in: query
          schema:
            type: string
            enum: [daily, three_card, all]
            default: all
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
        - name: is_favorite
          in: query
          schema:
            type: boolean
          description: Filter favorite readings only
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  readings:
                    type: array
                    items:
                      $ref: '#/components/schemas/ReadingWithCards'
                  total:
                    type: integer
                  limit:
                    type: integer
                  offset:
                    type: integer
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /api/readings/{id}:
    get:
      summary: Get reading by ID
      description: Returns full reading details with cards
      tags: [Readings]
      security:
        - BearerAuth: []
        - {} # Allow anonymous if user owns reading
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  reading:
                    $ref: '#/components/schemas/ReadingWithCards'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '403':
          description: Forbidden - user doesn't own this reading
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    patch:
      summary: Update reading
      description: Update reading notes or favorite status
      tags: [Readings]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                notes:
                  type: string
                  maxLength: 2000
                is_favorite:
                  type: boolean
            example:
              notes: "คำทำนายนี้แม่นมาก! ต้องจำไว้"
              is_favorite: true
      responses:
        '200':
          description: Reading updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  reading:
                    $ref: '#/components/schemas/Reading'
                  message:
                    type: string
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '404':
          $ref: '#/components/responses/NotFoundError'

    delete:
      summary: Delete reading
      description: Permanently delete a reading from history
      tags: [Readings]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Reading deleted
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Reading deleted successfully"
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '404':
          $ref: '#/components/responses/NotFoundError'

  # ============================================================================
  # USER ENDPOINTS (Authenticated)
  # ============================================================================
  /api/users/me:
    get:
      summary: Get current user profile
      description: Returns authenticated user's profile information
      tags: [Users]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  user:
                    $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

    patch:
      summary: Update user profile
      description: Update name and profile picture
      tags: [Users]
      security:
        - BearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  maxLength: 100
                profile_picture_url:
                  type: string
                  format: uri
            example:
              name: "สมชาย ใจดี"
      responses:
        '200':
          description: Profile updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  user:
                    $ref: '#/components/schemas/User'
                  message:
                    type: string
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /api/users/me/stats:
    get:
      summary: Get user statistics
      description: Returns reading count, favorite count, account age
      tags: [Users]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: User statistics
          content:
            application/json:
              schema:
                type: object
                properties:
                  total_readings:
                    type: integer
                  daily_readings:
                    type: integer
                  three_card_readings:
                    type: integer
                  favorite_readings:
                    type: integer
                  favorite_cards:
                    type: integer
                  account_age_days:
                    type: integer
                  last_reading_at:
                    type: string
                    format: date-time

  # ============================================================================
  # FAVORITES ENDPOINTS (Epic 4)
  # ============================================================================
  /api/favorites:
    get:
      summary: Get user's favorite cards
      description: Returns list of cards favorited by user
      tags: [Favorites]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  favorites:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                          format: uuid
                        card:
                          $ref: '#/components/schemas/Card'
                        created_at:
                          type: string
                          format: date-time

    post:
      summary: Add card to favorites
      description: Bookmark a card for quick reference
      tags: [Favorites]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - card_id
              properties:
                card_id:
                  type: string
                  format: uuid
      responses:
        '201':
          description: Card favorited
          content:
            application/json:
              schema:
                type: object
                properties:
                  favorite:
                    type: object
                    properties:
                      id:
                        type: string
                        format: uuid
                      card_id:
                        type: string
                        format: uuid
                  message:
                    type: string
        '409':
          description: Card already favorited
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/favorites/{id}:
    delete:
      summary: Remove card from favorites
      description: Unfavorite a previously bookmarked card
      tags: [Favorites]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
          description: Favorite record ID (not card ID)
      responses:
        '200':
          description: Favorite removed
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string

  # ============================================================================
  # PREFERENCES ENDPOINTS (Epic 4)
  # ============================================================================
  /api/preferences:
    get:
      summary: Get user preferences
      description: Returns user's personalization settings
      tags: [Preferences]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  preferences:
                    $ref: '#/components/schemas/UserPreferences'

    patch:
      summary: Update user preferences
      description: Update theme, notification settings, etc.
      tags: [Preferences]
      security:
        - BearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                theme:
                  type: string
                  enum: [dark_mystical, light_ethereal, deep_ocean, cosmic_purple]
                enable_notifications:
                  type: boolean
                notification_time:
                  type: string
                  pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
                enable_sound_effects:
                  type: boolean
                language:
                  type: string
                  enum: [th, en]
            example:
              theme: "cosmic_purple"
              enable_notifications: true
              notification_time: "09:00"
      responses:
        '200':
          description: Preferences updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  preferences:
                    $ref: '#/components/schemas/UserPreferences'
                  message:
                    type: string

  # ============================================================================
  # SHARE ENDPOINTS (Epic 3)
  # ============================================================================
  /api/share/generate:
    post:
      summary: Generate share image
      description: Creates shareable image for social media (1080x1080 and 1200x630)
      tags: [Share]
      security:
        - BearerAuth: []
        - {} # Allow anonymous
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - reading_id
              properties:
                reading_id:
                  type: string
                  format: uuid
                format:
                  type: string
                  enum: [instagram, facebook, twitter]
                  default: instagram
      responses:
        '200':
          description: Share image generated
          content:
            application/json:
              schema:
                type: object
                properties:
                  image_url:
                    type: string
                    format: uri
                    description: "URL to generated image in Supabase Storage"
                  image_width:
                    type: integer
                  image_height:
                    type: integer
                  expires_at:
                    type: string
                    format: date-time
                    description: "Image expiration (7 days)"
```

---

## Components

This section identifies major logical components across the fullstack application. Components are organized by layer (Frontend, Backend, Shared) with clear boundaries, responsibilities, and interfaces.

### Frontend - Web Application (`apps/web/`)

**Responsibility:** React-based user interface for tarot reading application. Handles all user interactions, displays readings, manages client-side state, and communicates with backend APIs.

**Key Interfaces:**
- **Public Pages:** Landing page, reading selection, card selection, reading results, card encyclopedia
- **Authenticated Pages:** User profile, reading history, favorites, preferences
- **API Communication:** RESTful API calls via service layer to Next.js API Routes

**Dependencies:**
- Next.js 14+ framework (routing, SSR, image optimization)
- Supabase client (authentication state management)
- Shared packages (types, constants, utilities)
- External libraries (Tailwind, Framer Motion, React Hook Form)

**Technology Stack:**
- **Framework:** Next.js 14+ App Router
- **Language:** TypeScript 5.3+
- **Styling:** Tailwind CSS + Framer Motion
- **State:** Zustand (UI state) + React Context (auth state)
- **Forms:** React Hook Form + Zod validation

**Sub-components:**
- Page Components (app router structure)
- UI Components (reusable React components)
- Layout Components (navigation, footer, modals)
- Feature Components (card selection, reading display)
- Service Layer (API client abstractions)
- Hooks (custom React hooks for shared logic)
- Stores (Zustand state management)

---

### Backend - API Layer (`apps/web/app/api/`)

**Responsibility:** Serverless API endpoints that handle business logic, database operations, authentication, and external service integrations. Deployed as Vercel serverless functions.

**Key Interfaces:**
- **REST API Endpoints:** `/api/cards`, `/api/readings`, `/api/users`, `/api/favorites`, `/api/preferences`, `/api/share`
- **Database Access:** Prisma ORM to PostgreSQL (Supabase)
- **Authentication:** Supabase Auth JWT validation
- **File Storage:** Supabase Storage for images

**Dependencies:**
- Prisma Client (database access)
- Supabase Server Client (auth validation, storage)
- Shared packages (types, utilities, validators)
- Node.js runtime (Vercel serverless)

**Technology Stack:**
- **Runtime:** Node.js on Vercel Serverless Functions
- **Language:** TypeScript 5.3+
- **ORM:** Prisma 5.8+
- **Validation:** Zod schemas
- **Auth:** Supabase Auth (JWT validation)

**Sub-components:**
- API Route Handlers (Next.js route handlers)
- Service Layer (business logic)
- Repository Layer (data access abstraction)
- Middleware (authentication, error handling, logging)
- Validators (request/response validation)

---

### Database Layer (Supabase PostgreSQL)

**Responsibility:** Persistent data storage for users, cards, readings, favorites, and preferences. Enforces data integrity through constraints and Row Level Security (RLS) policies.

**Key Interfaces:**
- **Prisma Client:** Type-safe database queries
- **Connection Pooling:** Supabase's built-in pooling (PgBouncer)
- **RLS Policies:** User-scoped data access control

**Dependencies:**
- PostgreSQL 15+ (Supabase managed)
- Prisma migrations (schema versioning)

**Technology Stack:**
- **Database:** PostgreSQL 15+
- **Access:** Prisma ORM
- **Security:** Row Level Security (RLS)
- **Backup:** Supabase automatic daily backups

**Sub-components:**
- Tables (Users, Cards, Readings, ReadingCards, FavoriteCards, UserPreferences)
- Indexes (query optimization)
- RLS Policies (authorization)
- Triggers (future: audit logs, updated_at timestamps)

---

### Authentication Service (Supabase Auth)

**Responsibility:** User authentication and authorization. Handles signup, login, password reset, OAuth providers (Google, Facebook), JWT token issuance and validation.

**Key Interfaces:**
- **Frontend SDK:** Supabase JavaScript client (`@supabase/supabase-js`)
- **Backend Validation:** JWT verification in API routes
- **OAuth Providers:** Google, Facebook OAuth flows

**Dependencies:**
- Supabase Auth service (managed)
- User table (linked via user_id)

**Technology Stack:**
- **Provider:** Supabase Auth
- **Token Format:** JWT (JSON Web Tokens)
- **Session Storage:** httpOnly cookies or localStorage
- **OAuth:** Google and Facebook providers

**Sub-components:**
- Auth UI Components (signup, login, password reset forms)
- Auth Context (React Context for auth state)
- Protected Route Wrapper (HOC for authenticated pages)
- API Auth Middleware (JWT validation middleware)

---

### Storage Service (Supabase Storage)

**Responsibility:** Object storage for card images, user profile pictures, and generated share images. Provides CDN-backed URLs and access control via RLS.

**Key Interfaces:**
- **Upload API:** `supabase.storage.from('bucket').upload()`
- **Public URLs:** CDN-backed URLs for card images
- **Signed URLs:** Temporary URLs for private content

**Dependencies:**
- Supabase Storage (S3-compatible)
- RLS policies (access control)

**Technology Stack:**
- **Provider:** Supabase Storage
- **CDN:** Supabase CDN (CloudFlare)
- **Format:** WebP images (optimized)
- **Buckets:** `cards` (public), `profiles` (private), `shares` (public, temp)

**Sub-components:**
- Upload utilities (file size limits, format validation)
- Image optimization pipeline (WebP conversion, resizing)
- CDN cache management

---

### Card Shuffle Engine

**Responsibility:** Cryptographically secure random card selection. Ensures fair, unpredictable card draws and determines reversed status for each card.

**Key Interfaces:**
- **shuffle():** Returns randomized array of all 78 card IDs
- **drawCards(count):** Selects specified number of unique cards
- **determineReversed():** 50% chance for each card to be reversed

**Dependencies:**
- Crypto library (Node.js `crypto` module for secure randomization)
- Card data (list of all 78 card IDs)

**Technology Stack:**
- **Language:** TypeScript
- **Randomization:** `crypto.randomInt()` (cryptographically secure)
- **Algorithm:** Fisher-Yates shuffle

**Sub-components:**
- Shuffle algorithm implementation
- Reversed status generator
- Unit tests (verify randomness distribution)

---

### Share Image Generator

**Responsibility:** Generates beautiful social media share images (1080x1080 for Instagram, 1200x630 for Facebook/Twitter) with card images, interpretations, and branding.

**Key Interfaces:**
- **generateShareImage(readingId, format):** Returns URL to generated image
- **Supported formats:** Instagram (square), Facebook/Twitter (landscape)

**Dependencies:**
- Canvas library (`@vercel/og` or `canvas` for Node.js)
- Card images from Supabase Storage
- Font files for Thai language support

**Technology Stack:**
- **Library:** `@vercel/og` (Vercel Edge Function image generation)
- **Format:** PNG or JPEG
- **Storage:** Supabase Storage (temporary, 7-day expiration)

**Sub-components:**
- Template renderer (card layout, text positioning)
- Font loader (Thai + English fonts)
- Image compositor (combines elements)
- Storage uploader (saves to Supabase, returns URL)

---

### Analytics Tracker

**Responsibility:** Client-side analytics tracking for user behavior, conversion events, and performance metrics. Integrates with multiple analytics platforms.

**Key Interfaces:**
- **trackEvent(eventName, properties):** Send custom event
- **trackPageView(pagePath):** Page view tracking
- **identifyUser(userId):** Associate events with user

**Dependencies:**
- Google Analytics 4 (`gtag.js`)
- Meta Pixel
- Hotjar
- Vercel Analytics (automatic)

**Technology Stack:**
- **Providers:** GA4, Meta Pixel, Hotjar, Vercel Analytics
- **Implementation:** Client-side JavaScript (loaded asynchronously)
- **Privacy:** PDPA-compliant (cookie consent)

**Sub-components:**
- Analytics wrapper (unified interface for all providers)
- Event tracking hooks (`useTrackEvent`, `usePageView`)
- Cookie consent manager
- Environment-based enablement (disabled in development)

---

### Error Tracking Service (Sentry)

**Responsibility:** Captures and reports errors from both frontend and backend. Provides context (user actions, breadcrumbs) for debugging.

**Key Interfaces:**
- **captureException(error, context):** Log exception with context
- **captureMessage(message, level):** Log custom message
- **setUser(user):** Associate errors with user ID

**Dependencies:**
- Sentry SDK (`@sentry/nextjs`)
- Source maps (for stack trace symbolication)

**Technology Stack:**
- **Provider:** Sentry
- **SDK:** `@sentry/nextjs` (supports both client and server)
- **Integration:** Automatic Next.js error capture

**Sub-components:**
- Error boundary (React error boundary component)
- API error middleware (catches unhandled errors)
- Custom error reporter (business logic errors)

---

### Shared - Types Package (`packages/shared/`)

**Responsibility:** Shared TypeScript types, interfaces, and constants used across frontend and backend. Single source of truth for data contracts.

**Key Interfaces:**
- Exported types for all data models (User, Card, Reading, etc.)
- API request/response types
- Enums (ReadingType, Suit, Arcana, Theme, etc.)
- Constants (API endpoints, validation rules)

**Dependencies:**
- None (pure TypeScript types)

**Technology Stack:**
- **Language:** TypeScript 5.3+
- **Distribution:** Compiled to `dist/` for import

**Sub-components:**
- `/types/` - Interface definitions
- `/constants/` - Shared constants
- `/validators/` - Zod schemas (shared validation)
- `/utils/` - Pure utility functions

---

### Shared - UI Package (`packages/ui/`)

**Responsibility:** Reusable UI components that can be shared across multiple apps (future-proofing for admin dashboard or mobile web views).

**Key Interfaces:**
- Base components (Button, Input, Card, Modal)
- Accessibility components (VisuallyHidden, FocusTrap)
- Tailwind-based styling

**Dependencies:**
- React
- Tailwind CSS (via config package)
- Headless UI (accessible primitives)

**Technology Stack:**
- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS
- **Documentation:** Storybook (future)

**Sub-components:**
- `/components/` - React components
- `/hooks/` - Shared React hooks
- `/styles/` - Shared CSS/Tailwind utilities

---

### Component Diagrams

#### High-Level Component Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        Pages[Page Components<br/>Next.js App Router]
        UI[UI Components<br/>React + Tailwind]
        Services[Service Layer<br/>API Clients]
        Hooks[Custom Hooks]
        Stores[Zustand Stores]
    end

    subgraph "API Layer - Backend"
        APIRoutes[API Route Handlers<br/>Next.js API Routes]
        BusinessLogic[Service Layer<br/>Business Logic]
        DataAccess[Repository Layer<br/>Data Access]
        Middleware[Middleware<br/>Auth, Error, Logging]
    end

    subgraph "External Services"
        Database[(PostgreSQL<br/>Supabase)]
        Auth[Supabase Auth<br/>JWT Tokens]
        Storage[Supabase Storage<br/>S3-compatible]
        Analytics[Analytics Services<br/>GA4, Meta, Hotjar]
        ErrorTracking[Sentry<br/>Error Tracking]
    end

    subgraph "Shared Packages"
        Types[Types Package<br/>Shared TypeScript Types]
        SharedUI[UI Package<br/>Shared Components]
    end

    Pages --> UI
    Pages --> Services
    Pages --> Hooks
    Pages --> Stores
    
    Services --> APIRoutes
    
    APIRoutes --> Middleware
    Middleware --> BusinessLogic
    BusinessLogic --> DataAccess
    
    DataAccess --> Database
    BusinessLogic --> Auth
    BusinessLogic --> Storage
    
    Pages --> Analytics
    Pages --> ErrorTracking
    APIRoutes --> ErrorTracking
    
    Pages -.-> Types
    UI -.-> Types
    APIRoutes -.-> Types
    BusinessLogic -.-> Types
    
    UI -.-> SharedUI
    
    style Pages fill:#6B46C1,color:#fff
    style APIRoutes fill:#1E293B,color:#fff
    style Database fill:#F59E0B,color:#000
    style Auth fill:#10B981,color:#fff
```

#### Component Interaction - Create Reading Flow

```mermaid
sequenceDiagram
    participant User
    participant Page as Reading Page
    participant Service as API Service
    participant API as API Route
    participant Shuffle as Shuffle Engine
    participant Repo as Repository
    participant DB as Database
    participant Analytics as Analytics

    User->>Page: Select reading type
    Page->>Service: createReading(type, question)
    Service->>API: POST /api/readings
    
    API->>API: Validate request
    API->>Shuffle: drawCards(count)
    Shuffle->>Shuffle: Shuffle deck
    Shuffle->>Shuffle: Select cards + reversed
    Shuffle-->>API: Selected cards
    
    API->>Repo: createReading(data)
    Repo->>DB: INSERT reading + reading_cards
    DB-->>Repo: Reading created
    Repo-->>API: Reading with cards
    
    API-->>Service: 201 Created + reading
    Service-->>Page: Reading data
    Page->>Page: Render reading result
    Page->>Analytics: Track reading_completed event
    Page->>User: Display cards + interpretation
```

#### Component Interaction - User Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant LoginPage as Login Page
    participant AuthContext as Auth Context
    participant SupabaseAuth as Supabase Auth
    participant API as API Route
    participant DB as Database

    User->>LoginPage: Enter credentials
    LoginPage->>SupabaseAuth: signInWithPassword()
    SupabaseAuth->>SupabaseAuth: Validate credentials
    SupabaseAuth-->>LoginPage: JWT tokens
    
    LoginPage->>AuthContext: setUser(user)
    AuthContext->>AuthContext: Store tokens
    
    LoginPage->>API: GET /api/users/me
    Note over LoginPage,API: Authorization: Bearer {token}
    
    API->>API: Validate JWT
    API->>DB: SELECT user data
    DB-->>API: User profile
    API-->>LoginPage: User data
    
    LoginPage->>User: Redirect to dashboard
```

---

## External APIs

This section documents all external API integrations required by the application. Each service provides critical functionality for authentication, storage, analytics, monitoring, or deployment.

### Supabase API

**Purpose:** Backend-as-a-Service (BaaS) providing PostgreSQL database, authentication, and file storage

**Documentation:** https://supabase.com/docs

**Base URL(s):**
- Database: `https://<project-id>.supabase.co/rest/v1/`
- Auth: `https://<project-id>.supabase.co/auth/v1/`
- Storage: `https://<project-id>.supabase.co/storage/v1/`

**Authentication:** 
- **API Key:** Service role key (server-side only, full access)
- **Anon Key:** Anonymous key (client-side, RLS-restricted)
- **JWT Tokens:** User authentication tokens

**Rate Limits:**
- Free tier: 50,000 monthly active users
- 500 MB database storage
- 1 GB file storage
- 2 GB bandwidth/month
- No strict API rate limits on free tier (fair use policy)

**Key Endpoints Used:**

1. **Database (Prisma via connection string):**
   - Connection string: `postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`
   - Accessed via Prisma ORM (not direct REST calls)

2. **Authentication:**
   - `POST /auth/v1/signup` - Create new user account
   - `POST /auth/v1/token?grant_type=password` - Login with email/password
   - `POST /auth/v1/token?grant_type=refresh_token` - Refresh access token
   - `POST /auth/v1/recover` - Password reset request
   - `POST /auth/v1/logout` - Sign out user
   - `GET /auth/v1/user` - Get current user info (requires JWT)
   - **OAuth Providers:**
     - `GET /auth/v1/authorize?provider=google` - Google OAuth flow
     - `GET /auth/v1/authorize?provider=facebook` - Facebook OAuth flow

3. **Storage:**
   - `POST /storage/v1/object/{bucket}` - Upload file
   - `GET /storage/v1/object/{bucket}/{path}` - Get file (public or signed URL)
   - `DELETE /storage/v1/object/{bucket}/{path}` - Delete file
   - `POST /storage/v1/object/sign/{bucket}` - Generate signed URL

**Integration Notes:**
- **Client vs Server SDK:** Use `@supabase/supabase-js` client on frontend, `@supabase/ssr` for server-side
- **Row Level Security (RLS):** All database access enforced by RLS policies
- **Connection Pooling:** Use Supabase's connection pooler (port 6543) for serverless functions to avoid connection exhaustion
- **CORS:** Configured to allow requests from Vercel domain
- **Environment Variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only)

---

### Google Analytics 4 (GA4) API

**Purpose:** User behavior tracking, conversion tracking, and funnel analysis

**Documentation:** https://developers.google.com/analytics/devguides/collection/ga4

**Base URL(s):**
- Measurement Protocol: `https://www.google-analytics.com/mp/collect`
- Data API (future): `https://analyticsdata.googleapis.com/v1beta`

**Authentication:** 
- **Measurement ID:** `G-XXXXXXXXXX` (configured in gtag.js)
- **API Secret:** Required for server-side events via Measurement Protocol

**Rate Limits:**
- No strict limits for client-side tracking
- Measurement Protocol: 20 hits per second per property
- Data API: 10 queries per second (for future reporting)

**Key Endpoints Used:**

1. **Client-side tracking (gtag.js):**
   - Automatically loaded script: `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
   - Events sent automatically (page views, clicks, scrolls)

2. **Custom events tracked:**
   - `reading_started` - User begins card selection
   - `reading_completed` - Reading result displayed
   - `reading_type` - Parameter: daily or three_card
   - `card_selected` - Card chosen (with card name)
   - `signup_started` - User clicks signup button
   - `signup_completed` - Account created successfully
   - `login_completed` - User logs in
   - `share_initiated` - User clicks share button
   - `share_completed` - Share action completed (with platform)
   - `favorite_added` - Card favorited
   - `theme_changed` - Theme preference updated

**Integration Notes:**
- **Client-side only for MVP:** Use gtag.js loaded asynchronously
- **Cookie Consent:** Implement consent mode for PDPA compliance
- **Debug Mode:** Enable GA4 DebugView in development for testing
- **Custom Dimensions:** User ID (hashed), reading count, account age
- **Environment-based:** Only load in production, disabled in development
- **Privacy:** No PII sent, user IDs hashed

---

### Meta Pixel API

**Purpose:** Facebook/Instagram ad conversion tracking and retargeting

**Documentation:** https://developers.facebook.com/docs/meta-pixel

**Base URL(s):**
- Pixel script: `https://connect.facebook.net/en_US/fbevents.js`
- Conversion API: `https://graph.facebook.com/v18.0/<PIXEL_ID>/events`

**Authentication:**
- **Pixel ID:** Configured in Meta Business Manager
- **Access Token:** Required for server-side Conversion API (future)

**Rate Limits:**
- Client-side: No strict limits
- Conversion API: 200 events per second per pixel

**Key Endpoints Used:**

1. **Client-side tracking (fbevents.js):**
   - Automatically loaded script
   - Standard events: PageView, ViewContent, CompleteRegistration

2. **Custom events tracked:**
   - `fbq('track', 'PageView')` - Automatic on all pages
   - `fbq('track', 'ViewContent', { content_name: 'Daily Reading' })` - Reading page viewed
   - `fbq('track', 'CompleteRegistration')` - User signs up
   - `fbq('track', 'Lead')` - User completes first reading
   - `fbq('trackCustom', 'ReadingCompleted', { reading_type: 'daily' })` - Custom event

**Integration Notes:**
- **Client-side only for MVP:** Server-side Conversion API for future (better tracking, iOS 14+ workaround)
- **Cookie Consent:** Required for PDPA compliance
- **Noscript Fallback:** `<noscript>` tag for users with JavaScript disabled
- **Test Events:** Use Meta Events Manager to verify events in real-time
- **Environment-based:** Only load in production

---

### Hotjar API

**Purpose:** Heatmaps, session recordings, and user behavior analytics

**Documentation:** https://help.hotjar.com/hc/en-us/articles/115011639927

**Base URL(s):**
- Tracking script: `https://static.hotjar.com/c/hotjar-<SITE_ID>.js`

**Authentication:**
- **Site ID:** Configured in Hotjar dashboard
- **Tracking Code:** Embedded in site header

**Rate Limits:**
- Free tier: 35 daily sessions
- Basic plan: 100 daily sessions
- No API rate limits for tracking

**Key Endpoints Used:**

1. **Client-side tracking (hotjar.js):**
   - Automatically loaded script
   - Captures clicks, mouse movements, scrolls, form interactions

2. **Features used:**
   - **Heatmaps:** Visual representation of clicks and scrolls
   - **Session Recordings:** Replay user sessions (privacy-safe, no sensitive data)
   - **Surveys:** Optional user feedback forms (future)

**Integration Notes:**
- **Production only:** Only load in production environment (not dev/staging)
- **Privacy:** Suppress sensitive fields (password inputs, personal data)
- **Performance:** Load asynchronously to not block page rendering
- **GDPR/PDPA:** Honor cookie consent preferences
- **Sampling:** Configure sampling rate to stay within daily session limits

---

### Sentry API

**Purpose:** Real-time error tracking and performance monitoring

**Documentation:** https://docs.sentry.io/

**Base URL(s):**
- DSN endpoint: `https://o<ORG_ID>.ingest.sentry.io/api/<PROJECT_ID>/store/`
- Performance monitoring: `https://o<ORG_ID>.ingest.sentry.io/api/<PROJECT_ID>/envelope/`

**Authentication:**
- **DSN (Data Source Name):** Contains authentication token
- Format: `https://<PUBLIC_KEY>@<ORG_ID>.ingest.sentry.io/<PROJECT_ID>`

**Rate Limits:**
- Free tier: 5,000 errors per month
- Developer plan: 50,000 errors per month
- Rate limiting applied automatically by Sentry

**Key Endpoints Used:**

1. **Error Capture:**
   - Frontend: Automatic React error boundary captures
   - Backend: Automatic Next.js API route error captures
   - Custom: `Sentry.captureException(error, { context })`

2. **Performance Monitoring:**
   - Automatic transaction tracking (page loads, API calls)
   - Custom transactions: `Sentry.startTransaction({ name, op })`

3. **Breadcrumbs:**
   - Automatic: Console logs, network requests, DOM events
   - Custom: `Sentry.addBreadcrumb({ message, category, level })`

**Integration Notes:**
- **Next.js Integration:** Use `@sentry/nextjs` (supports both client and server)
- **Source Maps:** Upload source maps for stack trace symbolication
- **Release Tracking:** Tag errors with git commit SHA for version tracking
- **User Context:** Attach user ID (hashed) to errors for debugging
- **Environment Tags:** Differentiate between dev, staging, production
- **Sample Rate:** Configure to reduce noise (100% errors, 10% performance traces)
- **Privacy:** Scrub sensitive data from error messages

---

### Vercel Platform APIs

**Purpose:** Deployment, edge functions, analytics, and infrastructure management

**Documentation:** https://vercel.com/docs/rest-api

**Base URL(s):**
- REST API: `https://api.vercel.com`
- Analytics: Built-in (no direct API calls needed)
- Edge Network: Automatic (CDN and edge functions)

**Authentication:**
- **Vercel Token:** Personal access token for API calls (used in CI/CD)
- **Environment Variables:** Set via dashboard or API

**Rate Limits:**
- REST API: 100 requests per 10 seconds (Hobby plan)
- Edge Functions: No strict limits (fair use policy)
- Edge Network: Unlimited bandwidth on Pro plan

**Key Endpoints Used:**

1. **Deployment API (CI/CD):**
   - `POST /v13/deployments` - Create new deployment
   - `GET /v13/deployments/{id}` - Get deployment status
   - `GET /v6/deployments` - List all deployments

2. **Environment Variables:**
   - `POST /v9/projects/{projectId}/env` - Create environment variable
   - `GET /v9/projects/{projectId}/env` - List environment variables

3. **Domains:**
   - `POST /v9/projects/{projectId}/domains` - Add custom domain
   - `GET /v9/projects/{projectId}/domains` - List domains

**Integration Notes:**
- **Git Integration:** Automatic deployments on push to main/master
- **Preview Deployments:** Automatic for pull requests
- **Vercel Analytics:** Built-in Web Vitals tracking (no setup needed)
- **Edge Functions:** Next.js Edge Runtime for `@vercel/og` image generation
- **Edge Config:** For feature flags (future)
- **Vercel KV:** Redis-compatible cache (future, if needed)
- **Environment:** Differentiate between development, preview, production

---

### Google OAuth API

**Purpose:** Third-party authentication via Google accounts

**Documentation:** https://developers.google.com/identity/protocols/oauth2

**Base URL(s):**
- Authorization: `https://accounts.google.com/o/oauth2/v2/auth`
- Token Exchange: `https://oauth2.googleapis.com/token`
- User Info: `https://www.googleapis.com/oauth2/v2/userinfo`

**Authentication:**
- **Client ID:** Configured in Google Cloud Console
- **Client Secret:** Server-side only (stored in Supabase Auth settings)
- **Scopes:** `openid`, `profile`, `email`

**Rate Limits:**
- 10,000 queries per day (free tier)
- 10 queries per second per user

**Key Endpoints Used:**

1. **OAuth Flow (handled by Supabase Auth):**
   - User redirected to Google login page
   - Google returns authorization code
   - Supabase exchanges code for access token
   - User info fetched and stored in Supabase

**Integration Notes:**
- **Supabase Integration:** Google OAuth configured in Supabase dashboard
- **Redirect URL:** Must whitelist Supabase callback URL in Google Console
- **Scopes:** Request minimal scopes (openid, profile, email)
- **Consent Screen:** Configure in Google Cloud Console (app name, logo, privacy policy)
- **Testing:** Use Google OAuth Playground for debugging

---

### Facebook OAuth API

**Purpose:** Third-party authentication via Facebook accounts

**Documentation:** https://developers.facebook.com/docs/facebook-login

**Base URL(s):**
- Authorization: `https://www.facebook.com/v18.0/dialog/oauth`
- Token Exchange: `https://graph.facebook.com/v18.0/oauth/access_token`
- User Info: `https://graph.facebook.com/v18.0/me`

**Authentication:**
- **App ID:** Configured in Meta for Developers
- **App Secret:** Server-side only (stored in Supabase Auth settings)
- **Permissions:** `public_profile`, `email`

**Rate Limits:**
- 200 calls per hour per user (OAuth)
- Graph API: Variable based on app tier

**Key Endpoints Used:**

1. **OAuth Flow (handled by Supabase Auth):**
   - User redirected to Facebook login page
   - Facebook returns authorization code
   - Supabase exchanges code for access token
   - User info fetched and stored in Supabase

**Integration Notes:**
- **Supabase Integration:** Facebook OAuth configured in Supabase dashboard
- **Redirect URL:** Must whitelist Supabase callback URL in Meta for Developers
- **Permissions:** Request minimal permissions (public_profile, email)
- **App Review:** May need Facebook app review for production (if requesting additional permissions)
- **Testing:** Use test users in Meta for Developers dashboard

---

### Anthropic Claude API

**Purpose:** AI-powered content generation for 78 tarot card interpretations (Thai language)

**Documentation:** https://docs.anthropic.com/claude/reference/

**Base URL(s):**
- Messages API: `https://api.anthropic.com/v1/messages`
- Streaming API: `https://api.anthropic.com/v1/messages` (with `stream: true`)

**Authentication:**
- **API Key:** `x-api-key` header with secret key from Anthropic Console
- **Format:** `x-api-key: sk-ant-api03-...`

**Rate Limits:**
- Claude 3.5 Sonnet: 50 requests per minute (RPM)
- 40,000 tokens per minute (TPM)
- 500,000 tokens per day (TPD)

**Key Endpoints Used:**

1. **Content Generation:**
   - `POST /v1/messages` - Generate card interpretations
   - Model: `claude-3-5-sonnet-20241022` (latest)
   - Max tokens: 4096 per response

**Example Request:**

```json
POST https://api.anthropic.com/v1/messages
Headers:
  x-api-key: sk-ant-api03-xxx
  anthropic-version: 2023-06-01
  content-type: application/json

Body:
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4096,
  "messages": [
    {
      "role": "user",
      "content": "Generate Thai tarot card interpretation for 'The Fool' card..."
    }
  ],
  "temperature": 0.7,
  "system": "You are a tarot expert writing interpretations in Thai..."
}
```

**Integration Notes:**
- **Development Phase Only:** API used during content generation phase (Story 1.14, Epic 1)
- **Not Production Runtime:** Content pre-generated and stored in database, API not called during app operation
- **Cost Estimation:** 
  - 78 cards × ~2,000 tokens/card = ~156,000 input tokens
  - 78 cards × ~1,500 tokens/output = ~117,000 output tokens
  - Cost: ~$0.47 USD (~฿15-17) for complete generation
  - Regenerations: ~$0.10 USD per 10 cards (~฿3-4)
- **Quality Assurance:** All AI-generated content reviewed by humans (4-stage quality gates)
- **Retry Strategy:** If generation fails, implement exponential backoff (3 retries max)
- **Batch Processing:** Generate 10 cards at a time to avoid rate limits
- **Prompt Engineering:** 
  - System prompt defines tarot expert persona
  - User prompt includes card details, context, tone guidelines
  - Few-shot examples for consistency
- **Content Versioning:** Store raw AI output + human-revised versions separately
- **Environment Variable:** `ANTHROPIC_API_KEY` (server-side only, never expose to client)

**Generation Script:**

```typescript
// scripts/generate-tarot-content.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateCardContent(card: Card) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    temperature: 0.7,
    system: `You are a professional tarot expert writing interpretations in Thai...`,
    messages: [{
      role: 'user',
      content: `Generate interpretation for "${card.name}" (${card.name_th})...`,
    }],
  });
  
  return parseAIResponse(message.content);
}

// Batch generation with rate limit handling
async function generateAllCards() {
  const cards = await loadCardMetadata(); // 78 cards
  const results = [];
  
  for (let i = 0; i < cards.length; i += 10) {
    const batch = cards.slice(i, i + 10);
    const batchResults = await Promise.all(
      batch.map(card => generateCardContent(card))
    );
    results.push(...batchResults);
    
    // Rate limit: 50 RPM, wait between batches
    if (i + 10 < cards.length) {
      await delay(15000); // 15 seconds between batches
    }
  }
  
  return results;
}
```

**Quality Gates Integration:**
- Gate 1 (Automated): Validate structure, field completeness, character limits
- Gate 2 (Tarot Expert): Review accuracy, traditional alignment
- Gate 3 (Thai Language): Proofread grammar, naturalness, cultural appropriateness
- Gate 4 (Final Approval): Product Owner + Content Manager sign-off

**Post-Generation Workflow:**
```bash
# 1. Generate content
pnpm generate:tarot-content

# 2. Export for review
pnpm export:content-review --format csv

# 3. Import reviewed content
pnpm prisma:seed --source content/approved-cards.json
```

---

## External API Integration Summary

| Service | Purpose | Authentication | Rate Limits | Critical for MVP |
|---------|---------|----------------|-------------|------------------|
| **Supabase** | Database, Auth, Storage | API Keys + JWT | 50K MAU, 2GB bandwidth | ✅ Yes |
| **Anthropic Claude** | AI content generation (78 cards) | API Key | 50 RPM, 40K TPM | ✅ Yes (Dev phase only) |
| **Google Analytics 4** | User behavior tracking | Measurement ID | 20 hits/sec | ✅ Yes (NFR3) |
| **Meta Pixel** | Ad conversion tracking | Pixel ID | 200 events/sec | ✅ Yes (NFR3) |
| **Hotjar** | Heatmaps, recordings | Site ID | 35 sessions/day | ✅ Yes (NFR3) |
| **Sentry** | Error tracking | DSN | 5K errors/month | ✅ Yes |
| **Vercel** | Deployment, hosting | Token | 100 req/10sec | ✅ Yes |
| **Google OAuth** | Social login | Client ID + Secret | 10K queries/day | ✅ Yes (Epic 2) |
| **Facebook OAuth** | Social login | App ID + Secret | 200 calls/hour | ✅ Yes (Epic 2) |

**Total External Services:** 9 integrations  
**Monthly Cost (Free Tiers):** $0 for MVP  
**One-time Content Generation Cost:** ~฿15-20 (Anthropic API)  
**Upgrade Triggers:** Supabase (50K users), GA4 (no limit), Meta Pixel (no limit), Hotjar (35 sessions), Sentry (5K errors)

---

## API Integration Best Practices

### 1. **Environment-Based Loading**
```typescript
// Only load analytics in production
if (process.env.NODE_ENV === 'production') {
  loadGoogleAnalytics();
  loadMetaPixel();
  loadHotjar();
}
```

### 2. **Graceful Degradation**
```typescript
try {
  await supabase.auth.signInWithOAuth({ provider: 'google' });
} catch (error) {
  // Fallback to email/password if OAuth fails
  Sentry.captureException(error);
  showErrorMessage('OAuth unavailable, please use email login');
}
```

### 3. **Rate Limit Handling**
```typescript
// Implement exponential backoff for API calls
async function fetchWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        await delay(2 ** i * 1000); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
}
```

### 4. **Secret Management**
```bash
# Environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...  # Public (client-side)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...      # Private (server-side only)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXX
NEXT_PUBLIC_META_PIXEL_ID=123456789
NEXT_PUBLIC_HOTJAR_ID=3456789
SENTRY_DSN=https://xxx@o123.ingest.sentry.io/456
```

### 5. **Error Monitoring**
```typescript
// Track external API failures
try {
  await externalAPICall();
} catch (error) {
  Sentry.captureException(error, {
    tags: { external_service: 'supabase' },
    extra: { endpoint: '/auth/v1/signup' }
  });
}
```

---

## Core Workflows

This section illustrates critical system workflows using sequence diagrams. These workflows represent the most important user journeys and system interactions, clarifying architecture decisions and complex interactions between components.

### Workflow 1: Daily Reading (Anonymous User)

**User Journey:** First-time visitor performs a daily reading without creating an account.

```mermaid
sequenceDiagram
    actor User
    participant LP as Landing Page
    participant RS as Reading Selection
    participant CS as Card Selection
    participant API as API Route<br/>/api/readings
    participant Shuffle as Shuffle Engine
    participant Repo as Repository
    participant DB as PostgreSQL
    participant RR as Reading Result
    participant Analytics as Analytics<br/>(GA4, Meta, Hotjar)

    User->>LP: Visit landing page
    LP->>User: Show hero + CTA "เริ่มดูดวง"
    
    User->>RS: Click "เริ่มดูดวง"
    RS->>User: Show reading types<br/>(Daily vs 3-Card)
    
    User->>RS: Select "Daily Reading"
    RS->>User: Optional: Enter question
    
    User->>CS: Click "เลือกไพ่"
    CS->>CS: Show fan of face-down cards
    CS->>API: POST /api/readings<br/>{type: "daily", question: "..."}
    
    API->>API: Validate request (Zod schema)
    API->>Shuffle: drawCards(1)
    Shuffle->>Shuffle: Fisher-Yates shuffle (crypto.random)
    Shuffle->>Shuffle: Select 1 card
    Shuffle->>Shuffle: Determine reversed (50% chance)
    Shuffle-->>API: [{ cardId, isReversed }]
    
    API->>Repo: createReading(data)
    Repo->>DB: BEGIN TRANSACTION
    Repo->>DB: INSERT INTO readings (user_id=NULL, type, question)
    Repo->>DB: INSERT INTO reading_cards (reading_id, card_id, is_reversed)
    Repo->>DB: SELECT cards with interpretation
    Repo->>DB: COMMIT
    DB-->>Repo: Reading with cards
    Repo-->>API: ReadingWithCards
    
    API-->>CS: 201 Created + reading data
    CS->>CS: Animate card flip (3D, 800ms)
    CS->>RR: Navigate to result page
    
    RR->>RR: Display card + interpretation
    RR->>Analytics: Track "reading_completed"<br/>{type: "daily", anonymous: true}
    RR->>User: Show result + actions<br/>(Share, ดูอีกครั้ง, Sign up prompt)
    
    Note over User,Analytics: Anonymous reading saved<br/>Can be claimed later on signup
```

**Key Points:**
- No authentication required (frictionless UX per PRD)
- Card shuffle uses cryptographically secure randomization
- Reading saved with `user_id = NULL` for anonymous users
- Transaction ensures data consistency
- Analytics tracked at completion
- Signup prompt shown (conversion opportunity)

---

### Workflow 2: 3-Card Spread (Authenticated User)

**User Journey:** Returning logged-in user performs a 3-card spread with a specific question.

```mermaid
sequenceDiagram
    actor User
    participant Page as Reading Page
    participant Auth as Auth Context
    participant API as API Route
    participant Shuffle as Shuffle Engine
    participant Repo as Repository
    participant DB as PostgreSQL
    participant Result as Result Page
    participant Analytics as Analytics

    Note over User,Analytics: User already authenticated (JWT in context)
    
    User->>Page: Select "3-Card Spread"
    Page->>User: Show question input + positions<br/>(Past-Present-Future)
    
    User->>Page: Enter question:<br/>"อาชีพการงานจะเป็นอย่างไร?"
    User->>Page: Click "เลือกไพ่"
    
    Page->>Auth: getUser()
    Auth-->>Page: User object + JWT token
    
    Page->>API: POST /api/readings<br/>Authorization: Bearer {token}<br/>{type: "three_card", question: "..."}
    
    API->>API: Validate JWT token<br/>(Supabase Auth)
    API->>API: Extract user_id from token
    API->>API: Validate request body
    
    API->>Shuffle: drawCards(3)
    Shuffle->>Shuffle: Shuffle full deck (78 cards)
    Shuffle->>Shuffle: Select 3 unique cards
    Shuffle->>Shuffle: Determine reversed for each (50%)
    Shuffle-->>API: [<br/>  {cardId, isReversed, position: 0, label: "past"},<br/>  {cardId, isReversed, position: 1, label: "present"},<br/>  {cardId, isReversed, position: 2, label: "future"}<br/>]
    
    API->>Repo: createReading({user_id, type, question, cards})
    Repo->>DB: BEGIN TRANSACTION
    Repo->>DB: INSERT INTO readings (user_id, type, question)
    
    loop For each of 3 cards
        Repo->>DB: INSERT INTO reading_cards<br/>(reading_id, card_id, position, position_label, is_reversed)
    end
    
    Repo->>DB: SELECT reading with JOINed cards and interpretations
    Repo->>DB: COMMIT
    DB-->>Repo: Complete reading with 3 cards
    Repo-->>API: ReadingWithCards
    
    API-->>Page: 201 Created + reading
    
    Page->>Page: Animate cards sequentially<br/>Card 1 → Card 2 → Card 3<br/>(staggered timing)
    
    Page->>Result: Navigate to result
    Result->>Result: Display 3 cards horizontally<br/>with position labels
    Result->>Result: Show individual interpretations<br/>+ combined summary
    
    Result->>Analytics: Track "reading_completed"<br/>{type: "three_card", user_id, has_question: true}
    
    Result->>User: Show results + actions<br/>(Share, Add notes, Favorite, ดูอีกครั้ง)
    
    Note over User,Analytics: Reading saved to user's history<br/>Can be viewed later in /history
```

**Key Points:**
- JWT authentication required (Bearer token)
- User context available throughout flow
- 3 cards drawn sequentially with position labels
- Transaction ensures all 3 cards saved atomically
- Personalized result display (user-specific)
- Richer actions available (notes, favorite)

---

### Workflow 3: User Signup & Login (OAuth - Google)

**User Journey:** New user signs up using Google OAuth after completing an anonymous reading.

```mermaid
sequenceDiagram
    actor User
    participant Page as Signup Page
    participant SupabaseClient as Supabase Client
    participant SupabaseAuth as Supabase Auth Server
    participant Google as Google OAuth
    participant AuthContext as Auth Context
    participant API as API Route<br/>/api/users/me
    participant DB as PostgreSQL
    participant Analytics as Analytics

    User->>Page: After reading, sees "Sign up to save history"
    User->>Page: Click "Sign up with Google"
    
    Page->>SupabaseClient: signInWithOAuth({provider: 'google'})
    SupabaseClient->>SupabaseAuth: Request OAuth flow
    SupabaseAuth->>Google: Redirect to Google login
    
    Google->>User: Show Google login page
    User->>Google: Enter credentials + consent
    Google->>SupabaseAuth: Authorization code
    
    SupabaseAuth->>Google: Exchange code for access token
    Google-->>SupabaseAuth: Access token + user info
    SupabaseAuth->>SupabaseAuth: Create user in auth.users table
    SupabaseAuth->>DB: INSERT INTO public.users<br/>(id, email, name, auth_provider='google')
    
    SupabaseAuth->>Page: Redirect to app with JWT tokens<br/>(access_token + refresh_token)
    
    Page->>AuthContext: setSession({access_token, refresh_token})
    AuthContext->>AuthContext: Store tokens (httpOnly cookie)
    AuthContext->>AuthContext: Decode JWT to get user_id
    
    Page->>API: GET /api/users/me<br/>Authorization: Bearer {token}
    API->>API: Validate JWT
    API->>DB: SELECT * FROM users WHERE id = {user_id}
    DB-->>API: User profile data
    API-->>Page: User object
    
    Page->>AuthContext: setUser(user)
    
    Page->>Analytics: Track "signup_completed"<br/>{method: "google", user_id}
    
    Page->>Page: Show welcome modal:<br/>"Welcome! Your readings are now saved."
    
    Page->>User: Redirect to profile or previous page
    
    Note over User,Analytics: User now authenticated<br/>Previous anonymous readings can be claimed
```

**Key Points:**
- OAuth flow handled by Supabase (no manual token exchange)
- User record automatically created in public.users table
- JWT tokens stored securely (httpOnly cookies recommended)
- Auth context provides user state to entire app
- Welcome experience for new users
- Analytics track signup method

---

### Workflow Summary

| Workflow | Complexity | Authentication | Key Components | PRD Epic |
|----------|------------|----------------|----------------|----------|
| **Daily Reading (Anonymous)** | Medium | ❌ None | Shuffle Engine, Repository, Analytics | Epic 1 |
| **3-Card Spread (Auth)** | High | ✅ JWT | Shuffle Engine, Repository, Position Logic | Epic 1, 2 |
| **Signup/Login (OAuth)** | High | ✅ Supabase Auth | OAuth Flow, Auth Context, User Creation | Epic 2 |

**Total Workflows Documented:** 3 critical user journeys  
**Coverage:** Epic 1 + Epic 2 core flows  
**Format:** Mermaid sequence diagrams (interactive in supported viewers)

---

## Database Schema

This section defines the concrete database schema for PostgreSQL (Supabase). The schema is implemented using Prisma ORM for type-safe database access and includes all tables, relationships, indexes, constraints, and Row Level Security (RLS) policies.

### Prisma Schema Definition

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Supabase connection pooler
}

// ============================================================================
// USERS TABLE
// ============================================================================
model User {
  id                  String    @id @default(uuid()) @db.Uuid
  email               String    @unique @db.VarChar(255)
  name                String?   @db.VarChar(100)
  profile_picture_url String?   @db.Text
  created_at          DateTime  @default(now()) @db.Timestamptz
  updated_at          DateTime  @updatedAt @db.Timestamptz
  last_login_at       DateTime? @db.Timestamptz
  email_verified      Boolean   @default(false)
  auth_provider       AuthProvider @default(email)

  // Relationships
  readings            Reading[]
  favorite_cards      FavoriteCard[]
  preferences         UserPreferences?

  @@map("users")
  @@index([email])
  @@index([created_at])
}

enum AuthProvider {
  email
  google
  facebook
}

// ============================================================================
// CARDS TABLE (Reference Data - 78 Tarot Cards)
// ============================================================================
model Card {
  id                 String   @id @default(uuid()) @db.Uuid
  number             Int      // 0-21 for Major Arcana, 1-14 for Minor Arcana
  name               String   @db.VarChar(100)
  name_th            String   @db.VarChar(100)
  suit               Suit
  arcana             Arcana
  image_url          String   @db.Text
  image_back_url     String   @default("/cards/back.webp") @db.Text
  meaning_upright    String   @db.Text
  meaning_reversed   String   @db.Text
  keywords_upright   String[] @db.VarChar(50)
  keywords_reversed  String[] @db.VarChar(50)
  symbolism          String?  @db.Text
  advice             String   @db.Text
  element            Element?
  slug               String   @unique @db.VarChar(100)
  created_at         DateTime @default(now()) @db.Timestamptz

  // Relationships
  reading_cards      ReadingCard[]
  favorite_cards     FavoriteCard[]

  @@map("cards")
  @@unique([suit, number]) // Prevent duplicate cards
  @@index([suit])
  @@index([arcana])
  @@index([slug])
}

enum Suit {
  major_arcana
  wands
  cups
  swords
  pentacles
}

enum Arcana {
  major
  minor
}

enum Element {
  fire   // Wands
  water  // Cups
  air    // Swords
  earth  // Pentacles
}

// ============================================================================
// READINGS TABLE
// ============================================================================
model Reading {
  id            String      @id @default(uuid()) @db.Uuid
  user_id       String?     @db.Uuid // Nullable for anonymous readings
  reading_type  ReadingType
  question      String?     @db.VarChar(500)
  created_at    DateTime    @default(now()) @db.Timestamptz
  updated_at    DateTime    @updatedAt @db.Timestamptz
  is_favorite   Boolean     @default(false)
  notes         String?     @db.VarChar(2000)

  // Relationships
  user          User?        @relation(fields: [user_id], references: [id], onDelete: Cascade)
  reading_cards ReadingCard[]

  @@map("readings")
  @@index([user_id])
  @@index([created_at(sort: Desc)]) // For history queries
  @@index([user_id, created_at(sort: Desc)]) // Composite index for user history
  @@index([reading_type])
}

enum ReadingType {
  daily
  three_card
}

// ============================================================================
// READING_CARDS TABLE (Junction Table)
// ============================================================================
model ReadingCard {
  id             String         @id @default(uuid()) @db.Uuid
  reading_id     String         @db.Uuid
  card_id        String         @db.Uuid
  position       Int            // 0 for daily, 0-2 for three_card
  position_label PositionLabel?
  is_reversed    Boolean        @default(false)
  created_at     DateTime       @default(now()) @db.Timestamptz

  // Relationships
  reading        Reading @relation(fields: [reading_id], references: [id], onDelete: Cascade)
  card           Card    @relation(fields: [card_id], references: [id], onDelete: Restrict)

  @@map("reading_cards")
  @@unique([reading_id, position]) // Prevent duplicate positions in same reading
  @@index([reading_id])
  @@index([card_id])
}

enum PositionLabel {
  past
  present
  future
}

// ============================================================================
// FAVORITE_CARDS TABLE (Epic 4)
// ============================================================================
model FavoriteCard {
  id         String   @id @default(uuid()) @db.Uuid
  user_id    String   @db.Uuid
  card_id    String   @db.Uuid
  created_at DateTime @default(now()) @db.Timestamptz

  // Relationships
  user       User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  card       Card @relation(fields: [card_id], references: [id], onDelete: Cascade)

  @@map("favorite_cards")
  @@unique([user_id, card_id]) // User can't favorite same card twice
  @@index([user_id])
  @@index([card_id])
}

// ============================================================================
// USER_PREFERENCES TABLE (Epic 4)
// ============================================================================
model UserPreferences {
  id                   String   @id @default(uuid()) @db.Uuid
  user_id              String   @unique @db.Uuid
  theme                Theme    @default(dark_mystical)
  enable_notifications Boolean  @default(false)
  notification_time    String?  @db.VarChar(5) // "HH:mm" format
  enable_sound_effects Boolean  @default(true)
  language             Language @default(th)
  created_at           DateTime @default(now()) @db.Timestamptz
  updated_at           DateTime @updatedAt @db.Timestamptz

  // Relationships
  user                 User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@map("user_preferences")
  @@index([user_id])
}

enum Theme {
  dark_mystical
  light_ethereal
  deep_ocean
  cosmic_purple
}

enum Language {
  th
  en
}
```

---

### Generated SQL DDL (PostgreSQL)

```sql
-- ============================================================================
-- ENUMS
-- ============================================================================
CREATE TYPE "AuthProvider" AS ENUM ('email', 'google', 'facebook');
CREATE TYPE "Suit" AS ENUM ('major_arcana', 'wands', 'cups', 'swords', 'pentacles');
CREATE TYPE "Arcana" AS ENUM ('major', 'minor');
CREATE TYPE "Element" AS ENUM ('fire', 'water', 'air', 'earth');
CREATE TYPE "ReadingType" AS ENUM ('daily', 'three_card');
CREATE TYPE "PositionLabel" AS ENUM ('past', 'present', 'future');
CREATE TYPE "Theme" AS ENUM ('dark_mystical', 'light_ethereal', 'deep_ocean', 'cosmic_purple');
CREATE TYPE "Language" AS ENUM ('th', 'en');

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "name" VARCHAR(100),
    "profile_picture_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "last_login_at" TIMESTAMPTZ,
    "email_verified" BOOLEAN NOT NULL DEFAULT FALSE,
    "auth_provider" "AuthProvider" NOT NULL DEFAULT 'email'
);

-- Indexes
CREATE INDEX "idx_users_email" ON "users"("email");
CREATE INDEX "idx_users_created_at" ON "users"("created_at");

-- Comments
COMMENT ON TABLE "users" IS 'Registered users of the application';
COMMENT ON COLUMN "users"."id" IS 'UUID from Supabase Auth (matches auth.users.id)';
COMMENT ON COLUMN "users"."email_verified" IS 'Synced with Supabase Auth email verification status';

-- ============================================================================
-- CARDS TABLE
-- ============================================================================
CREATE TABLE "cards" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "number" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "name_th" VARCHAR(100) NOT NULL,
    "suit" "Suit" NOT NULL,
    "arcana" "Arcana" NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_back_url" TEXT NOT NULL DEFAULT '/cards/back.webp',
    "meaning_upright" TEXT NOT NULL,
    "meaning_reversed" TEXT NOT NULL,
    "keywords_upright" VARCHAR(50)[] NOT NULL DEFAULT ARRAY[]::VARCHAR(50)[],
    "keywords_reversed" VARCHAR(50)[] NOT NULL DEFAULT ARRAY[]::VARCHAR(50)[],
    "symbolism" TEXT,
    "advice" TEXT NOT NULL,
    "element" "Element",
    "slug" VARCHAR(100) UNIQUE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX "idx_cards_slug" ON "cards"("slug");
CREATE UNIQUE INDEX "idx_cards_suit_number" ON "cards"("suit", "number");
CREATE INDEX "idx_cards_suit" ON "cards"("suit");
CREATE INDEX "idx_cards_arcana" ON "cards"("arcana");

-- Comments
COMMENT ON TABLE "cards" IS 'Reference data: 78 tarot cards (22 Major + 56 Minor Arcana)';
COMMENT ON COLUMN "cards"."slug" IS 'SEO-friendly URL slug (e.g., "the-fool", "ace-of-cups")';
COMMENT ON COLUMN "cards"."keywords_upright" IS 'Array of keywords for upright position (Thai)';

-- ============================================================================
-- READINGS TABLE
-- ============================================================================
CREATE TABLE "readings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
    "reading_type" "ReadingType" NOT NULL,
    "question" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "is_favorite" BOOLEAN NOT NULL DEFAULT FALSE,
    "notes" VARCHAR(2000)
);

-- Indexes
CREATE INDEX "idx_readings_user_id" ON "readings"("user_id");
CREATE INDEX "idx_readings_created_at" ON "readings"("created_at" DESC);
CREATE INDEX "idx_readings_user_created" ON "readings"("user_id", "created_at" DESC);
CREATE INDEX "idx_readings_type" ON "readings"("reading_type");

-- Comments
COMMENT ON TABLE "readings" IS 'Tarot reading sessions (daily or 3-card spread)';
COMMENT ON COLUMN "readings"."user_id" IS 'NULL for anonymous readings, can be claimed on signup';
COMMENT ON COLUMN "readings"."notes" IS 'Personal notes added by user (Epic 4)';

-- ============================================================================
-- READING_CARDS TABLE (Junction)
-- ============================================================================
CREATE TABLE "reading_cards" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "reading_id" UUID NOT NULL REFERENCES "readings"("id") ON DELETE CASCADE,
    "card_id" UUID NOT NULL REFERENCES "cards"("id") ON DELETE RESTRICT,
    "position" INTEGER NOT NULL CHECK ("position" >= 0 AND "position" <= 2),
    "position_label" "PositionLabel",
    "is_reversed" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT "uq_reading_position" UNIQUE ("reading_id", "position")
);

-- Indexes
CREATE INDEX "idx_reading_cards_reading_id" ON "reading_cards"("reading_id");
CREATE INDEX "idx_reading_cards_card_id" ON "reading_cards"("card_id");

-- Comments
COMMENT ON TABLE "reading_cards" IS 'Junction table linking readings to cards with position';
COMMENT ON COLUMN "reading_cards"."position" IS '0 for daily, 0-2 for three_card spread';
COMMENT ON COLUMN "reading_cards"."is_reversed" IS 'Whether card was drawn reversed (upside down)';

-- ============================================================================
-- FAVORITE_CARDS TABLE (Epic 4)
-- ============================================================================
CREATE TABLE "favorite_cards" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "card_id" UUID NOT NULL REFERENCES "cards"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT "uq_user_card_favorite" UNIQUE ("user_id", "card_id")
);

-- Indexes
CREATE INDEX "idx_favorite_cards_user_id" ON "favorite_cards"("user_id");
CREATE INDEX "idx_favorite_cards_card_id" ON "favorite_cards"("card_id");

-- Comments
COMMENT ON TABLE "favorite_cards" IS 'User bookmarked cards for quick reference';

-- ============================================================================
-- USER_PREFERENCES TABLE (Epic 4)
-- ============================================================================
CREATE TABLE "user_preferences" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID UNIQUE NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "theme" "Theme" NOT NULL DEFAULT 'dark_mystical',
    "enable_notifications" BOOLEAN NOT NULL DEFAULT FALSE,
    "notification_time" VARCHAR(5) CHECK ("notification_time" ~ '^([01]\d|2[0-3]):([0-5]\d)$'),
    "enable_sound_effects" BOOLEAN NOT NULL DEFAULT TRUE,
    "language" "Language" NOT NULL DEFAULT 'th',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX "idx_user_preferences_user_id" ON "user_preferences"("user_id");

-- Comments
COMMENT ON TABLE "user_preferences" IS 'User personalization settings (theme, notifications, language)';
COMMENT ON COLUMN "user_preferences"."notification_time" IS 'HH:mm format (24-hour) for daily reminders';
```

---

### Row Level Security (RLS) Policies

Supabase PostgreSQL supports Row Level Security to enforce authorization at the database level. These policies ensure users can only access their own data even if API logic is bypassed.

```sql
-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "readings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reading_cards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "favorite_cards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_preferences" ENABLE ROW LEVEL SECURITY;

-- Cards table is public (no RLS needed - reference data)

-- ============================================================================
-- USERS TABLE RLS POLICIES
-- ============================================================================
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON "users" FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON "users" FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================================
-- READINGS TABLE RLS POLICIES
-- ============================================================================
-- Authenticated users can create readings (user_id will be set to auth.uid())
CREATE POLICY "Authenticated users can create readings"
    ON "readings" FOR INSERT
    WITH CHECK (
        (auth.uid() IS NOT NULL AND user_id = auth.uid())
        OR user_id IS NULL -- Allow anonymous readings
    );

-- Users can view their own readings
CREATE POLICY "Users can view own readings"
    ON "readings" FOR SELECT
    USING (auth.uid() = user_id);

-- Anonymous readings are viewable by anyone who has the ID (for sharing)
CREATE POLICY "Anonymous readings viewable by reading ID"
    ON "readings" FOR SELECT
    USING (user_id IS NULL);

-- Users can update their own readings (for notes, favorite status)
CREATE POLICY "Users can update own readings"
    ON "readings" FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own readings
CREATE POLICY "Users can delete own readings"
    ON "readings" FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- READING_CARDS TABLE RLS POLICIES
-- ============================================================================
-- Inherit permissions from readings table (automatic via foreign key)
CREATE POLICY "Reading cards inherit reading permissions"
    ON "reading_cards" FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "readings"
            WHERE "readings"."id" = "reading_cards"."reading_id"
            AND (
                "readings"."user_id" = auth.uid()
                OR "readings"."user_id" IS NULL
            )
        )
    );

-- ============================================================================
-- FAVORITE_CARDS TABLE RLS POLICIES
-- ============================================================================
-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
    ON "favorite_cards" FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create favorites
CREATE POLICY "Users can create favorites"
    ON "favorite_cards" FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
    ON "favorite_cards" FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- USER_PREFERENCES TABLE RLS POLICIES
-- ============================================================================
-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
    ON "user_preferences" FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
    ON "user_preferences" FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can create their preferences (first time setup)
CREATE POLICY "Users can create own preferences"
    ON "user_preferences" FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

---

### Database Triggers & Functions

```sql
-- ============================================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_readings_updated_at
    BEFORE UPDATE ON "readings"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON "user_preferences"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER: Auto-create user preferences on user creation
-- ============================================================================
CREATE OR REPLACE FUNCTION create_default_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "user_preferences" ("user_id")
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_preferences_on_signup
    AFTER INSERT ON "users"
    FOR EACH ROW
    EXECUTE FUNCTION create_default_preferences();
```

---

### Database Indexes Summary

| Table | Index Name | Columns | Type | Purpose |
|-------|------------|---------|------|---------|
| **users** | `idx_users_email` | email | B-tree | Fast email lookups (login) |
| **users** | `idx_users_created_at` | created_at | B-tree | User cohort analysis |
| **cards** | `idx_cards_slug` | slug | B-tree (Unique) | SEO-friendly URL lookups |
| **cards** | `idx_cards_suit_number` | suit, number | B-tree (Unique) | Prevent duplicate cards |
| **cards** | `idx_cards_suit` | suit | B-tree | Filter by suit |
| **cards** | `idx_cards_arcana` | arcana | B-tree | Filter by Major/Minor |
| **readings** | `idx_readings_user_id` | user_id | B-tree | User's reading history |
| **readings** | `idx_readings_created_at` | created_at DESC | B-tree | Recent readings first |
| **readings** | `idx_readings_user_created` | user_id, created_at DESC | Composite | Optimized user history queries |
| **readings** | `idx_readings_type` | reading_type | B-tree | Filter by type |
| **reading_cards** | `idx_reading_cards_reading_id` | reading_id | B-tree | JOIN with readings |
| **reading_cards** | `idx_reading_cards_card_id` | card_id | B-tree | JOIN with cards |
| **reading_cards** | `uq_reading_position` | reading_id, position | B-tree (Unique) | Prevent duplicate positions |
| **favorite_cards** | `idx_favorite_cards_user_id` | user_id | B-tree | User's favorites list |
| **favorite_cards** | `idx_favorite_cards_card_id` | card_id | B-tree | Card popularity stats |
| **favorite_cards** | `uq_user_card_favorite` | user_id, card_id | B-tree (Unique) | Prevent duplicate favorites |
| **user_preferences** | `idx_user_preferences_user_id` | user_id | B-tree (Unique) | One-to-one with users |

**Total Indexes:** 17 indexes across 6 tables

---

## Frontend Architecture

This section defines frontend-specific architecture details including component organization, state management, routing patterns, and service layer abstractions.

### Component Architecture

**Organization Strategy:** Feature-based structure with shared UI components

```
apps/web/src/
├── app/                          # Next.js App Router (pages)
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page (/)
│   ├── reading/
│   │   ├── page.tsx            # Reading type selection (/reading)
│   │   ├── daily/page.tsx      # Daily reading flow
│   │   └── three-card/page.tsx # 3-Card spread flow
│   ├── cards/
│   │   ├── page.tsx            # Card encyclopedia list
│   │   └── [slug]/page.tsx     # Individual card detail
│   ├── history/page.tsx         # Reading history (auth required)
│   ├── profile/page.tsx         # User profile (auth required)
│   ├── favorites/page.tsx       # Favorite cards (Epic 4)
│   └── auth/
│       ├── login/page.tsx
│       └── signup/page.tsx
├── components/
│   ├── ui/                      # Base UI components (Button, Input, Card, Modal)
│   ├── cards/                   # Card-specific components
│   │   ├── CardDisplay.tsx     # Single card display
│   │   ├── CardFlip.tsx        # 3D flip animation
│   │   ├── CardFan.tsx         # Fan layout for selection
│   │   └── CardGrid.tsx        # Grid layout for encyclopedia
│   ├── reading/
│   │   ├── ReadingResult.tsx   # Reading result display
│   │   ├── ReadingHistory.tsx  # History list
│   │   └── ReadingCard.tsx     # Card in reading context
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   └── features/
│       ├── ShareButton.tsx
│       ├── FavoriteButton.tsx
│       └── ThemeSelector.tsx
├── lib/
│   ├── api/                     # API client layer
│   │   ├── readings.ts         # Reading API calls
│   │   ├── cards.ts            # Card API calls
│   │   ├── users.ts            # User API calls
│   │   └── favorites.ts        # Favorites API calls
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useReading.ts       # Reading state management
│   │   ├── useCards.ts         # Card data fetching
│   │   └── useAnalytics.ts     # Analytics tracking
│   ├── utils/                   # Utility functions
│   │   ├── shuffle.ts          # Client-side shuffle visualization
│   │   ├── format.ts           # Date/text formatting
│   │   └── validation.ts       # Zod schemas
│   └── stores/                  # Zustand stores
│       ├── authStore.ts        # Auth state
│       ├── readingStore.ts     # Reading flow state
│       └── uiStore.ts          # UI state (modals, toasts)
├── styles/
│   └── globals.css             # Global styles + Tailwind
└── types/
    └── index.ts                # Frontend-specific types
```

**Component Template:**

```typescript
// components/cards/CardDisplay.tsx
'use client';

import { Card } from '@/types';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CardDisplayProps {
  card: Card;
  isReversed?: boolean;
  showInterpretation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CardDisplay({ 
  card, 
  isReversed = false, 
  showInterpretation = false,
  size = 'md' 
}: CardDisplayProps) {
  const interpretation = isReversed ? card.meaning_reversed : card.meaning_upright;
  
  return (
    <motion.div
      className={`card-display card-${size}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`card-image-wrapper ${isReversed ? 'reversed' : ''}`}>
        <Image
          src={card.image_url}
          alt={`${card.name_th} - ${card.name}`}
          width={300}
          height={500}
          className="card-image"
          priority={size === 'lg'}
        />
      </div>
      
      <h3 className="card-name">
        {card.name_th}
        <span className="card-name-en">{card.name}</span>
      </h3>
      
      {showInterpretation && (
        <div className="card-interpretation">
          <p>{interpretation}</p>
        </div>
      )}
    </motion.div>
  );
}
```

### State Management Architecture

**Strategy:** Hybrid approach using React Context + Zustand

**1. Auth State (React Context):**

```typescript
// lib/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**2. Reading State (Zustand):**

```typescript
// lib/stores/readingStore.ts
import { create } from 'zustand';
import { Reading, Card } from '@/types';

interface ReadingState {
  currentReading: Reading | null;
  selectedCards: Card[];
  readingType: 'daily' | 'three_card' | null;
  question: string;
  
  // Actions
  setReadingType: (type: 'daily' | 'three_card') => void;
  setQuestion: (question: string) => void;
  addSelectedCard: (card: Card) => void;
  clearSelection: () => void;
  setCurrentReading: (reading: Reading) => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  currentReading: null,
  selectedCards: [],
  readingType: null,
  question: '',
  
  setReadingType: (type) => set({ readingType: type }),
  setQuestion: (question) => set({ question }),
  addSelectedCard: (card) => 
    set((state) => ({ selectedCards: [...state.selectedCards, card] })),
  clearSelection: () => 
    set({ selectedCards: [], question: '', readingType: null }),
  setCurrentReading: (reading) => set({ currentReading: reading }),
}));
```

### Routing Architecture

**Next.js App Router Structure:**

```typescript
// app/layout.tsx - Root layout with providers
import { AuthProvider } from '@/lib/context/AuthContext';
import { Analytics } from '@/components/Analytics';
import { Toaster } from '@/components/ui/Toaster';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}

// app/reading/layout.tsx - Reading-specific layout
export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="reading-layout">
      <main>{children}</main>
    </div>
  );
}
```

**Protected Route Pattern:**

```typescript
// components/auth/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=' + window.location.pathname);
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}
```

### Frontend Services Layer

**API Client Setup:**

```typescript
// lib/api/client.ts
import { supabase } from '@/lib/supabase';

interface ApiOptions {
  requireAuth?: boolean;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: any;
}

export async function apiCall<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { requireAuth = false, method = 'GET', body } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if required
  if (requireAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  }

  const response = await fetch(`/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  return response.json();
}
```

**Service Example:**

```typescript
// lib/api/readings.ts
import { apiCall } from './client';
import { Reading, ReadingWithCards, CreateReadingRequest } from '@/types';

export const readingsApi = {
  create: async (data: CreateReadingRequest): Promise<ReadingWithCards> => {
    return apiCall('/readings', {
      method: 'POST',
      body: data,
      requireAuth: false, // Optional auth
    });
  },

  getHistory: async (params?: { limit?: number; offset?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall<{ readings: ReadingWithCards[]; total: number }>(
      `/readings?${query}`,
      { requireAuth: true }
    );
  },

  getById: async (id: string): Promise<ReadingWithCards> => {
    return apiCall(`/readings/${id}`, { requireAuth: false });
  },

  update: async (id: string, data: Partial<Reading>) => {
    return apiCall(`/readings/${id}`, {
      method: 'PATCH',
      body: data,
      requireAuth: true,
    });
  },

  delete: async (id: string) => {
    return apiCall(`/readings/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
```

---

## Backend Architecture

This section defines backend-specific architecture including serverless function organization, database access patterns, and authentication implementation.

### Service Architecture - Serverless Functions

**Next.js API Routes Organization:**

```
apps/web/app/api/
├── cards/
│   ├── route.ts                 # GET /api/cards (list all)
│   ├── [slug]/
│   │   └── route.ts            # GET /api/cards/:slug
│   └── shuffle/
│       └── route.ts            # GET /api/cards/shuffle
├── readings/
│   ├── route.ts                 # POST /api/readings, GET /api/readings
│   └── [id]/
│       └── route.ts            # GET/PATCH/DELETE /api/readings/:id
├── users/
│   ├── me/
│   │   ├── route.ts            # GET/PATCH /api/users/me
│   │   └── stats/route.ts      # GET /api/users/me/stats
│   └── preferences/
│       └── route.ts            # GET/PATCH /api/preferences
├── favorites/
│   ├── route.ts                 # GET/POST /api/favorites
│   └── [id]/route.ts           # DELETE /api/favorites/:id
├── share/
│   └── generate/route.ts        # POST /api/share/generate
└── middleware/
    ├── auth.ts                  # JWT validation
    ├── error.ts                 # Error handling
    └── logger.ts                # Request logging
```

**Function Template:**

```typescript
// app/api/readings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '../middleware/auth';
import { handleApiError } from '../middleware/error';
import { createReadingService } from '@/services/readings';
import { CreateReadingSchema } from '@/lib/validation';

// POST /api/readings - Create new reading
export async function POST(request: NextRequest) {
  try {
    // Optional auth (anonymous allowed)
    const user = await validateAuth(request, { required: false });
    
    // Parse and validate request body
    const body = await request.json();
    const data = CreateReadingSchema.parse(body);
    
    // Create reading
    const reading = await createReadingService({
      ...data,
      user_id: user?.id || null,
    });
    
    return NextResponse.json(
      { reading, message: 'Reading created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/readings - Get reading history
export async function GET(request: NextRequest) {
  try {
    // Required auth
    const user = await validateAuth(request, { required: true });
    
    // Parse query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get readings
    const { readings, total } = await getReadingsService(user.id, { limit, offset });
    
    return NextResponse.json({ readings, total, limit, offset });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Database Architecture - Repository Pattern

**Data Access Layer:**

```typescript
// services/repositories/readingRepository.ts
import { prisma } from '@/lib/prisma';
import { Reading, Prisma } from '@prisma/client';

export class ReadingRepository {
  async create(data: Prisma.ReadingCreateInput): Promise<Reading> {
    return prisma.reading.create({
      data,
      include: {
        reading_cards: {
          include: {
            card: true,
          },
        },
      },
    });
  }

  async findByUserId(
    userId: string,
    options: { limit: number; offset: number }
  ) {
    const [readings, total] = await Promise.all([
      prisma.reading.findMany({
        where: { user_id: userId },
        include: {
          reading_cards: {
            include: { card: true },
          },
        },
        orderBy: { created_at: 'desc' },
        take: options.limit,
        skip: options.offset,
      }),
      prisma.reading.count({
        where: { user_id: userId },
      }),
    ]);

    return { readings, total };
  }

  async findById(id: string): Promise<Reading | null> {
    return prisma.reading.findUnique({
      where: { id },
      include: {
        reading_cards: {
          include: { card: true },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ReadingUpdateInput): Promise<Reading> {
    return prisma.reading.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.reading.delete({
      where: { id },
    });
  }
}
```

**Service Layer:**

```typescript
// services/readings/createReading.ts
import { ReadingRepository } from '../repositories/readingRepository';
import { ShuffleEngine } from '../shuffle/engine';
import { prisma } from '@/lib/prisma';

interface CreateReadingData {
  user_id: string | null;
  reading_type: 'daily' | 'three_card';
  question?: string;
}

export async function createReadingService(data: CreateReadingData) {
  const repo = new ReadingRepository();
  const shuffle = new ShuffleEngine();

  // Draw cards
  const count = data.reading_type === 'daily' ? 1 : 3;
  const drawnCards = shuffle.drawCards(count);

  // Create reading with cards in transaction
  return prisma.$transaction(async (tx) => {
    // Create reading
    const reading = await tx.reading.create({
      data: {
        user_id: data.user_id,
        reading_type: data.reading_type,
        question: data.question,
      },
    });

    // Create reading cards
    const readingCards = drawnCards.map((card, index) => ({
      reading_id: reading.id,
      card_id: card.cardId,
      position: index,
      position_label: data.reading_type === 'three_card' 
        ? (['past', 'present', 'future'][index] as any)
        : null,
      is_reversed: card.isReversed,
    }));

    await tx.readingCard.createMany({
      data: readingCards,
    });

    // Fetch complete reading with cards
    return tx.reading.findUnique({
      where: { id: reading.id },
      include: {
        reading_cards: {
          include: { card: true },
          orderBy: { position: 'asc' },
        },
      },
    });
  });
}
```

### Authentication Architecture

**Middleware Implementation:**

```typescript
// app/api/middleware/auth.ts
import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function validateAuth(
  request: NextRequest,
  options: { required: boolean } = { required: true }
) {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Get user from JWT
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    if (options.required) {
      throw new Error('Authentication required');
    }
    return null;
  }

  return user;
}
```

**Auth Flow Diagram:**

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Middleware
    participant Supabase
    participant DB

    Client->>API: Request with JWT token
    API->>Middleware: validateAuth()
    Middleware->>Supabase: Verify JWT
    Supabase-->>Middleware: User payload
    Middleware-->>API: user_id
    API->>DB: Query with user_id filter
    DB->>DB: RLS policy check
    DB-->>API: Authorized data
    API-->>Client: Response
```

---

## Unified Project Structure

Complete monorepo structure accommodating both frontend and backend with shared packages.

```
tarot-app/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI pipeline (lint, test, type-check)
│       └── deploy.yml                # Deployment to Vercel
├── apps/
│   └── web/                          # Next.js application (frontend + API)
│       ├── src/
│       │   ├── app/                  # Next.js App Router
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── api/              # API Routes (backend)
│       │   │   ├── reading/
│       │   │   ├── cards/
│       │   │   ├── history/
│       │   │   ├── profile/
│       │   │   └── auth/
│       │   ├── components/           # React components
│       │   │   ├── ui/
│       │   │   ├── cards/
│       │   │   ├── reading/
│       │   │   ├── layout/
│       │   │   └── features/
│       │   ├── lib/
│       │   │   ├── api/              # API client services
│       │   │   ├── hooks/            # Custom React hooks
│       │   │   ├── utils/            # Utilities
│       │   │   ├── stores/           # Zustand stores
│       │   │   ├── context/          # React contexts
│       │   │   ├── supabase.ts       # Supabase client
│       │   │   └── prisma.ts         # Prisma client
│       │   ├── services/             # Business logic (backend)
│       │   │   ├── repositories/     # Data access layer
│       │   │   ├── readings/         # Reading services
│       │   │   ├── shuffle/          # Shuffle engine
│       │   │   └── share/            # Image generation
│       │   ├── styles/
│       │   │   └── globals.css
│       │   └── types/
│       │       └── index.ts
│       ├── public/
│       │   ├── cards/                # Card images
│       │   ├── icons/
│       │   └── fonts/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts               # Seed 78 cards
│       ├── tests/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── e2e/
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── shared/                       # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types/                # TypeScript interfaces
│   │   │   │   ├── user.ts
│   │   │   │   ├── card.ts
│   │   │   │   ├── reading.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/            # Shared constants
│   │   │   │   ├── api.ts
│   │   │   │   └── validation.ts
│   │   │   ├── validators/           # Zod schemas
│   │   │   │   ├── reading.ts
│   │   │   │   └── user.ts
│   │   │   └── utils/                # Pure utilities
│   │   │       ├── format.ts
│   │   │       └── date.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── ui/                           # Shared UI components (future)
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── config/                       # Shared configurations
│       ├── eslint/
│       │   └── index.js
│       ├── typescript/
│       │   └── base.json
│       └── tailwind/
│           └── base.config.js
├── docs/
│   ├── prd.md                        # Product Requirements Document
│   ├── architecture.md               # This document
│   └── api.md                        # API documentation (future)
├── scripts/
│   ├── seed-cards.ts                 # Seed tarot cards to database
│   └── migrate.sh                    # Database migration script
├── .env.example                      # Environment variables template
├── .eslintrc.js                      # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── .gitignore
├── pnpm-workspace.yaml               # pnpm workspace config
├── package.json                      # Root package.json
├── turbo.json                        # Turborepo config (optional)
└── README.md
```

**Key Decisions:**
- ✅ **Single app structure** - No separate backend service for MVP
- ✅ **Co-located API routes** - Backend in `app/api/` alongside frontend pages
- ✅ **Shared packages** - Types and utilities shared via pnpm workspaces
- ✅ **Prisma in web app** - Database access in main app (not separate package)
- ✅ **Tests alongside app** - Unit, integration, e2e in app/tests

---

## Content Pipeline Architecture

This section defines the AI-powered content generation pipeline for creating 78 tarot card interpretations. The pipeline combines AI automation with human quality assurance to deliver accurate, culturally appropriate Thai-language content.

### Pipeline Overview

```mermaid
flowchart TB
    Start[Start: Card Metadata] --> AI[AI Generation<br/>Anthropic Claude 3.5]
    AI --> Output[Raw AI Output<br/>JSON/CSV]
    
    Output --> Gate1[Gate 1: Automated Validation<br/>Structure, Length, Fields]
    Gate1 --> Check1{Pass?}
    Check1 -->|No| Regen1[Regenerate]
    Regen1 --> AI
    Check1 -->|Yes| Gate2[Gate 2: Tarot Expert Review<br/>Accuracy, Tradition]
    
    Gate2 --> Check2{Pass?}
    Check2 -->|No| Revise1[Human Revision]
    Revise1 --> Gate2
    Check2 -->|Yes| Gate3[Gate 3: Thai Language Review<br/>Grammar, Naturalness]
    
    Gate3 --> Check3{Pass?}
    Check3 -->|No| Refine[Language Refinement]
    Refine --> Gate3
    Check3 -->|Yes| Gate4[Gate 4: Final Approval<br/>PO + Content Manager]
    
    Gate4 --> Check4{Approved?}
    Check4 -->|No| BackToGate[Back to Relevant Gate]
    BackToGate --> Gate1
    Check4 -->|Yes| DB[Seed to Database]
    
    DB --> Prod[Production Ready ✅]
    
    style AI fill:#6B46C1,color:#fff
    style Prod fill:#10B981,color:#fff
    style Regen1 fill:#EF4444,color:#fff
    style Revise1 fill:#F59E0B,color:#000
    style Refine fill:#F59E0B,color:#000
```

### Content Generation Architecture

**Tool Stack:**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **AI Model** | Anthropic Claude 3.5 Sonnet | Content generation (superior Thai) |
| **Generation Script** | TypeScript (Node.js) | Orchestrate batch generation |
| **Validation** | Zod + Custom Scripts | Automated quality checks |
| **Review Tools** | Google Sheets (CSV export) | Human review interface |
| **Storage** | JSON files + Git | Version control for content |
| **Database Import** | Prisma seed script | Import to PostgreSQL |

**Script Organization:**

```
scripts/
├── content/
│   ├── generate-tarot-content.ts     # Main generation script
│   ├── prompts/
│   │   ├── system-prompt.ts          # Tarot expert persona
│   │   ├── card-prompt-template.ts   # Per-card prompt template
│   │   └── few-shot-examples.ts      # Example outputs for consistency
│   ├── validators/
│   │   ├── structure-validator.ts    # Gate 1 automated checks
│   │   ├── content-validator.ts      # Field validation
│   │   └── thai-text-validator.ts    # Language checks
│   ├── exporters/
│   │   ├── csv-exporter.ts           # Export for Google Sheets
│   │   └── json-exporter.ts          # Database-ready format
│   └── batch-processor.ts            # Handle rate limits, retries

content/
├── metadata/
│   └── cards-metadata.json           # 78 cards base info (suit, number, name)
├── generated/
│   └── raw-ai-output.json            # Unreviewed AI generation
├── reviewed/
│   ├── gate1-validated.json          # Passed automated checks
│   ├── gate2-tarot-reviewed.csv      # Expert review sheet
│   ├── gate3-thai-reviewed.csv       # Proofreading sheet
│   └── gate4-approved.json           # Final approved version
└── production/
    └── tarot-cards-final.json        # Production seed data
```

### Generation Prompt Architecture

**System Prompt (Tarot Expert Persona):**

```typescript
const SYSTEM_PROMPT = `
You are a professional tarot expert with 20+ years of experience writing tarot card interpretations in Thai language. You write for Thai audiences who are interested in spiritual guidance and self-reflection.

Your writing style:
- Warm, empathetic, and supportive (not scary or negative)
- Conversational Thai (ไม่เป็นทางการเกินไป)
- Accessible to beginners but meaningful for experienced readers
- Culturally appropriate for Thai context
- Practical advice grounded in real-life situations

Guidelines:
- Upright meanings focus on positive aspects and opportunities
- Reversed meanings suggest challenges and lessons (not doom)
- Keep paragraphs short (2-3 sentences each)
- Use everyday Thai vocabulary, avoid overly complex terms
- Include relatable examples (work, relationships, personal growth)
- Maintain mystical but approachable tone
- Align with traditional Rider-Waite interpretations

Output format:
- meaning_upright: 2-3 paragraphs (150-250 words in Thai)
- meaning_reversed: 2-3 paragraphs (150-250 words in Thai)
- keywords_upright: 4-6 keywords in Thai (ความสำเร็จ, โอกาสใหม่, etc.)
- keywords_reversed: 4-6 keywords in Thai (อุปสรรค, ความท้าทาย, etc.)
- advice: 1-2 paragraphs (100-150 words in Thai)
`;
```

**Per-Card Prompt Template:**

```typescript
function generateCardPrompt(card: CardMetadata): string {
  return `
Generate complete Thai tarot interpretation for:

**Card:** ${card.name} (${card.name_th})
**Suit:** ${card.suit}
**Number:** ${card.number}
**Arcana:** ${card.arcana}
${card.element ? `**Element:** ${card.element}` : ''}

Please provide:
1. **meaning_upright** (Thai, 2-3 paragraphs):
   - What this card represents when upright
   - Common situations where this card appears
   - Positive aspects and opportunities
   
2. **meaning_reversed** (Thai, 2-3 paragraphs):
   - What this card represents when reversed
   - Challenges or lessons to learn
   - How to work with this energy
   
3. **keywords_upright** (Thai, 4-6 keywords):
   - Key concepts for upright position
   
4. **keywords_reversed** (Thai, 4-6 keywords):
   - Key concepts for reversed position
   
5. **advice** (Thai, 1-2 paragraphs):
   - Practical guidance for daily life
   - How to apply this card's wisdom

Format as JSON:
{
  "meaning_upright": "...",
  "meaning_reversed": "...",
  "keywords_upright": ["...", "..."],
  "keywords_reversed": ["...", "..."],
  "advice": "..."
}
`;
}
```

### Batch Processing Strategy

**Rate Limit Management:**

```typescript
// scripts/content/batch-processor.ts
interface BatchConfig {
  batchSize: number;      // 10 cards per batch
  delayBetweenBatches: number;  // 15 seconds
  maxRetries: number;     // 3 retries per card
  retryDelay: number;     // Exponential backoff
}

export class ContentBatchProcessor {
  private config: BatchConfig = {
    batchSize: 10,
    delayBetweenBatches: 15000,  // Stay under 50 RPM limit
    maxRetries: 3,
    retryDelay: 1000,
  };

  async processBatch(cards: CardMetadata[]): Promise<GeneratedCard[]> {
    const results: GeneratedCard[] = [];
    
    // Process in batches of 10
    for (let i = 0; i < cards.length; i += this.config.batchSize) {
      const batch = cards.slice(i, i + this.config.batchSize);
      
      console.log(`Processing batch ${Math.floor(i / 10) + 1}/${Math.ceil(cards.length / 10)}`);
      
      // Parallel processing within batch
      const batchResults = await Promise.allSettled(
        batch.map(card => this.generateWithRetry(card))
      );
      
      // Handle results and failures
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`Failed to generate ${batch[index].name}:`, result.reason);
          // Log failure for manual intervention
        }
      });
      
      // Wait between batches to respect rate limits
      if (i + this.config.batchSize < cards.length) {
        await this.delay(this.config.delayBetweenBatches);
      }
      
      // Progress update
      console.log(`Progress: ${Math.min(i + 10, cards.length)}/78 cards`);
    }
    
    return results;
  }

  private async generateWithRetry(
    card: CardMetadata,
    attempt = 0
  ): Promise<GeneratedCard> {
    try {
      return await generateCardContent(card);
    } catch (error) {
      if (attempt < this.config.maxRetries) {
        const delay = this.config.retryDelay * Math.pow(2, attempt);
        await this.delay(delay);
        return this.generateWithRetry(card, attempt + 1);
      }
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

**Execution Time Estimates:**

| Phase | Duration | Details |
|-------|----------|---------|
| **Batch Processing** | ~30 minutes | 78 cards ÷ 10 per batch × 15s delay + API time |
| **Gate 1 (Automated)** | ~2 minutes | Run validation scripts |
| **Gate 2 (Expert Review)** | 4-6 hours | Tarot expert reviews 78 cards |
| **Gate 3 (Proofreading)** | 3-4 hours | Thai language proofreader |
| **Gate 4 (Final Approval)** | 1 hour | PO + Content Manager review |
| **Total** | **1-2 days** | With parallel expert + proofreading |

### Content Storage & Version Control

**Storage Strategy:**

```typescript
// Content versioning structure
interface ContentVersion {
  version: string;           // v1.0, v1.1, etc.
  generated_at: string;      // ISO timestamp
  generated_by: 'ai' | 'human';
  ai_model?: string;         // claude-3-5-sonnet-20241022
  reviewer?: string;         // Name of human reviewer
  status: 'draft' | 'reviewed' | 'approved' | 'production';
  changes?: string[];        // List of changes from previous version
}

interface CardContent {
  card_id: string;
  name: string;
  name_th: string;
  meaning_upright: string;
  meaning_reversed: string;
  keywords_upright: string[];
  keywords_reversed: string[];
  advice: string;
  metadata: ContentVersion;
}
```

**Git Workflow:**

```bash
# 1. Generate content (feature branch)
git checkout -b content/tarot-cards-generation
pnpm generate:tarot-content
git add content/generated/
git commit -m "feat: Generate 78 tarot card interpretations (AI)"

# 2. Export for review
pnpm export:content-review
# → Generates CSV files for Google Sheets

# 3. After Gate 2-3 reviews, import revised content
git add content/reviewed/
git commit -m "review: Tarot expert and Thai proofreading complete"

# 4. After Gate 4 approval
git add content/production/
git commit -m "approve: Final content approval for production"

# 5. Seed to database
pnpm prisma:seed --source content/production/tarot-cards-final.json
git commit -m "chore: Seed approved tarot content to database"

# 6. Merge to main
git push origin content/tarot-cards-generation
# → Create PR with full review trail
# → Merge after final approval
```

### Integration with Quality Gates

**Automated Validation (Gate 1):**

```typescript
// scripts/content/validators/gate1-automated.ts
import { z } from 'zod';

const CardContentSchema = z.object({
  name: z.string().min(1),
  name_th: z.string().min(1),
  meaning_upright: z.string().min(100).max(500),
  meaning_reversed: z.string().min(100).max(500),
  keywords_upright: z.array(z.string()).min(4).max(6),
  keywords_reversed: z.array(z.string()).min(4).max(6),
  advice: z.string().min(80).max(300),
});

export async function validateGate1(cards: any[]): Promise<ValidationResult> {
  const results = {
    passed: 0,
    failed: 0,
    errors: [] as ValidationError[],
  };

  for (const card of cards) {
    try {
      CardContentSchema.parse(card);
      
      // Additional checks
      if (containsProfanity(card.meaning_upright)) {
        throw new Error('Contains inappropriate language');
      }
      
      if (!isValidThaiText(card.name_th)) {
        throw new Error('Invalid Thai characters');
      }
      
      results.passed++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        card: card.name,
        error: error.message,
      });
    }
  }

  return results;
}
```

**Review Export (Gates 2-3):**

```typescript
// scripts/content/exporters/csv-exporter.ts
export function exportForReview(cards: GeneratedCard[]): string {
  const headers = [
    'Card Number',
    'Name (EN)',
    'Name (TH)',
    'Meaning Upright',
    'Meaning Reversed',
    'Keywords Up',
    'Keywords Rev',
    'Advice',
    'Reviewer Notes',
    'Status (Pass/Fail)',
    'Required Changes',
  ];

  const rows = cards.map(card => [
    card.number,
    card.name,
    card.name_th,
    card.meaning_upright,
    card.meaning_reversed,
    card.keywords_upright.join(', '),
    card.keywords_reversed.join(', '),
    card.advice,
    '', // Reviewer fills
    '', // Reviewer fills
    '', // Reviewer fills
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}
```

### Content Update & Maintenance

**Post-Launch Content Updates:**

```typescript
// Future: Content improvement pipeline
interface ContentUpdateRequest {
  card_id: string;
  field: 'meaning_upright' | 'meaning_reversed' | 'advice';
  reason: string;
  proposed_change: string;
  requested_by: string;
}

// Workflow:
// 1. User feedback → Content update request
// 2. Content team reviews
// 3. If approved → Re-run relevant quality gates
// 4. Deploy update
// 5. Notify users (optional, for major changes)
```

**Content Analytics:**

```typescript
// Track content performance
interface ContentMetrics {
  card_id: string;
  views: number;              // How often viewed
  avg_time_on_page: number;   // Engagement indicator
  bounce_rate: number;        // Quality indicator
  feedback_score: number;     // User ratings (future)
  share_count: number;        // Virality indicator
}

// Identify improvement opportunities
// Cards with high bounce rate or low time-on-page may need content refinement
```

### Content Generation Cost Breakdown

**Anthropic API Pricing (Claude 3.5 Sonnet):**
- Input: $3.00 per million tokens
- Output: $15.00 per million tokens

**Cost Calculation:**

| Item | Tokens | Cost (USD) | Cost (THB) |
|------|--------|------------|------------|
| **System prompt** (78 requests) | 78 × 500 = 39K | $0.12 | ~฿4 |
| **Input prompts** (78 cards) | 78 × 300 = 23.4K | $0.07 | ~฿2 |
| **Output** (78 cards) | 78 × 1,500 = 117K | $1.76 | ~฿60 |
| **Regenerations** (~10% failure) | 10K input + 15K output | $0.26 | ~฿9 |
| **Total API Cost** | ~194K tokens | **$2.21** | **~฿75** |

**Total Budget Including Human Review:**

| Item | Cost (THB) |
|------|------------|
| Anthropic API | ฿75 |
| Tarot Expert Review (6 hours @ ฿1,000/hr) | ฿6,000 |
| Thai Proofreader (4 hours @ ฿800/hr) | ฿3,200 |
| Content Manager (2 hours @ ฿1,200/hr) | ฿2,400 |
| **Total** | **~฿11,675** |

**One-time investment for 78 professional tarot card contents** ✅

### Pipeline Performance

**Generation Speed:**
- Single card: ~8-12 seconds (API call + processing)
- Batch of 10: ~2 minutes (parallel processing)
- All 78 cards: ~25-30 minutes (with rate limit delays)

**Quality Gate Duration:**
- Gate 1 (Automated): 2-5 minutes
- Gate 2 (Expert): 4-6 hours
- Gate 3 (Proofreading): 3-4 hours
- Gate 4 (Approval): 1 hour

**Total Pipeline Time:** 1-2 business days (with parallel reviews)

---

## Development Workflow

### Local Development Setup

**Prerequisites:**

```bash
# Required installations
node --version      # v18.17+ or v20+
pnpm --version      # v8.14+
git --version       # v2.40+

# Install Node.js (if needed)
# macOS: brew install node
# Windows: https://nodejs.org/

# Install pnpm
npm install -g pnpm@latest
```

**Initial Setup:**

```bash
# Clone repository
git clone https://github.com/your-org/tarot-app.git
cd tarot-app

# Install dependencies (all packages)
pnpm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY  
# - SUPABASE_SERVICE_ROLE_KEY (server-side only)
# - DATABASE_URL
# - DIRECT_URL

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Seed database with 78 tarot cards
pnpm seed
```

**Development Commands:**

```bash
# Start all services (dev server + watch mode)
pnpm dev                    # Runs Next.js dev server on localhost:3000

# Start specific workspace
pnpm --filter web dev       # Start web app only
pnpm --filter shared build  # Build shared package

# Type checking
pnpm typecheck              # Type-check all packages

# Linting
pnpm lint                   # Run ESLint
pnpm lint:fix               # Auto-fix lint issues

# Formatting
pnpm format                 # Check Prettier formatting
pnpm format:fix             # Auto-format with Prettier

# Testing
pnpm test                   # Run all tests
pnpm test:unit              # Unit tests only
pnpm test:integration       # Integration tests only
pnpm test:e2e               # E2E tests (requires server running)
pnpm test:watch             # Watch mode

# Database
pnpm prisma studio          # Open Prisma Studio (GUI for database)
pnpm prisma migrate dev     # Create and apply migration
pnpm prisma db push         # Push schema changes (dev only)
pnpm prisma db seed         # Seed database

# Build
pnpm build                  # Build for production
pnpm start                  # Start production server (after build)
```

### Environment Configuration

**Required Environment Variables:**

```bash
# Frontend (.env.local) - Exposed to client
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=123456789
NEXT_PUBLIC_HOTJAR_ID=3456789
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend (.env.local) - Server-side only
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...              # DO NOT EXPOSE
DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:xxx@db.xxx.supabase.co:6543/postgres  # Connection pooler
SENTRY_DSN=https://xxx@o123.ingest.sentry.io/456
SENTRY_AUTH_TOKEN=xxx                            # For source map uploads

# Development
NODE_ENV=development
```

**Environment-specific configs:**
- **Development:** Full logging, no analytics, relaxed CORS
- **Staging:** Production-like, test data, limited analytics
- **Production:** Optimized, full analytics, strict security

---

## Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**
- **Platform:** Vercel
- **Build Command:** `pnpm build`
- **Output Directory:** `.next`
- **CDN/Edge:** Vercel Edge Network (300+ locations)
- **Regions:** Global (primary: US East, fallback: Europe, Asia-Pacific)

**Backend Deployment:**
- **Platform:** Vercel Serverless Functions (Next.js API Routes)
- **Build Command:** Same as frontend (monolithic)
- **Deployment Method:** Git-based auto-deploy
- **Regions:** Same as frontend

**Database:**
- **Platform:** Supabase (PostgreSQL)
- **Region:** Singapore (ap-southeast-1)
- **Connection:** Pooled connections via PgBouncer (port 6543)

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm typecheck
      
      - name: Format check
        run: pnpm format

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run unit tests
        run: pnpm test:unit
      
      - name: Run integration tests
        run: pnpm test:integration
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Install Playwright
        run: pnpm exec playwright install --with-deps
      
      - name: Build app
        run: pnpm build
      
      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          BASE_URL: http://localhost:3000
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

**Vercel Git Integration:**
- **Main branch:** Auto-deploy to production
- **Develop branch:** Auto-deploy to staging
- **Pull requests:** Create preview deployments
- **Rollback:** Instant rollback via Vercel dashboard

### Environments

| Environment | Frontend URL | Backend URL | Purpose | Database |
|-------------|--------------|-------------|---------|----------|
| **Development** | http://localhost:3000 | http://localhost:3000/api | Local dev | Local or Supabase dev |
| **Staging** | https://staging.tarot-app.vercel.app | Same (monolithic) | Pre-production testing | Supabase staging |
| **Production** | https://tarot-app.com | Same (monolithic) | Live environment | Supabase production |

---

## Security and Performance

### Security Requirements

**Frontend Security:**
- **CSP Headers:** Content Security Policy to prevent XSS
  ```
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' *.supabase.co *.google-analytics.com;
  ```
- **XSS Prevention:** React auto-escaping, DOMPurify for user HTML
- **Secure Storage:** httpOnly cookies for JWT (not localStorage)

**Backend Security:**
- **Input Validation:** Zod schemas on all API inputs
- **Rate Limiting:** 
  - Anonymous: 100 requests/hour per IP
  - Authenticated: 1000 requests/hour per user
  - Implemented via Vercel Edge Config or Upstash Redis
- **CORS Policy:** 
  ```typescript
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  ```

**Authentication Security:**
- **Token Storage:** httpOnly cookies (immune to XSS)
- **Session Management:** JWT expiry 1 hour, refresh token 30 days
- **Password Policy:** Min 8 chars, 1 uppercase, 1 lowercase, 1 number (Supabase enforced)

### Performance Optimization

**Frontend Performance:**
- **Bundle Size Target:** <200KB initial JavaScript (gzipped)
- **Loading Strategy:**
  - Above-fold: Inline critical CSS, priority images
  - Below-fold: Lazy load images, defer non-critical scripts
  - Code splitting: Automatic per-route (Next.js App Router)
- **Caching Strategy:**
  - Static assets: `Cache-Control: public, max-age=31536000, immutable`
  - API responses: `stale-while-revalidate` with SWR
  - Card images: CDN cache, long TTL (1 year)

**Backend Performance:**
- **Response Time Target:** <200ms (p95), <500ms (p99)
- **Database Optimization:**
  - Indexes on all foreign keys and query columns
  - Connection pooling (PgBouncer)
  - Query optimization (avoid N+1, use JOINs)
- **Caching Strategy:**
  - Card data: In-memory cache (78 cards, rarely change)
  - User sessions: Redis cache (future, if needed)
  - API responses: Edge caching for public endpoints

**Core Web Vitals Targets:**
- **LCP (Largest Contentful Paint):** <1.5s
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1

---

## Testing Strategy

Comprehensive testing approach following the testing pyramid (70% unit, 20% integration, 10% E2E).

### Testing Pyramid

```
        E2E Tests (10%)
       /              \
    Integration Tests (20%)
   /                      \
Frontend Unit (35%)  Backend Unit (35%)
```

### Test Organization

**Frontend Tests:**

```
apps/web/tests/
├── unit/
│   ├── components/
│   │   ├── CardDisplay.test.tsx
│   │   ├── ReadingResult.test.tsx
│   │   └── Navigation.test.tsx
│   ├── hooks/
│   │   ├── useAuth.test.ts
│   │   └── useReading.test.ts
│   └── utils/
│       ├── shuffle.test.ts
│       └── format.test.ts
├── integration/
│   ├── api/
│   │   ├── readings.test.ts
│   │   └── users.test.ts
│   └── flows/
│       ├── reading-flow.test.tsx
│       └── auth-flow.test.tsx
└── e2e/
    ├── daily-reading.spec.ts
    ├── three-card-spread.spec.ts
    ├── user-signup.spec.ts
    └── reading-history.spec.ts
```

### Test Examples

**Frontend Component Test:**

```typescript
// tests/unit/components/CardDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import { CardDisplay } from '@/components/cards/CardDisplay';

describe('CardDisplay', () => {
  const mockCard = {
    id: '1',
    name: 'The Fool',
    name_th: 'คนบ้า',
    image_url: '/cards/fool.webp',
    meaning_upright: 'New beginnings...',
    meaning_reversed: 'Recklessness...',
    // ... other fields
  };

  it('renders card image and name', () => {
    render(<CardDisplay card={mockCard} />);
    
    expect(screen.getByAltText(/คนบ้า/)).toBeInTheDocument();
    expect(screen.getByText('คนบ้า')).toBeInTheDocument();
    expect(screen.getByText('The Fool')).toBeInTheDocument();
  });

  it('shows upright interpretation when not reversed', () => {
    render(<CardDisplay card={mockCard} isReversed={false} showInterpretation />);
    
    expect(screen.getByText(/New beginnings/)).toBeInTheDocument();
  });

  it('shows reversed interpretation when reversed', () => {
    render(<CardDisplay card={mockCard} isReversed={true} showInterpretation />);
    
    expect(screen.getByText(/Recklessness/)).toBeInTheDocument();
  });
});
```

**Backend API Test:**

```typescript
// tests/integration/api/readings.test.ts
import { POST, GET } from '@/app/api/readings/route';
import { createMockRequest } from '@/tests/helpers';
import { prisma } from '@/lib/prisma';

describe('POST /api/readings', () => {
  afterEach(async () => {
    await prisma.reading.deleteMany();
  });

  it('creates daily reading for anonymous user', async () => {
    const request = createMockRequest({
      method: 'POST',
      body: {
        reading_type: 'daily',
        question: 'Test question',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.reading).toBeDefined();
    expect(data.reading.reading_type).toBe('daily');
    expect(data.reading.user_id).toBeNull();
  });

  it('requires authentication for reading history', async () => {
    const request = createMockRequest({ method: 'GET' });

    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});
```

**E2E Test:**

```typescript
// tests/e2e/daily-reading.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Daily Reading Flow', () => {
  test('complete daily reading as anonymous user', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/ดูดวงไพ่ยิปซี/);

    // Click "เริ่มดูดวง" button
    await page.click('text=เริ่มดูดวง');
    await expect(page).toHaveURL('/reading');

    // Select Daily Reading
    await page.click('text=ดูดวงประจำวัน');
    await expect(page).toHaveURL('/reading/daily');

    // Enter question (optional)
    await page.fill('input[name="question"]', 'วันนี้จะเป็นอย่างไร?');

    // Click to draw card
    await page.click('text=เลือกไพ่');

    // Wait for card flip animation
    await page.waitForSelector('.card-result', { timeout: 5000 });

    // Verify result displayed
    await expect(page.locator('.card-image')).toBeVisible();
    await expect(page.locator('.card-interpretation')).toBeVisible();

    // Verify signup prompt shown
    await expect(page.locator('text=Sign up to save')).toBeVisible();
  });
});
```

### Testing Tools & Configuration

**vitest.config.ts:**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Coverage Targets:**
- **Overall:** >70%
- **Critical paths:** >90% (auth, reading creation, data access)
- **UI components:** >60% (focus on logic, not styling)

---

## Content Quality Assurance Strategy

### Overview

**Context:** 78 tarot cards content generated using AI (Anthropic Claude 3.5 Sonnet) with mandatory human verification before production deployment.

**Quality Philosophy:** AI accelerates content creation, humans ensure accuracy and cultural appropriateness. Zero tolerance for inaccurate or inappropriate content in production.

**Timeline:** 5 days (content generation + review + approval)

**Budget:** ฿7,500-11,700 (API costs ฿30-75 + expert review ฿3,000-6,000 + proofreading ฿2,000-3,200)

---

### Content Generation Process

**Tool:** Anthropic Claude API (Claude 3.5 Sonnet)
- Superior Thai language capabilities
- Context-aware content generation
- Cost-effective (~฿32 for 78 cards)

**Generation Pipeline:**

```bash
# 1. Generate all 78 cards
pnpm generate:tarot-content

# 2. Export for human review
pnpm export:content-review --format csv,json

# 3. After review, import approved content
pnpm prisma:seed --source content/reviewed-cards.json
```

**Output Formats:**
- CSV: Human-readable review format (Google Sheets compatible)
- JSON: Database-ready format (Prisma import)

---

### Quality Gate Framework (4-Stage Process)

```mermaid
graph LR
    A[AI Generation] --> B[Gate 1: Automated Validation]
    B --> C{Pass?}
    C -->|Yes| D[Gate 2: Tarot Accuracy Review]
    C -->|No| E[Regenerate]
    E --> B
    
    D --> F{Pass?}
    F -->|Yes| G[Gate 3: Thai Language Review]
    F -->|No| H[Revise/Rewrite]
    H --> D
    
    G --> I{Pass?}
    I -->|Yes| J[Gate 4: Final Approval]
    I -->|No| K[Refine Language]
    K --> G
    
    J --> L{Approved?}
    L -->|Yes| M[Production Ready]
    L -->|No| N[Back to relevant gate]
    N --> B
    
    style A fill:#6B46C1,color:#fff
    style M fill:#10B981,color:#fff
    style E fill:#EF4444,color:#fff
    style H fill:#F59E0B,color:#000
    style K fill:#F59E0B,color:#000
```

---

### Gate 1: Automated Validation ✅

**Responsibility:** QA Team (Automated Scripts)

**Purpose:** Ensure AI output meets technical specifications before human review

**Validation Criteria:**

```typescript
// tests/content/automated-validation.test.ts

describe('Content Automated Validation', () => {
  describe('Structural Validation', () => {
    test('All 78 cards generated successfully', async () => {
      const cards = await loadGeneratedCards();
      expect(cards).toHaveLength(78);
    });

    test('All required fields present', async () => {
      const cards = await loadGeneratedCards();
      cards.forEach(card => {
        expect(card.name).toBeTruthy();
        expect(card.name_th).toBeTruthy();
        expect(card.meaning_upright).toBeTruthy();
        expect(card.meaning_reversed).toBeTruthy();
        expect(card.keywords_upright).toBeInstanceOf(Array);
        expect(card.keywords_reversed).toBeInstanceOf(Array);
        expect(card.advice).toBeTruthy();
      });
    });
  });

  describe('Content Length Validation', () => {
    test('Meaning fields within length constraints', async () => {
      const cards = await loadGeneratedCards();
      cards.forEach(card => {
        // Min 200 words, max 1000 words
        expect(card.meaning_upright.length).toBeGreaterThan(200);
        expect(card.meaning_upright.length).toBeLessThan(1000);
        expect(card.meaning_reversed.length).toBeGreaterThan(200);
        expect(card.meaning_reversed.length).toBeLessThan(1000);
        
        // Advice: 100-500 words
        expect(card.advice.length).toBeGreaterThan(100);
        expect(card.advice.length).toBeLessThan(500);
      });
    });

    test('Keywords array length valid', async () => {
      const cards = await loadGeneratedCards();
      cards.forEach(card => {
        expect(card.keywords_upright.length).toBeGreaterThanOrEqual(5);
        expect(card.keywords_upright.length).toBeLessThanOrEqual(10);
        expect(card.keywords_reversed.length).toBeGreaterThanOrEqual(5);
        expect(card.keywords_reversed.length).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('Language Detection', () => {
    test('Thai language detected in content', async () => {
      const cards = await loadGeneratedCards();
      cards.forEach(card => {
        expect(isThaiText(card.name_th)).toBe(true);
        expect(isThaiText(card.meaning_upright)).toBe(true);
        expect(isThaiText(card.meaning_reversed)).toBe(true);
        expect(containsThaiCharacters(card.advice)).toBe(true);
      });
    });

    test('No English-only content in Thai fields', async () => {
      const cards = await loadGeneratedCards();
      cards.forEach(card => {
        expect(isEnglishOnly(card.meaning_upright)).toBe(false);
        expect(isEnglishOnly(card.meaning_reversed)).toBe(false);
      });
    });
  });

  describe('Content Safety', () => {
    test('No profanity or inappropriate content', async () => {
      const cards = await loadGeneratedCards();
      cards.forEach(card => {
        expect(containsProfanity(card.meaning_upright)).toBe(false);
        expect(containsProfanity(card.meaning_reversed)).toBe(false);
        expect(containsProfanity(card.advice)).toBe(false);
      });
    });

    test('No overly negative or scary language', async () => {
      const cards = await loadGeneratedCards();
      const negativeWords = ['โชคร้าย', 'อันตราย', 'หายนะ', 'ตาย'];
      cards.forEach(card => {
        negativeWords.forEach(word => {
          expect(card.meaning_upright).not.toContain(word);
          expect(card.advice).not.toContain(word);
        });
      });
    });
  });

  describe('Data Integrity', () => {
    test('Unique card IDs', async () => {
      const cards = await loadGeneratedCards();
      const ids = cards.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(cards.length);
    });

    test('Valid suit and number combinations', async () => {
      const cards = await loadGeneratedCards();
      cards.forEach(card => {
        if (card.suit === 'major_arcana') {
          expect(card.number).toBeGreaterThanOrEqual(0);
          expect(card.number).toBeLessThanOrEqual(21);
          expect(card.element).toBeNull();
        } else {
          expect(card.number).toBeGreaterThanOrEqual(1);
          expect(card.number).toBeLessThanOrEqual(14);
          expect(card.element).toBeTruthy();
        }
      });
    });
  });
});
```

**Pass Criteria:**
- ✅ 100% test pass rate (all assertions pass)
- ✅ Zero empty fields
- ✅ Thai language detected in all Thai fields
- ✅ Length constraints met
- ✅ No content safety violations

**Action on Failure:**
- Re-generate failed cards automatically
- Maximum 3 retry attempts
- Escalate to manual review if still failing

---

### Gate 2: Tarot Accuracy Review 🔮

**Responsibility:** External Tarot Expert

**Purpose:** Verify content accuracy against traditional Rider-Waite tarot interpretations

**Review Checklist:**

```yaml
Tarot Accuracy Review Checklist:

Per Card (78 total):
  Content Accuracy:
    - [ ] Meaning aligns with Rider-Waite tradition
    - [ ] Upright interpretation accurate
    - [ ] Reversed interpretation distinct and accurate
    - [ ] Keywords reflect traditional symbolism
    - [ ] No contradictions with established meanings
  
  Interpretation Quality:
    - [ ] Advice is appropriate for card meaning
    - [ ] Context-appropriate guidance
    - [ ] Balanced perspective (not overly positive/negative)
    - [ ] Practical and actionable advice
  
  Consistency:
    - [ ] Consistent with related cards in same suit
    - [ ] Major Arcana progression makes sense
    - [ ] Court cards hierarchy appropriate
  
  Rating: [1-5 stars]
  Issues: [List any concerns]
  Recommendation: [Approve / Revise / Reject]
```

**Review Process:**

1. **Sample Review First (10 cards):**
   - Review diverse sample (2 Major, 2 from each Minor suit)
   - Assess overall quality and approach
   - Decide: Continue with all 78 or regenerate

2. **Full Review (if sample passes):**
   - Review all 78 cards systematically
   - Flag issues in review spreadsheet
   - Provide specific revision guidance

3. **Revision Round:**
   - Re-generate or manually edit problematic cards
   - Expert re-reviews revised cards
   - Iterate until approval

**Pass Criteria:**
- ✅ Average rating: ≥4.5/5 stars
- ✅ Approval rate: ≥95% (max 4 cards need revision)
- ✅ Zero major inaccuracies
- ✅ Expert sign-off documented

**Timeline:** 1-2 days (2-3 hours expert time)

**Cost:** ฿3,000-5,000 (freelance tarot expert)

**Action on Failure:**
- Individual card regeneration (AI)
- Manual writing for persistently problematic cards
- Expert consultation on prompt refinement

---

### Gate 3: Thai Language Quality Review 🇹🇭

**Responsibility:** Native Thai Speaker (Proofreader)

**Purpose:** Ensure natural, grammatically correct, and culturally appropriate Thai language

**Review Checklist:**

```yaml
Thai Language Quality Checklist:

Per Card:
  Grammar & Structure:
    - [ ] No grammatical errors
    - [ ] Natural sentence flow
    - [ ] Appropriate word choices
    - [ ] No literal translation artifacts
    - [ ] Punctuation correct
  
  Tone & Style:
    - [ ] Warm and encouraging tone
    - [ ] Conversational yet professional
    - [ ] Appropriate for target audience (25-40 years)
    - [ ] Consistent voice across cards
    - [ ] No overly formal/archaic language
  
  Cultural Appropriateness:
    - [ ] Culturally sensitive content
    - [ ] Thai idioms used correctly (if any)
    - [ ] No inappropriate cultural references
    - [ ] Respectful spiritual language
  
  Readability:
    - [ ] Easy to understand
    - [ ] Clear and concise
    - [ ] No ambiguous phrasing
    - [ ] Mobile-friendly (short paragraphs)
  
  Rating: [1-5 stars]
  Issues: [List specific errors/suggestions]
  Recommendation: [Approve / Minor edits / Major revision]
```

**Review Process:**

1. **Grammar & Syntax Check:**
   - Use automated tools (LanguageTool for Thai)
   - Manual review by native speaker
   - Fix obvious errors

2. **Naturalness Assessment:**
   - Read aloud test (does it sound natural?)
   - Compare with human-written tarot content
   - Flag translation-like phrases

3. **Cultural Review:**
   - Verify appropriate spiritual terminology
   - Check for unintentionally offensive content
   - Ensure brand tone alignment

**Pass Criteria:**
- ✅ Average rating: ≥4.5/5 stars
- ✅ Zero grammatical errors
- ✅ ≥90% "natural Thai" rating
- ✅ Brand tone alignment: ≥4/5 stars
- ✅ Proofreader sign-off documented

**Timeline:** 1-2 days (4-6 hours proofreading time)

**Cost:** ฿2,000-3,000 (฿25-40 per card)

**Action on Failure:**
- Minor edits: Direct correction by proofreader
- Major revision: Re-generate with refined prompts
- Persistent issues: Manual rewriting

---

### Gate 4: Final Product Approval ✅

**Responsibility:** Product Manager (John) + QA Lead (Quinn)

**Purpose:** Final verification before production deployment

**Approval Checklist:**

```yaml
Final Approval Checklist:

Technical Verification:
  - [ ] All 78 cards passed Gate 1-3
  - [ ] Database import successful (dev environment)
  - [ ] API returns content correctly
  - [ ] Frontend displays content properly
  - [ ] No performance issues (page load <1s)
  - [ ] Thai fonts rendering correctly

Content Quality:
  - [ ] Random sample review (10 cards) by PM
  - [ ] Consistent tone across all cards
  - [ ] No obvious errors or issues
  - [ ] Advice is actionable and appropriate
  - [ ] Brand voice alignment verified

Business Validation:
  - [ ] Timeline met (5 days)
  - [ ] Budget within limits (≤฿10,000)
  - [ ] Expert reviews documented
  - [ ] Quality gates evidence archived
  - [ ] Risk mitigation successful

Legal & Compliance:
  - [ ] Content reviewed disclaimer added
  - [ ] Expert credentials documented
  - [ ] No copyright violations
  - [ ] PDPA compliance (no PII in content)

Sign-offs:
  - [ ] Tarot Expert: _______________ Date: _______
  - [ ] Thai Proofreader: ___________ Date: _______
  - [ ] QA Lead (Quinn): ___________ Date: _______
  - [ ] PM (John): _________________ Date: _______
```

**Final Validation:**

```bash
# Run complete test suite
pnpm test:content

# Manual spot checks
pnpm test:content:manual --random 10

# Performance validation
pnpm lighthouse:check --target=reading-results

# Deploy to staging
pnpm deploy:staging

# Smoke tests on staging
pnpm test:e2e:staging
```

**Pass Criteria:**
- ✅ All checklist items completed
- ✅ All stakeholders signed off
- ✅ Zero P0/P1 bugs found
- ✅ Staging environment fully functional

**Timeline:** 4-6 hours (final testing + approvals)

**Action on Failure:**
- Return to relevant quality gate
- Document blockers and resolution plan
- Re-run approval process after fixes

---

### Risk Assessment & Mitigation

**Risk Matrix:**

| Risk | Probability | Impact | Mitigation Strategy | Owner |
|------|------------|--------|---------------------|-------|
| **AI generates inaccurate meanings** | Medium | Critical | Gate 2: Tarot expert review | QA |
| **Thai language unnatural/incorrect** | Medium | High | Gate 3: Native speaker review | QA |
| **Brand tone mismatch** | Low | Medium | Sample testing + refinement | PM |
| **Content too generic** | Low | Medium | Prompt engineering + expert review | Architect |
| **Timeline overrun (>5 days)** | Low | Medium | Parallel review process | PM |
| **Budget overrun (>฿10K)** | Low | Low | Fixed-price contracts with experts | PM |
| **Expert unavailable** | Low | High | Backup reviewers pre-identified | PM |
| **API rate limits hit** | Low | Low | Implement delays, use paid tier | Architect |

**Mitigation Actions:**

1. **Pre-identify backup reviewers** (both tarot expert and proofreader)
2. **Pilot test with 10 cards** before full generation
3. **Daily progress tracking** during review period
4. **Escalation protocol** for quality issues
5. **Rollback plan** if production issues discovered

---

### Content Quality Metrics

**Quantitative Metrics:**

```yaml
Success Metrics:
  Completeness:
    - 78/78 cards generated: 100%
    - All required fields populated: 100%
    - No empty content: 0 occurrences
  
  Efficiency:
    - Generation time: <20 minutes
    - Review time: 2-3 days
    - Total time: ≤5 days
    - Budget: ≤฿10,000
  
  Quality:
    - Automated validation pass rate: 100%
    - Expert approval rate: ≥95%
    - Language quality rating: ≥4.5/5
    - Revision rate: ≤10%
  
  Production:
    - Zero P0 bugs post-deployment
    - Page load time: <1s (with content)
    - User complaints: <1% of readings
```

**Qualitative Metrics:**

```yaml
User Feedback (Post-Launch):
  - Content feels personal: ≥4/5 stars
  - Advice is helpful: ≥4/5 stars
  - Easy to understand: ≥4.5/5 stars
  - Appropriate tone: ≥4.5/5 stars
  
Expert Assessment:
  - Tarot accuracy: ≥4.5/5 stars
  - Thai language quality: ≥4.5/5 stars
  - Brand alignment: ≥4/5 stars
```

---

### Documentation & Audit Trail

**Required Documentation:**

```
docs/content-quality/
├── generation-log.md              # Generation process log
├── automated-validation-results.json  # Gate 1 results
├── tarot-expert-review.csv        # Gate 2 review sheet
├── thai-proofreading-review.csv   # Gate 3 review sheet
├── final-approval-checklist.pdf   # Gate 4 sign-offs
├── revision-history.md            # All revisions made
└── expert-credentials.pdf         # Reviewer qualifications

output/
├── tarot-cards-generated.json     # Original AI output
├── tarot-cards-reviewed.json      # Post-review version
└── tarot-cards-approved.json      # Production-ready version
```

**Version Control:**

```bash
# All content changes tracked in git
git log --follow content/tarot-cards.json

# Review comments in PR
GitHub PR #123: Content Quality Review - 78 Tarot Cards
├─ Gate 1: Automated checks ✅
├─ Gate 2: Tarot expert review ✅
├─ Gate 3: Thai proofreading ✅
└─ Gate 4: Final approval ✅
```

---

### Post-Deployment Monitoring

**Ongoing Quality Checks:**

```yaml
Week 1-2 Post-Launch:
  - Monitor user feedback (support tickets, reviews)
  - Track bounce rates on reading result pages
  - Analyze time-on-page for interpretations
  - Collect qualitative feedback via surveys
  
Month 1:
  - Review analytics: which cards most/least viewed
  - Identify content improvement opportunities
  - Plan content refinement iteration (if needed)
  
Quarterly:
  - Content quality audit (sample 20 cards)
  - Update content based on user feedback
  - Refine based on new tarot insights
```

**Success Criteria (Post-Launch):**

- ✅ <1% user complaints about content accuracy
- ✅ Reading completion rate ≥80%
- ✅ Average time-on-page ≥2 minutes (indicating engagement)
- ✅ No viral negative feedback on social media
- ✅ Expert community feedback positive

---

### Continuous Improvement

**Feedback Loop:**

```mermaid
graph LR
    A[User Feedback] --> B[Content Analysis]
    B --> C{Quality Issue?}
    C -->|Yes| D[Identify Root Cause]
    C -->|No| E[Archive Feedback]
    
    D --> F[Plan Improvement]
    F --> G[Update Content]
    G --> H[Re-run Quality Gates]
    H --> I[Deploy Update]
    I --> A
    
    style A fill:#6B46C1,color:#fff
    style G fill:#F59E0B,color:#000
    style I fill:#10B981,color:#fff
```

**Content Update Policy:**

- **Minor updates** (typos, grammar): Direct fix → Quick review → Deploy
- **Major updates** (meaning changes): Full quality gate process
- **Quarterly reviews**: Systematic improvement of 10-15 cards
- **Emergency fixes**: Fast-track process for critical inaccuracies

---

## Coding Standards

### Critical Fullstack Rules

**Project-Specific Standards (AI agents must follow):**

- **Type Sharing:** Always define types in `packages/shared` and import from there. Never duplicate type definitions.

- **API Calls:** Never make direct HTTP calls with `fetch`. Always use the service layer (`lib/api/*`).

- **Environment Variables:** Access only through config objects. Never use `process.env` directly in components.
  ```typescript
  // Good
  import { config } from '@/lib/config';
  const apiUrl = config.supabaseUrl;
  
  // Bad
  const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  ```

- **Error Handling:** All API routes must use the standard error handler. Never throw raw errors.
  ```typescript
  // Good
  return handleApiError(error);
  
  // Bad
  throw new Error('Something went wrong');
  ```

- **State Updates:** Never mutate state directly. Use proper state management patterns (Zustand, React setState).

- **Database Queries:** Always use Prisma ORM. Never write raw SQL except for migrations.

- **Authentication:** Always validate auth on protected routes. Check both middleware and RLS.

- **Image Optimization:** Always use Next.js `Image` component. Never use `<img>` tags.

- **Async/Await:** Prefer async/await over promises. Always handle errors with try/catch.

### Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| **Components** | PascalCase | - | `UserProfile.tsx` |
| **Hooks** | camelCase with 'use' | - | `useAuth.ts` |
| **API Routes** | - | kebab-case | `/api/user-profile` |
| **Database Tables** | - | snake_case | `user_profiles` |
| **Functions** | camelCase | camelCase | `getUserProfile()` |
| **Constants** | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| **Types/Interfaces** | PascalCase | PascalCase | `UserProfile` |
| **Files** | kebab-case or PascalCase | kebab-case | `user-profile.ts` or `UserProfile.tsx` |

### Code Style

**ESLint + Prettier enforced:**
- Indent: 2 spaces
- Quotes: Single quotes
- Semicolons: Yes
- Trailing commas: es5
- Max line length: 100 characters

**TypeScript:**
- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Explicit return types for functions
- No unused variables

---

## Error Handling Strategy

### Error Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Service
    participant DB
    participant Sentry

    Client->>API: Request
    API->>Service: Call business logic
    Service->>DB: Query
    
    alt Success
        DB-->>Service: Data
        Service-->>API: Result
        API-->>Client: 200 OK
    else Database Error
        DB-->>Service: Error
        Service->>Sentry: Log with context
        Service-->>API: DatabaseError
        API->>API: Format error response
        API-->>Client: 500 Error
        Client->>Client: Show user-friendly message
    end
```

### Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;           // ERROR_CODE
    message: string;        // User-friendly message (Thai)
    details?: Record<string, any>;  // Additional context
    timestamp: string;      // ISO 8601
    requestId: string;      // For tracing
  };
}
```

### Frontend Error Handling

```typescript
// lib/api/client.ts
export async function apiCall<T>(endpoint: string, options?: ApiOptions): Promise<T> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method: options?.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      // Log to Sentry with user context
      Sentry.captureException(error, {
        tags: { endpoint, method: options?.method || 'GET' },
      });
      
      // Show user-friendly message
      showToast({
        title: 'เกิดข้อผิดพลาด',
        message: error.message,
        type: 'error',
      });
      
      throw error;
    }
    
    // Network error
    throw new Error('ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่อีกครั้ง');
  }
}
```

### Backend Error Handling

```typescript
// app/api/middleware/error.ts
export function handleApiError(error: unknown): NextResponse {
  // Log to Sentry
  Sentry.captureException(error);

  // Database errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: { code: 'DUPLICATE_ENTRY', message: 'ข้อมูลซ้ำ' } },
        { status: 409 }
      );
    }
    // ... other Prisma errors
  }

  // Validation errors (Zod)
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'ข้อมูลไม่ถูกต้อง',
          details: error.errors 
        } 
      },
      { status: 400 }
    );
  }

  // Authentication errors
  if (error.message === 'Authentication required') {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'กรุณาเข้าสู่ระบบ' } },
      { status: 401 }
    );
  }

  // Generic error
  return NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' } },
    { status: 500 }
  );
}
```

---

## Monitoring and Observability

### Monitoring Stack

**Services:**
- **Frontend Monitoring:** Vercel Analytics (Web Vitals)
- **Backend Monitoring:** Vercel Functions Logs
- **Error Tracking:** Sentry (client + server)
- **Performance Monitoring:** Sentry Performance
- **User Analytics:** Google Analytics 4, Meta Pixel, Hotjar

### Key Metrics

**Frontend Metrics:**
- Core Web Vitals (LCP, FID, CLS)
- JavaScript errors (count, rate, affected users)
- API response times (from client perspective)
- User interactions (clicks, scrolls, form submissions)

**Backend Metrics:**
- Request rate (requests/minute)
- Error rate (errors/total requests %)
- Response time (p50, p95, p99)
- Database query performance (slow queries >1s)

**Business Metrics:**
- Reading created (daily, 3-card)
- User signups (by method)
- Reading shares (by platform)
- Conversion funnel (landing → reading → signup)

### Alerting

**Critical Alerts (PagerDuty or Slack):**
- Error rate >5% for 5 minutes
- Response time p95 >1s for 10 minutes
- Database connection errors
- Authentication service down

**Warning Alerts (Slack only):**
- Error rate >2% for 15 minutes
- Response time p95 >500ms for 30 minutes
- Unusual traffic spike (3x normal)

---

## Future Architecture Considerations

### Overview

This section outlines architectural considerations for post-MVP phases based on the Product Roadmap (see `docs/product-roadmap.md`). The MVP (Phases 1) focuses on 2 spreads, while Phases 2-5 expand to 18 total spreads with premium features.

### Phase 2-5 Roadmap Integration

**18-Spread Strategy Summary:**

| Phase | Timeline | Spreads | Tier | Business Goal |
|-------|----------|---------|------|---------------|
| **Phase 1 (MVP)** | Weeks 1-12 | 2 spreads | Guest | Validate PMF |
| **Phase 2** | Weeks 13-18 | 3 spreads | Login | Drive signups |
| **Phase 3** | Weeks 19-26 | 4 spreads | Premium | Monetization |
| **Phase 4** | Weeks 27-36 | 9 spreads | Premium | Complete portfolio |
| **Phase 5** | Month 10+ | 2 spreads | Premium+ | Innovation |
| **Total** | 9 months | **18 spreads** | Mixed | Market leadership |

**Architectural Accommodations:**

#### **1. Database Schema Extensions**

**Current Schema (MVP):**
```prisma
enum ReadingType {
  daily        // 1 card
  three_card   // 3 cards (Past-Present-Future)
}
```

**Extended Schema (Phases 2-5):**
```prisma
enum ReadingType {
  // Phase 1 (MVP) - Guest Tier
  daily
  three_card
  
  // Phase 2 - Login Tier (3 spreads)
  love_relationship        // 3 cards
  career_money            // 3 cards
  yes_no                  // 1 card
  
  // Phase 3 - Premium Tier (4 spreads)
  celtic_cross            // 10 cards - comprehensive life reading
  horseshoe               // 7 cards - specific question deep dive
  relationship_deep_dive  // 7 cards - relationship analysis
  career_path             // 5 cards - career guidance
  
  // Phase 4 - Premium Tier (9 spreads)
  year_ahead              // 12 cards (monthly forecast)
  decision_making         // 7 cards (choice evaluation)
  spiritual_growth        // 5 cards (spiritual journey)
  chakra_alignment        // 7 cards (energy centers)
  shadow_work             // 6 cards (shadow self exploration)
  life_purpose            // 9 cards (life path discovery)
  relationship_compatibility  // 6 cards (partnership)
  manifestation           // 5 cards (goal achievement)
  healing_journey         // 8 cards (emotional healing)
  
  // Phase 5 - Innovation
  ai_guided               // Variable - AI-powered custom spread
  custom_spread           // Variable - user-defined positions
}
```

**New Table for Spread Configurations:**

```prisma
model SpreadConfiguration {
  id                String      @id @default(uuid()) @db.Uuid
  reading_type      ReadingType @unique
  card_count        Int         // Number of cards in spread
  position_labels   String[]    // Array of position names
  description_th    String      @db.Text
  description_en    String      @db.Text
  tier              Tier        // Access control
  price_credits     Int         @default(0)  // Cost in credits (premium)
  is_active         Boolean     @default(true)
  sort_order        Int         // Display order
  icon_name         String?     // UI icon reference
  
  @@map("spread_configurations")
  @@index([tier])
  @@index([is_active])
}

enum Tier {
  guest          // Free access (Daily, 3-Card)
  login          // Requires account (Love, Career, Yes/No)
  premium        // Requires subscription (13 premium spreads)
}
```

**Benefits:**
- Dynamic spread management (add/remove without code changes)
- Easy to enable/disable spreads
- Flexible pricing (credits-based)
- Configuration-driven UI

#### **2. Payment System Architecture (Phase 3)**

**New Integration: Stripe API**

**Required Components:**

```typescript
// New API routes
/api/stripe/
├── checkout/session     # Create checkout session
├── webhook              # Handle Stripe webhooks
├── subscription/status  # Check subscription status
└── billing-portal       # Customer portal redirect

// New database models
model Subscription {
  id                String   @id @default(uuid())
  user_id           String   @db.Uuid
  stripe_customer_id String  @unique
  stripe_subscription_id String @unique
  status            SubscriptionStatus
  plan_id           String   // premium_monthly, premium_yearly
  current_period_end DateTime
  cancel_at_period_end Boolean @default(false)
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  
  user              User @relation(fields: [user_id], references: [id])
}

enum SubscriptionStatus {
  active
  canceled
  past_due
  trialing
  incomplete
}

model CreditTransaction {
  id         String   @id @default(uuid())
  user_id    String   @db.Uuid
  amount     Int      // Positive for purchase, negative for usage
  type       TransactionType
  reading_type ReadingType?  // Which spread used credits
  created_at DateTime @default(now())
  
  user       User @relation(fields: [user_id], references: [id])
}

enum TransactionType {
  purchase      // Bought credits
  subscription  // Monthly/yearly allowance
  usage         // Used for reading
  refund        // Refunded
}
```

**Pricing Model (Reference):**
- Free tier: Daily + 3-Card (unlimited)
- Login tier: +3 spreads (Love, Career, Yes/No) - unlimited
- Premium tier: All 18 spreads
  - Monthly: ฿199/month
  - Yearly: ฿1,990/year (17% discount)
  - Or credits: ฿10-50 per premium spread (pay-as-you-go)

#### **3. AI Enhancement Architecture (Phase 5)**

**Enhanced Anthropic Integration:**

**Use Cases:**
1. **AI-Guided Custom Spreads:** AI analyzes question, suggests spread type
2. **Contextualized Interpretations:** AI tailors interpretation to user's question
3. **Follow-up Guidance:** AI provides additional insights based on reading
4. **Conversational Interface:** Chat with AI about reading results

**New API Routes:**

```typescript
/api/ai/
├── analyze-question     # Suggest best spread for question
├── enhance-interpretation  # Add personalized context
├── follow-up           # Get follow-up guidance
└── chat                # Conversational AI about reading
```

**Cost Considerations:**
- Input tokens: ~500-1,000 per request
- Output tokens: ~300-800 per request
- Cost per AI-enhanced reading: ฿3-8
- Only for premium users (included in subscription)

**Rate Limiting:**
- Premium users: 50 AI requests/day
- Throttle to prevent abuse
- Cache common questions/answers

#### **4. Scalability Considerations**

**When to Consider Microservices:**

**Triggers:**
- Monthly Active Users (MAU) > 100K
- Database size > 50GB
- API response time degradation (p95 > 500ms)
- Need for independent scaling of services

**Potential Service Boundaries:**

```
Monolith (MVP-Phase 2) → Microservices (Phase 3+)

┌──────────────────────────┐         ┌──────────────┐
│  Next.js Monolith        │         │  Frontend    │
│  (Frontend + Backend)    │   -->   │  (Next.js)   │
└──────────────────────────┘         └──────┬───────┘
                                            │
                                            ├─► Reading Service (Node.js)
                                            ├─► User Service (Node.js)
                                            ├─► Payment Service (Node.js)
                                            ├─► AI Service (Python/Node.js)
                                            └─► Content Service (Node.js)
```

**Migration Strategy:**
1. Extract reading creation logic → separate service
2. Extract user management → separate service
3. Keep frontend in Next.js (BFF pattern)
4. Use API Gateway (Kong or AWS API Gateway)
5. Event-driven communication (Kafka or RabbitMQ)

**Timeline:** Not before Month 12 (after achieving product-market fit)

---

## Checklist Results Report

**Note:** This architecture document provides comprehensive technical direction for implementing all 4 epics (55 user stories) from the PRD. The following checklist validates architecture completeness.

### Architecture Completeness: 95%

**Sections Completed:**
- ✅ Introduction & Background
- ✅ High Level Architecture
- ✅ Tech Stack (definitive 40+ technologies)
- ✅ Data Models (6 entities with relationships)
- ✅ API Specification (20+ REST endpoints, OpenAPI 3.0)
- ✅ Components (11 major components with diagrams)
- ✅ External APIs (8 services integration)
- ✅ Core Workflows (3 sequence diagrams)
- ✅ Database Schema (Prisma + SQL DDL + RLS policies)
- ✅ Frontend Architecture (Component structure, state management)
- ✅ Backend Architecture (Serverless, repository pattern)
- ✅ Project Structure (Complete monorepo layout)
- ✅ Development Workflow (Setup, commands, environment)
- ✅ Deployment Architecture (Vercel + Supabase, CI/CD)
- ✅ Security & Performance (CSP, rate limiting, Web Vitals)
- ✅ Testing Strategy (Unit, integration, E2E with examples)
- ✅ Coding Standards (Critical rules, naming conventions)
- ✅ Error Handling (Standard error format, flows)
- ✅ Monitoring & Observability (Metrics, alerting)

### Coverage Analysis

**PRD Requirements Coverage:**

| Epic | Stories | Architecture Coverage | Status |
|------|---------|----------------------|--------|
| **Epic 1** | 15 stories | Components, API, DB schema, workflows | ✅ 100% |
| **Epic 2** | 15 stories | Auth architecture, RLS, user management | ✅ 100% |
| **Epic 3** | 13 stories | Share API, SEO schema, encyclopedia | ✅ 100% |
| **Epic 4** | 12 stories | Preferences, favorites, personalization | ✅ 100% |

**All 55 user stories have architecture support** ✅

### Technical Readiness

**Developer Readiness:**
- ✅ Can start implementation immediately
- ✅ All tech stack decisions finalized
- ✅ Database schema ready for Prisma migrate
- ✅ API contracts defined (OpenAPI spec)
- ✅ Component structure clear
- ✅ Authentication flow documented
- ✅ Testing strategy with examples
- ✅ Deployment pipeline defined

**Missing Elements (5%):**
- ⚠️ **Source Tree Documentation:** Detailed file-by-file breakdown (can be generated during development)
- ⚠️ **Performance Benchmarks:** Actual load testing results (requires implementation first)
- ⚠️ **Disaster Recovery Plan:** Detailed backup/restore procedures (can be added post-MVP)

### Recommendations

**Immediate Next Steps:**
1. **Review & Approve:** Stakeholders review this architecture document
2. **Setup Infrastructure:** Create Supabase project, Vercel project
3. **Initialize Repository:** Setup monorepo with pnpm workspaces
4. **Database Setup:** Run Prisma migrations, seed 78 tarot cards
5. **Start Development:** Begin Epic 1 implementation (Story 1.1)

**Future Architecture Enhancements:**
- Add Redis caching layer (when scale requires)
- Implement CDN strategy for card images (Cloudflare/BunnyCDN)
- Add real-time features (Supabase Realtime subscriptions)
- Microservices consideration (if traffic >100K MAU)

### Architecture Approval

**Status:** ✅ **READY FOR IMPLEMENTATION**

This architecture document provides:
- ✅ Complete technical direction for all 4 epics
- ✅ Clear implementation guidelines for AI agents
- ✅ Validated tech stack choices with rationale
- ✅ Security and performance best practices
- ✅ Comprehensive testing strategy
- ✅ Production-ready deployment plan

**Estimated Implementation Timeline:**
- Epic 1 (Foundation): 2-3 weeks
- Epic 2 (Auth & History): 2 weeks
- Epic 3 (Social & SEO): 2 weeks
- Epic 4 (Personalization): 1-2 weeks
- **Total:** 7-9 weeks for full MVP

**Team can proceed with development.**

---

## Document History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-30 | 1.0 | Complete fullstack architecture document | Winston (Architect) |

---

**End of Architecture Document**  
**Total Pages:** ~100+ pages (when printed)  
**Word Count:** ~15,000 words  
**Diagrams:** 10+ Mermaid diagrams  
**Code Examples:** 50+ code snippets  

---