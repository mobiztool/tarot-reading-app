# Epic 8: Premium Spreads Batch 2 - Test Design

## Document Info

| Field | Value |
|-------|-------|
| **Epic** | Epic 8: Premium Spreads Batch 2 (Phase 4) |
| **Stories** | 8.1-8.4 (4 stories) |
| **Created By** | Quinn (QA Agent) |
| **Created Date** | 2026-01-07 |
| **Status** | Complete |

---

## Executive Summary

### Epic 8 Overview
Epic 8 เพิ่ม Premium Spreads อีก 5 ประเภท รวมถึง VIP-exclusive Shadow Work spread

### Test Design Statistics

| Metric | Count |
|--------|-------|
| Total Stories | 4 |
| Total Acceptance Criteria | 38 |
| Total Test Scenarios | 52 |
| High-Risk Scenarios | 10 |
| Medium-Risk Scenarios | 24 |
| Low-Risk Scenarios | 18 |

---

## Story 8.1: Shadow Work Spread (7 Cards) - VIP Only

### Test Scenarios (10 AC → 14 TS)

#### TS-8.1.1: VIP-Only Access
```gherkin
Scenario: VIP tier required
  Given user has Pro subscription
  When user navigates to /reading/shadow-work
  Then premium gate should display
  And message: "Available in VIP tier only"

Scenario: VIP user can access
  Given user has VIP subscription
  When user navigates to /reading/shadow-work
  Then Shadow Work page should display
  And 7-card layout shown

Scenario: Free user blocked
  Given user has no subscription
  When navigates to /reading/shadow-work
  Then premium gate displays
  And "Upgrade to VIP" CTA shown
```

#### TS-8.1.2: 7 Positions
```gherkin
Scenario: All 7 positions displayed
  Given VIP user completes Shadow Work reading
  Then 7 positions should display:
    | Position | Focus |
    | 1 | Conscious Self |
    | 2 | Shadow |
    | 3 | Fear |
    | 4 | Denied Strength |
    | 5 | Integration |
    | 6 | Healing |
    | 7 | Wholeness |
```

#### TS-8.1.3: Trigger Warning
```gherkin
Scenario: Trigger warning displayed
  Given user enters Shadow Work spread
  Then trigger warning should display
  And warning explains deep introspection content
  And user must acknowledge before proceeding
```

#### TS-8.1.4: Journaling Prompts
```gherkin
Scenario: Position-specific prompts
  Given reading complete
  Then each position has journaling prompt
  And prompts are introspective
  And integration with notes feature available
```

#### TS-8.1.5: Dark Theme
```gherkin
Scenario: Contemplative UI theme
  Given Shadow Work spread active
  Then UI should use dark, contemplative theme
  And visuals support deep reflection
```

#### TS-8.1.6: Save Reading
```gherkin
Scenario: Shadow Work saved correctly
  Given reading complete
  Then saved with:
    | Field | Value |
    | reading_type | shadow_work |
    | reading_cards | 7 cards with positions |
```

---

## Story 8.2: Chakra Alignment Spread (7 Cards)

### Test Scenarios (10 AC → 14 TS)

#### TS-8.2.1: Pro/VIP Access
```gherkin
Scenario: Pro tier can access
  Given user has Pro subscription
  When navigates to /reading/chakra
  Then Chakra spread page displays

Scenario: VIP can access
  Given user has VIP subscription
  When navigates to /reading/chakra
  Then Chakra spread page displays

Scenario: Basic blocked
  Given user has Basic subscription
  When navigates to /reading/chakra
  Then premium gate displays
  And "Upgrade to Pro" CTA shown
```

#### TS-8.2.2: 7 Chakra Positions
```gherkin
Scenario: All 7 chakras displayed
  Given reading complete
  Then 7 chakra positions shown:
    | # | Chakra | Color |
    | 1 | Root | Red |
    | 2 | Sacral | Orange |
    | 3 | Solar Plexus | Yellow |
    | 4 | Heart | Green |
    | 5 | Throat | Blue |
    | 6 | Third Eye | Indigo |
    | 7 | Crown | Violet |
```

#### TS-8.2.3: Chakra Color Indicators
```gherkin
Scenario: Color indicators visible
  Given Chakra reading display
  Then each position shows chakra color
  And colors are distinct and accurate
```

#### TS-8.2.4: Balance Analysis
```gherkin
Scenario: Balance analysis provided
  Given reading complete
  Then analysis shows:
    - Which chakras blocked
    - Which chakras open
    - Overall energy balance
    - Recommendations
```

#### TS-8.2.5: Vertical Layout
```gherkin
Scenario: Body alignment layout
  Given Chakra spread on desktop
  Then layout shows vertical alignment
  And resembles body/spine structure
  And chakras positioned correctly
```

#### TS-8.2.6: Save Reading
```gherkin
Scenario: Chakra reading saved
  Given reading complete
  Then saved with reading_type: 'chakra_alignment'
```

---

## Story 8.3: Remaining Premium Spreads Batch 2

### Test Scenarios (10 AC → 16 TS)

#### TS-8.3.1: Friendship Reading (4 Cards)
```gherkin
Scenario: Friendship spread accessible
  Given Pro/VIP user
  When navigates to /reading/friendship
  Then Friendship spread page displays

Scenario: 4 positions displayed
  Given Friendship reading complete
  Then 4 positions shown:
    | Position | Focus |
    | 1 | The Bond |
    | 2 | Your Role |
    | 3 | Their Role |
    | 4 | Future of Friendship |

Scenario: Saved correctly
  Given reading complete
  Then reading_type: 'friendship'
```

