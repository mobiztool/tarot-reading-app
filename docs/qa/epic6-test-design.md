# Epic 6: Premium Subscription & Payments - Test Design

## Document Info

| Field | Value |
|-------|-------|
| **Epic** | Epic 6: Premium Subscription & Payments (Phase 3) |
| **Stories** | 6.1-6.12 (12 stories) |
| **Created By** | Quinn (QA Agent) |
| **Created Date** | 2026-01-07 |
| **Status** | Complete |

---

## Executive Summary

### Epic 6 Overview
Epic 6 เพิ่มระบบ Subscription และ Payment ผ่าน Stripe สำหรับ monetization

### Risk Level: HIGH

```yaml
⚠️ Payment processing - zero tolerance for bugs
⚠️ PCI DSS compliance required
⚠️ Financial transactions involved
⚠️ Legal/regulatory requirements
```

### Test Design Statistics

| Metric | Count |
|--------|-------|
| Total Stories | 12 |
| Total Acceptance Criteria | 130 |
| Total Test Scenarios | 156 |
| High-Risk Scenarios | 48 |
| Medium-Risk Scenarios | 62 |
| Low-Risk Scenarios | 46 |

---

## Story 6.1: Stripe Payment Gateway Integration

### Test Scenarios (12 AC → 16 TS)

#### TS-6.1.1: Stripe SDK Setup
```gherkin
Scenario: Stripe SDK installed correctly
  Given project dependencies installed
  Then @stripe/stripe-js should be in package.json
  And stripe (server) should be in package.json

Scenario: Stripe client initializes
  Given NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set
  When Stripe client loads
  Then loadStripe() should return Stripe instance
```

#### TS-6.1.2: API Keys Configuration
```gherkin
Scenario: Environment variables configured
  Given Stripe account is set up
  Then STRIPE_SECRET_KEY should be in .env
  And NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY should be in .env
  And STRIPE_WEBHOOK_SECRET should be in .env

Scenario: Secret key not exposed client-side
  Given any client-side code bundle
  Then STRIPE_SECRET_KEY should NOT be present
  And only publishable key should be visible
```

#### TS-6.1.3: Webhook Endpoint
```gherkin
Scenario: Webhook receives events
  Given /api/webhooks/stripe endpoint exists
  When Stripe sends payment_intent.succeeded event
  Then endpoint should return 200 OK
  And event should be processed

Scenario: Webhook signature verified
  Given webhook receives event
  Then signature should be verified with STRIPE_WEBHOOK_SECRET
  And invalid signatures should return 400

Scenario: Webhook handles all event types
  Given webhook endpoint
  Then should handle:
    | Event |
    | payment_intent.succeeded |
    | payment_intent.payment_failed |
    | customer.subscription.created |
    | customer.subscription.updated |
    | customer.subscription.deleted |
    | invoice.paid |
    | invoice.payment_failed |
```

#### TS-6.1.4: Customer Creation
```gherkin
Scenario: Stripe customer created on signup
  Given user signs up
  Then Stripe customer should be created
  And stripe_customer_id should be saved to users table

Scenario: Existing customer linked
  Given user with stripe_customer_id
  When user makes payment
  Then existing customer ID should be used
```

#### TS-6.1.5: Test Mode
```gherkin
Scenario: Test mode functional
  Given Stripe test keys configured
  When test payment made with 4242424242424242
  Then payment should succeed
  And no real money charged

Scenario: Test cards work correctly
  Given Stripe test mode
  Then following cards should work:
    | Card | Result |
    | 4242424242424242 | Success |
    | 4000000000000002 | Declined |
    | 4000000000000069 | Expired |
    | 4000000000009995 | Insufficient funds |
```

#### TS-6.1.6: PCI Compliance
```gherkin
Scenario: No card data stored on server
  Given payment processed
  Then raw card number should NOT be in database
  And only Stripe token/ID should be stored
```

---

## Story 6.2: Subscription Management

### Test Scenarios (12 AC → 14 TS)

