# 7-Day Implementation Plan: AI Content Generation

**Epic:** 1 - Foundation & Core Reading Experience  
**Story:** 1.14 - Content Integration & Card Meanings  
**Owner:** TBD (Assign after Project Owner approval)  
**Budget:** ฿12,000 (approved allocation)  
**Timeline:** December 31, 2025 - January 6, 2026

---

## Overview

This document provides a detailed 7-day implementation plan for generating and verifying 78 tarot card interpretations using AI-assisted content generation with human quality gates.

**Deliverable:** Production-ready tarot card content (78 cards, Thai language, expert-verified)

**Success Criteria:**

- ✅ All 4 quality gates passed
- ✅ Timeline: ≤7 days
- ✅ Budget: ≤฿12,000
- ✅ Quality: ≥4.5/5 expert ratings

---

## Daily Breakdown

### Day 1 (Dec 31): Setup & Implementation

**Goal:** Infrastructure ready, scripts implemented, experts contracted

**Morning (9:00-12:00):**

```
09:00-09:30 | Kickoff Meeting (Team)
            | - Review QA report
            | - Assign responsibilities
            | - Confirm timeline & budget

09:30-10:00 | Setup Anthropic API (Dev)
            | - Create account
            | - Generate API key
            | - Test connection

10:00-12:00 | Implement Generation Scripts (Dev)
            | - create scripts/content-generation/
            | - generate-tarot-cards.ts
            | - batch-processor.ts
            | - validators/
```

**Afternoon (13:00-17:00):**

```
13:00-14:00 | Post Expert Jobs (PM)
            | - Tarot expert job posting (Fiverr, Upwork)
            | - Thai proofreader job posting
            | - Screen initial applicants

14:00-16:00 | Implement Validation Tests (Dev/QA)
            | - Gate 1 automated tests
            | - Language detection helpers
            | - Content safety checks

16:00-17:00 | Test Scripts (Dev)
            | - Test with 1 sample card
            | - Debug any issues
            | - Prepare for pilot
```

**Deliverables:**

- ✅ Anthropic API working
- ✅ Generation script ready
- ✅ Validation tests ready
- ✅ Expert job postings live

**Status Check (17:00):** Scripts tested successfully? [ ] Yes [ ] Issues: \_\_\_

---

### Day 2 (Jan 1): Pilot Generation & Refinement

**Goal:** Validate approach with 10 cards, refine if needed

**Morning (9:00-12:00):**

```
09:00-09:30 | Daily Standup
            | - Review Day 1 deliverables
            | - Address any blockers

09:30-10:00 | Run Pilot Generation (Dev)
            | pnpm generate:tarot-content --batch major --count 10
            | Expected: 10 Major Arcana cards

10:00-10:15 | Run Gate 1 Validation
            | pnpm test:content
            | Expected: 100% pass

10:15-12:00 | Team Quality Review (ALL)
            | - Review all 10 cards
            | - Check Thai language quality
            | - Verify tone and style
            | - Rate quality (1-5 stars)
```

**Afternoon (13:00-17:00):**

```
13:00-14:00 | Go/No-Go Decision (Team + PO)
            | ✅ If quality ≥4/5 → Proceed to full generation
            | ⚠️ If quality <4/5 → Refine prompts, regenerate pilot

14:00-15:00 | Contract Expert Reviewers (PM)
            | - Select best candidates
            | - Send contracts/agreements
            | - Share review materials
            | - Set expectations & deadlines

15:00-17:00 | Prepare for Full Generation (Dev)
            | - Refine prompts based on pilot
            | - Setup output directories
            | - Prepare review exports
            | - Final testing
```

**Deliverables:**

- ✅ 10 pilot cards generated and reviewed
- ✅ Quality assessment complete (go/no-go decision)
- ✅ Expert reviewers contracted
- ✅ Ready for full 78-card generation

**Status Check (17:00):**

- Pilot quality: \_\_/5 stars
- Go/No-Go: [ ] GO [ ] Refine
- Experts hired: [ ] Tarot [ ] Proofreader

---

### Day 3 (Jan 2): Full Generation & Export

