# Production Launch Checklist - Tarot Platform

**Version:** 1.0  
**Date:** 2026-01-18  
**Status:** PRE-LAUNCH

---

## Overview

This checklist must be completed before the GO/NO-GO decision for production launch. All items marked with ⚠️ are **BLOCKERS** - launch cannot proceed until resolved.

---

## 1. Technical Excellence

### 1.1 Application Functionality

- [ ] ⚠️ All 18 spreads functional and tested
- [ ] ⚠️ All 4 subscription tiers working correctly
- [ ] ⚠️ Payment system processing successfully
- [ ] ⚠️ User authentication working
- [ ] ⚠️ Reading history saved correctly
- [ ] AI interpretations generating (VIP)
- [ ] PDF export working (Pro+)
- [ ] Pattern analysis working (VIP)
- [ ] Premium dashboard functional

### 1.2 Testing

- [ ] ⚠️ All E2E tests passing
- [ ] ⚠️ All unit tests passing
- [ ] ⚠️ All integration tests passing
- [ ] Code coverage >85%
- [ ] No critical linting errors

### 1.3 Performance

- [ ] ⚠️ Home page load < 1.5s
- [ ] ⚠️ Reading pages load < 2s
- [ ] ⚠️ API response time < 300ms
- [ ] Lighthouse Performance score > 80
- [ ] No memory leaks detected
- [ ] Database queries optimized

### 1.4 Security

- [ ] ⚠️ No secrets in client-side code
- [ ] ⚠️ All API endpoints authenticated
- [ ] ⚠️ RLS policies enforced
- [ ] ⚠️ Stripe webhook signatures verified
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Input validation on all forms

---

## 2. Infrastructure

### 2.1 Vercel Deployment