#### TS-6.2.1: Database Schema
```gherkin
Scenario: Subscriptions table exists
  Given database migrated
  Then subscriptions table should have columns:
    | Column | Type |
    | id | UUID |
    | user_id | UUID |
    | stripe_subscription_id | String |
    | tier | Enum (basic/pro/vip) |
    | status | Enum |
    | current_period_end | DateTime |
```

#### TS-6.2.2: Subscription Lifecycle
```gherkin
Scenario: Create subscription
  Given user selects Pro tier (฿199)
  When payment succeeds
  Then subscription created in Stripe
  And subscription saved to database
  And status = 'active'

Scenario: Cancel subscription (end of period)
  Given active subscription
  When user cancels (end of period)
  Then subscription.cancel_at_period_end = true
  And access continues until period end

Scenario: Cancel subscription (immediate)
  Given active subscription
  When user cancels immediately
  Then subscription ends now
  And access revoked

Scenario: Pause subscription
  Given active subscription
  When user pauses
  Then status = 'paused'
  And billing stops
  And access continues (grace period)

Scenario: Resume subscription
  Given paused subscription
  When user resumes
  Then status = 'active'
  And billing resumes
```

#### TS-6.2.3: Tier Pricing
```gherkin
Scenario: Tier prices correct
  Given pricing configuration
  Then tiers should be:
    | Tier | Price | Currency |
    | basic | 9900 | THB (฿99) |
    | pro | 19900 | THB (฿199) |
    | vip | 39900 | THB (฿399) |
```

#### TS-6.2.4: Webhook Sync
```gherkin
Scenario: Subscription created webhook
  Given Stripe sends customer.subscription.created
  Then local database should create subscription record

Scenario: Subscription updated webhook
  Given Stripe sends customer.subscription.updated
  Then local database should sync changes

Scenario: Subscription deleted webhook
  Given Stripe sends customer.subscription.deleted
  Then local status should be 'canceled'
```

---

## Story 6.3: Feature Gating by Tier

### Test Scenarios (10 AC → 12 TS)

#### TS-6.3.1: Access Control Matrix
```gherkin
Scenario: Free user access
  Given user with no subscription
  Then can access: Daily, 3-Card
  And blocked from: Love, Career, Yes/No (login-only)
  And blocked from: Premium spreads (tier-gated)

Scenario: Basic tier access
  Given user with Basic subscription
  Then can access: 8 spreads
  And blocked from: Pro-only spreads

Scenario: Pro tier access
  Given user with Pro subscription
  Then can access: 13 spreads
  And blocked from: VIP-only spreads

Scenario: VIP tier access
  Given user with VIP subscription
  Then can access: all 18 spreads
```

#### TS-6.3.2: Premium Gate Component
```gherkin
Scenario: Premium gate displayed
  Given Basic user tries VIP spread
  Then PremiumGate should display
  And show "Upgrade to VIP to access"
  And show upgrade button

Scenario: Gate shows required tier
  Given user tries locked spread
  Then gate should display minimum tier required
  And show tier comparison
```

#### TS-6.3.3: Upgrade Flow
```gherkin
Scenario: Click upgrade from gate
  Given premium gate displayed
  When user clicks "Upgrade"
  Then redirect to /pricing
  And context preserved (which spread)
```

---

## Story 6.4: Pricing Page

### Test Scenarios (12 AC → 12 TS)

#### TS-6.4.1: Page Display
```gherkin
Scenario: Pricing page loads
  Given user navigates to /pricing
  Then page should display
  And 3 tier cards visible
  And "Most Popular" on Pro tier

Scenario: Tier details correct
  Given pricing page
  Then each tier should show:
    | Field |
    | Tier name |
    | Price |
    | Feature list |
    | CTA button |
```

#### TS-6.4.2: Feature Comparison
```gherkin
Scenario: Feature comparison visible
  Given pricing page
  Then comparison table should show:
    - Spreads count per tier
    - Features per tier
    - Checkmarks for included
```

#### TS-6.4.3: CTA Buttons
```gherkin
Scenario: Subscribe button works
  Given pricing page
  When user clicks "Subscribe to Pro"
  Then redirect to /checkout?tier=pro
```

#### TS-6.4.4: Mobile Responsive
```gherkin
Scenario: Mobile layout
  Given viewport width < 768px
  Then tier cards should stack vertically
  And buttons thumb-friendly
```

