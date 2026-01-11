# Web App ดูดวงไพ่ยิปซี - Product Roadmap

**Document Version:** 1.0  
**Last Updated:** January 7, 2026  
**Owner:** John (Product Manager)  
**Status:** Planning Phase

---

## Executive Summary

This document outlines the product roadmap for the Tarot Reading Web App following the MVP launch (Epic 1-4). The roadmap is based on the **18-Spread Strategy** developed during brainstorming sessions and aligned with business goals of building the most comprehensive tarot platform in the Thai market.

**Vision:** สร้าง spiritual wellness platform ที่ครบถ้วนที่สุดในประเทศไทย โดยเริ่มจาก tarot reading แล้วขยายไปสู่ holistic spiritual experience

**Strategy:** Phased rollout across 5 phases (MVP + 4 post-MVP phases) delivering 18 tarot spreads with clear value ladder from Guest → Login → Premium tiers

---

## Roadmap Overview

### Timeline Summary

| Phase | Duration | Focus | Deliverables | Status |
|-------|----------|-------|--------------|--------|
| **Phase 1: MVP** | Weeks 1-12 | Foundation + 2 Guest Spreads | Epic 1-4 (See PRD) | 🟢 In Progress |
| **Phase 2: Login Tier** | Weeks 13-18 | 3 Login Spreads + Auth Enhancement | 3 new spreads | 🔵 Planned |
| **Phase 3: Premium Launch** | Weeks 19-26 | Payment + 4 Premium Spreads | Monetization engine | 🔵 Planned |
| **Phase 4: Premium Expansion** | Weeks 27-36 | 9 Premium Spreads + Features | Complete 18-spread portfolio | 🔵 Planned |
| **Phase 5: Innovation** | Month 10+ | AI Features + Moonshots | Next-gen experience | 🟡 Exploration |

**Total Timeline:** 9 months for complete 18-spread platform

---

## 🎴 18-Spread Strategy Overview

### Distribution & Business Model

**Guest Mode (2 spreads - 11%):**
- Daily Card (1 card)
- Past-Present-Future (3 cards)
- **Goal:** Product sampling, validate PMF
- **Revenue:** $0 (user acquisition)

**Free Login (3 spreads - 17%):**
- Love & Relationships (3 cards)
- Career & Money (3 cards)
- Yes/No Question (1 card)
- **Goal:** Strong signup incentive, increase retention
- **Revenue:** $0 (conversion to paid pipeline)

**Premium (13 spreads - 72%):**
- All advanced spreads (Celtic Cross, Year Ahead, Zodiac Wheel, etc.)
- **Goal:** Justify premium subscription value
- **Revenue:** ฿99-399/month × subscribers

### Value Ladder

```
Guest (Free) → 2 spreads
    ↓ Signup incentive: 3 additional spreads
Login (Free) → 5 spreads total
    ↓ Premium upgrade: 13 additional spreads + unlimited readings
Premium (Paid) → 18 spreads total + AI features + export + no ads
```

**Conversion Funnel:**
- Guest → Login: Expected 20-30% conversion
- Login → Premium: Expected 5-10% conversion
- Overall Guest → Premium: 1-3% (industry standard)

---

## Phase 1: MVP (Weeks 1-12) ✅ SEE PRD

**Status:** In Progress (Epic 1-4 execution)

**Deliverables:**
- Epic 1: Foundation & Core Reading Experience (2 spreads)
- Epic 2: User Account & Reading History
- Epic 3: Social Sharing & Content Discovery
- Epic 4: Personalization & Enhanced UX

**Reference:** See `docs/prd.md` for complete Epic 1-4 details with 55 user stories

**Success Criteria:**
- 100 beta users testing MVP
- <1s page load time achieved
- 80% reading completion rate
- 20% signup conversion rate

**Post-MVP Decision Gate:**
- ✅ If PMF validated → Proceed to Phase 2
- ⚠️ If PMF unclear → Iterate on MVP, delay Phase 2
- ❌ If PMF failed → Pivot or cancel