**Goal:** Generate all 78 cards, pass Gate 1, deliver to experts

**Morning (9:00-12:00):**

```
09:00-09:15 | Daily Standup

09:15-10:00 | Full Generation (Dev)
            | pnpm generate:tarot-content
            | Expected: 78 cards in 25-30 minutes

10:00-10:15 | Gate 1: Automated Validation
            | pnpm test:content
            | Expected: 100% pass (or regenerate failures)

10:15-11:00 | Handle Failures (if any)
            | - Identify failed cards
            | - Regenerate (max 3 retries)
            | - Re-run validation

11:00-12:00 | Export for Review
            | pnpm export:content-review --format csv,json
            | Upload to Google Sheets
```

**Afternoon (13:00-17:00):**

```
13:00-14:00 | Share with Experts (PM)
            | - Email review sheets to Tarot expert
            | - Email review sheets to Proofreader
            | - Set deadline: Day 5 (Jan 4) EOD
            | - Confirm receipt and understanding

14:00-15:00 | Spot Check Quality (QA)
            | - Random sample 10 cards
            | - Verify Thai language quality
            | - Check for obvious issues
            | - Report findings

15:00-17:00 | Buffer / Documentation (Team)
            | - Document generation process
            | - Update progress tracker
            | - Prepare for expert reviews
```

**Deliverables:**

- ✅ 78 cards generated
- ✅ Gate 1 validation passed (100%)
- ✅ Review sheets shared with experts
- ✅ Experts confirmed started

**Status Check (17:00):**

- Generation success rate: \_\_/78 cards
- Gate 1 pass rate: \_\_%
- Experts started: [ ] Yes [ ] No

---

### Day 4-5 (Jan 3-4): Expert Reviews (Parallel)

**Goal:** Complete Gate 2 (Tarot) and Gate 3 (Thai) reviews

**Day 4 Morning (9:00-12:00):**

```
09:00-09:15 | Daily Standup
            | - Check expert progress
            | - Address any questions from experts

09:15-12:00 | Expert Work (Parallel)
            | Tarot Expert:
            | - Continue reviewing cards 1-40
            | - Provide preliminary feedback
            |
            | Thai Proofreader:
            | - Continue proofreading cards 1-40
            | - Note corrections needed
```

**Day 4 Afternoon (13:00-17:00):**

```
13:00-14:00 | Check-in with Experts (PM)
            | - Progress update (% complete)
            | - Any major issues found?
            | - On track for Day 5 delivery?

14:00-17:00 | Expert Work Continues
            | Tarot Expert: Cards 41-78
            | Thai Proofreader: Cards 41-78
```

**Day 5 Full Day (9:00-17:00):**

```
09:00-12:00 | Experts Complete Reviews
            | Both reviewers finish 78 cards
            | Submit completed review sheets

13:00-14:00 | Receive Expert Feedback (PM/QA)
            | - Download review sheets
            | - Analyze results
            | - Identify cards needing revision

14:00-17:00 | Process Revisions (Dev)
            | - Regenerate problematic cards (AI)
            | - Manual edits for minor issues
            | - Re-submit to experts for quick review
```

**Deliverables (Day 5 EOD):**

- ✅ Gate 2 complete: Tarot accuracy verified
- ✅ Gate 3 complete: Thai language proofread
- ✅ Revisions processed
- ✅ Expert sign-offs obtained

**Status Check (Day 5 EOD):**

- Tarot expert rating: \_\_/5 stars
- Thai proofreader rating: \_\_/5 stars
- Cards needing major revision: \_\_ cards
- Cards approved: \_\_/78 (≥95% target)

---

### Day 6 (Jan 5): Final Approval & Testing

**Goal:** Gate 4 approval, database import, comprehensive testing

**Morning (9:00-12:00):**

```
09:00-09:15 | Daily Standup

09:15-10:00 | Compile Final Content (Dev)
            | - Merge approved content
            | - Create production-ready JSON
            | - Version control commit

10:00-11:00 | Gate 4: PM Review (John)
            | - Review random 10 cards
            | - Verify tone consistency
            | - Check alignment with brand
            | - Initial sign-off

11:00-12:00 | Gate 4: QA Review (Quinn)
            | - Verify all gates passed
            | - Check documentation complete
            | - Validate test results
            | - Technical sign-off
```

