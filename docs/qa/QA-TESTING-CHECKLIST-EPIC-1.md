# QA Testing Checklist: Epic 1 - Foundation & Core Reading Experience

**Epic:** 1 - Foundation & Core Reading Experience  
**Total Stories:** 9 (1.1 - 1.9)  
**QA Engineer:** _____________  
**Testing Date:** _____________  
**Environment:** ☐ Staging  ☐ Production  

---

## 📋 How to Use This Checklist

1. **Test in order** (1.1 → 1.9) - stories have dependencies
2. **Check each box** ✓ as you complete testing
3. **Note bugs** in the "Bugs Found" column with severity (P0/P1/P2)
4. **Sign off** at the end when all tests pass
5. **Escalate** any P0/P1 bugs immediately

---

## Story 1.1: Project Setup & Infrastructure Foundation

### Test Scenarios

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.1-01 | Development server runs | 1. Run `pnpm dev`<br>2. Open http://localhost:3000 | Server starts without errors, page loads | ☐ | |
| 1.1-02 | TypeScript strict mode | 1. Run `pnpm build` | Build completes with no TypeScript errors | ☐ | |
| 1.1-03 | ESLint configuration | 1. Run `pnpm lint` | No ESLint errors | ☐ | |
| 1.1-04 | Tailwind CSS works | 1. Check any page<br>2. Inspect elements | Tailwind classes applied correctly | ☐ | |
| 1.1-05 | Environment variables | 1. Check `.env.example` exists<br>2. Verify `.env.local` configured | All required env vars documented | ☐ | |
| 1.1-06 | Git repository | 1. Run `git status`<br>2. Check `.gitignore` | Git initialized, proper ignore patterns | ☐ | |
| 1.1-07 | pnpm workspace | 1. Run `pnpm install`<br>2. Check `pnpm-workspace.yaml` | Monorepo structure working | ☐ | |
| 1.1-08 | Vercel deployment | 1. Check Vercel dashboard<br>2. Visit production URL | Project deployed, accessible online | ☐ | |
| 1.1-09 | Custom color theme | 1. Inspect Tailwind config<br>2. Check purple/blue/gold colors | Custom colors available and used | ☐ | |
| 1.1-10 | README documentation | 1. Open README.md<br>2. Follow setup instructions | Instructions clear and complete | ☐ | |

**Story 1.1 Sign-off:** ☐ All tests passing  
**Tester:** _____________ **Date:** _____________

---

## Story 1.2: Database Schema & Supabase Integration

### Test Scenarios

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.2-01 | Supabase connection | 1. Check Supabase project<br>2. Test database connection | Connection successful | ☐ | |
| 1.2-02 | Prisma schema | 1. Check `prisma/schema.prisma`<br>2. Verify tables defined | Cards, Readings, ReadingCards tables exist | ☐ | |
| 1.2-03 | Cards table | 1. Run query: `SELECT COUNT(*) FROM cards`<br>2. Check structure | 78 cards total, all fields present | ☐ | |
| 1.2-04 | Readings table | 1. Create test reading via API<br>2. Query readings table | Reading saved correctly | ☐ | |
| 1.2-05 | Reading_cards table | 1. Check reading_cards entries<br>2. Verify foreign keys | Junction table works, relationships intact | ☐ | |
| 1.2-06 | Card data seeded | 1. Query cards: `SELECT * FROM cards LIMIT 10`<br>2. Check Thai and English names | All 78 cards have data, both languages | ☐ | |
| 1.2-07 | Prisma client works | 1. Test API route: GET /api/cards<br>2. Check response | Returns card data via Prisma | ☐ | |
| 1.2-08 | Database indexes | 1. Check query performance<br>2. Verify indexes in schema | Queries fast (< 100ms) | ☐ | |
| 1.2-09 | Connection pooling | 1. Multiple concurrent requests<br>2. Monitor connections | No connection errors | ☐ | |
| 1.2-10 | CRUD operations | 1. Create reading<br>2. Read reading<br>3. Update reading<br>4. Delete reading | All operations work | ☐ | |

**Story 1.2 Sign-off:** ☐ All tests passing  
**Tester:** _____________ **Date:** _____________

---

## Story 1.3: Analytics & Monitoring Setup

