/**
 * Individual Subscription API Routes
 * GET: Get subscription details
 * DELETE: Cancel subscription
 * PATCH: Pause/Resume subscription
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { handleStripeError } from '@/lib/stripe/errors';
import { getTierFromPriceId } from '@/lib/subscription';
// Simple analytics tracking - logs to console since events aren't in DB enum yet
function logAnalyticsEvent(
  eventType: string, 
  userId: string, 
  data?: Record<string, unknown>
) {
  console.log(`[Analytics] ${eventType}`, { userId, ...data });
}

// Force dynamic rendering to prevent build-time initialization
export const dynamic = 'force-dynamic';

// Lazy import stripe to prevent build-time API key requirement
const getStripe = async () => {
  const { stripe } = await import('@/lib/stripe/server');
  return stripe;
};

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/subscriptions/[id]
 * Get subscription details
 */
export async function GET(
  req: Request,
  { params }: RouteParams
): Promise<Response> {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (subscription.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get latest info from Stripe
    const stripe = await getStripe();
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    );

    return NextResponse.json({
      subscription,
      stripeStatus: stripeSubscription.status,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    });
  } catch (error) {
    console.error('[Subscription API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/subscriptions/[id]
 * Cancel subscription
 * Body: { immediate?: boolean, reason?: string, feedback?: string }
 */
export async function DELETE(
  req: Request,
  { params }: RouteParams
): Promise<Response> {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (subscription.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { 
      immediate = false, 
      cancelImmediately = false, // Backward compatibility
      reason,
      feedback,
    } = body as { 
      immediate?: boolean; 
      cancelImmediately?: boolean;
      reason?: string;
      feedback?: string;
    };

    const shouldCancelImmediately = immediate || cancelImmediately;

    const stripe = await getStripe();
    if (shouldCancelImmediately) {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    } else {
      // Cancel at end of billing period (grace period)
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: true,
      });
    }

    // Update local record with cancellation reason
    await prisma.subscription.update({
      where: { id },
      data: {
        // If not canceling immediately, set cancel_at to period end for grace period
        cancel_at: shouldCancelImmediately ? null : subscription.current_period_end,
        canceled_at: shouldCancelImmediately ? new Date() : null,
        status: shouldCancelImmediately ? 'canceled' : subscription.status,
        cancellation_reason: reason || subscription.cancellation_reason,
        cancellation_feedback: feedback || subscription.cancellation_feedback,
      },
    });

    // Track analytics
    logAnalyticsEvent('cancellation_completed', user.id, {
      subscription_id: id,
      tier: getTierFromPriceId(subscription.stripe_price_id),
      immediate: shouldCancelImmediately,
      reason,
    });

    // TODO: Send cancellation confirmation email

    return NextResponse.json({
      success: true,
      canceledImmediately: shouldCancelImmediately,
      message: shouldCancelImmediately
        ? 'การสมัครสมาชิกถูกยกเลิกทันที'
        : 'การสมัครสมาชิกจะยกเลิกเมื่อสิ้นสุดรอบบิลปัจจุบัน',
    });
  } catch (error) {
    console.error('[Subscription API] DELETE error:', error);
    const stripeError = handleStripeError(error);
    return NextResponse.json(
      { error: stripeError.messageTh },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/subscriptions/[id]
 * Update subscription (pause/resume)
 * Body: { action: 'pause' | 'resume' }
 */
export async function PATCH(
  req: Request,
  { params }: RouteParams
): Promise<Response> {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (subscription.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body as { action: 'pause' | 'resume' };

    if (!action || !['pause', 'resume'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "pause" or "resume"' },
        { status: 400 }
      );
    }

    const stripe = await getStripe();
    if (action === 'pause') {
      // Pause subscription
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        pause_collection: { behavior: 'keep_as_draft' },
      });

      await prisma.subscription.update({
        where: { id },
        data: { status: 'paused' },
      });

      return NextResponse.json({
        success: true,
        message: 'การสมัครสมาชิกถูกหยุดชั่วคราว',
      });
    } else {
      // Resume subscription
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        pause_collection: null as unknown as undefined,
      });

      await prisma.subscription.update({
        where: { id },
        data: { status: 'active' },
      });

      return NextResponse.json({
        success: true,
        message: 'การสมัครสมาชิกกลับมาใช้งานแล้ว',
      });
    }
  } catch (error) {
    console.error('[Subscription API] PATCH error:', error);
    const stripeError = handleStripeError(error);
    return NextResponse.json(
      { error: stripeError.messageTh },
      { status: 500 }
    );
  }
}
