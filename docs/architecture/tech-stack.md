# Tech Stack

This is the **DEFINITIVE technology selection** for the entire project. All development must use these exact versions and tools. This table serves as the single source of truth for the technology stack.

## Technology Stack Table

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