- [ ] ⚠️ Production environment created
- [ ] ⚠️ Custom domain configured
- [ ] ⚠️ SSL certificate valid
- [ ] Environment variables set:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] STRIPE_SECRET_KEY
  - [ ] STRIPE_WEBHOOK_SECRET
  - [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - [ ] STRIPE_PRICE_ID_BASIC
  - [ ] STRIPE_PRICE_ID_PRO
  - [ ] STRIPE_PRICE_ID_VIP
  - [ ] ANTHROPIC_API_KEY

### 2.2 Database (Supabase)

- [ ] ⚠️ Production database provisioned
- [ ] ⚠️ All migrations applied
- [ ] ⚠️ RLS policies enabled
- [ ] Connection pooling configured
- [ ] Backup strategy enabled
- [ ] Point-in-time recovery enabled

### 2.3 Stripe (Payment)

- [ ] ⚠️ Live mode enabled
- [ ] ⚠️ Products created (Basic, Pro, VIP)
- [ ] ⚠️ Prices configured (THB)
- [ ] ⚠️ Webhook endpoint registered
- [ ] ⚠️ Webhook events subscribed:
  - [ ] checkout.session.completed
  - [ ] customer.subscription.created
  - [ ] customer.subscription.updated
  - [ ] customer.subscription.deleted
  - [ ] invoice.paid
  - [ ] invoice.payment_failed

### 2.4 CDN & Assets

- [ ] Card images optimized and served
- [ ] Fonts loading correctly
- [ ] Animations loading correctly
- [ ] Cache headers configured

---

## 3. Monitoring & Observability

### 3.1 Error Tracking

- [ ] ⚠️ Sentry configured for production
- [ ] Source maps uploaded
- [ ] Alert notifications configured
- [ ] Error rate thresholds set

### 3.2 Analytics

- [ ] Google Analytics 4 configured
- [ ] Conversion tracking set up:
  - [ ] Sign up
  - [ ] Subscription purchase
  - [ ] Reading completed
- [ ] Meta Pixel configured (if using)

### 3.3 Performance Monitoring

- [ ] Vercel Analytics enabled
- [ ] Core Web Vitals tracked
- [ ] Performance alerts configured

### 3.4 Logging

- [ ] Application logs accessible
- [ ] Error logs centralized
- [ ] Audit logs for sensitive actions

---

## 4. Content & Localization

### 4.1 Thai Language

- [ ] ⚠️ All UI text in Thai
- [ ] ⚠️ All spread descriptions in Thai
- [ ] ⚠️ All card interpretations in Thai
- [ ] Error messages in Thai
- [ ] Email templates in Thai

### 4.2 Content Quality

- [ ] All interpretations reviewed
- [ ] No placeholder text remaining
- [ ] Images display correctly
- [ ] Links work correctly

---

## 5. Legal & Compliance

### 5.1 Legal Documents

- [ ] ⚠️ Terms of Service published
- [ ] ⚠️ Privacy Policy published
- [ ] Refund Policy published
- [ ] Disclaimer for tarot readings

### 5.2 Compliance

- [ ] Thai e-commerce regulations reviewed
- [ ] PDPA compliance verified
- [ ] Cookie consent banner (if required)
- [ ] Age verification (if required)

### 5.3 Payment Compliance

- [ ] Clear pricing displayed
- [ ] Subscription terms clear
- [ ] Cancellation process documented
- [ ] Refund process documented

---

## 6. Operational Readiness

### 6.1 Team Preparation

- [ ] Support email configured
- [ ] On-call schedule defined
- [ ] Escalation procedures documented
- [ ] Team trained on platform

### 6.2 Documentation

- [ ] User help/FAQ pages ready
- [ ] Internal runbook created
- [ ] Incident response plan documented
- [ ] Contact information updated

### 6.3 Rollback Plan

- [ ] Rollback procedure documented
- [ ] Previous version available
- [ ] Database rollback tested
- [ ] Communication plan ready

---

## 7. Launch Communication

### 7.1 Pre-Launch

- [ ] Internal announcement prepared
- [ ] Beta user communication ready
- [ ] Social media posts scheduled

### 7.2 Launch Day

- [ ] Launch announcement ready
- [ ] Support team on standby
- [ ] Monitoring dashboards open
- [ ] Communication channels active

### 7.3 Post-Launch

- [ ] Success metrics defined
- [ ] Review meeting scheduled
- [ ] Feedback collection plan

---

## 8. Final Verification

### 8.1 Smoke Tests on Production

Run these tests after deployment to production:

```bash
# Homepage loads
curl -I https://your-domain.com

# API health (if endpoint exists)
curl https://your-domain.com/api/health

# Pricing page loads
curl -I https://your-domain.com/pricing

# Login page loads
curl -I https://your-domain.com/login
```

### 8.2 Manual Verification

- [ ] Create test account
- [ ] Complete free reading
- [ ] View premium gate
- [ ] Navigate all pages
- [ ] Test on mobile device

---

## 9. Go/No-Go Decision

### 9.1 Approval Matrix

| Role | Approver | Approved | Date |
|------|----------|----------|------|
| QA Lead | Quinn | [ ] | |
| Product Owner | Sarah | [ ] | |
| Tech Lead | | [ ] | |
| Legal | | [ ] | |

### 9.2 Decision

**Launch Decision:** ⏳ PENDING

**Launch Date/Time:** TBD

**Deployment Window:** TBD

---

## 10. Post-Launch Monitoring (First 24-48 Hours)

### 10.1 Critical Metrics to Watch

- [ ] Error rate < 0.1%
- [ ] Response time < 500ms (p95)
- [ ] Successful signups occurring
- [ ] Successful payments processing
- [ ] No critical alerts

### 10.2 Checkpoints

| Time | Check | Status |
|------|-------|--------|
| Launch + 15min | Quick smoke test | ⏳ |
| Launch + 1hr | Error rate check | ⏳ |
| Launch + 4hr | Full metrics review | ⏳ |
| Launch + 24hr | Daily report | ⏳ |
| Launch + 48hr | Stability confirmed | ⏳ |

---

## Appendix: Emergency Contacts

| Role | Name | Contact |
|------|------|---------|
| Tech Lead | | |
| DevOps | | |
| Product Owner | Sarah | |
| QA Lead | Quinn | |

---

**Checklist Version:** 1.0  
**Last Updated:** 2026-01-18

---

*This checklist is part of Story 9.6 - Phase 4 Complete Testing & Final QA*
