# API Integration Best Practices

## 1. **Environment-Based Loading**
```typescript
// Only load analytics in production
if (process.env.NODE_ENV === 'production') {
  loadGoogleAnalytics();
  loadMetaPixel();
  loadHotjar();
}
```

## 2. **Graceful Degradation**
```typescript
try {
  await supabase.auth.signInWithOAuth({ provider: 'google' });
} catch (error) {
  // Fallback to email/password if OAuth fails
  Sentry.captureException(error);
  showErrorMessage('OAuth unavailable, please use email login');
}
```

## 3. **Rate Limit Handling**
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

## 4. **Secret Management**
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

## 5. **Error Monitoring**
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