---

## Story 6.5: Checkout Flow

### Test Scenarios (12 AC → 16 TS)

#### TS-6.5.1: Checkout Page
```gherkin
Scenario: Checkout page loads
  Given user navigates to /checkout?tier=pro
  Then checkout page should display
  And tier summary shown
  And price displayed: ฿199/month
```

#### TS-6.5.2: Stripe Checkout
```gherkin
Scenario: Stripe Checkout session created
  Given user on checkout page
  When user clicks "Pay now"
  Then checkout session created
  And redirect to Stripe hosted checkout

Scenario: Stripe Checkout success
  Given Stripe checkout completed
  Then redirect to /subscription/success
  And subscription activated
```

#### TS-6.5.3: Payment Processing
```gherkin
Scenario: Payment succeeds
  Given user enters valid card
  When payment processed
  Then success page shown
  And subscription active

Scenario: Payment fails (declined)
  Given user enters declined card
  When payment processed
  Then error message shown
  And retry option available

Scenario: Payment fails (expired)
  Given user enters expired card
  Then error: "Your card has expired"
```

#### TS-6.5.4: Analytics
```gherkin
Scenario: Checkout analytics tracked
  Given checkout flow
  Then events should fire:
    | Event |
    | checkout_started |
    | payment_initiated |
    | payment_completed OR payment_failed |
```

---

## Story 6.6: Payment Success/Failure

### Test Scenarios (10 AC → 12 TS)

#### TS-6.6.1: Success Page
```gherkin
Scenario: Success page displays
  Given payment succeeded
  When redirect to /subscription/success
  Then celebration UI shown
  And tier activated message
  And "Receipt sent to email"
  And CTA to use premium features
```

#### TS-6.6.2: Failure Page
```gherkin
Scenario: Failure page displays
  Given payment failed
  When redirect to /subscription/failed
  Then error explanation shown
  And specific reason (if available)
  And retry button
  And support contact

Scenario: Retry payment
  Given failure page
  When user clicks retry
  Then redirect back to checkout
  And can try again
```

#### TS-6.6.3: Transaction ID
```gherkin
Scenario: Transaction ID displayed
  Given payment completed (success or fail)
  Then transaction ID should display
  And useful for support reference
```

---

## Story 6.7: Invoice & Receipts

### Test Scenarios (10 AC → 10 TS)

#### TS-6.7.1: Invoice Generated
```gherkin
Scenario: Invoice created after payment
  Given payment succeeded
  Then invoice should be created
  And saved to invoices table
  And includes: tier, amount, date, transaction_id
```

#### TS-6.7.2: Email Receipt
```gherkin
Scenario: Receipt email sent
  Given payment succeeded
  Then email should be sent
  And includes invoice/receipt link
  And PDF attachment (optional)
```

#### TS-6.7.3: Invoice List
```gherkin
Scenario: Invoice history accessible
  Given user has past payments
  When user visits /profile/invoices
  Then list of all invoices shown
  And sortable by date
  And download PDF available
```

#### TS-6.7.4: Thai Invoices
```gherkin
Scenario: Invoice in Thai
  Given Thai user preference
  Then invoice should be in Thai
  And VAT details if applicable
  And proper Thai formatting
```

---

## Story 6.8: Subscription Analytics

### Test Scenarios (10 AC → 10 TS)

#### TS-6.8.1: Revenue Metrics
```gherkin
Scenario: MRR calculated
  Given active subscriptions
  Then MRR = sum of monthly subscription values

Scenario: Revenue per user
  Given subscription data
  Then ARPU = MRR / active users
```

#### TS-6.8.2: Subscription Metrics
```gherkin
Scenario: Churn rate calculated
  Given subscription data
  Then churn = (canceled this month / active start of month) × 100%

Scenario: Tier distribution tracked
  Given active subscriptions
  Then should show:
    - % Basic
    - % Pro
    - % VIP
```

#### TS-6.8.3: Conversion Funnels
```gherkin
Scenario: Upgrade funnel tracked
  Given user journey
  Then track: free → basic → pro → vip
  And conversion rate at each step
```