### Test Scenarios

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.3-01 | GA4 integration | 1. Open production site<br>2. Check GA4 DebugView | Page views tracked | ☐ | |
| 1.3-02 | Custom events | 1. Complete a reading<br>2. Check GA4 Events | reading_completed event tracked | ☐ | |
| 1.3-03 | Meta Pixel | 1. Check page source<br>2. Look for Meta Pixel code | Pixel installed (if configured) | ☐ | |
| 1.3-04 | Hotjar integration | 1. Check production site<br>2. Verify Hotjar script | Hotjar tracking (production only) | ☐ | |
| 1.3-05 | Vercel Analytics | 1. Open Vercel dashboard<br>2. Check Analytics tab | Web Vitals data showing | ☐ | |
| 1.3-06 | Sentry error tracking | 1. Trigger test error<br>2. Check Sentry dashboard | Error captured and logged | ☐ | |
| 1.3-07 | Dev vs Prod tracking | 1. Check localhost (dev)<br>2. Verify analytics disabled | Analytics only in production | ☐ | |
| 1.3-08 | Cookie consent | 1. Visit site first time<br>2. Check for consent banner | Banner shows (PDPA compliance) | ☐ | |
| 1.3-09 | Async script loading | 1. Check page source<br>2. Verify async/defer attributes | Scripts don't block rendering | ☐ | |
| 1.3-10 | Event tracking works | 1. Click buttons<br>2. Complete actions<br>3. Check GA4 | All events tracked correctly | ☐ | |

**Story 1.3 Sign-off:** ☐ All tests passing  
**Tester:** _____________ **Date:** _____________

---

## Story 1.4: Landing Page & Core Layout

### Test Scenarios

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.4-01 | Landing page loads | 1. Navigate to `/`<br>2. Check page loads | Home page displays within 1s | ☐ | |
| 1.4-02 | Hero section | 1. View hero section<br>2. Read headline and description | Value proposition clear in Thai | ☐ | |
| 1.4-03 | CTA button | 1. Click "เริ่มดูดวง" button<br>2. Verify navigation | Redirects to /reading page | ☐ | |
| 1.4-04 | Dark mode UI | 1. Check background colors<br>2. Verify purple theme | Dark mystical aesthetic | ☐ | |
| 1.4-05 | Mobile responsive | 1. Resize to mobile (< 768px)<br>2. Check layout | Layout adapts, readable on mobile | ☐ | |
| 1.4-06 | Desktop responsive | 1. View on desktop (> 1024px)<br>2. Check layout | Optimal desktop layout | ☐ | |
| 1.4-07 | Navigation header | 1. Check header<br>2. Click logo and menu items | Logo, menu items work | ☐ | |
| 1.4-08 | Footer | 1. Scroll to footer<br>2. Check links | Copyright, links present | ☐ | |
| 1.4-09 | SEO meta tags | 1. View page source<br>2. Check `<head>` tags | Title, description, OG tags present | ☐ | |
| 1.4-10 | Accessibility | 1. Tab through page<br>2. Test screen reader | Keyboard nav works, ARIA labels | ☐ | |
| 1.4-11 | Page performance | 1. Run Lighthouse<br>2. Check score | Performance > 90, LCP < 1s | ☐ | |

**Story 1.4 Sign-off:** ☐ All tests passing  
**Tester:** _____________ **Date:** _____________

---

## Story 1.5: Card Data Model & Image Assets

### Test Scenarios

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.5-01 | All 78 cards exist | 1. Query: `SELECT COUNT(*) FROM cards`<br>2. Check result | Returns 78 | ☐ | |
| 1.5-02 | Major Arcana complete | 1. Query: `WHERE arcana = 'major'`<br>2. Count results | 22 Major Arcana cards | ☐ | |
| 1.5-03 | Minor Arcana complete | 1. Query: `WHERE arcana = 'minor'`<br>2. Count results | 56 Minor Arcana cards (14×4 suits) | ☐ | |
| 1.5-04 | Card images load | 1. View any card on site<br>2. Check image displays | Image loads quickly, high quality | ☐ | |
| 1.5-05 | Image optimization | 1. Check image formats<br>2. Verify sizes | WebP format, optimized sizes | ☐ | |
| 1.5-06 | Thai card names | 1. View cards in Thai<br>2. Check translations | All cards have Thai names | ☐ | |
| 1.5-07 | Card meanings | 1. Select random card<br>2. Check meaning displayed | Upright and reversed meanings | ☐ | |
| 1.5-08 | Image paths correct | 1. Check image URLs<br>2. Verify no broken images | All images load (no 404s) | ☐ | |
| 1.5-09 | Card back image | 1. View face-down card<br>2. Check card back | Card back image displays | ☐ | |
| 1.5-10 | Next.js Image optimization | 1. Inspect card images<br>2. Check if using Next Image | Uses `<Image>` component, responsive | ☐ | |

