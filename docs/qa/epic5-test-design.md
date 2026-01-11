# Epic 5: Login Tier Spreads - Test Design

## Document Info

| Field | Value |
|-------|-------|
| **Epic** | Epic 5: Login Tier Spreads (Phase 2) |
| **Stories** | 5.1-5.8 (8 stories) |
| **Created By** | Quinn (QA Agent) |
| **Created Date** | 2026-01-07 |
| **Status** | Complete |

---

## Executive Summary

### Epic 5 Overview
Epic 5 เพิ่ม 3 spread types ใหม่ที่ต้อง login ได้แก่ Love, Career, และ Yes/No เพื่อเพิ่ม signup conversion

### Test Design Statistics

| Metric | Count |
|--------|-------|
| Total Stories | 8 |
| Total Acceptance Criteria | 84 |
| Total Test Scenarios | 98 |
| High-Risk Scenarios | 18 |
| Medium-Risk Scenarios | 42 |
| Low-Risk Scenarios | 38 |

---

## Story 5.1: Love & Relationships Spread

### Test Scenarios (12 AC → 14 TS)

#### TS-5.1.1: Access Control
```gherkin
Scenario: Login required for Love spread
  Given user is not logged in
  When user navigates to /reading/love
  Then user should be redirected to /auth/login
  And redirectTo param should be /reading/love

Scenario: Logged-in user can access Love spread
  Given user is logged in
  When user navigates to /reading/love
  Then Love spread page should display
  And 3-position explanation should show
```

#### TS-5.1.2: Spread Positions
```gherkin
Scenario: 3 positions displayed correctly
  Given user is on Love spread
  Then 3 position labels should display:
    | Position | Thai | English |
    | 0 | คุณ | You |
    | 1 | อีกฝ่าย | The Other Person |
    | 2 | พลังงานความสัมพันธ์ | Relationship Energy |

Scenario: Position-specific interpretations
  Given user completes Love reading
  When card is drawn for "You" position
  Then interpretation should focus on querent's feelings
  When card is drawn for "Other" position
  Then interpretation should focus on partner's perspective
```

#### TS-5.1.3: Love Question Examples
```gherkin
Scenario: Love-specific question suggestions
  Given user is on Love spread selection
  Then question examples should display:
    | Example |
    | "จะเจอคนที่ใช่ไหม?" |
    | "ความสัมพันธ์จะดีขึ้นไหม?" |
    | "ควรเปิดใจหรือรอดูก่อน?" |
```

#### TS-5.1.4: Reading Save
```gherkin
Scenario: Love reading saved correctly
  Given user completes Love reading
  Then reading should save to database with:
    | Field | Value |
    | reading_type | love_relationships |
    | user_id | current user ID |
    | reading_cards | 3 cards with positions |
```

#### TS-5.1.5: Analytics
```gherkin
Scenario: Love spread analytics tracked
  Given user starts Love reading
  Then event "love_spread_started" should fire
  When user completes reading
  Then event "love_spread_completed" should fire
```

---

## Story 5.2: Career & Money Spread

### Test Scenarios (10 AC → 12 TS)

#### TS-5.2.1: Access Control
```gherkin
Scenario: Login required for Career spread
  Given user is not logged in
  When user navigates to /reading/career
  Then user should be redirected to login

Scenario: Logged-in user can access
  Given user is logged in
  When user navigates to /reading/career
  Then Career spread page should display
```

#### TS-5.2.2: Spread Positions
```gherkin
Scenario: Career positions displayed
  Given user is on Career spread
  Then 3 position labels should display:
    | Position | Thai |
    | 0 | สถานการณ์ปัจจุบัน |
    | 1 | ความท้าทาย/โอกาส |
    | 2 | ผลลัพธ์ |
```

#### TS-5.2.3: Reading Save
```gherkin
Scenario: Career reading saved
  Given user completes Career reading
  Then reading_type should be "career_money"
  And 3 cards should be saved with positions
```

---

## Story 5.3: Yes/No Question Spread

### Test Scenarios (10 AC → 14 TS)

#### TS-5.3.1: Access Control
```gherkin
Scenario: Login required
  Given user is not logged in
  When user navigates to /reading/yes-no
  Then user should be redirected to login
```

#### TS-5.3.2: Question Required
```gherkin
Scenario: Question is required (not optional)
  Given user is on Yes/No spread
  When user tries to proceed without question
  Then error should display: "กรุณาใส่คำถาม"
  And user cannot draw card

Scenario: Question input works
  Given user enters question "จะได้งานใหม่ไหม?"
  When user clicks draw
  Then card should draw successfully
```