---

## Phase 2: Login Tier Expansion (Weeks 13-18)

**Status:** Planned  
**Duration:** 6 weeks  
**Team:** 2 developers, 1 content writer

### Objectives

1. **Add 3 Login-Tier Spreads** - Strengthen signup incentive
2. **Enhance Authentication Experience** - Make signup/login seamless
3. **Improve Retention** - Deliver clear value to free users

### Deliverables

#### Epic 5: Login Tier Spreads

**Goal:** เพิ่มฟีเจอร์พิเศษ 3 spreads สำหรับ free login users เพื่อสร้าง strong incentive ให้ guest users สมัครสมาชิก

**User Stories (8 stories):**

1. **Story 5.1: Love & Relationships Spread (3 cards)**
   - Positions: You, The Other Person, Relationship Energy
   - Use case: ปัญหาความรัก, ความสัมพันธ์
   - Target: Universal appeal - ทุกคนสนใจเรื่องรัก

2. **Story 5.2: Career & Money Spread (3 cards)**
   - Positions: Current Situation, Challenge/Opportunity, Outcome
   - Use case: งานและการเงิน, การตัดสินใจอาชีพ
   - Target: คนทำงานเครียด (primary target)

3. **Story 5.3: Yes/No Question Spread (1 card)**
   - Quick answer format with clear interpretation
   - Use case: คำถามด่วนที่ต้องการคำตอบชัดเจน
   - Target: Decision-makers, คนที่ต้องการความแน่นอน

4. **Story 5.4: Spread Access Control & Feature Gating**
   - Implement authentication checks for login-only spreads
   - Show "Login to unlock" prompts for guest users
   - Smooth upgrade flow from guest to login

5. **Story 5.5: Enhanced Signup Value Proposition**
   - Update landing page: highlight 3 login-exclusive spreads
   - Add spread previews in signup flow
   - "Unlock 3 more spreads" messaging

6. **Story 5.6: Login Tier Content Creation**
   - Write interpretations for 3 new spreads
   - Position-specific meanings (9 positions total)
   - Quality assurance via 4-gate process

7. **Story 5.7: Spread Usage Analytics**
   - Track which spreads most popular
   - Conversion metrics: guest → login via spread interest
   - Retention: do login users come back?

8. **Story 5.8: Phase 2 Testing & QA**
   - Test new spreads functionality
   - Verify access control working
   - Performance: ensure <1s load with 5 spreads

**Timeline:** 5-6 weeks  
**Effort:** ~20-25 story points

### Success Metrics

- ✅ 3 new spreads live and functional
- ✅ Signup conversion increases from 20% → 30-35%
- ✅ Login user retention ≥30% (7-day)
- ✅ Love & Relationships spread = most popular login spread
- ✅ Zero P0 bugs in production

### Budget

- Development: 6 weeks × 2 devs (in-house)
- Content: ฿2,000-3,000 (9 positions × 3 spreads + QA)
- Analytics: Free (existing tools)
- **Total:** ~฿2,000-3,000 (mostly content costs)

---

## Phase 3: Premium Launch (Weeks 19-26)

**Status:** Planned  
**Duration:** 8 weeks  
**Team:** 2 developers, 1 designer, 1 content writer, 1 payment specialist

### Objectives

1. **Launch Premium Subscription System** - Enable monetization
2. **Deliver First 4 Premium Spreads** - Most popular/requested
3. **Create Premium User Experience** - Justify subscription value

### Deliverables

#### Epic 6: Payment & Subscription System

**Goal:** เปิดตัวระบบ subscription 3 tiers พร้อม payment gateway เพื่อเริ่มสร้างรายได้

**Key Features:**

**Subscription Tiers:**
- **Basic:** ฿99/month - 8 spreads (5 login + 3 premium basic)
- **Pro:** ฿199/month - 13 spreads (5 login + 8 premium)
- **VIP:** ฿399/month - All 18 spreads + AI features + priority support