**Afternoon (13:00-17:00):**

```
13:00-13:30 | Import to Development DB
            | pnpm prisma:seed --source content/production/tarot-cards-final.json
            | Verify 78 cards imported

13:30-15:00 | Integration Testing (QA/Dev)
            | - Test daily reading flow
            | - Test 3-card spread flow
            | - Verify Thai fonts render
            | - Check mobile responsive
            | - Performance validation (<1s load)

15:00-16:00 | E2E Testing
            | pnpm test:e2e
            | All critical paths must pass

16:00-17:00 | Final Approval (PO)
            | - Review test results
            | - Final go/no-go decision
            | - Sign-off documentation
```

**Deliverables:**

- ✅ All 4 gates passed
- ✅ Content in development database
- ✅ All tests passing
- ✅ Final approvals signed

**Status Check (17:00):**

- PM approval: [ ] ✅ [ ] Issues: \_\_\_
- QA approval: [ ] ✅ [ ] Issues: \_\_\_
- Tests passed: **/** (100% required)
- Ready for staging: [ ] Yes [ ] No

---

### Day 7 (Jan 6): Staging & Production Deployment

**Goal:** Deploy to production, monitor launch

**Morning (9:00-12:00):**

```
09:00-09:15 | Final Standup

09:15-10:00 | Deploy to Staging (Dev)
            | - Create production branch
            | - Commit final content
            | - Push to staging
            | - Verify deployment success

10:00-11:00 | Staging Verification (QA)
            | - Smoke tests
            | - Manual UAT
            | - Performance check
            | - Cross-browser check

11:00-12:00 | Stakeholder Demo (Optional)
            | - Show working features
            | - Demo reading flows
            | - Get feedback
```

**Afternoon (13:00-17:00):**

```
13:00-13:30 | Production Deployment Decision
            | Go/No-Go: [ ] Deploy [ ] Hold

13:30-14:00 | Deploy to Production
            | - Merge to main branch
            | - Vercel auto-deploys
            | - Monitor deployment

14:00-15:00 | Post-Deployment Validation
            | - Smoke tests on production
            | - Verify 78 cards live
            | - Check analytics tracking
            | - Test on real devices

15:00-16:00 | Post-Launch Monitoring Setup
            | - Setup Sentry alerts
            | - Monitor error rates
            | - Track user behavior (GA4)
            | - Watch for content issues

16:00-17:00 | Sprint Retrospective (Team)
            | - What went well
            | - What can improve
            | - Lessons learned
            | - Celebrate! 🎉
```

**Deliverables:**

- ✅ Content live in production
- ✅ Zero P0/P1 bugs
- ✅ Monitoring active
- ✅ Team retrospective complete

**Final Status:**

- Production URL: ******\_\_\_\_******
- Cards live: \_\_/78
- Issues found: \_\_ (P0/P1/P2)
- User feedback: (monitor Week 1)

---

## Team Responsibilities (RACI)

### Task Assignment Matrix

| Task                    | PM (John) | Architect (Winston) | QA (Quinn) | Dev Team | PO    |
| ----------------------- | --------- | ------------------- | ---------- | -------- | ----- |
| **Approve budget**      | C         | C                   | C          | -        | **A** |
| **Setup Anthropic API** | I         | **R**               | I          | C        | I     |
| **Implement scripts**   | I         | **R**/C             | I          | **R**    | I     |
| **Post expert jobs**    | **R**     | -                   | C          | -        | **A** |
| **Contract reviewers**  | **R**     | -                   | C          | -        | **A** |
| **Run pilot**           | I         | C                   | C          | **R**    | I     |
| **Generate 78 cards**   | I         | C                   | I          | **R**    | I     |
| **Gate 1 validation**   | I         | C                   | **R**      | C        | I     |
| **Gate 2 coordination** | **R**     | -                   | C          | -        | I     |
| **Gate 3 coordination** | **R**     | -                   | C          | -        | I     |
| **Gate 4 approval**     | **R**     | C                   | **R**      | -        | **A** |
| **Database import**     | I         | C                   | C          | **R**    | I     |
| **Testing**             | I         | C                   | **R**      | **R**    | I     |
| **Deployment**          | C         | **R**               | C          | **R**    | **A** |