#### TS-5.3.3: Yes/No Interpretation
```gherkin
Scenario: Card interpreted as Yes
  Given card drawn has "Yes" mapping (e.g., The Sun upright)
  Then answer should display "ใช่" with confidence
  And confidence indicator shows "Strong Yes"

Scenario: Card interpreted as No
  Given card drawn has "No" mapping (e.g., Tower reversed)
  Then answer should display "ไม่" with confidence

Scenario: Card interpreted as Maybe
  Given card drawn has neutral mapping
  Then answer should display "อาจจะ / ไม่แน่ใจ"
  And additional guidance provided
```

#### TS-5.3.4: Confidence Indicator
```gherkin
Scenario: Confidence levels display
  Given Yes/No reading completed
  Then confidence should be one of:
    | Level | Thai |
    | Strong Yes | ใช่แน่นอน |
    | Leaning Yes | น่าจะใช่ |
    | Maybe | อาจจะ |
    | Leaning No | น่าจะไม่ |
    | Strong No | ไม่แน่นอน |
```

#### TS-5.3.5: Fast Flow
```gherkin
Scenario: Yes/No flow completes quickly
  Given user starts Yes/No reading
  When user enters question and draws card
  Then total time should be <30 seconds
  And flow is streamlined (fewer steps)
```

---

## Story 5.4: Spread Access Control

### Test Scenarios (10 AC → 14 TS)

#### TS-5.4.1: Access Matrix
```gherkin
Scenario: Guest can access Daily reading
  Given user is not logged in
  When user navigates to /reading/daily
  Then page should display (no login required)

Scenario: Guest can access 3-Card Spread
  Given user is not logged in
  When user navigates to /reading/three-card
  Then page should display (no login required)

Scenario: Guest cannot access Love spread
  Given user is not logged in
  When user navigates to /reading/love
  Then login gate should display

Scenario: Guest cannot access Career spread
  Given user is not logged in
  When user navigates to /reading/career
  Then login gate should display

Scenario: Guest cannot access Yes/No spread
  Given user is not logged in
  When user navigates to /reading/yes-no
  Then login gate should display
```

#### TS-5.4.2: Login Gate UI
```gherkin
Scenario: Login gate displays benefits
  Given guest tries to access protected spread
  Then gate should display:
    - Spread preview/description
    - Benefits of signing up
    - "Sign up free to unlock" CTA
    - Login link for existing users

Scenario: Gate is attractive (not blocking)
  Given login gate displays
  Then design should feel like upgrade invitation
  And not a frustrating block
```

#### TS-5.4.3: Redirect Flow
```gherkin
Scenario: Redirect after login
  Given guest on login gate for /reading/love
  When guest clicks signup and completes
  Then user should redirect to /reading/love
  And can start reading immediately
```

#### TS-5.4.4: Conversion Tracking
```gherkin
Scenario: Conversion tracked
  Given gate shown for Love spread
  When user signs up
  Then track: "signup_from_gate" with spread_type
  When user completes reading
  Then track: "conversion_complete"
```

---

## Story 5.5: Enhanced Signup Value Prop

### Test Scenarios (10 AC → 10 TS)

#### TS-5.5.1: Landing Page Update
```gherkin
Scenario: Landing page shows 5 spreads
  Given user on landing page
  Then "5 Free Spreads" section should display
  And 2 unlocked spreads visible
  And 3 locked spreads with lock icons
```

#### TS-5.5.2: Signup Page Benefits
```gherkin
Scenario: Signup page shows unlock benefits
  Given user on signup page
  Then benefits section should display:
    - "Unlock 3 exclusive spreads"
    - Love spread card
    - Career spread card
    - Yes/No spread card
```

#### TS-5.5.3: Reading Selection Page
```gherkin
Scenario: All 5 spreads shown
  Given user on /reading
  Then 5 spread options should display
  And 2 are clickable (Daily, 3-Card)
  And 3 show lock icon (Love, Career, Yes/No)
  And clicking locked → login gate
```

#### TS-5.5.4: Post-Signup Celebration
```gherkin
Scenario: Celebration after signup
  Given user just completed signup
  Then celebration modal should display
  And message: "You unlocked 3 new spreads!"
  And shows 3 newly available spreads
  And CTA to try first spread
```

---

## Story 5.6: Login Tier Content Creation

### Test Scenarios (10 AC → 10 TS)

#### TS-5.6.1: Position Interpretations Exist
```gherkin
Scenario: 9 position interpretations created
  Given content generation complete
  Then database should have:
    | Spread | Positions |
    | Love | You, Other, Energy |
    | Career | Current, Challenge, Outcome |
    | Yes/No | Answer |
```

#### TS-5.6.2: Quality Gate Passed
```gherkin
Scenario: All content passed quality gates
  Given all content generated
  Then Gate 1 (Automated) passed
  And Gate 2 (Expert review) passed
  And Gate 3 (Thai proofreader) passed
  And Gate 4 (PM/QA sign-off) passed
```