**User Stories (12 stories):**

1. Stripe integration (payment gateway)
2. Subscription management (create, update, cancel)
3. Feature gating by subscription tier
4. Pricing page with tier comparison
5. Checkout flow (seamless payment experience)
6. Subscription success/failure handling
7. Invoice generation and email receipts
8. Subscription analytics and metrics
9. Free trial (7 days) for first-time subscribers
10. Upgrade/downgrade flow between tiers
11. Cancellation flow with retention offers
12. Payment testing & security QA

**Timeline:** 3-4 weeks  
**Effort:** ~35-40 story points

#### Epic 7: Premium Spreads Batch 1 (4 Spreads)

**Goal:** ส่งมอบ premium spreads ที่ถูกเลือกจาก user demand และ market research

**Spreads to Launch:**

1. **Celtic Cross (10 cards)** ⭐⭐⭐
   - Classic, most requested spread
   - Comprehensive life reading
   - Target: Serious practitioners

2. **Decision Making (5 cards)** ⭐⭐
   - Choose between 2 options
   - Practical decision support
   - Target: Career professionals

3. **Self Discovery (5 cards)** ⭐⭐
   - Personal growth journey
   - Understanding oneself
   - Target: Spiritual seekers

4. **Relationship Deep Dive (7 cards)** ⭐⭐
   - In-depth relationship analysis
   - Beyond simple love reading
   - Target: Couples, serious relationships

**User Stories (10 stories):**

1. Celtic Cross spread implementation (10-card layout)
2. Decision Making spread (2-option comparison)
3. Self Discovery spread (inner journey)
4. Relationship Deep Dive spread (complex relationship)
5. Premium spread layouts (responsive designs)
6. Complex position interpretations (30+ positions total)
7. Premium content creation & QA (via 4-gate process)
8. Premium UI enhancements (special animations, premium badge)
9. Spread recommendation engine (suggest spread based on question)
10. Phase 3 testing & QA

**Timeline:** 3-4 weeks  
**Effort:** ~30-35 story points

### Success Metrics

- ✅ Payment system operational with ≥99% uptime
- ✅ 50-100 paying subscribers within first month
- ✅ MRR (Monthly Recurring Revenue): ฿5,000-15,000
- ✅ Celtic Cross = most popular premium spread
- ✅ Subscription churn rate <10%/month
- ✅ Average subscription lifetime ≥3 months

### Budget

- Stripe fees: 3.65% + ฿11 per transaction
- Development: 8 weeks × 2 devs (in-house)
- Premium content: ฿8,000-12,000 (30+ positions + QA)
- Legal: ฿5,000-10,000 (terms, payment policies)
- **Total:** ~฿15,000-25,000 (plus Stripe fees from revenue)

---

## Phase 4: Premium Portfolio Completion (Weeks 27-36)

**Status:** Planned  
**Duration:** 10 weeks  
**Team:** 2 developers, 1 content writer

### Objectives

1. **Complete 18-Spread Portfolio** - Deliver remaining 9 premium spreads
2. **Advanced Features** - AI interpretation, export to PDF
3. **Community Features** - User engagement and retention

### Deliverables

#### Epic 8: Premium Spreads Batch 2 (5 Spreads)

**Spreads:**

1. **Shadow Work (7 cards)** ⭐⭐⭐ - Psychology depth
2. **Chakra Alignment (7 cards)** ⭐⭐ - Energy balance
3. **Friendship Reading (4 cards)** ⭐ - Social relationships
4. **Career Path (6 cards)** ⭐⭐ - Career planning
5. **Financial Abundance (5 cards)** ⭐⭐ - Wealth & prosperity

**Timeline:** 3-4 weeks  
**Effort:** ~25-30 story points

#### Epic 9: Premium Spreads Batch 3 (4 Spreads)

**Spreads:**

