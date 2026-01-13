/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique tokens per interval
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (cleared on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000); // Cleanup every minute
}

/**
 * Check if a request should be rate limited
 * @param identifier Unique identifier for the client (e.g., IP address, user ID)
 * @param limit Maximum number of requests allowed
 * @param interval Time window in milliseconds
 * @returns Object with success flag and remaining requests
 */
export function rateLimit(
  identifier: string,
  limit: number,
  interval: number = 60000 // Default: 1 minute
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = identifier;

  const entry = rateLimitStore.get(key);

  // If no entry or entry has expired, create new one
  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + interval,
    };
    rateLimitStore.set(key, newEntry);
    return { success: true, remaining: limit - 1, resetAt: newEntry.resetAt };
  }

  // Increment count
  entry.count += 1;

  // Check if limit exceeded
  if (entry.count > limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Get client IP address from request headers
 * Handles various proxy configurations
 */
export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback
  return 'unknown';
}

/**
 * Rate limit configuration presets
 */
export const RateLimitPresets = {
  // Standard API rate limit
  api: {
    limit: 100,
    interval: 60 * 1000, // 100 requests per minute
  },
  // Auth endpoints (stricter)
  auth: {
    limit: 10,
    interval: 60 * 1000, // 10 requests per minute
  },
  // Reading creation (moderate)
  reading: {
    limit: 30,
    interval: 60 * 1000, // 30 readings per minute
  },
  // Password reset (very strict)
  passwordReset: {
    limit: 3,
    interval: 15 * 60 * 1000, // 3 requests per 15 minutes
  },
} as const;

/**
 * Higher-order function to add rate limiting to API handlers
 */
export function withRateLimit(
  preset: keyof typeof RateLimitPresets
): (request: Request) => { success: boolean; response?: Response } {
  const config = RateLimitPresets[preset];

  return (request: Request) => {
    const clientIP = getClientIP(request);
    const result = rateLimit(`${preset}:${clientIP}`, config.limit, config.interval);

    if (!result.success) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({
            error: 'Too many requests',
            message: 'คุณทำคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่',
            retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
              'X-RateLimit-Limit': String(config.limit),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(result.resetAt),
            },
          }
        ),
      };
    }

    return { success: true };
  };
}


