/**
 * Stripe Error Handling
 * User-friendly error messages in Thai
 */
import Stripe from 'stripe';
import * as Sentry from '@sentry/nextjs';

/**
 * Stripe error type enumeration for internal use
 */
export type StripeErrorType =
  | 'card_error'
  | 'invalid_request'
  | 'api_error'
  | 'connection_error'
  | 'authentication_error'
  | 'rate_limit_error'
  | 'unknown_error';

/**
 * Structured error response for API handlers
 */
export interface StripeErrorResponse {
  type: StripeErrorType;
  message: string;
  messageTh: string;
  code?: string;
  declineCode?: string;
}

/**
 * Handle Stripe errors and return user-friendly messages in Thai
 */
export function handleStripeError(error: unknown): StripeErrorResponse {
  // Log error to Sentry for monitoring
  if (error instanceof Error) {
    Sentry.captureException(error, {
      tags: { service: 'stripe' },
    });
  }

  if (error instanceof Stripe.errors.StripeError) {
    switch (error.type) {
      case 'StripeCardError':
        return {
          type: 'card_error',
          message: error.message || 'Your card was declined.',
          messageTh: getCardErrorMessageTh(error.code, error.decline_code),
          code: error.code,
          declineCode: error.decline_code,
        };
      
      case 'StripeInvalidRequestError':
        return {
          type: 'invalid_request',
          message: error.message || 'Invalid payment request.',
          messageTh: 'ข้อมูลการชำระเงินไม่ถูกต้อง กรุณาตรวจสอบและลองอีกครั้ง',
          code: error.code,
        };
      
      case 'StripeAPIError':
        return {
          type: 'api_error',
          message: 'An error occurred with our payment service.',
          messageTh: 'เกิดข้อผิดพลาดในระบบชำระเงิน กรุณาลองอีกครั้งภายหลัง',
          code: error.code,
        };
      
      case 'StripeConnectionError':
        return {
          type: 'connection_error',
          message: 'Unable to connect to payment service.',
          messageTh: 'ไม่สามารถเชื่อมต่อระบบชำระเงินได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
          code: error.code,
        };
      
      case 'StripeAuthenticationError':
        return {
          type: 'authentication_error',
          message: 'Authentication with payment service failed.',
          messageTh: 'เกิดข้อผิดพลาดในการยืนยันตัวตนกับระบบชำระเงิน',
          code: error.code,
        };
      
      case 'StripeRateLimitError':
        return {
          type: 'rate_limit_error',
          message: 'Too many requests. Please try again later.',
          messageTh: 'มีการร้องขอมากเกินไป กรุณารอสักครู่แล้วลองอีกครั้ง',
          code: error.code,
        };
      
      default:
        return {
          type: 'unknown_error',
          message: error.message || 'An unexpected payment error occurred.',
          messageTh: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาติดต่อฝ่ายสนับสนุน',
          code: error.code,
        };
    }
  }

  // Handle non-Stripe errors
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return {
    type: 'unknown_error',
    message: errorMessage,
    messageTh: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาติดต่อฝ่ายสนับสนุน',
  };
}

/**
 * Get Thai error message for specific card errors
 */
function getCardErrorMessageTh(code?: string, declineCode?: string): string {
  // Handle specific decline codes first
  if (declineCode) {
    switch (declineCode) {
      case 'insufficient_funds':
        return 'ยอดเงินในบัญชีไม่เพียงพอ กรุณาใช้บัตรอื่นหรือเติมเงิน';
      case 'lost_card':
      case 'stolen_card':
        return 'บัตรนี้ถูกระงับ กรุณาติดต่อธนาคารของคุณ';
      case 'card_velocity_exceeded':
        return 'เกินวงเงินที่ใช้ได้ในวันนี้ กรุณาลองใหม่ในวันพรุ่งนี้';
      case 'do_not_honor':
        return 'ธนาคารปฏิเสธการทำรายการ กรุณาติดต่อธนาคารของคุณ';
      case 'expired_card':
        return 'บัตรหมดอายุ กรุณาใช้บัตรใหม่';
      case 'incorrect_cvc':
        return 'รหัส CVV ไม่ถูกต้อง กรุณาตรวจสอบหลังบัตร';
      case 'processing_error':
        return 'เกิดข้อผิดพลาดในการประมวลผล กรุณาลองอีกครั้ง';
      case 'incorrect_number':
        return 'หมายเลขบัตรไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
      default:
        // Continue to code-based handling
        break;
    }
  }

  // Handle error codes
  if (code) {
    switch (code) {
      case 'card_declined':
        return 'บัตรของคุณถูกปฏิเสธ กรุณาติดต่อธนาคารหรือใช้บัตรอื่น';
      case 'expired_card':
        return 'บัตรหมดอายุ กรุณาใช้บัตรใหม่';
      case 'incorrect_cvc':
        return 'รหัส CVV ไม่ถูกต้อง กรุณาตรวจสอบหลังบัตร';
      case 'incorrect_number':
        return 'หมายเลขบัตรไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
      case 'invalid_expiry_month':
      case 'invalid_expiry_year':
        return 'วันหมดอายุของบัตรไม่ถูกต้อง';
      case 'processing_error':
        return 'เกิดข้อผิดพลาดในการประมวลผล กรุณาลองอีกครั้ง';
      default:
        return 'บัตรของคุณถูกปฏิเสธ กรุณาตรวจสอบข้อมูลหรือใช้บัตรอื่น';
    }
  }

  return 'บัตรของคุณถูกปฏิเสธ กรุณาตรวจสอบข้อมูลหรือใช้บัตรอื่น';
}

/**
 * Check if error is a Stripe error
 */
export function isStripeError(error: unknown): error is Stripe.errors.StripeError {
  return error instanceof Stripe.errors.StripeError;
}

/**
 * Log Stripe error with context for debugging
 */
export function logStripeError(
  error: unknown,
  context: {
    operation: string;
    userId?: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }
): void {
  const errorResponse = handleStripeError(error);
  
  console.error('[Stripe Error]', {
    ...context,
    errorType: errorResponse.type,
    errorCode: errorResponse.code,
    declineCode: errorResponse.declineCode,
    message: errorResponse.message,
  });

  // Send to Sentry with context
  Sentry.captureException(error, {
    tags: {
      service: 'stripe',
      operation: context.operation,
      errorType: errorResponse.type,
    },
    extra: {
      ...context,
      errorCode: errorResponse.code,
      declineCode: errorResponse.declineCode,
    },
  });
}
