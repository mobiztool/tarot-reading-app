# Security and Performance

## Security Requirements

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

## Performance Optimization

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
