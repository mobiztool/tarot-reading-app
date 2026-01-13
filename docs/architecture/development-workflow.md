# Development Workflow

## Local Development Setup

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

## Environment Configuration

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
