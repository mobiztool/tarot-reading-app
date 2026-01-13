# Test Design: Epic 6 - Remaining Stories (6.6-6.12)

**Epic:** 6 - Payment & Subscription System  
**QA Engineer:** Quinn (Test Architect)  
**Date:** 2026-01-13

---

## Story 6.6: Payment Success & Failure Handling

### Risk Level: LOW (Presentation layer)

### Key Test Scenarios
1. **Success Page Display (P0)**
   - TC-6.6-001: Success page shows celebration animation
   - TC-6.6-002: Displays activated tier and features
   - TC-6.6-003: Shows transaction ID
   - TC-6.6-004: Email confirmation message

2. **Failure Page Display (P0)**
   - TC-6.6-010: Failure page shows error message
   - TC-6.6-011: Thai error messages
   - TC-6.6-012: Retry button redirects to checkout
   - TC-6.6-013: Support contact info visible

3. **E2E Flow (P0)**
   - Success flow: Payment → Success page → Profile shows new tier
   - Failure flow: Failed payment → Failure page → Retry works

**Estimated Effort:** 1 day

---

## Story 6.7: Invoice Generation & Email Receipts

### Risk Level: MEDIUM (Email integration incomplete)

### Key Test Scenarios
1. **Invoice Webhook Handler (P0)**
   - TC-6.7-001: invoice.paid → saved to database
   - TC-6.7-002: Invoice includes all required fields
   - TC-6.7-003: PDF URL stored correctly
   - TC-6.7-004: invoice.payment_failed → status updated

2. **Invoice Retrieval API (P1)**
   - TC-6.7-010: GET /api/invoices → returns user invoices
   - TC-6.7-011: Sorted by date (newest first)
   - TC-6.7-012: Includes PDF download links

3. **Email Service (P1) - BLOCKED**
   - TC-6.7-020: Email sent after invoice.paid (TODO: implement email service)
   - TC-6.7-021: Email includes PDF attachment
   - TC-6.7-022: Thai language email template

**Blockers:** Email service integration not complete (TODO placeholders)

**Estimated Effort:** 2 days (+ email service implementation)

---

## Story 6.8: Subscription Analytics & Metrics

### Risk Level: HIGH (Financial calculations)

### Key Test Scenarios
1. **Revenue Calculations (P0)**
   - TC-6.8-001: calculateMRR() accurate for all tiers
   - TC-6.8-002: calculateARR() = MRR × 12
   - TC-6.8-003: Revenue per user calculation
   - TC-6.8-004: Edge case: zero users handled
   - TC-6.8-005: Edge case: trialing users excluded from MRR

2. **Churn Rate Calculations (P0)**
   - TC-6.8-010: Churn rate = cancellations / active_subs
   - TC-6.8-011: Time period filtering (day/week/month)
   - TC-6.8-012: Churn by tier breakdown

3. **Retention Metrics (P1)**
   - TC-6.8-020: Retention rate calculation
   - TC-6.8-021: Cohort analysis
   - TC-6.8-022: LTV calculation per tier

4. **Tier Distribution (P1)**
   - TC-6.8-030: Percentage per tier accurate
   - TC-6.8-031: Active vs inactive breakdown

**Estimated Effort:** 3 days

---

## Story 6.9: Free Trial (7 Days) Implementation

### Risk Level: LOW (Stripe-managed)

### Key Test Scenarios
1. **Trial Configuration (P0)**
   - TC-6.9-001: Checkout includes trial_period_days=7
   - TC-6.9-002: No charge during trial
   - TC-6.9-003: Trial end date set correctly

2. **Trial Status Display (P1)**
   - TC-6.9-010: Trial banner shows days remaining
   - TC-6.9-011: Trial countdown accurate
   - TC-6.9-012: Trial end date displayed

3. **Trial Conversion (P0)**
   - TC-6.9-020: Trial → Active after 7 days (if paid)
   - TC-6.9-021: Webhook subscription.updated tracked
   - TC-6.9-022: Analytics event "trial_converted"

4. **Trial Cancellation (P1)**
   - TC-6.9-030: Cancel during trial → no charge
   - TC-6.9-031: Analytics event "trial_canceled"

**Estimated Effort:** 1 day

---

## Story 6.10: Upgrade & Downgrade Flow

### Risk Level: HIGH (Billing logic)

### Key Test Scenarios
1. **Upgrade Flow (P0)**
   - TC-6.10-001: Basic → Pro upgrade API works
   - TC-6.10-002: Immediate access to Pro features
   - TC-6.10-003: Prorated billing applied
   - TC-6.10-004: Webhook subscription.updated triggered
   - TC-6.10-005: Database tier updated immediately

2. **Downgrade Flow (P0)**
   - TC-6.10-010: Pro → Basic downgrade API works
   - TC-6.10-011: Scheduled for period end (not immediate)
   - TC-6.10-012: Pro access until period end
   - TC-6.10-013: No refund (industry standard)
   - TC-6.10-014: Confirmation modal shown

3. **Proration Calculations (P0)**
   - TC-6.10-020: Proration amount calculated correctly
   - TC-6.10-021: Charged difference only
   - TC-6.10-022: Proration explanation shown to user

4. **E2E Flow (P0)**
   - Upgrade: Select tier → Confirm → Pay prorated amount → Immediate access
   - Downgrade: Select tier → Confirm → Access until period end → Then downgrade

**Estimated Effort:** 3 days

---

## Story 6.11: Cancellation Flow with Retention Offers