1. **Monthly Forecast (4 cards)** ⭐ - Monthly planning
2. **Year Ahead (13 cards)** ⭐⭐⭐ - Annual forecast
3. **Elemental Balance (4 cards)** ⭐⭐ - Four elements
4. **Zodiac Wheel (12 cards)** ⭐⭐⭐ - Astrological houses

**Timeline:** 3-4 weeks  
**Effort:** ~30-35 story points

#### Epic 10: Advanced Premium Features

**Features:**

1. **AI-Powered Personalized Interpretations**
   - Use Anthropic Claude API for contextualized readings
   - Analyze user's question + drawn cards → personalized advice
   - Premium tier exclusive feature

2. **Reading Export to PDF**
   - Beautiful PDF generation with card images
   - Include full interpretation and user's notes
   - Shareable and printable format

3. **Reading Comparison & Patterns**
   - Compare multiple readings over time
   - Identify recurring cards or themes
   - Pattern insights: "The Fool appears often in your readings"

4. **Spread Recommendation Engine**
   - Suggest appropriate spread based on user's question
   - ML-based recommendation from usage patterns
   - Help users discover new spreads

5. **Premium User Dashboard**
   - Advanced statistics: most common cards, reading frequency, growth insights
   - Visualization: charts, graphs, card distribution
   - Personal tarot journey timeline

**Timeline:** 3 weeks  
**Effort:** ~25-30 story points

### Success Metrics

- ✅ All 18 spreads operational
- ✅ 200-500 paying subscribers
- ✅ MRR: ฿20,000-80,000
- ✅ Premium features adoption: ≥40% of premium users use AI interpretation
- ✅ PDF export: ≥20% of premium users export readings
- ✅ Subscriber satisfaction: ≥4.5/5 stars

### Budget

- Development: 10 weeks × 2 devs (in-house)
- Content: ฿15,000-20,000 (remaining 9 spreads)
- AI API costs: ฿500-2,000/month (based on usage)
- **Total:** ~฿17,000-25,000 (plus ongoing AI costs)

---

## Phase 5: Innovation & Expansion (Month 10+)

**Status:** Exploration Phase  
**Duration:** Ongoing  
**Team:** Variable based on features

### Objectives

1. **Next-Generation Experience** - Voice, AR, AI Coach
2. **Platform Expansion** - Beyond tarot to holistic spiritual wellness
3. **Community Building** - User-generated content and engagement

### Potential Features

#### Moonshot 1: Voice-Activated Tarot Reading 🎤

**Description:**
- Voice input: Ask question verbally in Thai
- Voice output: AI responds with interpretation in mystical voice
- Natural conversation flow

**Technology:**
- Speech-to-text: Google Cloud Speech API (Thai language)
- AI interpretation: Anthropic Claude API
- Text-to-speech: Google Cloud TTS with custom voice

**Effort Estimate:** 8-12 weeks  
**Cost Estimate:** ฿50,000-100,000 (development + API costs)

**Business Case:**
- Unique differentiator (no competitors have this)
- Accessibility: users while driving, doing chores
- Premium feature: VIP tier exclusive
- Viral potential: shareable voice readings

**Risk Assessment:**
- 🟡 Medium risk: Thai voice recognition accuracy
- 🟡 Medium risk: Voice synthesis quality
- 🟢 Low risk: Technology exists, integration challenge only

---

#### Moonshot 2: AR Tarot Card Experience 📱

**Description:**
- AR mode: View 3D tarot cards in real world via phone camera
- Place cards on your desk/table
- Interactive: flip, arrange, study cards in AR

**Technology:**
- AR framework: ARKit (iOS), ARCore (Android)
- 3D models: Cards as 3D objects
- Platform: React Native or native apps required

**Effort Estimate:** 12-16 weeks  
**Cost Estimate:** ฿100,000-200,000 (native app development)

**Business Case:**
- Viral marketing: users share AR experience videos
- Next-level UX: immersive, memorable
- PR opportunity: first tarot AR app in Thailand
- Premium feature: Pro/VIP tier exclusive

