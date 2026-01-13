/**
 * Unit Tests: Stripe Customer Management
 * Tests for src/lib/stripe/customer.ts
 * 
 * Story 6.1 - Stripe Integration
 * Coverage Target: >90%
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create hoisted mocks first (vi.mock is hoisted to top)
const { mockStripe, mockPrisma, mockLogStripeError } = vi.hoisted(() => ({
  mockStripe: {
    customers: {
      create: vi.fn(),
      update: vi.fn(),
      retrieve: vi.fn(),
      del: vi.fn(),
    },
  },
  mockPrisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
  mockLogStripeError: vi.fn(),
}));

// Mock the server module to return our mock Stripe
vi.mock('@/lib/stripe/server', () => ({
  stripe: mockStripe,
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

// Mock error handling
vi.mock('@/lib/stripe/errors', () => ({
  logStripeError: mockLogStripeError,
}));

import {
  createStripeCustomer,
  getOrCreateStripeCustomer,
  updateStripeCustomer,
  getStripeCustomer,
  getStripeCustomerIdByUserId,
  deleteStripeCustomer,
  syncUserToStripeCustomer,
} from '@/lib/stripe/customer';

// Alias for cleaner test code
const logStripeError = mockLogStripeError;

describe('Stripe Customer Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createStripeCustomer', () => {
    it('should return existing customer ID if already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: 'cus_existing123',
        name: 'Test User',
      });

      const result = await createStripeCustomer('user-123', 'test@example.com', 'Test User');

      expect(result).toBe('cus_existing123');
      expect(mockStripe.customers.create).not.toHaveBeenCalled();
    });

    it('should create new customer if none exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: null,
        name: 'Existing Name',
      });

      mockStripe.customers.create.mockResolvedValue({
        id: 'cus_new456',
        email: 'test@example.com',
      });

      mockPrisma.user.update.mockResolvedValue({});

      const result = await createStripeCustomer('user-123', 'test@example.com', 'Test User');

      expect(result).toBe('cus_new456');
      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        metadata: {
          userId: 'user-123',
          source: 'tarot-reading-app',
        },
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { stripeCustomerId: 'cus_new456' },
      });
    });

    it('should use existing user name if no name provided', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: null,
        name: 'Database Name',
      });

      mockStripe.customers.create.mockResolvedValue({
        id: 'cus_789',
      });

      mockPrisma.user.update.mockResolvedValue({});

      await createStripeCustomer('user-123', 'test@example.com');

      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Database Name',
        metadata: {
          userId: 'user-123',
          source: 'tarot-reading-app',
        },
      });
    });

    it('should log error and rethrow on Stripe failure', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: null,
        name: null,
      });

      const stripeError = new Error('Stripe API error');
      mockStripe.customers.create.mockRejectedValue(stripeError);

      await expect(
        createStripeCustomer('user-123', 'test@example.com')
      ).rejects.toThrow('Stripe API error');

      expect(logStripeError).toHaveBeenCalledWith(stripeError, {
        operation: 'createStripeCustomer',
        userId: 'user-123',
      });
    });
  });

  describe('getOrCreateStripeCustomer', () => {
    it('should return existing customer ID if user has one', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: 'cus_existing',
        name: 'User',
      });

      const result = await getOrCreateStripeCustomer('user-123', 'test@example.com');

      expect(result).toBe('cus_existing');
      expect(mockStripe.customers.create).not.toHaveBeenCalled();
    });

    it('should create user if not found in database', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        stripeCustomerId: null,
        name: 'New User',
      });

      mockStripe.customers.create.mockResolvedValue({
        id: 'cus_created',
      });

      mockPrisma.user.update.mockResolvedValue({});

      const result = await getOrCreateStripeCustomer('user-123', 'test@example.com', 'New User');

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'New User',
        },
        select: { stripeCustomerId: true, name: true },
      });
      expect(result).toBe('cus_created');
    });

    it('should create Stripe customer if user exists but has no customer ID', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: null,
        name: 'Existing User',
      });

      mockStripe.customers.create.mockResolvedValue({
        id: 'cus_new',
      });

      mockPrisma.user.update.mockResolvedValue({});

      const result = await getOrCreateStripeCustomer('user-123', 'test@example.com');

      expect(result).toBe('cus_new');
    });
  });

  describe('updateStripeCustomer', () => {
    it('should update customer successfully', async () => {
      const updatedCustomer = {
        id: 'cus_123',
        email: 'new@example.com',
        name: 'New Name',
      };

      mockStripe.customers.update.mockResolvedValue(updatedCustomer);

      const result = await updateStripeCustomer('cus_123', {
        email: 'new@example.com',
        name: 'New Name',
      });

      expect(result).toEqual(updatedCustomer);
      expect(mockStripe.customers.update).toHaveBeenCalledWith('cus_123', {
        email: 'new@example.com',
        name: 'New Name',
      });
    });

    it('should log error and rethrow on failure', async () => {
      const error = new Error('Update failed');
      mockStripe.customers.update.mockRejectedValue(error);

      await expect(
        updateStripeCustomer('cus_123', { name: 'Test' })
      ).rejects.toThrow('Update failed');

      expect(logStripeError).toHaveBeenCalledWith(error, {
        operation: 'updateStripeCustomer',
        customerId: 'cus_123',
      });
    });
  });

  describe('getStripeCustomer', () => {
    it('should retrieve customer successfully', async () => {
      const customer = {
        id: 'cus_123',
        email: 'test@example.com',
      };

      mockStripe.customers.retrieve.mockResolvedValue(customer);

      const result = await getStripeCustomer('cus_123');

      expect(result).toEqual(customer);
    });

    it('should return null on error', async () => {
      mockStripe.customers.retrieve.mockRejectedValue(new Error('Not found'));

      const result = await getStripeCustomer('cus_invalid');

      expect(result).toBeNull();
      expect(logStripeError).toHaveBeenCalled();
    });
  });

  describe('getStripeCustomerIdByUserId', () => {
    it('should return customer ID if exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: 'cus_123',
      });

      const result = await getStripeCustomerIdByUserId('user-123');

      expect(result).toBe('cus_123');
    });

    it('should return null if user has no customer ID', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: null,
      });

      const result = await getStripeCustomerIdByUserId('user-123');

      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await getStripeCustomerIdByUserId('user-unknown');

      expect(result).toBeNull();
    });
  });

  describe('deleteStripeCustomer', () => {
    it('should delete customer successfully', async () => {
      mockStripe.customers.del.mockResolvedValue({ deleted: true });

      const result = await deleteStripeCustomer('cus_123');

      expect(result).toBe(true);
      expect(mockStripe.customers.del).toHaveBeenCalledWith('cus_123');
    });

    it('should return false on error', async () => {
      mockStripe.customers.del.mockRejectedValue(new Error('Delete failed'));

      const result = await deleteStripeCustomer('cus_invalid');

      expect(result).toBe(false);
      expect(logStripeError).toHaveBeenCalled();
    });
  });

  describe('syncUserToStripeCustomer', () => {
    it('should update customer with email and name', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: 'cus_123',
      });

      mockStripe.customers.update.mockResolvedValue({});

      await syncUserToStripeCustomer('user-123', 'new@example.com', 'New Name');

      expect(mockStripe.customers.update).toHaveBeenCalledWith('cus_123', {
        email: 'new@example.com',
        name: 'New Name',
      });
    });

    it('should update customer with email only', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: 'cus_123',
      });

      mockStripe.customers.update.mockResolvedValue({});

      await syncUserToStripeCustomer('user-123', 'new@example.com');

      expect(mockStripe.customers.update).toHaveBeenCalledWith('cus_123', {
        email: 'new@example.com',
      });
    });

    it('should update customer with name set to null (clear name)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: 'cus_123',
      });

      mockStripe.customers.update.mockResolvedValue({});

      await syncUserToStripeCustomer('user-123', undefined, null);

      expect(mockStripe.customers.update).toHaveBeenCalledWith('cus_123', {
        name: undefined,
      });
    });

    it('should not call update if no customer ID', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: null,
      });

      await syncUserToStripeCustomer('user-123', 'test@example.com');

      expect(mockStripe.customers.update).not.toHaveBeenCalled();
    });

    it('should not call update if no changes', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: 'cus_123',
      });

      await syncUserToStripeCustomer('user-123');

      expect(mockStripe.customers.update).not.toHaveBeenCalled();
    });
  });
});
