# External APIs

This section documents all external API integrations required by the application. Each service provides critical functionality for authentication, storage, analytics, monitoring, or deployment.

## Supabase API

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

## Google Analytics 4 (GA4) API

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

## Meta Pixel API

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

## Hotjar API

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

## Sentry API

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

## Vercel Platform APIs

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

## Google OAuth API

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

## Facebook OAuth API

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

## Anthropic Claude API

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