**Risk Assessment:**
- 🔴 High risk: Requires native app development (not web)
- 🟡 Medium risk: Performance on mid-range devices
- 🟡 Medium risk: High development cost vs uncertain ROI

**Recommendation:** 
- Wait until platform mature (1,000+ paying users)
- Start with web 3D preview, gauge interest
- Partner with AR agency if pursuing

---

#### Moonshot 3: Personalized AI Tarot Coach 🤖

**Description:**
- AI coach learns from user's reading history
- Provides personalized guidance and insights
- Tracks personal growth journey over time
- Weekly insights and recommendations

**Technology:**
- AI: Anthropic Claude API with user context
- Vector database: Store reading embeddings for pattern recognition
- Recommendation engine: ML-based personalization

**Effort Estimate:** 10-14 weeks  
**Cost Estimate:** ฿80,000-150,000 (development + AI infrastructure)

**Business Case:**
- Transform from tool → ongoing relationship
- High retention: daily/weekly engagement
- Premium feature: VIP tier exclusive
- Upsell opportunity: ฿599-799/month "Coach Plan"

**Risk Assessment:**
- 🟡 Medium risk: AI accuracy and personalization quality
- 🟡 Medium risk: Data privacy concerns (storing personal readings for analysis)
- 🟢 Low risk: Technology feasible with Claude API

**Recommendation:**
- Start after Phase 4 complete (need user data for training)
- Pilot with 20-50 VIP users
- Iterate based on feedback

---

#### Feature 4: Community Platform 👥

**Description:**
- Forum/community space for users
- Share readings publicly (optional)
- Discussion boards: learning, questions, experiences
- User-generated content

**Technology:**
- Forum software: Discourse (open-source) or custom built
- Moderation tools: automated + manual moderation
- Integration: SSO with main app

**Effort Estimate:** 8-10 weeks  
**Cost Estimate:** ฿60,000-100,000

**Business Case:**
- Engagement: community increases retention
- Content: user-generated content for SEO
- Support: peer-to-peer help reduces support burden
- Network effects: more users = more value

**Risk Assessment:**
- 🟡 Medium risk: Moderation requires ongoing resources
- 🟡 Medium risk: Negative/inappropriate content management
- 🟢 Low risk: Technology proven (Discourse)

**Recommendation:**
- Launch after 500+ active users (critical mass)
- Start small: Discord server first, then custom platform
- Allocate budget for community manager

---

#### Feature 5: Platform Expansion 🌟

**Beyond Tarot:**

1. **Oracle Cards**
   - Different divination system
   - Easier for beginners
   - 44 cards vs 78 tarot

2. **I-Ching**
   - Chinese divination system
   - Hexagram readings
   - Appeal to Eastern spirituality market

3. **Astrology Integration**
   - Birth chart calculator
   - Daily horoscope
   - Combine with tarot readings

4. **Meditation & Wellness**
   - Guided meditations
   - Spiritual practices
   - Holistic wellness platform

**Timeline:** Phase 6+ (Year 2+)  
**Effort:** Major expansion - each system = 3-6 months

**Business Case:**
- Market expansion: capture broader spiritual/wellness audience
- Diversification: reduce reliance on tarot only
- Cross-sell: users interested in one system often interested in others
- Long-term vision: become #1 spiritual wellness platform in Thailand

---

## Feature Prioritization Framework

### How to Decide What's Next

**Priority Matrix:**

```
High Impact, Low Effort (DO FIRST):
- Phase 2: Login spreads ✅
- Phase 3: Payment system ✅

High Impact, High Effort (DO SECOND):
- Phase 3: Premium spreads batch 1 ✅
- Phase 4: Complete 18-spread portfolio ✅

Low Impact, Low Effort (DO IF TIME):
- Minor UI tweaks
- Additional themes
- Nice-to-have features

Low Impact, High Effort (DON'T DO):
- Complex features without proven demand
- Moonshots without validation
```

### Decision Criteria

**Before adding any feature to roadmap:**

