# Monitoring and Observability

## Monitoring Stack

**Services:**
- **Frontend Monitoring:** Vercel Analytics (Web Vitals)
- **Backend Monitoring:** Vercel Functions Logs
- **Error Tracking:** Sentry (client + server)
- **Performance Monitoring:** Sentry Performance
- **User Analytics:** Google Analytics 4, Meta Pixel, Hotjar

## Key Metrics

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

## Alerting

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
