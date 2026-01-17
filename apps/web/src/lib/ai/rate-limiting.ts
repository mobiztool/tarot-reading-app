/**
 * AI Rate Limiting & Usage Tracking
 * Story 9.2: AI-Powered Personalized Interpretations
 * 
 * Manages rate limiting per VIP user and tracks API usage costs
 */

import { config } from '@/lib/config';
import { AIRateLimitStatus, AIUsageRecord } from './types';

// In-memory store for rate limiting (for MVP - consider Redis for production)
const userDailyUsage = new Map<string, { count: number; resetAt: Date; totalCost: number }>();

// In-memory cache for AI responses
const responseCache = new Map<string, { response: string; timestamp: Date; tokensUsed: number }>();

/**
 * Generate cache key for a reading
 */
export function generateCacheKey(
  cards: { name: string; isReversed: boolean }[],
  question?: string
): string {
  const cardsKey = cards
    .map((c) => `${c.name}-${c.isReversed ? 'r' : 'u'}`)
    .sort()
    .join('|');
  const questionKey = question?.toLowerCase().trim() || '';
  return `${cardsKey}::${questionKey}`;
}

/**
 * Check if a cached response exists and is valid
 */
export function getCachedResponse(
  cacheKey: string
): { response: string; tokensUsed: number } | null {
  if (!config.ai.cacheEnabled) {
    return null;
  }

  const cached = responseCache.get(cacheKey);
  if (!cached) {
    return null;
  }

  // Check if cache has expired
  const expiryTime = config.ai.cacheExpiryHours * 60 * 60 * 1000;
  if (Date.now() - cached.timestamp.getTime() > expiryTime) {
    responseCache.delete(cacheKey);
    return null;
  }

  return { response: cached.response, tokensUsed: cached.tokensUsed };
}

/**
 * Store response in cache
 */
export function cacheResponse(
  cacheKey: string,
  response: string,
  tokensUsed: number
): void {
  if (!config.ai.cacheEnabled) {
    return;
  }

  responseCache.set(cacheKey, {
    response,
    timestamp: new Date(),
    tokensUsed,
  });

  // Cleanup old entries if cache is too large
  if (responseCache.size > 1000) {
    const entries = Array.from(responseCache.entries());
    entries
      .sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime())
      .slice(0, 500)
      .forEach(([key]) => responseCache.delete(key));
  }
}

/**
 * Get reset time for today (midnight UTC+7)
 */
function getDailyResetTime(): Date {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(17, 0, 0, 0); // UTC+7 midnight = 17:00 UTC previous day
  if (tomorrow <= now) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }
  return tomorrow;
}

/**
 * Check rate limit for a user
 */
export function checkRateLimit(userId: string): AIRateLimitStatus {
  const now = new Date();
  const usage = userDailyUsage.get(userId);

  // If no record or expired, create new
  if (!usage || usage.resetAt <= now) {
    userDailyUsage.set(userId, {
      count: 0,
      resetAt: getDailyResetTime(),
      totalCost: 0,
    });
    return {
      allowed: true,
      remaining: config.ai.maxRequestsPerDay,
      resetAt: getDailyResetTime(),
      dailyUsed: 0,
      dailyLimit: config.ai.maxRequestsPerDay,
    };
  }

  const remaining = config.ai.maxRequestsPerDay - usage.count;
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    resetAt: usage.resetAt,
    dailyUsed: usage.count,
    dailyLimit: config.ai.maxRequestsPerDay,
  };
}

/**
 * Record AI usage for a user
 */
export function recordUsage(
  userId: string,
  tokensUsed: number,
  costEstimate: number
): void {
  const now = new Date();
  const usage = userDailyUsage.get(userId);

  if (!usage || usage.resetAt <= now) {
    userDailyUsage.set(userId, {
      count: 1,
      resetAt: getDailyResetTime(),
      totalCost: costEstimate,
    });
  } else {
    usage.count += 1;
    usage.totalCost += costEstimate;
  }

  // Log for monitoring
  console.log(`[AI Usage] User: ${userId}, Tokens: ${tokensUsed}, Cost: $${costEstimate.toFixed(4)}`);
}

/**
 * Get daily cost aggregate (for monitoring)
 */
export function getDailyCostAggregate(): { totalCost: number; totalRequests: number } {
  let totalCost = 0;
  let totalRequests = 0;
  const now = new Date();

  userDailyUsage.forEach((usage) => {
    if (usage.resetAt > now) {
      totalCost += usage.totalCost;
      totalRequests += usage.count;
    }
  });

  return { totalCost, totalRequests };
}

/**
 * Check if daily cost threshold is exceeded
 */
export function isDailyCostThresholdExceeded(): boolean {
  const { totalCost } = getDailyCostAggregate();
  return totalCost >= config.ai.dailyCostAlertThreshold;
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = new Date();
  for (const [userId, usage] of userDailyUsage.entries()) {
    if (usage.resetAt <= now) {
      userDailyUsage.delete(userId);
    }
  }
}

// Cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 60 * 60 * 1000);
}
