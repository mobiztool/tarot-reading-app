/**
 * Integration Tests: Stripe Webhook Handler
 * Tests for src/app/api/webhooks/stripe/route.ts
 * 
 * Story 6.1 - Stripe Integration
 * Coverage Target: >85%
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Stripe from 'stripe';

// Create hoisted mocks first (vi.mock is hoisted to top)
const { mockStripe, mockPrisma, mockSentry, mockHeaders } = vi.hoisted(() => {
  const headerGet = vi.fn((key: string) => {
    if (key === 'stripe-signature') return 'test_signature';
    return null;
  });
  
  return {
    mockStripe: {
      webhooks: {
        constructEvent: vi.fn(),
      },
      subscriptions: {
        retrieve: vi.fn(),
      },
    },
    mockPrisma: {
      user: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      subscription: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        upsert: vi.fn(),
        update: vi.fn(),
      },
      invoice: {
        upsert: vi.fn(),
      },
      analyticsEvent: {
        create: vi.fn(),
      },
    },
    mockSentry: {
      captureException: vi.fn(),
    },
    mockHeaders: vi.fn(() => Promise.resolve({
      get: headerGet,
    })),
  };
});

// Mock configuration
vi.mock('@/lib/config', () => ({
  config: {
    stripeSecretKey: 'sk_test_mock',
    stripeWebhookSecret: 'whsec_test_mock',
  },
}));

vi.mock('@/lib/stripe/server', () => ({
  stripe: mockStripe,
}));

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

vi.mock('@sentry/nextjs', () => mockSentry);

vi.mock('next/headers', () => ({
  headers: mockHeaders,
}));

// Import after mocks
import { POST } from '@/app/api/webhooks/stripe/route';

// Alias for cleaner test code
const Sentry = mockSentry;

// Helper to create mock request
function createMockRequest(body: string): Request {
  return {
    text: () => Promise.resolve(body),
  } as unknown as Request;
}

// Helper to create Stripe events
function createStripeEvent(type: string, data: Record<string, unknown>): Stripe.Event {
  return {
    id: `evt_test_${Date.now()}`,
    type,
    livemode: false,
    data: {
      object: data,
    },
    created: Math.floor(Date.now() / 1000),
    object: 'event',
    api_version: '2024-04-10',
    pending_webhooks: 0,
    request: null,
  } as Stripe.Event;
}

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console mocks
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Signature Verification', () => {
    it('should return 400 if signature is missing', async () => {
      // Override headers mock to return null signature
      mockHeaders.mockResolvedValueOnce({
        get: () => null,
      });

      const req = createMockRequest('{}');
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toContain('Missing stripe-signature');
    });

    it('should return 400 if signature verification fails', async () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const req = createMockRequest('{}');
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toBe('Invalid signature');
      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });

  describe('Customer Events', () => {
    it('should handle customer.created event', async () => {
      const event = createStripeEvent('customer.created', {
        id: 'cus_123',
        email: 'test@example.com',
        metadata: { userId: 'user-123' },
      });

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.user.update.mockResolvedValue({});

      const req = createMockRequest('{}');
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.received).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { stripeCustomerId: 'cus_123' },
      });
    });

    it('should handle customer.created without userId in metadata', async () => {
      const event = createStripeEvent('customer.created', {
        id: 'cus_123',
        email: 'test@example.com',
        metadata: {},
      });

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('should handle customer.deleted event', async () => {
      const event = createStripeEvent('customer.deleted', {
        id: 'cus_123',
        deleted: true,
      });

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.user.updateMany.mockResolvedValue({ count: 1 });

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.user.updateMany).toHaveBeenCalledWith({
        where: { stripeCustomerId: 'cus_123' },
        data: { stripeCustomerId: null },
      });
    });
  });

  describe('Subscription Events', () => {
    const mockSubscription = {
      id: 'sub_123',
      status: 'active',
      customer: 'cus_456',
      metadata: { userId: 'user-789' },
      items: {
        data: [
          { price: { id: 'price_pro' } },
        ],
      },
      current_period_start: 1700000000,
      current_period_end: 1702592000,
      cancel_at_period_end: false,
      canceled_at: null,
      ended_at: null,
    };

    it('should handle customer.subscription.created event', async () => {
      const event = createStripeEvent('customer.subscription.created', mockSubscription);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.subscription.upsert.mockResolvedValue({});

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.subscription.upsert).toHaveBeenCalledWith(expect.objectContaining({
        where: { stripe_subscription_id: 'sub_123' },
        create: expect.objectContaining({
          user_id: 'user-789',
          stripe_subscription_id: 'sub_123',
          stripe_customer_id: 'cus_456',
          status: 'active',
        }),
      }));
    });

    it('should skip subscription.created if no userId in metadata', async () => {
      const subWithoutUserId = {
        ...mockSubscription,
        metadata: {},
      };
      const event = createStripeEvent('customer.subscription.created', subWithoutUserId);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.subscription.upsert).not.toHaveBeenCalled();
    });

    it('should handle customer.subscription.updated event with tier change', async () => {
      const event = createStripeEvent('customer.subscription.updated', {
        ...mockSubscription,
        items: {
          data: [{ price: { id: 'price_vip' } }],
        },
      });

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.subscription.findUnique.mockResolvedValue({
        id: 'db_sub_1',
        user_id: 'user-789',
        stripe_price_id: 'price_pro',
        status: 'active',
      });
      mockPrisma.subscription.update.mockResolvedValue({});
      mockPrisma.analyticsEvent.create.mockResolvedValue({});

      // Set up env vars for tier tracking
      process.env.STRIPE_PRICE_ID_PRO = 'price_pro';
      process.env.STRIPE_PRICE_ID_VIP = 'price_vip';

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.subscription.update).toHaveBeenCalled();
      expect(mockPrisma.analyticsEvent.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          user_id: 'user-789',
          metadata: expect.objectContaining({
            eventName: 'subscription_tier_changed',
            changeType: 'upgrade',
          }),
        }),
      }));
    });

    it('should handle trial conversion (trialing -> active)', async () => {
      const event = createStripeEvent('customer.subscription.updated', {
        ...mockSubscription,
        status: 'active',
      });

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.subscription.findUnique.mockResolvedValue({
        id: 'db_sub_1',
        user_id: 'user-789',
        stripe_price_id: 'price_pro',
        status: 'trialing',
      });
      mockPrisma.subscription.update.mockResolvedValue({});
      mockPrisma.analyticsEvent.create.mockResolvedValue({});

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.analyticsEvent.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          metadata: expect.objectContaining({
            eventName: 'trial_converted',
          }),
        }),
      }));
    });

    it('should handle customer.subscription.deleted event', async () => {
      const event = createStripeEvent('customer.subscription.deleted', mockSubscription);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.subscription.findUnique.mockResolvedValue({
        id: 'db_sub_1',
        user_id: 'user-789',
        status: 'active',
        created_at: new Date(),
      });
      mockPrisma.subscription.update.mockResolvedValue({});

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
        where: { stripe_subscription_id: 'sub_123' },
        data: expect.objectContaining({
          status: 'canceled',
        }),
      });
    });

    it('should track trial_canceled analytics', async () => {
      const event = createStripeEvent('customer.subscription.deleted', mockSubscription);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.subscription.findUnique.mockResolvedValue({
        id: 'db_sub_1',
        user_id: 'user-789',
        status: 'trialing',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        cancellation_reason: 'too_expensive',
      });
      mockPrisma.subscription.update.mockResolvedValue({});
      mockPrisma.analyticsEvent.create.mockResolvedValue({});

      const req = createMockRequest('{}');
      await POST(req);

      expect(mockPrisma.analyticsEvent.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          metadata: expect.objectContaining({
            eventName: 'trial_canceled',
          }),
        }),
      }));
    });
  });

  describe('Invoice Events', () => {
    const mockInvoice = {
      id: 'in_123',
      customer: 'cus_456',
      amount_paid: 19900,
      amount_due: 19900,
      currency: 'thb',
      number: 'INV-001',
      status: 'paid',
      description: 'Subscription payment',
      invoice_pdf: 'https://pay.stripe.com/invoice/pdf/123',
      hosted_invoice_url: 'https://pay.stripe.com/invoice/123',
      status_transitions: {
        paid_at: 1700000000,
      },
      lines: {
        data: [
          { period: { start: 1700000000, end: 1702592000 } },
        ],
      },
      parent: {
        subscription_details: {
          subscription: 'sub_789',
        },
      },
    };

    it('should handle invoice.paid event', async () => {
      const event = createStripeEvent('invoice.paid', mockInvoice);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      });
      mockPrisma.subscription.findFirst.mockResolvedValue({
        id: 'db_sub_1',
      });
      mockPrisma.invoice.upsert.mockResolvedValue({});

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.invoice.upsert).toHaveBeenCalledWith(expect.objectContaining({
        where: { stripe_invoice_id: 'in_123' },
        create: expect.objectContaining({
          user_id: 'user-123',
          stripe_invoice_id: 'in_123',
          amount: 19900,
          status: 'paid',
        }),
      }));
    });

    it('should handle invoice.paid without user', async () => {
      const event = createStripeEvent('invoice.paid', mockInvoice);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.invoice.upsert).not.toHaveBeenCalled();
    });

    it('should handle invoice.payment_failed event', async () => {
      const failedInvoice = {
        ...mockInvoice,
        status: 'open',
      };
      const event = createStripeEvent('invoice.payment_failed', failedInvoice);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      });
      mockPrisma.subscription.findFirst.mockResolvedValue({
        id: 'db_sub_1',
      });
      mockPrisma.invoice.upsert.mockResolvedValue({});

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.invoice.upsert).toHaveBeenCalledWith(expect.objectContaining({
        create: expect.objectContaining({
          status: 'open',
        }),
      }));
    });
  });

  describe('Checkout Session Events', () => {
    const mockCheckoutSession = {
      id: 'cs_123',
      customer: 'cus_456',
      subscription: 'sub_789',
      mode: 'subscription',
      amount_total: 19900,
      metadata: {
        userId: 'user-123',
        tierId: 'pro',
      },
    };

    it('should handle checkout.session.completed event for subscription', async () => {
      const event = createStripeEvent('checkout.session.completed', mockCheckoutSession);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockStripe.subscriptions.retrieve.mockResolvedValue({
        id: 'sub_789',
        status: 'active',
        trial_end: null,
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
      });
      mockPrisma.analyticsEvent.create.mockResolvedValue({});

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockStripe.subscriptions.retrieve).toHaveBeenCalledWith('sub_789');
    });

    it('should track trial_started for trialing subscriptions', async () => {
      const event = createStripeEvent('checkout.session.completed', mockCheckoutSession);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockStripe.subscriptions.retrieve.mockResolvedValue({
        id: 'sub_789',
        status: 'trialing',
        trial_end: 1702592000,
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
      });
      mockPrisma.analyticsEvent.create.mockResolvedValue({});

      const req = createMockRequest('{}');
      await POST(req);

      expect(mockPrisma.analyticsEvent.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          user_id: 'user-123',
          metadata: expect.objectContaining({
            eventName: 'trial_started',
          }),
        }),
      }));
    });

    it('should skip non-subscription checkout sessions', async () => {
      const paymentSession = {
        ...mockCheckoutSession,
        mode: 'payment',
      };
      const event = createStripeEvent('checkout.session.completed', paymentSession);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockStripe.subscriptions.retrieve).not.toHaveBeenCalled();
    });

    it('should handle checkout.session.expired event', async () => {
      const event = createStripeEvent('checkout.session.expired', mockCheckoutSession);

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const req = createMockRequest('{}');
      const response = await POST(req);

      expect(response.status).toBe(200);
    });
  });

  describe('Unhandled Events', () => {
    it('should return 200 for unhandled event types', async () => {
      const event = createStripeEvent('some.unhandled.event', { id: 'test' });

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const req = createMockRequest('{}');
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.received).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 200 even on handler error (prevent Stripe retry)', async () => {
      const event = createStripeEvent('invoice.paid', {
        id: 'in_123',
        customer: 'cus_456',
        amount_paid: 100,
      });

      mockStripe.webhooks.constructEvent.mockReturnValue(event);
      mockPrisma.user.findFirst.mockRejectedValue(new Error('Database error'));

      const req = createMockRequest('{}');
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.received).toBe(true);
      expect(json.error).toBe('Handler error logged');
      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });
});
