# Stripe Integration Guide

## Overview

This document describes the Stripe payment gateway integration for the Tarot Reading App, implemented in Story 6.1.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Client (Next.js)                                             │
│  - Stripe.js (@stripe/stripe-js)                            │
│  - Publishable key (safe to expose)                         │
│  - src/lib/stripe/client.ts                                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Server (API Routes)                                          │
│  - Stripe SDK (stripe)                                       │
│  - Secret key (NEVER expose to client)                      │
│  - src/lib/stripe/server.ts                                 │
│  - src/lib/stripe/customer.ts                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Stripe API                                                   │
│  - Payment processing                                        │
│  - Subscription management                                   │
│  - Sends webhooks back to our server                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Webhook Handler (API Route)                                  │
│  - /api/webhooks/stripe                                      │
│  - Receives payment events                                   │
│  - Updates database                                          │
│  - Triggers notifications                                    │
└─────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Stripe Account Setup

1. Create account at [stripe.com](https://stripe.com)
2. Complete business information
3. Enable test mode for development
4. Complete business verification for production

### 2. Get API Keys

1. Go to Dashboard → Developers → API keys
2. Copy the following keys:
   - **Test publishable key**: `pk_test_...`
   - **Test secret key**: `sk_test_...`

### 3. Environment Variables

Add to your `.env.local`:

```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Configuration
STRIPE_API_VERSION=2023-10-16
```

**Security Notes:**
- Never commit actual keys to git
- Use different keys for test/production
- Rotate keys periodically

### 4. Webhook Configuration

#### Local Development

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows (via scoop)
   scoop install stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret to your `.env.local`

#### Production

1. Go to Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `customer.created`
   - `customer.updated`
   - `customer.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy the signing secret to environment variables

### 5. Database Migration

Run the Stripe integration migration:

```bash
# Using Prisma
pnpm prisma migrate dev --name add_stripe_integration

# Or apply the SQL directly
psql -d your_database -f prisma/migrations/add_stripe_integration.sql
```

## Usage

### Client-Side (React Components)

```typescript
import { getStripe, isStripeConfigured } from '@/lib/stripe';

// Check if Stripe is configured
if (!isStripeConfigured()) {
  console.error('Stripe is not configured');
  return;
}

// Get Stripe instance for checkout
const stripe = await getStripe();
if (!stripe) {
  console.error('Failed to load Stripe');
  return;
}

// Redirect to checkout (example)
const { error } = await stripe.redirectToCheckout({
  sessionId: 'cs_test_...',
});
```

### Server-Side (API Routes)

```typescript
import { stripe } from '@/lib/stripe/server';
import { getOrCreateStripeCustomer } from '@/lib/stripe/customer';

// Create or get customer
const customerId = await getOrCreateStripeCustomer(
  userId,
  userEmail,
  userName
);

// Create payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 29900, // 299.00 THB in satangs
  currency: 'thb',
  customer: customerId,
  metadata: { userId },
});
```

### Error Handling

```typescript
import { handleStripeError, StripeErrorResponse } from '@/lib/stripe';

try {
  // Stripe operation
} catch (error) {
  const errorResponse: StripeErrorResponse = handleStripeError(error);
  
  // Show Thai error message to user
  showToast(errorResponse.messageTh);
  
  // Log for debugging
  console.error('Stripe error:', errorResponse);
}
```

## Test Cards

Use these cards in test mode:

| Scenario | Card Number | CVC | Date |
|----------|-------------|-----|------|
| Success | 4242 4242 4242 4242 | Any 3 digits | Any future date |
| Decline | 4000 0000 0000 0002 | Any 3 digits | Any future date |
| Insufficient Funds | 4000 0000 0000 9995 | Any 3 digits | Any future date |
| Requires Auth (3DS) | 4000 0025 0000 3155 | Any 3 digits | Any future date |
| Expired Card | 4000 0000 0000 0069 | Any 3 digits | Any past date |

## Testing Webhooks

Trigger test events using Stripe CLI:

```bash
# Test successful payment
stripe trigger payment_intent.succeeded

# Test subscription creation
stripe trigger customer.subscription.created

# Test payment failure
stripe trigger payment_intent.payment_failed
```

## File Structure

```
apps/web/src/lib/stripe/
├── index.ts        # Public exports
├── client.ts       # Client-side Stripe.js wrapper
├── server.ts       # Server-side Stripe SDK
├── customer.ts     # Customer management functions
└── errors.ts       # Error handling with Thai messages

apps/web/src/app/api/webhooks/stripe/
└── route.ts        # Webhook endpoint handler
```

## Security Best Practices

1. **Never expose secret key** - Only use in server-side code
2. **Verify webhook signatures** - Always use `stripe.webhooks.constructEvent()`
3. **Use environment variables** - Different keys for test/production
4. **PCI Compliance** - Use Stripe Checkout or Elements, never handle raw card data
5. **HTTPS only** - All payment pages must use HTTPS

## PCI Compliance (SAQ-A)

This integration follows PCI SAQ-A requirements:

- ✅ No card numbers stored in our database
- ✅ No CVV stored anywhere
- ✅ Stripe Elements/Checkout used (not custom forms)
- ✅ HTTPS enforced on all payment pages
- ✅ Card data never touches our servers

## Troubleshooting

### Webhook not receiving events
- Check Stripe Dashboard → Webhooks → Attempts
- Verify endpoint URL is publicly accessible
- Check webhook signing secret is correct

### Test payments failing
- Verify publishable key starts with `pk_test_`
- Check test mode enabled in Stripe Dashboard
- Use official Stripe test card numbers

### Customer creation failing
- Check user email is valid
- Verify Stripe secret key has correct permissions
- Check for duplicate stripeCustomerId in database

### Signature verification failed
- Verify STRIPE_WEBHOOK_SECRET is correct
- Check that raw request body is used (not parsed JSON)
- Ensure webhook handler is receiving the correct signature header

## Related Stories

- **Story 6.2**: Subscription Management (builds on this foundation)
- **Story 6.3**: Pricing Plans
- **Story 6.5**: Checkout Flow
- **Story 2.1**: User Authentication (customer creation integration)

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-10 | 1.0 | Initial Stripe integration | James (Dev) |
