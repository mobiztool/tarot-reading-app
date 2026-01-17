/**
 * AI Interpretation API Endpoint
 * Story 9.2: AI-Powered Personalized Interpretations
 * 
 * POST /api/ai/interpret
 * Generates AI-powered personalized tarot interpretation for VIP users
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  generateAIInterpretation,
  isAIServiceAvailable,
  checkRateLimit,
  recordUsage,
  generateCacheKey,
  getCachedResponse,
  cacheResponse,
  isDailyCostThresholdExceeded,
  AICardInfo,
} from '@/lib/ai';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';

interface InterpretRequest {
  readingType: string;
  question?: string;
  cards: AICardInfo[];
}

/**
 * Helper to get user's subscription tier
 */
async function getUserTier(userId: string): Promise<string> {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const subscription = await prisma.subscription.findFirst({
      where: {
        user_id: userId,
        status: 'active',
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!subscription) {
      return 'free';
    }

    // Map Stripe price ID to tier
    // In production, these should be env vars
    const priceIdToTier: Record<string, string> = {
      [process.env.STRIPE_PRICE_ID_BASIC || '']: 'basic',
      [process.env.STRIPE_PRICE_ID_PRO || '']: 'pro',
      [process.env.STRIPE_PRICE_ID_VIP || '']: 'vip',
    };

    return priceIdToTier[subscription.stripe_price_id] || 'free';
  } catch (error) {
    console.error('Error fetching user tier:', error);
    return 'free';
  }
}

/**
 * POST /api/ai/interpret
 * Generate AI interpretation for tarot reading
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if AI service is configured
    if (!isAIServiceAvailable()) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI service is not configured',
          fallback: true,
        },
        { status: 503 }
      );
    }

    // Check daily cost threshold
    if (isDailyCostThresholdExceeded()) {
      console.warn('[AI] Daily cost threshold exceeded');
      return NextResponse.json(
        {
          success: false,
          error: 'AI service temporarily unavailable',
          fallback: true,
        },
        { status: 503 }
      );
    }

    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'กรุณาเข้าสู่ระบบก่อน',
          fallback: true,
        },
        { status: 401 }
      );
    }

    // Check VIP tier
    const userTier = await getUserTier(user.id);
    if (userTier !== 'vip') {
      return NextResponse.json(
        {
          success: false,
          error: 'ฟีเจอร์นี้สำหรับสมาชิก VIP เท่านั้น',
          requiredTier: 'vip',
          currentTier: userTier,
          fallback: true,
        },
        { status: 403 }
      );
    }

    // Check rate limit
    const rateLimitStatus = checkRateLimit(user.id);
    if (!rateLimitStatus.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `คุณใช้ AI ครบ ${rateLimitStatus.dailyLimit} ครั้งต่อวันแล้ว กรุณารอจนถึง ${rateLimitStatus.resetAt.toLocaleTimeString('th-TH')}`,
          rateLimitExceeded: true,
          resetAt: rateLimitStatus.resetAt.toISOString(),
          fallback: true,
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body: InterpretRequest = await request.json();

    // Validate request
    if (!body.readingType || !body.cards || body.cards.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ข้อมูลไม่ครบถ้วน',
          fallback: true,
        },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = generateCacheKey(
      body.cards.map((c) => ({ name: c.name, isReversed: c.isReversed })),
      body.question
    );
    
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        interpretation: cached.response,
        cached: true,
        tokensUsed: cached.tokensUsed,
        remaining: rateLimitStatus.remaining,
      });
    }

    // Generate AI interpretation with timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), config.ai.timeoutMs)
    );

    const interpretationPromise = generateAIInterpretation({
      userId: user.id,
      question: body.question,
      cards: body.cards,
      readingType: body.readingType,
    });

    const result = await Promise.race([interpretationPromise, timeoutPromise]);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'เกิดข้อผิดพลาดในการสร้างคำทำนาย',
          fallback: true,
        },
        { status: 500 }
      );
    }

    // Record usage
    recordUsage(user.id, result.tokensUsed || 0, result.costEstimate || 0);

    // Cache the response
    if (result.interpretation && result.tokensUsed) {
      cacheResponse(cacheKey, result.interpretation, result.tokensUsed);
    }

    return NextResponse.json({
      success: true,
      interpretation: result.interpretation,
      cached: false,
      tokensUsed: result.tokensUsed,
      remaining: rateLimitStatus.remaining - 1,
    });
  } catch (error) {
    console.error('[AI API Error]', error);

    // Handle timeout
    if (error instanceof Error && error.message === 'Timeout') {
      return NextResponse.json(
        {
          success: false,
          error: 'AI ใช้เวลานานเกินไป กรุณาลองใหม่',
          fallback: true,
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
        fallback: true,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/interpret
 * Get rate limit status for current user
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if AI service is configured
    const available = isAIServiceAvailable();

    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        available,
        authenticated: false,
        isVip: false,
        rateLimit: null,
      });
    }

    // Check VIP tier
    const userTier = await getUserTier(user.id);
    const isVip = userTier === 'vip';

    // Get rate limit status
    const rateLimitStatus = isVip ? checkRateLimit(user.id) : null;

    return NextResponse.json({
      available,
      authenticated: true,
      isVip,
      currentTier: userTier,
      rateLimit: rateLimitStatus
        ? {
            remaining: rateLimitStatus.remaining,
            dailyLimit: rateLimitStatus.dailyLimit,
            resetAt: rateLimitStatus.resetAt.toISOString(),
          }
        : null,
    });
  } catch (error) {
    console.error('[AI Status Error]', error);
    return NextResponse.json(
      {
        available: false,
        error: 'Failed to check status',
      },
      { status: 500 }
    );
  }
}
