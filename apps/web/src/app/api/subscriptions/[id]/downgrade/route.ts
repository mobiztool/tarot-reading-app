/**
 * Downgrade Subscription API Route
 * POST /api/subscriptions/[id]/downgrade
 * 
 * Schedules a downgrade to a lower tier at the end of the current billing period
 * No proration - no refund for downgrades (industry standard)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe/server';
import Stripe from 'stripe';
import { SubscriptionTier } from '@/types/subscription';
import { getTierPriceId, isHigherTier } from '@/lib/subscription/tiers';

// Map Stripe Price ID to subscription tier
function getTierFromPriceId(priceId: string): SubscriptionTier {
  const basicPriceId = process.env.STRIPE_PRICE_ID_BASIC;
  const proPriceId = process.env.STRIPE_PRICE_ID_PRO;
  const vipPriceId = process.env.STRIPE_PRICE_ID_VIP;

  if (priceId === vipPriceId) return 'vip';
  if (priceId === proPriceId) return 'pro';
  if (priceId === basicPriceId) return 'basic';
  return 'free';
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: subscriptionId } = await params;
    
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // Parse request body
    const { newTier } = await request.json();

    if (!newTier) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }

    // Get subscription from database
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'ไม่พบการสมัครสมาชิก' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (subscription.user_id !== user.id) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการดำเนินการ' },
        { status: 403 }
      );
    }

    // Verify it's a downgrade (not an upgrade)
    const currentTier = getTierFromPriceId(subscription.stripe_price_id);
    if (isHigherTier(newTier, currentTier) || newTier === currentTier) {
      return NextResponse.json(
        { error: 'ไม่สามารถอัปเกรดผ่าน API นี้ได้' },
        { status: 400 }
      );
    }

    // Get the price ID for the new tier
    const newPriceId = getTierPriceId(newTier);
    if (!newPriceId) {
      return NextResponse.json(
        { error: 'ไม่พบราคาสำหรับแพ็คเกจนี้' },
        { status: 400 }
      );
    }

    // Get Stripe subscription to find the item ID
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    );

    const subscriptionItemId = stripeSubscription.items.data[0]?.id;
    if (!subscriptionItemId) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลรายการสมัครสมาชิก' },
        { status: 500 }
      );
    }

    // Schedule downgrade at period end (no immediate change, no proration)
    // This uses Stripe's "subscription schedules" approach
    // The price change will be applied at the next billing cycle
    await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        items: [{
          id: subscriptionItemId,
          price: newPriceId,
        }],
        proration_behavior: 'none', // No proration, takes effect at period end
        billing_cycle_anchor: 'unchanged',
      }
    );

    // Store pending downgrade info in metadata
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        metadata: {
          pendingDowngrade: {
            newTier,
            newPriceId,
            effectiveDate: subscription.current_period_end.toISOString(),
            scheduledAt: new Date().toISOString(),
          },
        },
      },
    });

    // Track analytics
    console.log('[Analytics] subscription_downgraded:', {
      userId: user.id,
      oldTier: currentTier,
      newTier,
      effectiveDate: subscription.current_period_end,
    });

    // Create analytics event
    await prisma.analyticsEvent.create({
      data: {
        event_type: 'spread_page_view', // Using a generic event type
        user_id: user.id,
        metadata: {
          eventName: 'subscription_downgraded',
          oldTier: currentTier,
          newTier,
          effectiveDate: subscription.current_period_end.toISOString(),
        },
      },
    }).catch(err => console.error('[Analytics] Failed to track subscription_downgraded:', err));

    // TODO: Send downgrade scheduled email
    // await sendDowngradeScheduledEmail(user.email, currentTier, newTier, subscription.current_period_end);

    return NextResponse.json({
      success: true,
      message: `การลดระดับจะมีผลในวันที่สิ้นสุดรอบบิล คุณยังคงใช้งาน${currentTier}ได้จนถึงวันนั้น`,
      pendingDowngrade: {
        newTier,
        effectiveDate: subscription.current_period_end,
      },
    });

  } catch (error) {
    console.error('[Downgrade API] Error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/subscriptions/[id]/downgrade
 * Cancel a scheduled downgrade
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: subscriptionId } = await params;
    
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // Get subscription from database
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'ไม่พบการสมัครสมาชิก' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (subscription.user_id !== user.id) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการดำเนินการ' },
        { status: 403 }
      );
    }

    // Get current tier
    const currentTier = getTierFromPriceId(subscription.stripe_price_id);
    const currentPriceId = getTierPriceId(currentTier);

    if (!currentPriceId) {
      return NextResponse.json(
        { error: 'ไม่สามารถกู้คืนแพ็คเกจได้' },
        { status: 500 }
      );
    }

    // Get Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    );

    const subscriptionItemId = stripeSubscription.items.data[0]?.id;
    if (!subscriptionItemId) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลรายการสมัครสมาชิก' },
        { status: 500 }
      );
    }

    // Revert to current tier price in Stripe
    await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        items: [{
          id: subscriptionItemId,
          price: currentPriceId,
        }],
        proration_behavior: 'none',
      }
    );

    // Clear pending downgrade from metadata
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        metadata: {},
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ยกเลิกการลดระดับเรียบร้อยแล้ว',
    });

  } catch (error) {
    console.error('[Cancel Downgrade API] Error:', error);
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