### Risk Level: MEDIUM-HIGH (Revenue retention)

### Key Test Scenarios
1. **Cancellation Survey (P1)**
   - TC-6.11-001: Survey shows 7 cancellation reasons
   - TC-6.11-002: Optional feedback textarea
   - TC-6.11-003: Survey data saved to database
   - TC-6.11-004: Analytics event "cancellation_survey_completed"

2. **Retention Offers (P0)**
   - TC-6.11-010: Discount offer shown (20% off 3 months)
   - TC-6.11-011: Pause subscription option shown
   - TC-6.11-012: Downgrade option shown
   - TC-6.11-013: Accept offer → subscription continues with modification
   - TC-6.11-014: Decline offers → proceed to cancel

3. **Cancellation API (P0)**
   - TC-6.11-020: Immediate cancel → ends now
   - TC-6.11-021: Cancel at period end → grace period
   - TC-6.11-022: Stripe subscription.updated triggered
   - TC-6.11-023: Database cancel_at field updated

4. **Analytics Tracking (P1)**
   - TC-6.11-030: cancellation_attempted event
   - TC-6.11-031: retention_offer_accepted event
   - TC-6.11-032: cancellation_completed event
   - TC-6.11-033: Cancellation reason tracked

5. **E2E Flow (P0)**
   - Full flow: Cancel button → Survey → Retention offers → Accept/Decline → Confirmation

**Estimated Effort:** 3 days

---

## Story 6.12: Payment Testing & Security QA

### Risk Level: MEDIUM (Testing story itself)

### Key Test Scenarios

**Note:** Story 6.12 is a QA/testing story that defines the manual testing requirements. Most test scenarios for this story are the ACTUAL EXECUTION of tests defined in other stories.

1. **Stripe Test Cards Matrix (P0)**
   - Execute all test card scenarios (success, decline, etc.)
   - Document results in test matrix

2. **Webhook Testing with Stripe CLI (P0)**
   - Trigger all webhook events
   - Verify database updates
   - Verify email notifications (when implemented)
   - Verify analytics tracking

3. **Security Audit Checklist (P0)**
   - Verify no secret keys in client code
   - Verify webhook signature verification
   - Verify PCI compliance
   - Verify HTTPS enforcement

4. **Cross-browser Testing (P1)**
   - Chrome, Safari, Firefox
   - Mobile browsers (iOS Safari, Chrome Android)

5. **Performance Testing (P2)**
   - API response times < 500ms
   - Checkout session creation < 2s
   - Webhook processing < 500ms

6. **Manual Test Execution (P0)**
   - Execute all P0 test cases from Stories 6.1-6.11
   - Document pass/fail results
   - Create bug reports for failures

**Deliverables:**
- Test execution report
- Bug list (if any)
- Security audit sign-off
- QA approval for production

**Estimated Effort:** 5-7 days (full Epic 6 testing)

---

## Overall Epic 6 Test Summary

### Total Test Cases Estimated: 200+

| Story | Test Cases | Priority P0 | Estimated Effort |
|-------|-----------|-------------|------------------|
| 6.1 | 85+ | 60% | ✅ Complete |
| 6.2 | 40+ | 70% | 4-5 days |
| 6.3 | 35+ | 65% | 4 days |
| 6.4 | 15+ | 40% | 1 day |
| 6.5 | 20+ | 75% | 2-3 days |
| 6.6 | 10+ | 50% | 1 day |
| 6.7 | 15+ | 60% | 2 days |
| 6.8 | 20+ | 70% | 3 days |
| 6.9 | 12+ | 50% | 1 day |
| 6.10 | 25+ | 75% | 3 days |
| 6.11 | 25+ | 65% | 3 days |
| 6.12 | Manual | 100% | 5-7 days |

### **Total Estimated Effort: 30-35 days**
(Can be parallelized with multiple QA engineers)

---

## Test Execution Strategy

### Phase 1: Critical Path (Stories 6.1, 6.2, 6.3, 6.5)
- Payment integration
- Subscription management
- Access control
- Checkout flow
- **Duration:** 2 weeks

### Phase 2: Supporting Features (Stories 6.7, 6.8, 6.10, 6.11)
- Invoice system
- Analytics
- Upgrade/downgrade
- Cancellation
- **Duration:** 1.5 weeks

### Phase 3: Polish & QA (Stories 6.4, 6.6, 6.9, 6.12)
- Pricing page
- Success/failure pages
- Free trial
- Full Epic testing
- **Duration:** 1 week

---

## Success Criteria for Epic 6

✅ **All P0 Tests Passing:**
- [ ] Payment flows working with test cards
- [ ] Subscription management verified
- [ ] Access control preventing unauthorized access
- [ ] Webhooks syncing correctly
- [ ] No security vulnerabilities found

✅ **Code Coverage:**
- [ ] Unit tests: >90%
- [ ] Integration tests: >85%
- [ ] E2E tests: All critical paths covered

✅ **QA Sign-off:**
- [ ] Manual testing complete (Story 6.12)
- [ ] Security audit passed
- [ ] Performance acceptable
- [ ] Ready for production launch

---

**Next Steps:**
1. Review all test designs with team
2. Prioritize test implementation (Phase 1 first)
3. Set up test infrastructure (test DB, Stripe test mode)
4. Begin test implementation
5. Execute tests and fix bugs
6. Final QA sign-off

**Prepared by:** Quinn (Test Architect)  
**Date:** 2026-01-13  
**Status:** Test design complete, ready for implementation