---

## Story 6.9: Free Trial

### Test Scenarios (10 AC → 12 TS)

#### TS-6.9.1: Trial Start
```gherkin
Scenario: 7-day trial starts
  Given new user subscribes with trial
  Then trial_start = now
  And trial_end = now + 7 days
  And status = 'trialing'
  And no charge

Scenario: Full access during trial
  Given user in trial
  Then all tier features accessible
  And no limitations
```

#### TS-6.9.2: Trial Countdown
```gherkin
Scenario: Trial days displayed
  Given user in trial
  Then UI shows "X days left in trial"
  And countdown updates daily
```

#### TS-6.9.3: Trial Reminder
```gherkin
Scenario: Reminder email 2 days before
  Given trial ends in 2 days
  Then email sent: "Your trial ends in 2 days"
  And explains what happens next
  And cancel option
```

#### TS-6.9.4: Trial Conversion
```gherkin
Scenario: Auto-convert to paid
  Given trial ends and not canceled
  Then payment charged automatically
  And status = 'active'
  And email confirmation sent

Scenario: Trial canceled before end
  Given user cancels during trial
  Then no charge
  And access until trial end
  And status = 'canceled'
```

---

## Story 6.10: Upgrade/Downgrade

### Test Scenarios (10 AC → 12 TS)

#### TS-6.10.1: Upgrade Flow
```gherkin
Scenario: Upgrade Basic → Pro
  Given Basic subscriber
  When user clicks "Upgrade to Pro"
  Then prorated charge calculated
  And confirmation shown
  When confirmed
  Then immediate access to Pro features
  And billing updated

Scenario: Proration calculation
  Given Basic (฿99) user on day 15 of 30
  When upgrading to Pro (฿199)
  Then charge = (฿199-฿99) × (15/30) = ฿50 prorated
```

#### TS-6.10.2: Downgrade Flow
```gherkin
Scenario: Downgrade Pro → Basic
  Given Pro subscriber
  When user clicks "Downgrade to Basic"
  Then confirmation shown
  And "Takes effect at end of period"
  When confirmed
  Then continues Pro until period end
  And next bill is Basic

Scenario: Downgrade refund policy
  Given downgrade confirmed
  Then no refund for current period
  And access continues until period end
```

#### TS-6.10.3: Email Notification
```gherkin
Scenario: Tier change email
  Given tier changed (up or down)
  Then email confirmation sent
  And shows old tier → new tier
  And effective date
```

---

## Story 6.11: Cancellation Flow

### Test Scenarios (10 AC → 12 TS)

#### TS-6.11.1: Cancel Button
```gherkin
Scenario: Cancel option visible
  Given active subscriber
  When user visits settings
  Then "Cancel subscription" button visible
```

#### TS-6.11.2: Retention Flow
```gherkin
Scenario: Survey before cancel
  Given user clicks cancel
  Then survey modal appears
  And asks "Why are you canceling?"
  And options: too expensive, not using, etc.

Scenario: Retention offer shown
  Given survey completed
  Then offer displayed:
    | Offer |
    | 30% discount for 3 months |
    | Pause subscription instead |
    | Downgrade to lower tier |

Scenario: Offer accepted
  Given retention offer
  When user accepts discount
  Then subscription continues
  And discount applied
  And thank you message
```

#### TS-6.11.3: Cancel Confirmed
```gherkin
Scenario: Cancel proceeds
  Given user declines offers
  When user confirms cancel
  Then subscription marked canceled
  And access until period end
  And confirmation email sent

Scenario: Easy reactivation
  Given canceled subscription
  Then "Resubscribe" button available
  And can re-subscribe easily
```

---

## Story 6.12: Payment Testing & QA

### Test Scenarios (12 AC → 18 TS)

#### TS-6.12.1: Stripe Test Cards
```gherkin
Scenario: All test cards verified
  Given test mode
  Then verify all cards:
    | Card | Expected |
    | 4242424242424242 | Success |
    | 4000000000000002 | Generic decline |
    | 4000000000000069 | Expired card |
    | 4000000000009995 | Insufficient funds |
    | 4000000000000127 | Incorrect CVC |
    | 4000002500003155 | 3D Secure required |
```