**Legend:**

- **R** = Responsible (does the work)
- **A** = Accountable (final approval)
- **C** = Consulted (input needed)
- **I** = Informed (kept updated)

---

## Resource Requirements

### Team Availability

**Required Commitment:**

| Role                 | Days | Hours/Day | Total Hours | Notes               |
| -------------------- | ---- | --------- | ----------- | ------------------- |
| **Developer**        | 7    | 4-6       | 28-42 hours | Focus: Day 1-3, 6-7 |
| **PM**               | 7    | 2-3       | 14-21 hours | Focus: Day 1, 4-5   |
| **QA**               | 7    | 2-4       | 14-28 hours | Focus: Day 2, 6     |
| **Architect**        | 7    | 1-2       | 7-14 hours  | Advisory, Day 1     |
| **Tarot Expert**     | 2    | 3-4       | 6-8 hours   | External, Day 4-5   |
| **Thai Proofreader** | 2    | 2-3       | 4-6 hours   | External, Day 4-5   |

**Total Internal Effort:** 63-105 person-hours over 7 days

**External Dependency:** 10-14 hours (expert reviews)

---

## Budget Allocation

### Detailed Budget

```yaml
Personnel Costs (Internal):
  Development: 30-40 hours @ included in salary
  PM: 15-20 hours @ included in salary
  QA: 15-25 hours @ included in salary
  Subtotal: Salaried (no additional cost)

External Costs:
  Anthropic API:
    - 78 cards generation: ฿30-50
    - Regenerations (10%): ฿10-25
    Subtotal: ฿40-75

  Tarot Expert:
    - Pilot review (10 cards): ฿400-800
    - Full review (78 cards): ฿2,600-5,200
    Subtotal: ฿3,000-6,000

  Thai Proofreader:
    - Full proofread (78 cards): ฿2,000-3,200
    Subtotal: ฿2,000-3,200

  Content Manager (Final QA):
    - Final review and sign-off: ฿2,400
    Subtotal: ฿2,400

  TOTAL EXTERNAL: ฿7,440-11,675

  Contingency (10%): ฿750-1,200

  GRAND TOTAL: ฿8,190-12,875

Recommended PO Approval: ฿12,000 (safe budget with buffer)
```

---

## Risk Management Plan

### Top 5 Risks & Mitigation

**1. Expert Reviewer Unavailable (Probability: Medium, Impact: High)**

```
Mitigation:
- Post jobs on Day 1 (3 days before needed)
- Pre-identify 2-3 backup candidates
- Offer expedited payment for faster turnaround
- Buffer time: 2 days in schedule

Contingency:
- Use backup reviewers
- Extend timeline by 2 days (acceptable)
- Worst case: PM reviews with tarot reference books
```

**2. AI Quality Below Threshold (Probability: Low, Impact: High)**

```
Mitigation:
- Pilot test with 10 cards first (Day 2)
- Refine prompts based on pilot
- Few-shot examples for consistency
- Temperature tuning (0.5-0.9)

Contingency:
- Manual writing for problematic cards (up to 20 cards)
- Hybrid approach: AI draft + heavy human editing
- Extend timeline if needed
```

**3. Timeline Overrun (Probability: Low, Impact: Medium)**

```
Mitigation:
- 2-day buffer built in (5 days work, 7 days schedule)
- Parallel expert reviews (Gate 2 + 3 same time)
- Daily progress tracking
- Early blocker escalation

Contingency:
- Prioritize Major Arcana (22 cards) if time critical
- Deploy in phases (22 cards first, 56 later)
```

**4. Budget Overrun (Probability: Low, Impact: Low)**

```
Mitigation:
- Fixed-price contracts with experts
- API cost predictable (฿30-75 max)
- 10% contingency included

Contingency:
- Reduce expert review scope (sample review)
- Use cheaper reviewers (trade quality)
- Cut content manager review (not recommended)
```

