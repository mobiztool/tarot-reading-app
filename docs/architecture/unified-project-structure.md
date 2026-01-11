# Unified Project Structure

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