**Story 1.5 Sign-off:** ☐ All tests passing  
**Tester:** _____________ **Date:** _____________

---

## Story 1.6: Card Shuffle & Random Selection Logic

### Test Scenarios

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.6-01 | Shuffle API works | 1. Call POST /api/shuffle<br>2. Check response | Returns random cards | ☐ | |
| 1.6-02 | Daily reading (1 card) | 1. Request 1 card<br>2. Verify response | Returns exactly 1 card | ☐ | |
| 1.6-03 | 3-card spread | 1. Request 3 cards<br>2. Verify response | Returns exactly 3 unique cards | ☐ | |
| 1.6-04 | No duplicate cards | 1. Request 10 cards multiple times<br>2. Check each draw | No duplicates within single draw | ☐ | |
| 1.6-05 | Randomness quality | 1. Draw 100 times<br>2. Check distribution | Cards distributed fairly (not always same) | ☐ | |
| 1.6-06 | Reversed card logic | 1. Draw multiple times<br>2. Check reversed flag | ~50% cards reversed | ☐ | |
| 1.6-07 | Cards from full deck | 1. Check card IDs returned<br>2. Verify from 78 cards | All cards can appear | ☐ | |
| 1.6-08 | API error handling | 1. Send invalid request<br>2. Check error response | Returns appropriate error message | ☐ | |
| 1.6-09 | Performance | 1. Time shuffle requests<br>2. Check response time | < 100ms response time | ☐ | |
| 1.6-10 | Stateless (no session) | 1. Multiple requests<br>2. No authentication needed | Works for anonymous users | ☐ | |

**Story 1.6 Sign-off:** ☐ All tests passing  
**Tester:** _____________ **Date:** _____________

---

## Story 1.7: Daily Reading Flow (1 Card)

### Test Scenarios - Desktop

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.7-01 | Navigate to daily reading | 1. From home, click "ดูดวงประจำวัน" | Navigate to /reading/daily | ☐ | |
| 1.7-02 | Question input (optional) | 1. Enter question: "วันนี้จะเป็นอย่างไร?"<br>2. Leave blank also works | Optional field works | ☐ | |
| 1.7-03 | Draw card button | 1. Click "ดึงไพ่" or "เริ่มดูดวง" | Button triggers card draw | ☐ | |
| 1.7-04 | Card animation | 1. Watch card reveal<br>2. Check flip animation | Smooth flip animation (no jank) | ☐ | |
| 1.7-05 | Card displays | 1. After draw<br>2. Check card image visible | Card image loads, large and clear | ☐ | |
| 1.7-06 | Card name shown | 1. Check card name<br>2. Verify Thai name | Thai card name displayed | ☐ | |
| 1.7-07 | Upright interpretation | 1. Draw upright card<br>2. Read interpretation | Upright meaning shown in Thai | ☐ | |
| 1.7-08 | Reversed interpretation | 1. Draw reversed card<br>2. Read interpretation | Reversed meaning shown, card upside down | ☐ | |
| 1.7-09 | Save reading (guest) | 1. Complete reading as guest<br>2. Check if saved | Guest reading not saved (expected) | ☐ | |
| 1.7-10 | Draw another card | 1. Click "ดูดวงใหม่"<br>2. Draw again | Can draw new card, different result | ☐ | |

### Test Scenarios - Mobile (< 768px)

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.7-11 | Mobile layout | 1. Open on mobile device<br>2. Check layout | Vertical layout, readable | ☐ | |
| 1.7-12 | Touch interactions | 1. Tap "ดึงไพ่" button<br>2. Swipe gestures (if any) | Touch responsive, smooth | ☐ | |
| 1.7-13 | Card size on mobile | 1. View card on mobile<br>2. Check readability | Card large enough, clear | ☐ | |
| 1.7-14 | No horizontal scroll | 1. Check mobile view<br>2. Try scrolling horizontally | No horizontal scroll needed | ☐ | |

**Story 1.7 Sign-off:** ☐ All tests passing  
**Tester:** _____________ **Date:** _____________

---

## Story 1.8: Three Card Spread Flow (3 Cards)