**5. Technical Issues (API, Scripts) (Probability: Low, Impact: Medium)**

```
Mitigation:
- Test API connection Day 1
- Pilot with 1 card before batch
- Error handling and retries in code
- Architect available for support

Contingency:
- Use OpenAI GPT-4 as fallback API
- Manual content writing (last resort)
```

---

## Communication Plan

### Daily Updates

**Format:** Slack/Email standup summary

**Template:**

```
📊 Day X Update - Content Generation Sprint

Progress: X% complete

Today's Accomplishments:
- [Completed task 1]
- [Completed task 2]

Blockers:
- [Blocker 1] - Owner: X, ETA: X
- [Blocker 2] - Owner: Y, ETA: Y

Tomorrow's Plan:
- [Task 1] - Owner: X
- [Task 2] - Owner: Y

Status: 🟢 On track | 🟡 Minor issues | 🔴 Needs attention

— [Reporter]
```

**Frequency:** Daily at 17:00

**Recipients:** Team + Project Owner

---

### Milestone Reports

**Report 1: Day 2 - Pilot Complete**

- Quality assessment results
- Go/No-Go decision rationale
- Adjustments made (if any)

**Report 2: Day 5 - Reviews Complete**

- Expert feedback summary
- Approval rates (Gate 2, Gate 3)
- Revisions needed and status

**Report 3: Day 7 - Production Launch**

- Final deployment confirmation
- All quality gates passed evidence
- Post-launch monitoring plan
- Sprint retrospective summary

---

## Success Metrics

### Key Performance Indicators

**Timeline KPIs:**

- ✅ Day 1 setup complete: [ ] Yes [ ] Delayed
- ✅ Day 2 pilot approved: [ ] Yes [ ] Needs work
- ✅ Day 3 generation complete: [ ] 78/78 [ ] Partial
- ✅ Day 5 reviews complete: [ ] Yes [ ] Delayed
- ✅ Day 7 production deploy: [ ] Yes [ ] Delayed

**Quality KPIs:**

- ✅ Gate 1 pass rate: ≥100%
- ✅ Gate 2 expert rating: ≥4.5/5 stars
- ✅ Gate 3 language rating: ≥4.5/5 stars
- ✅ Revision rate: ≤10% (max 8 cards)
- ✅ Zero P0 bugs post-launch

**Budget KPIs:**

- ✅ Total spend: ≤฿12,000
- ✅ API costs: ≤฿100
- ✅ Expert costs: ≤฿9,500
- ✅ No unplanned expenses

**Business KPIs (Post-Launch Week 1):**

- ✅ User complaints: <1% of readings
- ✅ Reading completion rate: ≥80%
- ✅ Time-on-page: ≥2 minutes
- ✅ No viral negative feedback

---

## Approval Section

### Project Owner Sign-off

**I approve this 7-day implementation plan:**

- [ ] Budget approved: ฿12,000
- [ ] Timeline approved: Dec 31 - Jan 6
- [ ] Team commitment confirmed
- [ ] Risks acknowledged and accepted
- [ ] Expert hiring authorized (up to ฿9,000)
- [ ] Daily progress tracking agreed
- [ ] Success criteria clear

**Signature:** ********\_\_\_\_********  
**Date:** ********\_\_\_\_********  
**Next Review:** Day 3 (Jan 2) progress check

---

## Attachments

1. **QA Review Report** - Overall assessment and risks
2. **PRD v0.2** - Story 1.14 requirements
3. **Architecture v1.2** - Technical implementation guide
4. **Budget breakdown** - Detailed cost analysis
5. **RACI matrix** - Team responsibilities

---

## Contact & Escalation

**For Questions:**

- Implementation: @winston (Architect)
- Quality: @quinn (QA)
- Budget/Timeline: @john (PM)

**For Decisions:**

- Project Owner: [Your name/contact]

**For Escalations:**

- Blockers → PM → PO
- Technical issues → Architect → PO
- Quality issues → QA → PO

**Daily Check-in:** 9:00 AM standup (10 minutes)

---

**Status:** ⏳ Awaiting Project Owner approval to begin Day 1

---

_Prepared by Quinn (QA Lead) - December 30, 2025_
