# Test Suite: Story 6.1 - Stripe Payment Gateway Integration

เอกสารนี้อธิบายวิธีการรัน automated tests สำหรับ Story 6.1

## 📋 Test Coverage Summary

| Test Type | Files | Coverage Target | Status |
|-----------|-------|-----------------|--------|
| **Unit Tests** | 2 files | >90% | ✅ Ready |
| **Integration Tests** | 1 file | >85% | ✅ Ready |
| **E2E Tests** | 1 file | Key flows | ✅ Ready |

### Test Files Created

```
tests/
├── unit/
│   └── stripe/
│       ├── customer.test.ts        # Customer management functions
│       └── errors.test.ts          # Error handling & Thai localization
├── integration/
│   └── stripe/
│       └── webhook.test.ts         # Webhook event handlers
└── e2e/
    └── payment-flow.spec.ts        # Complete payment flows
```

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
pnpm install

# Set up test environment variables
cp .env.example .env.test.local

# Add Stripe test keys to .env.test.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

### Run All Tests

```bash
# Run all unit + integration tests
pnpm test

# Run with coverage report
pnpm test:coverage

# Run E2E tests (requires running server)
pnpm test:e2e
```

### Run Specific Test Suites

```bash
# Unit tests only
pnpm vitest tests/unit/stripe

# Integration tests only
pnpm vitest tests/integration/stripe

# Specific test file
pnpm vitest tests/unit/stripe/customer.test.ts

# E2E tests (Playwright)
pnpm playwright test tests/e2e/payment-flow.spec.ts
```

## 📊 Test Coverage Goals

Based on Quinn's review (2026-01-13):

### Unit Tests - Target: >90%

**`customer.test.ts`** - Customer Management
- ✅ createStripeCustomer() - all scenarios
- ✅ getOrCreateStripeCustomer() - with/without existing customer
- ✅ updateStripeCustomer() - success/error cases
- ✅ getStripeCustomer() - retrieval/error handling
- ✅ deleteStripeCustomer() - GDPR compliance
- ✅ syncUserToStripeCustomer() - profile sync

**`errors.test.ts`** - Error Handling
- ✅ All Stripe error types (Card, API, Connection, Auth, Rate Limit)
- ✅ All decline codes with Thai messages
- ✅ Non-Stripe error handling
- ✅ Sentry integration
- ✅ Error logging with context

**Expected Coverage:** >95% for both files

### Integration Tests - Target: >85%

**`webhook.test.ts`** - Webhook Handler
- ✅ Signature verification (valid/invalid)
- ✅ Customer events (created, updated, deleted)
- ✅ Payment Intent events (succeeded, failed)
- ✅ Subscription events (created, updated, deleted)
- ✅ Invoice events (paid, payment_failed)
- ✅ Error handling and retry prevention
- ✅ Idempotency (duplicate events)

**Expected Coverage:** >90%

### E2E Tests - Key User Flows

**`payment-flow.spec.ts`** - Complete Payment Flows
- ✅ Successful payment with test card (4242...)
- ✅ Declined card handling (4000...0002)
- ✅ Payment failure page
- ✅ Success page after payment
- ✅ Session timeout handling
- ✅ Security checks (no secret keys exposed)
- ✅ Webhook sync verification

## 🧪 Test Card Numbers

Use these Stripe test cards for E2E testing:

| Card Number | Scenario | Expected Result |
|-------------|----------|-----------------|
| 4242 4242 4242 4242 | Success | Payment succeeds |
| 4000 0000 0000 0002 | Decline | Card declined error |
| 4000 0000 0000 9995 | Insufficient Funds | Insufficient funds error |
| 4000 0000 0000 0069 | Expired Card | Card expired error |
| 4000 0025 0000 3155 | 3D Secure | Requires authentication |

Use any future expiry date (e.g., 12/34) and any 3-digit CVC (e.g., 123).

## 🔧 Running Tests Locally