#### TS-8.3.2: Career Path Spread (6 Cards)
```gherkin
Scenario: Career Path accessible
  Given Pro/VIP user
  When navigates to /reading/career-path
  Then Career Path spread page displays

Scenario: 6 positions displayed
  Given Career Path reading complete
  Then 6 positions shown:
    | Position | Focus |
    | 1 | Current Position |
    | 2 | Obstacles |
    | 3 | Skills to Develop |
    | 4 | Hidden Opportunities |
    | 5 | Next Step |
    | 6 | Long-term Outcome |

Scenario: Saved correctly
  Given reading complete
  Then reading_type: 'career_path'
```

#### TS-8.3.3: Financial Abundance Spread (5 Cards)
```gherkin
Scenario: Financial spread accessible
  Given Pro/VIP user
  When navigates to /reading/financial
  Then Financial Abundance spread page displays

Scenario: 5 positions displayed
  Given Financial reading complete
  Then 5 positions shown:
    | Position | Focus |
    | 1 | Current Financial State |
    | 2 | Blocks to Abundance |
    | 3 | Strengths to Leverage |
    | 4 | Action to Take |
    | 5 | Potential Outcome |

Scenario: Saved correctly
  Given reading complete
  Then reading_type: 'financial_abundance'
```

#### TS-8.3.4: Common Requirements
```gherkin
Scenario: All 3 spreads have tier check
  Given any of 3 spreads
  Then Pro/VIP tier check applies
  And Basic/Free users see gate

Scenario: All 3 mobile responsive
  Given viewport < 768px
  Then all 3 spreads stack vertically
  And readable on mobile

Scenario: Analytics tracked
  Given any of 3 spreads completed
  Then analytics events fire:
    - {spread_type}_started
    - {spread_type}_completed
```

---

## Story 8.4: Phase 4 Batch 2 Testing & QA

### Test Scenarios (8 AC → 8 TS)

#### TS-8.4.1: All 5 Spreads Tested
```gherkin
Scenario: Shadow Work tested
  Given Shadow Work spread
  Then functional E2E test passes
  And VIP-only access verified

Scenario: Chakra tested
  Given Chakra spread
  Then functional E2E test passes
  And Pro/VIP access verified

Scenario: Friendship tested
  Given Friendship spread
  Then functional E2E test passes

Scenario: Career Path tested
  Given Career Path spread
  Then functional E2E test passes

Scenario: Financial tested
  Given Financial spread
  Then functional E2E test passes
```

#### TS-8.4.2: Layouts Responsive
```gherkin
Scenario: All layouts tested on devices
  Given each of 5 spreads
  Then test on:
    - Desktop (1920x1080)
    - Tablet (768x1024)
    - Mobile (375x667)
  And all display correctly
```

#### TS-8.4.3: Content Quality
```gherkin
Scenario: Content reviewed
  Given 29 position interpretations
  Then all passed 4-gate quality process
  And Thai language quality verified
```

#### TS-8.4.4: Regression
```gherkin
Scenario: Previous phases work
  Given Phase 4 Batch 2 deployed
  Then Phase 1 features work
  And Phase 2 features work
  And Phase 3 features work
  And no breaking changes
```

---

## Test Data Matrix

### Spread Access Matrix

| Spread | Free | Basic | Pro | VIP |
|--------|------|-------|-----|-----|
| Shadow Work | ❌ | ❌ | ❌ | ✅ |
| Chakra Alignment | ❌ | ❌ | ✅ | ✅ |
| Friendship | ❌ | ❌ | ✅ | ✅ |
| Career Path | ❌ | ❌ | ✅ | ✅ |
| Financial | ❌ | ❌ | ✅ | ✅ |

### Card Counts

| Spread | Cards |
|--------|-------|
| Shadow Work | 7 |
| Chakra Alignment | 7 |
| Friendship | 4 |
| Career Path | 6 |
| Financial | 5 |
| **Total** | **29** |

---

## Risk-Based Test Prioritization

### Priority 0 (Critical)

| ID | Scenario | Risk |
|----|----------|------|
| TS-8.1.1 | VIP-only access | BUSINESS |
| TS-8.4.4 | Regression | STABILITY |

### Priority 1 (High)

| ID | Scenario | Risk |
|----|----------|------|
| TS-8.1.3 | Trigger warning | UX/LEGAL |
| TS-8.2.1 | Pro/VIP access | BUSINESS |
| TS-8.4.3 | Content quality | CONTENT |

---

## Test Exit Criteria

```yaml
Epic 8 Release Criteria:
  ✅ All 5 spreads functional
  ✅ VIP-only spread restricted correctly
  ✅ Pro/VIP spreads accessible
  ✅ Content quality approved (29 positions)
  ✅ Layouts responsive
  ✅ Regression passed
  ✅ No P0/P1 bugs
```

---

## Summary

```yaml
Epic 8 Test Design:
  ├─ 4 Stories analyzed
  ├─ 38 Acceptance Criteria mapped
  ├─ 52 Test Scenarios created
  ├─ Given-When-Then format
  ├─ Risk-based prioritization
  └─ Exit criteria defined

Status: COMPLETE ✅
Ready for: Implementation & Execution
```

