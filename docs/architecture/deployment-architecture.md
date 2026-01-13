# Deployment Architecture

## Deployment Strategy

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

## CI/CD Pipeline

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

## Environments

| Environment | Frontend URL | Backend URL | Purpose | Database |
|-------------|--------------|-------------|---------|----------|
| **Development** | http://localhost:3000 | http://localhost:3000/api | Local dev | Local or Supabase dev |
| **Staging** | https://staging.tarot-app.vercel.app | Same (monolithic) | Pre-production testing | Supabase staging |
| **Production** | https://tarot-app.com | Same (monolithic) | Live environment | Supabase production |

---
