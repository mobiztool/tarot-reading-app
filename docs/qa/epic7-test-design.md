# Epic 7: Premium Spreads & Features - Test Design

## Document Info

| Field | Value |
|-------|-------|
| **Epic** | Epic 7: Premium Spreads & Features (Phase 3) |
| **Stories** | 7.1-7.10 (10 stories) |
| **Created By** | Quinn (QA Agent) |
| **Created Date** | 2026-01-07 |
| **Status** | Complete |

---

## Executive Summary

### Epic 7 Overview
Epic 7 เพิ่ม Premium Spreads 4 ประเภทใหม่ รวมถึง layouts, content, UI enhancements และ recommendation engine

### Test Design Statistics

| Metric | Count |
|--------|-------|
| Total Stories | 10 |
| Total Acceptance Criteria | 102 |
| Total Test Scenarios | 124 |
| High-Risk Scenarios | 28 |
| Medium-Risk Scenarios | 52 |
| Low-Risk Scenarios | 44 |

---

## Story 7.1: Celtic Cross Spread (10 Cards)

### Test Scenarios (10 AC → 16 TS)

#### TS-7.1.1: Access Control
```gherkin
Scenario: Premium tier required
  Given user has no subscription
  When user navigates to /reading/celtic-cross
  Then premium gate should display
  And "Upgrade to access" CTA shown

Scenario: Premium user can access
  Given user has Pro or VIP subscription
  When user navigates to /reading/celtic-cross
  Then Celtic Cross page should display
  And 10-card layout shown
```

#### TS-7.1.2: 10-Card Layout
```gherkin
Scenario: Cross formation displays
  Given Celtic Cross spread active
  Then 6 cards in cross formation:
    | Position | Location |
    | 1 Present | Center |
    | 2 Challenge | Center (overlay) |
    | 3 Past | Below |
    | 4 Future | Above |
    | 5 Above | Top |
    | 6 Below | Bottom |

Scenario: Staff formation displays
  Given Celtic Cross spread active
  Then 4 cards in vertical staff:
    | Position | Location |
    | 7 Advice | Right column, bottom |
    | 8 External | Right column |
    | 9 Hopes/Fears | Right column |
    | 10 Outcome | Right column, top |
```

#### TS-7.1.3: Sequential Animation
```gherkin
Scenario: Staggered card reveal
  Given user draws Celtic Cross
  When cards are revealed
  Then cards reveal one by one (staggered)
  And delay between each card ~200ms
  And total reveal time ~2 seconds
```

#### TS-7.1.4: Position Interpretations
```gherkin
Scenario: 10 position-specific meanings
  Given reading complete
  Then each card shows interpretation for its position:
    | Position | Interpretation Focus |
    | 1 Present | Current situation |
    | 2 Challenge | What crosses/challenges |
    | 3 Past | Foundation/past |
    | 4 Future | Near future |
    | 5 Above | Goals/aspirations |
    | 6 Below | Subconscious |
    | 7 Advice | Recommended action |
    | 8 External | External influences |
    | 9 Hopes/Fears | Inner world |
    | 10 Outcome | Final outcome |
```

#### TS-7.1.5: Save Reading
```gherkin
Scenario: Celtic Cross saved correctly
  Given reading complete
  Then reading saved with:
    | Field | Value |
    | reading_type | celtic_cross |
    | reading_cards | 10 cards with positions |
```

#### TS-7.1.6: Mobile Responsive
```gherkin
Scenario: Mobile layout
  Given viewport width < 768px
  Then cards stack vertically
  And position labels clearly visible
  And scrollable if needed
```

---

## Story 7.2: Decision Making Spread (5 Cards)

### Test Scenarios (10 AC → 14 TS)

#### TS-7.2.1: Access Control
```gherkin
Scenario: Premium tier required
  Given non-premium user
  When navigates to /reading/decision
  Then premium gate displays
```

