# Analytics & Monitoring Setup Guide

This guide explains how to set up all analytics and monitoring tools for the Tarot Reading App.

## 📋 Required Accounts & Credentials

You need to create accounts for the following services and obtain their credentials:

### 1. Google Analytics 4 (GA4)

**Purpose:** Track user behavior, page views, and custom events

**Setup Steps:**

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

**Free Tier:** Unlimited (completely free)

### 2. Meta Pixel (Facebook/Instagram)

**Purpose:** Track conversions for future ad campaigns

**Setup Steps:**

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create a new Pixel
3. Get your Pixel ID (format: 16-digit number)
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXX
   ```

**Free Tier:** Unlimited (completely free)

### 3. Hotjar

**Purpose:** Session recordings and heatmaps

**Setup Steps:**

1. Go to [Hotjar](https://www.hotjar.com/)
2. Create a new site
3. Get your Site ID (format: 7-digit number)
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_HOTJAR_ID=XXXXXXX
   ```

**Free Tier:** 35 daily sessions

### 4. Sentry

**Purpose:** Error tracking and monitoring

**Setup Steps:**

1. Go to [Sentry](https://sentry.io/)
2. Create a new project (select "Next.js")
3. Get your DSN (format: `https://xxx@xxx.ingest.sentry.io/xxx`)
4. Get your Organization slug and Project name
5. Create an Auth Token (for source maps upload)
6. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   SENTRY_ORG=your-org-slug
   SENTRY_PROJECT=your-project-name
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

**Free Tier:** 5,000 errors/month

### 5. Vercel Analytics

**Purpose:** Web Vitals and performance monitoring

**Setup Steps:**

- Already included! No configuration needed
- Automatically enabled on Vercel deployments
- View analytics in Vercel Dashboard

**Free Tier:** Included with Vercel hobby plan

---

## 📝 Environment Variables Template

Create a `.env.local` file in `apps/web/` with:

```bash
# ============================================================================
# DATABASE (from Story 1.2)
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# ============================================================================
# ANALYTICS (Story 1.3)
# ============================================================================
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Meta Pixel (Facebook/Instagram)
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXX

# Hotjar
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX

# ============================================================================
# ERROR TRACKING (Story 1.3)
# ============================================================================
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=tarot-app
SENTRY_AUTH_TOKEN=your-auth-token
```

---

## 🔧 Vercel Deployment Configuration

When deploying to Vercel, add all environment variables in the Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add each variable from above
3. Select environments: Production, Preview, Development
4. Save and redeploy

---

## ✅ Testing Your Analytics Setup

### 1. Test in Development (Local)

Analytics are **disabled** in development by default. You'll see console logs instead:

```bash
pnpm dev
# Navigate around the app
# Check console for: [GA4 Dev] Pageview: /
```

### 2. Test in Production

Deploy to Vercel and test:

#### Google Analytics 4:

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) extension
2. Visit your production site
3. Check browser console for GA4 events
4. Or go to GA4 → Reports → Realtime → See your visit

#### Meta Pixel:

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper) extension
2. Visit your production site
3. Click the extension icon → Should show "PageView" event

#### Hotjar:

1. Go to Hotjar Dashboard
2. Navigate to Recordings
3. Visit your site → Session should appear within 1-2 minutes

#### Sentry:

1. Trigger a test error (see below)
2. Check Sentry Dashboard → Issues

```typescript
// Add temporary test button
<button onClick={() => { throw new Error('Test Sentry Error'); }}>
  Test Error
</button>
```

#### Vercel Analytics:

1. Go to Vercel Dashboard → Your Project → Analytics
2. Should see Web Vitals data after a few page views

---

## 📊 Using Analytics in Your Code

### Track Page Views (Automatic)

Page views are tracked automatically by the `GoogleAnalytics` component in the root layout.

### Track Custom Events

```typescript
import { useAnalytics } from '@/lib/hooks';

function MyComponent() {
  const { trackReadingStarted, track } = useAnalytics();

  const handleStartReading = () => {
    // Pre-defined event
    trackReadingStarted('daily', true);

    // Or custom event
    track('button_clicked', { button_name: 'start_reading' });
  };

  return <button onClick={handleStartReading}>Start Reading</button>;
}
```

### Track Errors

```typescript
import { useAnalytics } from '@/lib/hooks';

function MyComponent() {
  const { trackError } = useAnalytics();

  try {
    // ... some code
  } catch (error) {
    trackError(error as Error, 'MyComponent');
  }
}
```

---

## 🍪 Cookie Consent (PDPA Compliance)

The cookie consent banner will appear on first visit:

- If user **accepts**: All analytics are enabled
- If user **declines**: All tracking is disabled
- Choice is stored in `localStorage`

Users can change their preference by clearing their browser's localStorage.

---

## 🎯 Available Pre-defined Events

From `useAnalytics()` hook:

- `trackReadingStarted(type, hasQuestion)`
- `trackCardSelected(name, position, isReversed)`
- `trackReadingCompleted(type, id, duration)`
- `trackCtaClicked(buttonName, page)`
- `trackShareInitiated(readingId, platform)`
- `trackReadingSaved(readingId, type)`
- `trackReadingDeleted(readingId, type)`
- `trackCardFlipped(name, position)`
- `trackCardDetailsViewed(name, slug)`

---

## 🔒 Privacy & Security

- All analytics scripts load **only in production**
- Analytics require **user consent** (PDPA compliant)
- Hotjar: Text and media are **masked** by default
- Sentry: Session replays mask all sensitive data
- No tracking cookies without consent

---

## 🐛 Troubleshooting

### Analytics not tracking in production

1. Check environment variables are set in Vercel
2. Check browser console for errors
3. Verify cookie consent was accepted
4. Check GA4 DebugView for real-time events

### Sentry not capturing errors

1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set
2. Check Sentry Dashboard → Project Settings → Client Keys
3. Ensure error occurred in production environment

### Vercel Analytics not showing data

1. Analytics data can take 1-2 hours to appear
2. Ensure you're on the correct Vercel project
3. Check that the deployment was successful

---

## 📚 Documentation Links

- [Google Analytics 4 Docs](https://developers.google.com/analytics/devguides/collection/ga4)
- [Meta Pixel Docs](https://developers.facebook.com/docs/meta-pixel)
- [Hotjar Docs](https://help.hotjar.com/hc/en-us)
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Analytics Docs](https://vercel.com/docs/analytics)

---

## ✨ What's Next?

All analytics infrastructure is ready! Events will be tracked automatically once you:

1. Add the environment variables to `.env.local`
2. Deploy to Vercel (or build locally with `NODE_ENV=production`)
3. Accept the cookie consent banner
4. Navigate the app and trigger events

**Note:** Actual event tracking in reading flows will be implemented in Stories 1.7-1.8.