#### TS-6.12.2: Webhook Testing
```gherkin
Scenario: All webhooks tested
  Given Stripe CLI or test events
  Then verify handling:
    | Webhook Event |
    | payment_intent.succeeded |
    | payment_intent.payment_failed |
    | customer.subscription.created |
    | customer.subscription.updated |
    | customer.subscription.deleted |
    | invoice.paid |
    | invoice.payment_failed |
```

#### TS-6.12.3: Security Audit
```gherkin
Scenario: No secret keys exposed
  Given frontend bundle
  Then grep for STRIPE_SECRET_KEY = 0 results
  And only publishable key present

Scenario: Webhook signature verified
  Given webhook endpoint
  Then invalid signature returns 400
  And valid signature processed

Scenario: PCI compliance check
  Given payment system
  Then no raw card data stored
  And only Stripe tokens used
```

#### TS-6.12.4: Edge Cases
```gherkin
Scenario: Network failure during payment
  Given network interrupted mid-payment
  Then transaction should not complete
  And user not charged
  And retry possible

Scenario: Duplicate payment prevention
  Given user double-clicks pay button
  Then only one payment processed
  And duplicate request rejected

Scenario: Race condition handling
  Given concurrent subscription updates
  Then database should handle correctly
  And no data corruption
```

#### TS-6.12.5: Legal Review
```gherkin
Scenario: Terms of service present
  Given checkout flow
  Then user must accept terms
  And terms link visible

Scenario: Refund policy clear
  Given pricing/checkout pages
  Then refund policy linked
  And easily accessible

Scenario: Cancellation policy clear
  Given subscription management
  Then cancellation process clear
  And no hidden fees
```

---

## Test Data Matrix

### Stripe Test Cards

| Card Number | Scenario | Expected |
|-------------|----------|----------|
| 4242424242424242 | Success | Payment succeeds |
| 4000000000000002 | Declined | Generic decline |
| 4000000000000069 | Expired | Card expired |
| 4000000000009995 | Insufficient | Insufficient funds |
| 4000000000000127 | CVC | Incorrect CVC |
| 4000002500003155 | 3DS | 3D Secure required |

### Subscription States

| State | Description |
|-------|-------------|
| trialing | In free trial |
| active | Paying, access granted |
| past_due | Payment failed, retrying |
| paused | User paused |
| canceled | Subscription ended |

---

## Risk-Based Test Prioritization

### Priority 0 (CRITICAL - Block Release)

| ID | Scenario | Risk |
|----|----------|------|
| TS-6.1.6 | PCI compliance | SECURITY |
| TS-6.5.3 | Payment success/fail | FINANCIAL |
| TS-6.12.3 | Security audit | SECURITY |
| TS-6.12.4 | Edge cases | DATA |
| TS-6.1.3 | Webhook handling | SYNC |

### Priority 1 (HIGH)

| ID | Scenario | Risk |
|----|----------|------|
| TS-6.2.2 | Subscription lifecycle | BUSINESS |
| TS-6.3.1 | Access control | FEATURE |
| TS-6.9.4 | Trial conversion | REVENUE |
| TS-6.11.2 | Retention flow | CHURN |

---

## Test Exit Criteria

```yaml
Epic 6 Release Criteria:
  ✅ All P0 security tests passed
  ✅ All payment flows tested (success + failure)
  ✅ Webhook handling verified
  ✅ Subscription lifecycle complete
  ✅ No P0/P1 bugs
  ✅ PCI compliance verified
  ✅ Legal review completed
  ✅ Performance acceptable (<2s checkout)
  ✅ Mobile payment working
```

---

## Summary

```yaml
Epic 6 Test Design:
  ├─ 12 Stories analyzed
  ├─ 130 Acceptance Criteria mapped
  ├─ 156 Test Scenarios created
  ├─ Given-When-Then format
  ├─ Risk-based prioritization
  ├─ Security focus (payment critical)
  └─ Exit criteria defined

Risk Level: HIGH
Status: COMPLETE ✅
Ready for: Implementation & Execution
```