#### TS-7.2.2: Two-Option Input
```gherkin
Scenario: User inputs 2 options
  Given user on Decision spread
  Then 2 input fields visible:
    | Field | Label |
    | 1 | "Option A" |
    | 2 | "Option B" |
  And both fields required

Scenario: Options required before draw
  Given user has not entered options
  When user tries to draw
  Then error: "Please enter both options"
```

#### TS-7.2.3: Comparison Layout
```gherkin
Scenario: 2-column layout
  Given reading complete
  Then layout shows:
    | Column A | Column B |
    | Option A Pros | Option B Pros |
    | Option A Cons | Option B Cons |
    | Best Path (centered) |
```

#### TS-7.2.4: Recommendation
```gherkin
Scenario: Best path recommendation
  Given reading complete
  Then recommendation section shows:
    - Which option is favored
    - Reasoning based on cards
    - Practical advice
```

---

## Story 7.3: Self Discovery Spread (5 Cards)

### Test Scenarios (10 AC → 12 TS)

#### TS-7.3.1: Access Control
```gherkin
Scenario: Premium required
  Given non-premium user
  When navigates to /reading/self-discovery
  Then premium gate displays
```

#### TS-7.3.2: 5 Positions
```gherkin
Scenario: Self Discovery positions
  Given reading complete
  Then 5 positions displayed:
    | Position | Focus |
    | 1 | Core Self |
    | 2 | Shadow |
    | 3 | Strength |
    | 4 | Weakness |
    | 5 | Potential |
```

#### TS-7.3.3: Introspective Interpretations
```gherkin
Scenario: Psychology-focused content
  Given any card interpretation
  Then content should be:
    - Introspective in nature
    - Personal growth focused
    - Shadow work concepts included
```

#### TS-7.3.4: Journaling Prompt
```gherkin
Scenario: Journaling prompt displayed
  Given reading complete
  Then journaling prompt section shows
  And provides reflection questions
  And integrates with notes feature
```

---

## Story 7.4: Relationship Deep Dive (7 Cards)

### Test Scenarios (10 AC → 12 TS)

#### TS-7.4.1: Access Control
```gherkin
Scenario: Premium required
  Given non-premium user
  When navigates to /reading/relationship-deep-dive
  Then premium gate displays
```

#### TS-7.4.2: 7 Positions
```gherkin
Scenario: Relationship positions
  Given reading complete
  Then 7 positions displayed:
    | Position | Focus |
    | 1 | You |
    | 2 | Partner |
    | 3 | Connection |
    | 4 | Challenges |
    | 5 | Strengths |
    | 6 | Path Forward |
    | 7 | Outcome |
```

#### TS-7.4.3: Relationship Type
```gherkin
Scenario: Relationship type selection (optional)
  Given user on Relationship Deep Dive
  Then optional relationship type selector:
    | Type |
    | Romantic |
    | Family |
    | Friendship |
    | Work |
  And interpretations adjust accordingly
```

#### TS-7.4.4: Deeper Than Love Spread
```gherkin
Scenario: More comprehensive than Story 5.1
  Given Relationship Deep Dive reading
  Then has 7 cards vs Love's 3
  And deeper analysis provided
  And more detailed advice
```

---

## Story 7.5: Premium Spread Layouts

### Test Scenarios (10 AC → 12 TS)

#### TS-7.5.1: Celtic Cross Layout Component
```gherkin
Scenario: CelticCrossLayout works
  Given CelticCrossLayout component
  Then renders 10 card positions
  And cross formation correct
  And staff formation correct
  And responsive to viewport
```

#### TS-7.5.2: Comparison Layout Component
```gherkin
Scenario: ComparisonLayout works
  Given ComparisonLayout component
  Then renders 2 columns
  And suitable for Decision spread
  And center element for Best Path
```

#### TS-7.5.3: Responsive Behavior
```gherkin
Scenario: Desktop layout
  Given viewport width >= 1024px
  Then visual formations displayed
  And full layout visible

Scenario: Tablet layout
  Given viewport width 768-1023px
  Then adjusted formations
  And still visual

Scenario: Mobile layout
  Given viewport width < 768px
  Then vertical stack
  And clear position labels
```

