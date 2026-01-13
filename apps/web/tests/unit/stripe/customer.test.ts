/**
 * Unit Tests: Stripe Customer Management
 * Tests for lib/stripe/customer.ts
 * 
 * Story: 6.1 - Stripe Payment Gateway Integration
 * Target Coverage: >90%
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createStripeCustomer,
  getOrCreateStripeCustomer,
  updateStripeCustomer,
  getStripeCustomer,
  deleteStripeCustomer,
  syncUserToStripeCustomer,
} from '@/lib/stripe/customer';
import { prisma } from '@/lib/prisma';

// Mock Stripe SDK
vi.mock('@/lib/stripe/server', () => ({
  stripe: {
    customers: {
      create: vi.fn(),
      update: vi.fn(),
      retrieve: vi.fn(),
      del: vi.fn(),
    },
  },
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('Stripe Customer Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createStripeCustomer', () => {
    it('should return existing customer ID if user already has one', async () => {
      const mockUserId = 'user_123';
      const mockStripeCustomerId = 'cus_existing';

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        email: 'test@example.com',
        stripeCustomerId: mockStripeCustomerId,
        name: 'Test User',
      } as any);

      const result = await createStripeCustomer(mockUserId, 'test@example.com');

      expect(result).toBe(mockStripeCustomerId);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
        select: { stripeCustomerId: true, name: true },
      });
    });

    it('should create new Stripe customer and save ID to database', async () => {
      const mockUserId = 'user_123';
      const mockEmail = 'test@example.com';
      const mockName = 'Test User';
      const mockStripeCustomerId = 'cus_new123';

      // User doesn't have Stripe customer yet
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        email: mockEmail,
        stripeCustomerId: null,
        name: mockName,
      } as any);

      // Mock Stripe customer creation
      const { stripe } = await import('@/lib/stripe/server');
      vi.mocked(stripe.customers.create).mockResolvedValue({
        id: mockStripeCustomerId,
        email: mockEmail,
        name: mockName,
      } as any);

      // Mock database update
      vi.mocked(prisma.user.update).mockResolvedValue({
        id: mockUserId,
        stripeCustomerId: mockStripeCustomerId,
      } as any);

      const result = await createStripeCustomer(mockUserId, mockEmail, mockName);

      expect(result).toBe(mockStripeCustomerId);
      expect(stripe.customers.create).toHaveBeenCalledWith({
        email: mockEmail,
        name: mockName,
        metadata: {
          userId: mockUserId,
          source: 'tarot-reading-app',
        },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { stripeCustomerId: mockStripeCustomerId },
      });
    });

    it('should handle Stripe API errors gracefully', async () => {
      const mockUserId = 'user_123';
      const mockEmail = 'test@example.com';

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        stripeCustomerId: null,
      } as any);

      const { stripe } = await import('@/lib/stripe/server');
      vi.mocked(stripe.customers.create).mockRejectedValue(
        new Error('Stripe API Error')
      );

      await expect(
        createStripeCustomer(mockUserId, mockEmail)
      ).rejects.toThrow('Stripe API Error');
    });
  });

  describe('getOrCreateStripeCustomer', () => {
    it('should return existing customer ID if user has one', async () => {
      const mockUserId = 'user_123';
      const mockStripeCustomerId = 'cus_existing';

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        stripeCustomerId: mockStripeCustomerId,
      } as any);

      const result = await getOrCreateStripeCustomer(
        mockUserId,
        'test@example.com'
      );

      expect(result).toBe(mockStripeCustomerId);
    });

    it('should create new customer if user does not exist', async () => {
      const mockUserId = 'user_new';
      const mockEmail = 'new@example.com';
      const mockStripeCustomerId = 'cus_new123';

      // User doesn't exist
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      // Mock user creation
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: mockUserId,
        email: mockEmail,
        stripeCustomerId: null,
      } as any);

      // Mock Stripe customer creation
      const { stripe } = await import('@/lib/stripe/server');
      vi.mocked(stripe.customers.create).mockResolvedValue({
        id: mockStripeCustomerId,
      } as any);

      vi.mocked(prisma.user.update).mockResolvedValue({
        id: mockUserId,
        stripeCustomerId: mockStripeCustomerId,
      } as any);

      const result = await getOrCreateStripeCustomer(mockUserId, mockEmail);

      expect(result).toBe(mockStripeCustomerId);
      expect(prisma.user.create).toHaveBeenCalled();
    });
  });

  describe('updateStripeCustomer', () => {
    it('should update Stripe customer successfully', async () => {
      const mockCustomerId = 'cus_123';
      const updates = { name: 'Updated Name' };

      const { stripe } = await import('@/lib/stripe/server');
      vi.mocked(stripe.customers.update).mockResolvedValue({
        id: mockCustomerId,
        name: 'Updated Name',
      } as any);

      const result = await updateStripeCustomer(mockCustomerId, updates);

      expect(stripe.customers.update).toHaveBeenCalledWith(
        mockCustomerId,
        updates
      );
      expect(result.name).toBe('Updated Name');
    });

    it('should handle update errors', async () => {
      const mockCustomerId = 'cus_123';
      const { stripe } = await import('@/lib/stripe/server');
      
      vi.mocked(stripe.customers.update).mockRejectedValue(
        new Error('Customer not found')
      );

      await expect(
        updateStripeCustomer(mockCustomerId, { name: 'Test' })
      ).rejects.toThrow('Customer not found');
    });
  });

  describe('getStripeCustomer', () => {
    it('should retrieve customer from Stripe', async () => {
      const mockCustomerId = 'cus_123';
      const mockCustomer = {
        id: mockCustomerId,
        email: 'test@example.com',
        name: 'Test User',
      };

      const { stripe } = await import('@/lib/stripe/server');
      vi.mocked(stripe.customers.retrieve).mockResolvedValue(mockCustomer as any);

      const result = await getStripeCustomer(mockCustomerId);

      expect(result).toEqual(mockCustomer);
      expect(stripe.customers.retrieve).toHaveBeenCalledWith(mockCustomerId);
    });

    it('should return null on error', async () => {
      const mockCustomerId = 'cus_invalid';
      const { stripe } = await import('@/lib/stripe/server');
      
      vi.mocked(stripe.customers.retrieve).mockRejectedValue(
        new Error('Customer not found')
      );

      const result = await getStripeCustomer(mockCustomerId);

      expect(result).toBeNull();
    });
  });

  describe('deleteStripeCustomer', () => {
    it('should delete customer from Stripe (GDPR compliance)', async () => {
      const mockCustomerId = 'cus_123';

      const { stripe } = await import('@/lib/stripe/server');
      vi.mocked(stripe.customers.del).mockResolvedValue({
        id: mockCustomerId,
        deleted: true,
      } as any);

      const result = await deleteStripeCustomer(mockCustomerId);

      expect(result).toBe(true);
      expect(stripe.customers.del).toHaveBeenCalledWith(mockCustomerId);
    });

    it('should return false on deletion error', async () => {
      const mockCustomerId = 'cus_123';
      const { stripe } = await import('@/lib/stripe/server');
      
      vi.mocked(stripe.customers.del).mockRejectedValue(
        new Error('Deletion failed')
      );

      const result = await deleteStripeCustomer(mockCustomerId);

      expect(result).toBe(false);
    });
  });

  describe('syncUserToStripeCustomer', () => {
    it('should sync user info to existing Stripe customer', async () => {
      const mockUserId = 'user_123';
      const mockCustomerId = 'cus_123';
      const mockEmail = 'updated@example.com';
      const mockName = 'Updated Name';

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        stripeCustomerId: mockCustomerId,
      } as any);

      const { stripe } = await import('@/lib/stripe/server');
      vi.mocked(stripe.customers.update).mockResolvedValue({
        id: mockCustomerId,
        email: mockEmail,
        name: mockName,
      } as any);

      await syncUserToStripeCustomer(mockUserId, mockEmail, mockName);

      expect(stripe.customers.update).toHaveBeenCalledWith(mockCustomerId, {
        email: mockEmail,
        name: mockName,
      });
    });

    it('should do nothing if user has no Stripe customer', async () => {
      const mockUserId = 'user_123';

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        stripeCustomerId: null,
      } as any);

      const { stripe } = await import('@/lib/stripe/server');

      await syncUserToStripeCustomer(mockUserId, 'test@example.com');

      expect(stripe.customers.update).not.toHaveBeenCalled();
    });
  });
});