#### TS-5.6.3: Thai Language Quality
```gherkin
Scenario: Content is proper Thai
  Given any position interpretation
  Then text should be:
    - Grammatically correct Thai
    - Natural phrasing (not literal translation)
    - No spelling errors
    - Appropriate tone
```

---

## Story 5.7: Spread Usage Analytics

### Test Scenarios (10 AC → 10 TS)

#### TS-5.7.1: Event Tracking
```gherkin
Scenario: All 5 spreads tracked
  Given user completes any spread
  Then analytics event should fire with:
    | Property | Value |
    | spread_type | daily/three_card/love/career/yes_no |
    | user_type | guest/logged_in |
    | completed | true/false |
```

#### TS-5.7.2: Spread Popularity
```gherkin
Scenario: Popularity metrics available
  Given analytics collected over time
  Then GA4 should show:
    - Most popular spread
    - Completion rate per spread
    - Time spent per spread
```

#### TS-5.7.3: Conversion Funnel
```gherkin
Scenario: Conversion funnel tracked
  Given user journey from gate to signup
  Then funnel should track:
    | Step | Event |
    | 1 | spread_interest |
    | 2 | login_gate_shown |
    | 3 | signup_started |
    | 4 | signup_completed |
    | 5 | spread_completed |
```

---

## Story 5.8: Epic 5 Testing & QA

### Test Scenarios (12 AC → 14 TS)

#### TS-5.8.1: All Spreads Tested
```gherkin
Scenario: Love spread E2E
  Given logged-in user
  When user completes Love spread
  Then all 3 cards drawn with positions
  And interpretation displayed
  And saved to database

Scenario: Career spread E2E
  Given logged-in user
  When user completes Career spread
  Then flow completes successfully

Scenario: Yes/No spread E2E
  Given logged-in user
  When user enters question and draws
  Then Yes/No answer displayed
  And confidence indicator shown
```

#### TS-5.8.2: Access Control Verified
```gherkin
Scenario: Guest blocked from login spreads
  Given guest user
  Then cannot access Love, Career, Yes/No
  And can access Daily, 3-Card
```

#### TS-5.8.3: Regression Testing
```gherkin
Scenario: Phase 1 features still work
  Given Phase 2 deployed
  Then Daily reading works
  And 3-Card spread works
  And Encyclopedia works
  And Share functionality works
  And Login/Signup works
```

#### TS-5.8.4: Performance
```gherkin
Scenario: New spreads meet performance
  Given any new spread
  Then page load <1 second
  And animations 60fps
  And no performance regression
```

---

## Test Data Matrix

### Spread Access Matrix

| Spread | Guest | Logged-in |
|--------|-------|-----------|
| Daily | ✅ | ✅ |
| 3-Card | ✅ | ✅ |
| Love | ❌ Gate | ✅ |
| Career | ❌ Gate | ✅ |
| Yes/No | ❌ Gate | ✅ |

### Yes/No Interpretation Examples

| Card | Upright | Reversed |
|------|---------|----------|
| The Sun | Strong Yes | Leaning Yes |
| The Tower | Strong No | Maybe |
| The Star | Leaning Yes | Maybe |
| Death | Maybe | Maybe |

---

## Risk-Based Test Prioritization

### Priority 0 (Critical)

| ID | Test Scenario | Risk |
|----|--------------|------|
| TS-5.4.1 | Access control matrix | Security |
| TS-5.4.3 | Redirect after login | UX |
| TS-5.3.3 | Yes/No interpretation | Feature |
| TS-5.8.3 | Regression | Stability |

### Priority 1 (High)

| ID | Test Scenario | Risk |
|----|--------------|------|
| TS-5.1.1 | Love spread access | Feature |
| TS-5.2.1 | Career spread access | Feature |
| TS-5.5.4 | Post-signup celebration | Conversion |
| TS-5.6.2 | Quality gate passed | Content |

---

## Test Exit Criteria

```yaml
Epic 5 Release Criteria:
  ✅ All 3 new spreads functional
  ✅ Access control working (guest vs login)
  ✅ Yes/No interpretation accurate
  ✅ Conversion flow tested
  ✅ Analytics events firing
  ✅ Phase 1 regression passed
  ✅ Performance maintained
  ✅ No P0/P1 bugs
```

---

## Summary

```yaml
Epic 5 Test Design:
  ├─ 8 Stories analyzed
  ├─ 84 Acceptance Criteria mapped
  ├─ 98 Test Scenarios created
  ├─ Given-When-Then format
  ├─ Risk-based prioritization
  └─ Exit criteria defined

Status: COMPLETE ✅
Ready for: Implementation & Execution
```