1. **User Demand:** Is there evidence users want this? (feedback, analytics, research)
2. **Business Value:** Does it drive revenue, retention, or acquisition?
3. **Technical Feasibility:** Can we build it with current stack and team?
4. **Resource Availability:** Do we have budget, time, people?
5. **Strategic Alignment:** Does it fit long-term vision?

**Pass 4/5 criteria → Add to roadmap**  
**Pass 3/5 criteria → Consider for future**  
**Pass ≤2/5 criteria → Reject or defer**

---

## Dependencies & Prerequisites

### Phase 2 Prerequisites

**Must Complete Before Phase 2:**
- ✅ Phase 1 (Epic 1-4) complete
- ✅ MVP validated: PMF confirmed, users returning
- ✅ Authentication system stable: no major auth bugs
- ✅ Database schema supports new spreads (extensible design)

### Phase 3 Prerequisites

**Must Complete Before Phase 3:**
- ✅ Phase 2 complete: 5 spreads total (2 guest + 3 login)
- ✅ User base: ≥500 MAU (enough to convert to paid)
- ✅ Login conversion: ≥25% of guests signing up
- ✅ Legal: Terms of Service, Privacy Policy updated for payments
- ✅ Business: Thai company registered, VAT registration (if needed)

### Phase 4 Prerequisites

**Must Complete Before Phase 4:**
- ✅ Phase 3 complete: Payment system working, first paying users
- ✅ Revenue: ≥฿10,000 MRR (proves payment model works)
- ✅ Retention: Premium churn rate <15%/month
- ✅ Content pipeline: Proven we can deliver quality content at scale

### Phase 5 Prerequisites

**Must Complete Before Phase 5 (Moonshots):**
- ✅ All 18 spreads live and proven
- ✅ Revenue: ≥฿50,000 MRR (sustainable business)
- ✅ User base: ≥1,000 paying subscribers
- ✅ Market validation: strong product-market fit
- ✅ Budget: Sufficient runway for R&D investments

---

## Risk Assessment & Contingencies

### Phase 2 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Login spreads don't increase signups | High | A/B test different spreads, survey users |
| Content quality issues | Medium | Reuse 4-gate QA process |
| Timeline slip | Low | Stories well-scoped, buffer time |

### Phase 3 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users won't pay (wrong pricing) | Critical | Free trial, A/B test pricing tiers |
| Payment integration issues | High | Use Stripe (proven), thorough testing |
| Premium spreads insufficient value | High | User research before development |
| Stripe Thailand compliance | Medium | Legal counsel, proper setup |

### Phase 4 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content production bottleneck | High | Hire additional content writers |
| Premium churn too high | High | Improve onboarding, add more value |
| Development velocity slows | Medium | Add 3rd developer or reduce scope |

### Phase 5 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Moonshots don't validate | Critical | Small pilots, user research first |
| High development cost | High | Start with MVP versions, iterate |
| Technology challenges | Medium | POC before full commitment |

---

## Resource Planning

### Team Evolution

**Phase 1 (MVP):** 2 devs + 1 designer + 1 content writer  
**Phase 2:** 2 devs + 1 content writer  
**Phase 3:** 2 devs + 1 designer + 1 content writer + 1 payment specialist  
**Phase 4:** 2-3 devs + 1-2 content writers  
**Phase 5:** 3-4 devs + specialists (voice/AR/AI)

### Budget Evolution

**Phase 1:** ~฿15,000 (mostly content + analytics)  
**Phase 2:** ~฿3,000 (content only)  
**Phase 3:** ~฿25,000 (payment setup + content + legal)  
**Phase 4:** ~฿30,000 (content at scale + AI costs)  
**Phase 5:** ฿50,000-200,000 per moonshot

**Cumulative Budget (Phases 1-4):** ~฿75,000  
**Revenue Target (End of Phase 4):** ฿50,000-100,000 MRR

**Break-even:** Expected Month 5-6 (during Phase 4)

---