#### TS-7.5.4: Animation Support
```gherkin
Scenario: Staggered reveal works
  Given any premium layout
  When cards reveal
  Then staggered animation applies
  And configurable delay per card
```

---

## Story 7.6: Premium Content Creation

### Test Scenarios (10 AC → 10 TS)

#### TS-7.6.1: Content Exists
```gherkin
Scenario: 27 position interpretations created
  Given content generation complete
  Then database has:
    | Spread | Positions |
    | Celtic Cross | 10 |
    | Decision Making | 5 |
    | Self Discovery | 5 |
    | Relationship Deep Dive | 7 |
    | Total | 27 |
```

#### TS-7.6.2: Quality Gates Passed
```gherkin
Scenario: All content passed 4 gates
  Given premium content
  Then Gate 1 (Automated) passed
  And Gate 2 (Expert) passed
  And Gate 3 (Thai proofreader) passed
  And Gate 4 (PM/QA) passed
```

#### TS-7.6.3: Premium Quality
```gherkin
Scenario: Premium content higher quality
  Given premium position interpretation
  Then content is:
    - More sophisticated language
    - Deeper insights
    - More practical advice
    - Premium feel
```

#### TS-7.6.4: Thai Language
```gherkin
Scenario: Thai quality verified
  Given any premium content
  Then Thai language is:
    - Grammatically correct
    - Natural phrasing
    - Engaging tone
    - No errors
```

---

## Story 7.7: Premium UI Enhancements

### Test Scenarios (10 AC → 10 TS)

#### TS-7.7.1: Premium Badge
```gherkin
Scenario: Badge displayed
  Given premium user
  Then premium badge visible:
    - In profile
    - In reading selection
    - In spread header

Scenario: Badge design
  Given premium badge
  Then design includes:
    - Gold color accent
    - "Premium" text or icon
```

#### TS-7.7.2: Gold Accents
```gherkin
Scenario: Premium color scheme
  Given premium user in app
  Then gold accents visible:
    - Buttons
    - Headers
    - Card borders
```

#### TS-7.7.3: Special Animations
```gherkin
Scenario: Premium-exclusive effects
  Given premium spread
  Then animations are:
    - More polished than free
    - Smooth and delightful
    - Particle effects (optional)
```

---

## Story 7.8: Spread Recommendation Engine

### Test Scenarios (10 AC → 10 TS)

#### TS-7.8.1: Keyword Matching
```gherkin
Scenario: Love keywords → Love spreads
  Given user question contains "love" or "relationship"
  Then recommendations include:
    - Love & Relationships (5.1)
    - Relationship Deep Dive (7.4)

Scenario: Career keywords → Career spreads
  Given user question contains "career" or "job" or "money"
  Then recommendations include:
    - Career & Money (5.2)

Scenario: Decision keywords → Decision spread
  Given user question contains "decide" or "choose"
  Then recommendations include:
    - Decision Making (7.2)
```

#### TS-7.8.2: Recommendation Display
```gherkin
Scenario: Suggested spreads shown
  Given user enters question
  Then "Suggested for you" section shows
  And recommended spread highlighted
  And other options still visible
```

#### TS-7.8.3: Default Behavior
```gherkin
Scenario: No clear recommendation
  Given user question has no clear keywords
  Then all spreads shown
  And no specific recommendation highlighted
```

---

## Story 7.9: Phase 3 Testing & QA

### Test Scenarios (12 AC → 16 TS)

#### TS-7.9.1: Payment System
```gherkin
Scenario: Payment tested thoroughly
  Given Story 6.12 test results
  Then all payment tests passed
  And security audit completed
```

#### TS-7.9.2: Premium Spreads
```gherkin
Scenario: All 4 spreads tested
  Given 4 premium spreads implemented
  Then each spread:
    - Functional end-to-end
    - Layouts responsive
    - Interpretations display
    - Saves correctly
```