### 1. Unit Tests (No server required)

```bash
# Watch mode for development
pnpm vitest --watch tests/unit/stripe

# Run once with coverage
pnpm vitest run tests/unit/stripe --coverage
```

### 2. Integration Tests (Requires test database)

```bash
# Set up test database
DATABASE_URL="postgresql://user:pass@localhost:5432/tarot_test" pnpm prisma migrate deploy

# Run integration tests
pnpm vitest tests/integration/stripe
```

### 3. E2E Tests (Requires running server)

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Run E2E tests
pnpm playwright test tests/e2e/payment-flow.spec.ts

# Run with UI mode
pnpm playwright test --ui

# Run specific test
pnpm playwright test -g "successful payment"
```

### 4. Webhook Testing with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

## 📈 Viewing Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# Open HTML report
open coverage/index.html
```

### Coverage Thresholds

Set in `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  thresholds: {
    lines: 90,
    functions: 90,
    branches: 85,
    statements: 90,
  },
  include: [
    'src/lib/stripe/**/*.ts',
    'src/app/api/webhooks/stripe/**/*.ts',
  ],
}
```

## 🐛 Debugging Tests

### Unit/Integration Tests

```bash
# Run tests in debug mode
node --inspect-brk ./node_modules/vitest/vitest.mjs run tests/unit/stripe/customer.test.ts

# Or use VS Code debugger with launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["vitest", "run", "${file}"],
  "console": "integratedTerminal"
}
```

### E2E Tests

```bash
# Run with headed browser
pnpm playwright test --headed

# Run with debugger
pnpm playwright test --debug

# Take screenshots on failure
pnpm playwright test --screenshot=only-on-failure
```

## ✅ Checklist Before Production

### Story 6.1 Test Requirements

- [ ] All unit tests passing (>90% coverage)
  - [ ] customer.test.ts: 100% pass
  - [ ] errors.test.ts: 100% pass
  
- [ ] All integration tests passing (>85% coverage)
  - [ ] webhook.test.ts: 100% pass
  
- [ ] All E2E tests passing
  - [ ] Successful payment flow
  - [ ] Declined payment handling
  - [ ] Session timeout handling
  
- [ ] Manual testing completed
  - [ ] Test all Stripe test cards
  - [ ] Verify webhook events with Stripe CLI
  - [ ] Check database sync
  
- [ ] Security verification
  - [ ] No secret keys in client code
  - [ ] Webhook signature verification working
  - [ ] HTTPS enforced (production)

## 📚 Additional Resources

- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Story 6.1 Requirements](../../../docs/stories/6.1.stripe-integration.md)
- [QA Gate Decision](../../../docs/qa/gates/6.1-stripe-integration.yml)

## 🆘 Troubleshooting

### Common Issues

**Test failing: "stripe is not defined"**
```bash
# Make sure mocks are set up correctly
# Check if @/lib/stripe/server is mocked at top of test file
```

**Webhook tests timing out**
```bash
# Increase timeout in vitest.config.ts
test: {
  testTimeout: 10000,
}
```

**E2E tests can't connect to server**
```bash
# Make sure dev server is running on correct port
# Check playwright.config.ts webServer configuration
```

**Coverage not reaching threshold**
```bash
# Check which files are not covered
pnpm test:coverage
# Add tests for uncovered lines shown in report
```

## 📞 Support

หากพบปัญหาในการรัน tests:

1. ตรวจสอบ environment variables ว่าตั้งค่าถูกต้อง
2. ตรวจสอบ Stripe test mode ใช้งานอยู่
3. ตรวจสอบ database connection (integration tests)
4. ดูล็อกใน terminal สำหรับ error details
5. ติดต่อทีม QA หรือ Dev Lead

---

**Created by:** Quinn (Test Architect)  
**Date:** 2026-01-13  
**Story:** 6.1 - Stripe Payment Gateway Integration  
**Gate Status:** CONCERNS → Must add these tests before production
