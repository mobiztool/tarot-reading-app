# External API Integration Summary

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