## Success Metrics & KPIs

### Phase-by-Phase Targets

**Phase 1 (Month 3):**
- 1,000 MAU
- 20% signup rate
- 80% reading completion

**Phase 2 (Month 4-5):**
- 2,000 MAU
- 30% signup rate
- 30% 7-day retention

**Phase 3 (Month 6-7):**
- 3,000 MAU
- 100 paying subscribers
- ฿10,000 MRR
- 5% conversion to paid

**Phase 4 (Month 8-9):**
- 5,000 MAU
- 300 paying subscribers
- ฿50,000 MRR
- <10% monthly churn

**Phase 5 (Month 10+):**
- 10,000+ MAU
- 500+ paying subscribers
- ฿100,000+ MRR
- Market leadership position

---

## Out of Scope (Not on Roadmap)

### Explicitly Deferred or Rejected

**Mobile Native Apps (iOS/Android):**
- **Rationale:** PWA sufficient for MVP, native apps expensive
- **Reconsider:** If users strongly request native experience
- **Timeline:** Year 2+ if validated

**Live Tarot Reading with Human Experts:**
- **Rationale:** High operational cost, not scalable
- **Reconsider:** If premium tier needs differentiation
- **Timeline:** Exploratory only

**Multi-Language Support (Beyond Thai/English):**
- **Rationale:** Focus on Thai market first
- **Reconsider:** If international demand validated
- **Timeline:** Year 2+ after Thailand success

**Custom Spread Builder:**
- **Rationale:** Complex feature, limited demand initially
- **Reconsider:** After 18 spreads launched, if users request
- **Timeline:** Phase 5 or later

**Tarot Card Sales (Physical Cards):**
- **Rationale:** Different business model, logistics complexity
- **Reconsider:** Partnership opportunity with card printers
- **Timeline:** Not planned

**Video Content Library:**
- **Rationale:** High production cost, uncertain ROI
- **Reconsider:** If content marketing proves highly effective
- **Timeline:** Phase 5 or later

---

## Competitive Strategy

### Market Positioning by Phase

**Phase 1-2:** "Fastest, most beautiful free tarot app in Thailand"  
**Phase 3:** "Premium tarot experience with most spreads available"  
**Phase 4:** "Complete tarot platform - 18 spreads, no one else offers this"  
**Phase 5:** "AI-powered spiritual wellness platform - beyond just tarot"

### Competitive Advantages

**Phase 1:**
- ✅ Speed (<1s load)
- ✅ UX (mystical aesthetic)
- ✅ Free + no login required

