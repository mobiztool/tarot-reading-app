/**
 * Unit Tests: Stripe Error Handling
 * Tests for src/lib/stripe/errors.ts
 * 
 * Story 6.1 - Stripe Integration
 * Coverage Target: 100%
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Stripe from 'stripe';

// Mock Sentry before importing the module under test
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

import { handleStripeError, isStripeError, logStripeError } from '@/lib/stripe/errors';
import * as Sentry from '@sentry/nextjs';

describe('Stripe Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleStripeError', () => {
    it('should handle StripeCardError with decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Your card was declined.',
        code: 'card_declined',
        decline_code: 'insufficient_funds',
      });

      const result = handleStripeError(error);

      expect(result.type).toBe('card_error');
      expect(result.code).toBe('card_declined');
      expect(result.declineCode).toBe('insufficient_funds');
      expect(result.messageTh).toContain('ยอดเงินในบัญชีไม่เพียงพอ');
      expect(Sentry.captureException).toHaveBeenCalledWith(error, expect.any(Object));
    });

    it('should handle lost_card decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Card was reported lost.',
        code: 'card_declined',
        decline_code: 'lost_card',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('บัตรนี้ถูกระงับ');
    });

    it('should handle stolen_card decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Card was reported stolen.',
        code: 'card_declined',
        decline_code: 'stolen_card',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('บัตรนี้ถูกระงับ');
    });

    it('should handle card_velocity_exceeded decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Card velocity exceeded.',
        code: 'card_declined',
        decline_code: 'card_velocity_exceeded',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('เกินวงเงินที่ใช้ได้ในวันนี้');
    });

    it('should handle do_not_honor decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Do not honor.',
        code: 'card_declined',
        decline_code: 'do_not_honor',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('ธนาคารปฏิเสธการทำรายการ');
    });

    it('should handle expired_card decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Card expired.',
        code: 'expired_card',
        decline_code: 'expired_card',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('บัตรหมดอายุ');
    });

    it('should handle incorrect_cvc decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Incorrect CVC.',
        code: 'incorrect_cvc',
        decline_code: 'incorrect_cvc',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('รหัส CVV ไม่ถูกต้อง');
    });

    it('should handle processing_error decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Processing error.',
        code: 'processing_error',
        decline_code: 'processing_error',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('เกิดข้อผิดพลาดในการประมวลผล');
    });

    it('should handle incorrect_number decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Incorrect number.',
        code: 'incorrect_number',
        decline_code: 'incorrect_number',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('หมายเลขบัตรไม่ถูกต้อง');
    });

    it('should handle card_declined error code without decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Your card was declined.',
        code: 'card_declined',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('บัตรของคุณถูกปฏิเสธ');
    });

    it('should handle invalid_expiry_month error code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Invalid expiry month.',
        code: 'invalid_expiry_month',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('วันหมดอายุของบัตรไม่ถูกต้อง');
    });

    it('should handle invalid_expiry_year error code', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Invalid expiry year.',
        code: 'invalid_expiry_year',
      });

      const result = handleStripeError(error);

      expect(result.messageTh).toContain('วันหมดอายุของบัตรไม่ถูกต้อง');
    });

    it('should handle StripeInvalidRequestError', () => {
      const error = new Stripe.errors.StripeInvalidRequestError({
        type: 'invalid_request_error',
        message: 'Invalid request.',
        code: 'invalid_request',
      });

      const result = handleStripeError(error);

      expect(result.type).toBe('invalid_request');
      expect(result.messageTh).toContain('ข้อมูลการชำระเงินไม่ถูกต้อง');
    });

    it('should handle StripeAPIError', () => {
      const error = new Stripe.errors.StripeAPIError({
        type: 'api_error',
        message: 'API error.',
      });

      const result = handleStripeError(error);

      expect(result.type).toBe('api_error');
      expect(result.messageTh).toContain('เกิดข้อผิดพลาดในระบบชำระเงิน');
    });

    it('should handle StripeConnectionError', () => {
      const error = new Stripe.errors.StripeConnectionError({
        type: 'api_connection_error',
        message: 'Connection error.',
      });

      const result = handleStripeError(error);

      expect(result.type).toBe('connection_error');
      expect(result.messageTh).toContain('ไม่สามารถเชื่อมต่อระบบชำระเงินได้');
    });

    it('should handle StripeAuthenticationError', () => {
      const error = new Stripe.errors.StripeAuthenticationError({
        type: 'authentication_error',
        message: 'Authentication error.',
      });

      const result = handleStripeError(error);

      expect(result.type).toBe('authentication_error');
      expect(result.messageTh).toContain('เกิดข้อผิดพลาดในการยืนยันตัวตน');
    });

    it('should handle StripeRateLimitError', () => {
      const error = new Stripe.errors.StripeRateLimitError({
        type: 'rate_limit_error',
        message: 'Rate limit exceeded.',
      });

      const result = handleStripeError(error);

      expect(result.type).toBe('rate_limit_error');
      expect(result.messageTh).toContain('มีการร้องขอมากเกินไป');
    });

    it('should handle unknown Stripe error type', () => {
      // Create a base StripeError with unknown type
      const error = new Stripe.errors.StripePermissionError({
        type: 'permission_error',
        message: 'Permission denied.',
      });

      const result = handleStripeError(error);

      expect(result.type).toBe('unknown_error');
      expect(result.messageTh).toContain('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    });

    it('should handle non-Stripe Error', () => {
      const error = new Error('Some random error');

      const result = handleStripeError(error);

      expect(result.type).toBe('unknown_error');
      expect(result.message).toBe('Some random error');
      expect(result.messageTh).toContain('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    });

    it('should handle non-Error objects', () => {
      const error = 'string error';

      const result = handleStripeError(error);

      expect(result.type).toBe('unknown_error');
      expect(result.message).toBe('Unknown error');
    });

    it('should handle null/undefined errors', () => {
      const result = handleStripeError(null);

      expect(result.type).toBe('unknown_error');
    });
  });

  describe('isStripeError', () => {
    it('should return true for Stripe errors', () => {
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Card declined.',
      });

      expect(isStripeError(error)).toBe(true);
    });

    it('should return false for regular errors', () => {
      const error = new Error('Regular error');

      expect(isStripeError(error)).toBe(false);
    });

    it('should return false for non-error objects', () => {
      expect(isStripeError('string')).toBe(false);
      expect(isStripeError(null)).toBe(false);
      expect(isStripeError(undefined)).toBe(false);
      expect(isStripeError({})).toBe(false);
    });
  });

  describe('logStripeError', () => {
    it('should log error with context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new Stripe.errors.StripeCardError({
        type: 'card_error',
        message: 'Card declined.',
        code: 'card_declined',
      });

      logStripeError(error, {
        operation: 'createCustomer',
        userId: 'user-123',
        customerId: 'cus_123',
      });

      expect(consoleSpy).toHaveBeenCalledWith('[Stripe Error]', expect.objectContaining({
        operation: 'createCustomer',
        userId: 'user-123',
        customerId: 'cus_123',
        errorType: 'card_error',
      }));

      expect(Sentry.captureException).toHaveBeenCalledWith(error, expect.objectContaining({
        tags: expect.objectContaining({
          service: 'stripe',
          operation: 'createCustomer',
        }),
        extra: expect.objectContaining({
          userId: 'user-123',
          customerId: 'cus_123',
        }),
      }));

      consoleSpy.mockRestore();
    });

    it('should log error with minimal context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new Error('Some error');

      logStripeError(error, {
        operation: 'testOperation',
      });

      expect(consoleSpy).toHaveBeenCalled();
      expect(Sentry.captureException).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should log error with metadata', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new Error('Error with metadata');

      logStripeError(error, {
        operation: 'operationWithMeta',
        metadata: {
          subscriptionId: 'sub_123',
          priceId: 'price_abc',
        },
      });

      expect(Sentry.captureException).toHaveBeenCalledWith(error, expect.objectContaining({
        extra: expect.objectContaining({
          metadata: {
            subscriptionId: 'sub_123',
            priceId: 'price_abc',
          },
        }),
      }));

      consoleSpy.mockRestore();
    });
  });
});