### Test Scenarios - Desktop

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.8-01 | Navigate to 3-card | 1. From home or /reading<br>2. Select "3 ใบ" spread | Navigate to /reading/three-card | ☐ | |
| 1.8-02 | Question input | 1. Enter question (optional)<br>2. Check placeholder text | Optional question field works | ☐ | |
| 1.8-03 | Draw 3 cards | 1. Click "ดึงไพ่"<br>2. Watch card reveal | 3 cards draw sequentially | ☐ | |
| 1.8-04 | Sequential animation | 1. Watch reveal<br>2. Time animation | Cards reveal one by one (~0.5s delay) | ☐ | |
| 1.8-05 | All 3 cards unique | 1. Check 3 cards drawn<br>2. Verify no duplicates | All 3 cards different | ☐ | |
| 1.8-06 | Position labels | 1. View 3 cards<br>2. Check position labels | "อดีต", "ปัจจุบัน", "อนาคต" or similar | ☐ | |
| 1.8-07 | Card 1 interpretation | 1. Read first card meaning | Interpretation shows with position context | ☐ | |
| 1.8-08 | Card 2 interpretation | 1. Read second card meaning | Interpretation shows with position context | ☐ | |
| 1.8-09 | Card 3 interpretation | 1. Read third card meaning | Interpretation shows with position context | ☐ | |
| 1.8-10 | Combined summary | 1. Scroll to summary section<br>2. Read overall reading | Summary combines all 3 cards | ☐ | |
| 1.8-11 | Save reading (guest) | 1. Complete as guest<br>2. Check save prompt | Prompt to sign up to save | ☐ | |
| 1.8-12 | Draw new reading | 1. Click "ดูดวงใหม่"<br>2. Verify new draw | New 3 cards drawn, different | ☐ | |

### Test Scenarios - Mobile

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.8-13 | Mobile 3-card layout | 1. Open on mobile<br>2. View 3 cards | Cards stack vertically, clear | ☐ | |
| 1.8-14 | Mobile scroll | 1. Scroll through reading<br>2. Check all content visible | Smooth scroll, all content accessible | ☐ | |
| 1.8-15 | Touch responsive | 1. Tap all interactive elements | All buttons/taps work | ☐ | |

**Story 1.8 Sign-off:** ☐ All tests passing  
**Tester:** _____________ **Date:** _____________

---

## Story 1.9: Reading Type Selection UI

### Test Scenarios

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| 1.9-01 | Reading selection page | 1. Navigate to /reading<br>2. View available spreads | Spread selection page displays | ☐ | |
| 1.9-02 | Daily reading card | 1. Find "ดูดวงประจำวัน" card<br>2. Check description | Card shows with description | ☐ | |
| 1.9-03 | 3-card spread card | 1. Find "ไพ่ 3 ใบ" card<br>2. Check description | Card shows with description | ☐ | |
| 1.9-04 | Card images/icons | 1. Check spread cards<br>2. Verify visual appeal | Each spread has icon or preview image | ☐ | |
| 1.9-05 | Hover states | 1. Hover over spread cards<br>2. Check visual feedback | Hover effect shows (scale, shadow) | ☐ | |
| 1.9-06 | Click to navigate | 1. Click daily reading card<br>2. Click 3-card card | Navigate to respective spread | ☐ | |
| 1.9-07 | Locked spreads (if any) | 1. Check for premium spreads<br>2. Verify lock icons | Premium spreads show lock/badge | ☐ | |
| 1.9-08 | Mobile grid | 1. View on mobile<br>2. Check card layout | Cards stack or grid 2-column | ☐ | |
| 1.9-09 | Back navigation | 1. Navigate to spread<br>2. Click back button | Returns to selection page | ☐ | |
| 1.9-10 | Analytics tracking | 1. Click spread card<br>2. Check GA4 | spread_selected event tracked | ☐ | |

**Story 1.9 Sign-off:** ☐ All tests passing  
**Tester:** _____________ **Date:** _____________

---

## Epic 1 Integration Testing

### Cross-Story Test Scenarios

| # | Test Scenario | Steps | Expected Result | ✓ | Bugs Found |
|---|--------------|-------|-----------------|---|------------|
| E1-01 | Complete user flow | 1. Land on home<br>2. Click "เริ่มดูดวง"<br>3. Select daily reading<br>4. Draw card<br>5. Read interpretation | Complete flow smooth, no errors | ☐ | |
| E1-02 | 3-card complete flow | 1. Home → Reading → 3-card<br>2. Draw cards<br>3. View results | Complete flow smooth | ☐ | |
| E1-03 | Database persistence | 1. Complete reading<br>2. Check database | Reading saved (if logged in) | ☐ | |
| E1-04 | Analytics end-to-end | 1. Complete reading<br>2. Check GA4 Events | All events tracked throughout flow | ☐ | |
| E1-05 | Error handling | 1. Disconnect network<br>2. Try actions<br>3. Reconnect | Graceful error messages, recovery | ☐ | |