**Phase 2:**
- ✅ Free login value (5 spreads vs competitors' 2-3)
- ✅ Smooth signup flow
- ✅ Reading history

**Phase 3:**
- ✅ Multiple subscription tiers (flexibility)
- ✅ 4 premium spreads (Celtic Cross highlight)
- ✅ Professional quality

**Phase 4:**
- ✅ **18 spreads total** - most in Thailand market
- ✅ AI interpretation (premium feature)
- ✅ Export to PDF
- ✅ Pattern insights

**Phase 5:**
- ✅ Voice-activated (unique)
- ✅ AR experience (cutting-edge)
- ✅ AI coach (relationship, not tool)

---

## Go/No-Go Decision Gates

### Gate 1: Proceed to Phase 2?

**Evaluate after Phase 1 complete:**

**GO Criteria (need 4/6):**
- ✅ 500+ MAU achieved
- ✅ 20%+ signup rate
- ✅ 25%+ 7-day retention
- ✅ 3+ NPS (Net Promoter Score)
- ✅ <฿50/month operational costs
- ✅ Zero critical technical debt

**NO-GO Triggers:**
- ❌ <200 MAU (insufficient traction)
- ❌ <10% signup rate (weak value proposition)
- ❌ >50% bug rate (quality issues)

**Decision Maker:** PM + Stakeholders

---

### Gate 2: Proceed to Phase 3 (Payment)?

**Evaluate after Phase 2 complete:**

**GO Criteria (need 5/7):**
- ✅ 1,000+ MAU
- ✅ 30%+ signup rate (login value proven)
- ✅ 30%+ 7-day retention
- ✅ User survey: 60%+ would pay for premium
- ✅ At least ฿10,000 revenue from donations/tips (if offered)
- ✅ Legal ready: Thai business entity, payment processing
- ✅ Sufficient cash runway: ≥3 months

**NO-GO Triggers:**
- ❌ Low retention (<20%) - fix retention first
- ❌ Users say "would never pay" in surveys
- ❌ Cash runway <2 months

**Decision Maker:** PM + Finance + Stakeholders

---

### Gate 3: Proceed to Phase 4 (Expansion)?

**Evaluate after Phase 3 first month:**

**GO Criteria (need 4/6):**
- ✅ 50+ paying subscribers
- ✅ ฿5,000+ MRR
- ✅ <15% monthly churn
- ✅ Premium user satisfaction ≥4/5
- ✅ Payment system stable (no major issues)
- ✅ Positive ROI trajectory

**NO-GO Triggers:**
- ❌ <20 subscribers (weak demand)
- ❌ >25% churn (value proposition weak)
- ❌ Major payment/billing issues

**Alternative:** Pivot to different monetization or pricing model

---

### Gate 4: Proceed to Phase 5 (Moonshots)?

**Evaluate after Phase 4 complete:**

**GO Criteria (need 5/7):**
- ✅ 500+ paying subscribers
- ✅ ฿50,000+ MRR (sustainable business)
- ✅ Market leader position (most spreads in Thailand)
- ✅ Healthy unit economics (LTV > 3× CAC)
- ✅ Strong cash position: ≥6 months runway
- ✅ User demand for advanced features validated
- ✅ Team capacity: can allocate R&D resources

**NO-GO Triggers:**
- ❌ Revenue declining or flat
- ❌ High churn (>15%/month)
- ❌ Negative cash flow

**Alternative:** Focus on optimization and growth of existing features

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-07 | 1.0 | Initial Product Roadmap created based on brainstorming v1.0 and PRD; Covers Phase 2-5 post-MVP features | John (PM) |

---

## Appendix: Quick Reference

### All 18 Spreads at a Glance

**Phase 1 (MVP) - 2 spreads:**
1. Daily Card - Guest
2. Past-Present-Future - Guest

**Phase 2 (Login Tier) - 3 spreads:**
3. Love & Relationships - Login
4. Career & Money - Login
5. Yes/No Question - Login

**Phase 3 (Premium Batch 1) - 4 spreads:**
6. Celtic Cross - Premium
7. Decision Making - Premium
8. Self Discovery - Premium
11. Relationship Deep Dive - Premium

**Phase 4a (Premium Batch 2) - 5 spreads:**
9. Shadow Work - Premium
10. Chakra Alignment - Premium
12. Friendship Reading - Premium
13. Career Path - Premium
14. Financial Abundance - Premium

**Phase 4b (Premium Batch 3) - 4 spreads:**
15. Monthly Forecast - Premium
16. Year Ahead - Premium
17. Elemental Balance - Premium
18. Zodiac Wheel - Premium

### Revenue Model Summary

**Free Tier (Guest + Login):**
- 5 spreads accessible
- Monetization: ads (optional), user acquisition
- Goal: Convert to Premium

**Premium Tier (Paid):**
- Basic (฿99/mo): 8 spreads
- Pro (฿199/mo): 13 spreads  
- VIP (฿399/mo): All 18 spreads + AI features

**In-App Purchases (Future):**
- One-time spread unlock: ฿29-49
- Reading packages: ฿99 for 10 readings
- Courses: ฿499-999 for tarot learning

---

*This roadmap is a living document and will be updated based on user feedback, market conditions, and business performance.*

*For MVP details (Phase 1), refer to: `docs/prd.md`*

*For technical implementation, refer to: `docs/architecture.md`*

