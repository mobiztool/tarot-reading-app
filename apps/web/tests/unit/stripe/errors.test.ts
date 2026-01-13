/**
 * Unit Tests: Stripe Error Handling
 * Tests for lib/stripe/errors.ts
 * 
 * Story: 6.1 - Stripe Payment Gateway Integration
 * Target Coverage: 100%
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import Stripe from 'stripe';
import {
  handleStripeError,
  isStripeError,
  logStripeError,
  type StripeErrorResponse,
} from '@/lib/stripe/errors';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

describe('Stripe Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleStripeError', () => {
    it('should handle StripeCardError with decline code', () => {
      const error = new Stripe.errors.StripeCardError({
        message: 'Your card was declined.',
        code: 'card_declined',
        decline_code: 'insufficient_funds',
        type: 'StripeCardError',
      } as any);

      const result = handleStripeError(error);

      expect(result.type).toBe('card_error');
      expect(result.messageTh).toContain('ยอดเงินในบัญชีไม่เพียงพอ');
      expect(result.declineCode).toBe('insufficient_funds');
    });

    it('should handle expired card error', () => {
      const error = new Stripe.errors.StripeCardError({
        message: 'Your card has expired.',
        code: 'expired_card',
        type: 'StripeCardError',
      } as any);

      const result = handleStripeError(error);

      expect(result.type).toBe('card_error');
      expect(result.messageTh).toContain('บัตรหมดอายุ');
    });

    it('should handle incorrect CVC error', () => {
      const error = new Stripe.errors.StripeCardError({
        message: 'Your card CVC is incorrect.',
        code: 'incorrect_cvc',
        decline_code: 'incorrect_cvc',
        type: 'StripeCardError',
      } as any);

      const result = handleStripeError(error);

      expect(result.type).toBe('card_error');
      expect(result.messageTh).toContain('รหัส CVV ไม่ถูกต้อง');
    });

    it('should handle StripeInvalidRequestError', () => {
      const error = new Stripe.errors.StripeInvalidRequestError({
        message: 'Invalid request',
        type: 'StripeInvalidRequestError',
      } as any);

      const result = handleStripeError(error);

      expect(result.type).toBe('invalid_request');
      expect(result.messageTh).toContain('ข้อมูลการชำระเงินไม่ถูกต้อง');
    });

    it('should handle StripeAPIError', () => {
      const error = new Stripe.errors.StripeAPIError({
        message: 'API error occurred',
        type: 'StripeAPIError',
      } as any);

      const result = handleStripeError(error);

      expect(result.type).toBe('api_error');
      expect(result.messageTh).toContain('เกิดข้อผิดพลาดในระบบชำระเงิน');
    });

    it('should handle StripeConnectionError', () => {
      const error = new Stripe.errors.StripeConnectionError({
        message: 'Connection failed',
        type: 'StripeConnectionError',
      } as any);

      const result = handleStripeError(error);

      expect(result.type).toBe('connection_error');
      expect(result.messageTh).toContain('ไม่สามารถเชื่อมต่อระบบชำระเงินได้');
    });

    it('should handle StripeAuthenticationError', () => {
      const error = new Stripe.errors.StripeAuthenticationError({
        message: 'Authentication failed',
        type: 'StripeAuthenticationError',
      } as any);

      const result = handleStripeError(error);

      expect(result.type).toBe('authentication_error');
      expect(result.messageTh).toContain('เกิดข้อผิดพลาดในการยืนยันตัวตน');
    });

    it('should handle StripeRateLimitError', () => {
      const error = new Stripe.errors.StripeRateLimitError({
        message: 'Too many requests',
        type: 'StripeRateLimitError',
      } as any);

      const result = handleStripeError(error);

      expect(result.type).toBe('rate_limit_error');
      expect(result.messageTh).toContain('มีการร้องขอมากเกินไป');
    });

    it('should handle non-Stripe errors', () => {
      const error = new Error('Generic error');

      const result = handleStripeError(error);

      expect(result.type).toBe('unknown_error');
      expect(result.message).toBe('Generic error');
      expect(result.messageTh).toContain('ไม่ทราบสาเหตุ');
    });

    it('should handle unknown error types', () => {
      const error = { something: 'unexpected' };

      const result = handleStripeError(error);

      expect(result.type).toBe('unknown_error');
      expect(result.messageTh).toContain('ไม่ทราบสาเหตุ');
    });
  });

  describe('Decline Code Thai Messages', () => {
    const testDeclineCode = (
      declineCode: string,
      expectedThaiKeyword: string
    ) => {
      it(`should return Thai message for decline_code: ${declineCode}`, () => {
        const error = new Stripe.errors.StripeCardError({
          message: 'Card declined',
          code: 'card_declined',
          decline_code: declineCode,
          type: 'StripeCardError',
        } as any);

        const result = handleStripeError(error);

        expect(result.messageTh).toContain(expectedThaiKeyword);
      });
    };

    testDeclineCode('insufficient_funds', 'ยอดเงินในบัญชีไม่เพียงพอ');
    testDeclineCode('lost_card', 'บัตรนี้ถูกระงับ');
    testDeclineCode('stolen_card', 'บัตรนี้ถูกระงับ');
    testDeclineCode('card_velocity_exceeded', 'เกินวงเงิน');
    testDeclineCode('do_not_honor', 'ธนาคารปฏิเสธการทำรายการ');
    testDeclineCode('processing_error', 'เกิดข้อผิดพลาดในการประมวลผล');
    testDeclineCode('incorrect_number', 'หมายเลขบัตรไม่ถูกต้อง');
  });

  describe('isStripeError', () => {
    it('should return true for Stripe errors', () => {
      const error = new Stripe.errors.StripeCardError({
        message: 'Card error',
        type: 'StripeCardError',
      } as any);

      expect(isStripeError(error)).toBe(true);
    });

    it('should return false for non-Stripe errors', () => {
      const error = new Error('Regular error');

      expect(isStripeError(error)).toBe(false);
    });
  });

  describe('logStripeError', () => {
    it('should log error with context to console and Sentry', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { captureException } = await import('@sentry/nextjs');

      const error = new Stripe.errors.StripeCardError({
        message: 'Card declined',
        code: 'card_declined',
        type: 'StripeCardError',
      } as any);

      const context = {
        operation: 'createPayment',
        userId: 'user_123',
        customerId: 'cus_123',
      };

      logStripeError(error, context);

      expect(consoleSpy).toHaveBeenCalled();
      expect(captureException).toHaveBeenCalledWith(
        error,
        expect.objectContaining({
          tags: expect.objectContaining({
            service: 'stripe',
            operation: 'createPayment',
          }),
        })
      );

      consoleSpy.mockRestore();
    });
  });
});