**Epic 1 Integration Sign-off:** ☐ All tests passing  
**Tester:** _____________ **Date:** _____________

---

## Browser Compatibility Testing

### Browsers to Test

| Browser | Version | Desktop | Mobile | Daily Reading | 3-Card Spread | Status |
|---------|---------|---------|--------|---------------|---------------|--------|
| Chrome | Latest | ☐ | ☐ | ☐ | ☐ | ☐ Pass |
| Safari | Latest | ☐ | ☐ | ☐ | ☐ | ☐ Pass |
| Firefox | Latest | ☐ | ☐ | ☐ | ☐ | ☐ Pass |
| Edge | Latest | ☐ | ☐ | ☐ | ☐ | ☐ Pass |
| iOS Safari | iOS 16+ | N/A | ☐ | ☐ | ☐ | ☐ Pass |
| Chrome Android | Latest | N/A | ☐ | ☐ | ☐ | ☐ Pass |

---

## Device Testing Matrix

| Device | OS | Screen Size | Daily Reading | 3-Card | Landing Page | Status |
|--------|----|-----------| --------------|--------|--------------|--------|
| iPhone 14 | iOS 17 | 390×844 | ☐ | ☐ | ☐ | ☐ Pass |
| iPhone 12 | iOS 16 | 390×844 | ☐ | ☐ | ☐ | ☐ Pass |
| Samsung S22 | Android 13 | 360×800 | ☐ | ☐ | ☐ | ☐ Pass |
| iPad Pro | iOS 17 | 1024×1366 | ☐ | ☐ | ☐ | ☐ Pass |
| MacBook Pro | macOS | 1440×900 | ☐ | ☐ | ☐ | ☐ Pass |
| Windows PC | Win 11 | 1920×1080 | ☐ | ☐ | ☐ | ☐ Pass |

---

## Performance Testing

| Metric | Target | Actual | ✓ | Notes |
|--------|--------|--------|---|-------|
| Home page load (LCP) | < 1.5s | ___s | ☐ | |
| Daily reading page load | < 1.5s | ___s | ☐ | |
| 3-card page load | < 1.5s | ___s | ☐ | |
| Shuffle API response | < 100ms | ___ms | ☐ | |
| Card image load | < 500ms | ___ms | ☐ | |
| Animation smoothness | 60fps | ___fps | ☐ | |
| Lighthouse Performance | > 90 | ___ | ☐ | |
| Lighthouse Accessibility | > 90 | ___ | ☐ | |

---

## Security Testing

| # | Test | Steps | Expected | ✓ | Notes |
|---|------|-------|----------|---|-------|
| S-01 | No sensitive data exposed | 1. Check page source<br>2. Check API responses | No API keys, secrets visible | ☐ | |
| S-02 | HTTPS enforced | 1. Try http://<br>2. Verify redirect | Redirects to https:// | ☐ | |
| S-03 | API rate limiting | 1. Spam shuffle API<br>2. Check if limited | Rate limit prevents abuse (optional) | ☐ | |
| S-04 | Input sanitization | 1. Enter special characters in question<br>2. Check saved data | XSS prevented, input sanitized | ☐ | |

---

## Bug Summary

### P0 (Critical) Bugs
| Bug # | Story | Description | Status |
|-------|-------|-------------|--------|
| | | | |

### P1 (High) Bugs
| Bug # | Story | Description | Status |
|-------|-------|-------------|--------|
| | | | |

### P2 (Medium) Bugs
| Bug # | Story | Description | Status |
|-------|-------|-------------|--------|
| | | | |

---

## Final Epic 1 Sign-off

### QA Summary
- **Total Tests Executed:** _____ / 85+
- **Tests Passed:** _____
- **Tests Failed:** _____
- **Bugs Found:** P0: ___ | P1: ___ | P2: ___

### Quality Gate Decision

☐ **PASS** - Epic 1 ready for production  
☐ **CONCERNS** - Minor issues, can launch with monitoring  
☐ **FAIL** - Critical issues must be fixed  

**Reason:** _______________________________________

---

### Sign-off

**QA Engineer:** _____________________ **Date:** __________  
**Tech Lead:** _____________________ **Date:** __________  
**Product Owner:** _____________________ **Date:** __________  

---

## Notes / Comments

_____________________________________________________________________

_____________________________________________________________________

_____________________________________________________________________

---

**Document Version:** 1.0  
**Created by:** Quinn (Test Architect)  
**Date:** 2026-01-17  
**Purpose:** Manual QA testing checklist for Epic 1 validation