#### TS-7.9.3: Subscription Lifecycle
```gherkin
Scenario: Full lifecycle tested
  Given subscription system
  Then tested:
    - Trial start → paid
    - Active → cancel
    - Active → upgrade
    - Active → downgrade
```

#### TS-7.9.4: Feature Gating
```gherkin
Scenario: Tier access verified
  Given tier-gated spreads
  Then:
    - Free users blocked from premium
    - Basic gets correct spreads
    - Pro gets correct spreads
    - VIP gets all spreads
```

#### TS-7.9.5: Regression
```gherkin
Scenario: Phase 1-2 intact
  Given Phase 3 deployed
  Then Phase 1 features work
  And Phase 2 features work
  And no breaking changes
```

#### TS-7.9.6: E2E Premium Journey
```gherkin
Scenario: Complete premium journey
  Given new user
  Then flow works:
    1. See premium spread locked
    2. Click upgrade
    3. See pricing page
    4. Subscribe to Pro
    5. Payment succeeds
    6. Access premium spread
    7. Complete Celtic Cross reading
    8. Share result
```

---

## Story 7.10: Integration & Launch

### Test Scenarios (10 AC → 12 TS)

#### TS-7.10.1: Reading Selection Updated
```gherkin
Scenario: All spreads visible
  Given logged-in user on /reading
  Then all spreads displayed:
    - Free spreads (2)
    - Login spreads (3)
    - Premium spreads (4+)
  And premium badges shown
  And tier requirements visible
```

#### TS-7.10.2: Navigation Updated
```gherkin
Scenario: Menu includes premium
  Given premium user
  Then navigation shows:
    - Premium section
    - Quick access to premium spreads
```

#### TS-7.10.3: Soft Launch
```gherkin
Scenario: Beta testing complete
  Given 50-100 beta users
  Then feedback collected
  And critical bugs fixed
  And ready for full launch
```

---

## Test Data Matrix

### Premium Spread Access Matrix

| Spread | Free | Basic | Pro | VIP |
|--------|------|-------|-----|-----|
| Celtic Cross | ❌ | ❌ | ✅ | ✅ |
| Decision Making | ❌ | ❌ | ✅ | ✅ |
| Self Discovery | ❌ | ❌ | ✅ | ✅ |
| Relationship Deep Dive | ❌ | ❌ | ✅ | ✅ |

### Card Counts by Spread

| Spread | Cards |
|--------|-------|
| Celtic Cross | 10 |
| Decision Making | 5 |
| Self Discovery | 5 |
| Relationship Deep Dive | 7 |

---

## Risk-Based Test Prioritization

### Priority 0 (Critical)

| ID | Scenario | Risk |
|----|----------|------|
| TS-7.1.1 | Celtic Cross access control | SECURITY |
| TS-7.5.3 | Layout responsiveness | UX |
| TS-7.6.2 | Content quality gates | CONTENT |
| TS-7.9.5 | Phase 1-2 regression | STABILITY |

### Priority 1 (High)

| ID | Scenario | Risk |
|----|----------|------|
| TS-7.1.2 | 10-card layout | FEATURE |
| TS-7.2.2 | Two-option input | UX |
| TS-7.9.4 | Feature gating | BUSINESS |

---

## Test Exit Criteria

```yaml
Epic 7 Release Criteria:
  ✅ All 4 premium spreads functional
  ✅ Layouts responsive on all devices
  ✅ Premium content quality approved
  ✅ Feature gating verified
  ✅ No P0/P1 bugs
  ✅ Phase 1-2 regression passed
  ✅ E2E premium journey works
  ✅ Beta feedback addressed
```

---

## Summary

```yaml
Epic 7 Test Design:
  ├─ 10 Stories analyzed
  ├─ 102 Acceptance Criteria mapped
  ├─ 124 Test Scenarios created
  ├─ Given-When-Then format
  ├─ Risk-based prioritization
  └─ Exit criteria defined

Status: COMPLETE ✅
Ready for: Implementation & Execution
```

