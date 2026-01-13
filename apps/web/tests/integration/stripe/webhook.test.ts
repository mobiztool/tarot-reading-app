/**
 * Integration Tests: Stripe Webhook Handler
 * Tests for app/api/webhooks/stripe/route.ts
 * 
 * Story: 6.1 - Stripe Payment Gateway Integration
 * Target Coverage: >85%
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Stripe from 'stripe';

// Create hoisted mocks (vi.mock is hoisted to top of file)
const { mockStripe, mockPrisma, mockHeaders } = vi.hoisted(() => {
  const headerGetFn = vi.fn((key: string) => {
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
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      subscription: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        upsert: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      },
      invoice: {
        upsert: vi.fn(),
      },
      analyticsEvent: {
        create: vi.fn(),
      },
    },
    mockHeaders: vi.fn(() => Promise.resolve({
      get: headerGetFn,
    })),
  };
});

// Mock Stripe SDK
vi.mock('@/lib/stripe/server', () => ({
  stripe: mockStripe,
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

// Mock Next.js headers (async in Next.js 15+)
vi.mock('next/headers', () => ({
  headers: mockHeaders,
}));

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

// Import after mocks
import { POST } from '@/app/api/webhooks/stripe/route';

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Webhook Signature Verification', () => {
    it('should return 400 if signature header is missing', async () => {
      // Override headers mock to return null signature
      mockHeaders.mockResolvedValueOnce({
        get: () => null,
      });

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing stripe-signature');
    });

    it('should return 400 if signature verification fails', async () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid signature');
    });
  });

  describe('Customer Events', () => {
    it('should handle customer.created event', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'customer.created',
        data: {
          object: {
            id: 'cus_123',
            email: 'test@example.com',
            metadata: {
              userId: 'user_123',
            },
          } as Stripe.Customer,
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPrisma.user.update.mockResolvedValue({} as any);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'customer.created' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user_123' },
        data: { stripeCustomerId: 'cus_123' },
      });
    });

    it('should handle customer.deleted event', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'customer.deleted',
        data: {
          object: {
            id: 'cus_123',
            deleted: true,
          },
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPrisma.user.updateMany.mockResolvedValue({ count: 1 } as any);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'customer.deleted' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.user.updateMany).toHaveBeenCalledWith({
        where: { stripeCustomerId: 'cus_123' },
        data: { stripeCustomerId: null },
      });
    });
  });

  describe('Payment Intent Events', () => {
    it('should handle payment_intent.succeeded event', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            amount: 9900,
            currency: 'thb',
            customer: 'cus_123',
          } as Stripe.PaymentIntent,
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'payment_intent.succeeded' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should handle payment_intent.payment_failed event', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_123',
            last_payment_error: {
              message: 'Card declined',
            },
            customer: 'cus_123',
          } as Stripe.PaymentIntent,
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'payment_intent.payment_failed' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });
  });

  describe('Subscription Events', () => {
    it('should handle subscription.created event', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_123',
            customer: 'cus_123',
            status: 'active',
            items: {
              data: [
                {
                  price: {
                    id: 'price_basic',
                  },
                },
              ],
            },
            current_period_start: 1704067200,
            current_period_end: 1706745600,
            cancel_at_period_end: false,
            metadata: {
              userId: 'user_123',
            },
          } as Partial<Stripe.Subscription>,
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPrisma.subscription.upsert.mockResolvedValue({} as any);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'customer.subscription.created' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.subscription.upsert).toHaveBeenCalled();
    });

    it('should handle subscription.updated event', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_123',
            status: 'past_due',
            items: {
              data: [{ price: { id: 'price_basic' } }],
            },
            current_period_start: 1704067200,
            current_period_end: 1706745600,
          } as Partial<Stripe.Subscription>,
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPrisma.subscription.findUnique.mockResolvedValue({
        id: 'db_sub_123',
        user_id: 'user_123',
        stripe_price_id: 'price_basic',
      } as any);
      mockPrisma.subscription.update.mockResolvedValue({} as any);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'customer.subscription.updated' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.subscription.update).toHaveBeenCalled();
    });

    it('should handle subscription.deleted event', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_123',
            customer: 'cus_123',
          } as Stripe.Subscription,
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPrisma.subscription.findUnique.mockResolvedValue({
        id: 'db_sub_123',
        user_id: 'user_123',
        status: 'trialing',
        created_at: new Date(),
      } as any);
      mockPrisma.analyticsEvent.create.mockResolvedValue({} as any);
      mockPrisma.subscription.update.mockResolvedValue({} as any);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'customer.subscription.deleted' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
        where: { stripe_subscription_id: 'sub_123' },
        data: expect.objectContaining({
          status: 'canceled',
        }),
      });
    });
  });

  describe('Invoice Events', () => {
    it('should handle invoice.paid event', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'invoice.paid',
        data: {
          object: {
            id: 'in_123',
            customer: 'cus_123',
            amount_paid: 9900,
            currency: 'thb',
            status: 'paid',
            invoice_pdf: 'https://invoice.pdf',
            hosted_invoice_url: 'https://invoice.url',
            status_transitions: {
              paid_at: 1704067200,
            },
          } as Partial<Stripe.Invoice>,
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user_123',
      } as any);
      mockPrisma.invoice.upsert.mockResolvedValue({} as any);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'invoice.paid' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.invoice.upsert).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should return 200 even on handler errors (to prevent retries)', async () => {
      // Use invoice.paid which throws on error (unlike customer.created which catches)
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'invoice.paid',
        data: {
          object: {
            id: 'in_123',
            customer: 'cus_123',
            amount_paid: 9900,
          } as Partial<Stripe.Invoice>,
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPrisma.user.findFirst.mockResolvedValue({ id: 'user_123' } as any);
      mockPrisma.invoice.upsert.mockRejectedValue(new Error('Database error'));

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'invoice.paid' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(data.error).toBe('Handler error logged');
    });

    it('should log unhandled event types', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'charge.updated' as any,
        data: {
          object: {} as any,
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'charge.updated' }),
      });

      await POST(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unhandled event type')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Idempotency', () => {
    it('should handle duplicate webhook events gracefully with upsert', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_123',
            customer: 'cus_123',
            status: 'active',
            items: { data: [{ price: { id: 'price_123' } }] },
            current_period_start: 1704067200,
            current_period_end: 1706745600,
            metadata: { userId: 'user_123' },
          } as Partial<Stripe.Subscription>,
        },
      } as any;

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPrisma.subscription.upsert.mockResolvedValue({} as any);

      // Send same event twice
      const request1 = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'customer.subscription.created' }),
      });

      const request2 = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({ type: 'customer.subscription.created' }),
      });

      const response1 = await POST(request1);
      const response2 = await POST(request2);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      // Upsert ensures duplicate events don't create duplicate records
      expect(mockPrisma.subscription.upsert).toHaveBeenCalledTimes(2);
    });
  });
});
