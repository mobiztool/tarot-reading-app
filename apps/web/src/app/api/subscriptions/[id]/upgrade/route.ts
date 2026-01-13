/**
 * Upgrade Subscription API Route
 * POST /api/subscriptions/[id]/upgrade
 * 
 * Upgrades a user's subscription to a higher tier with proration
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
    const { newTier, newPriceId } = await request.json();

    if (!newTier || !newPriceId) {
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

    // Verify it's an upgrade (not a downgrade)
    const currentTier = getTierFromPriceId(subscription.stripe_price_id);
    if (!isHigherTier(newTier, currentTier)) {
      return NextResponse.json(
        { error: 'ไม่สามารถลดระดับผ่าน API นี้ได้' },
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

    // Update subscription in Stripe with proration
    const updatedStripeSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        items: [{
          id: subscriptionItemId,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations', // Charge difference immediately
      }
    );

    // Update database immediately (webhook will also update, but this is for instant access)
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        stripe_price_id: newPriceId,
        // Clear any pending downgrade if exists
        metadata: {},
      },
    });

    // Track analytics
    console.log('[Analytics] subscription_upgraded:', {
      userId: user.id,
      oldTier: currentTier,
      newTier,
      subscriptionId,
    });

    // Create analytics event
    await prisma.analyticsEvent.create({
      data: {
        event_type: 'spread_page_view', // Using a generic event type
        user_id: user.id,
        metadata: {
          eventName: 'subscription_upgraded',
          oldTier: currentTier,
          newTier,
          subscriptionId,
        },
      },
    }).catch(err => console.error('[Analytics] Failed to track subscription_upgraded:', err));

    // TODO: Send upgrade confirmation email
    // await sendUpgradeConfirmationEmail(user.email, newTier);

    return NextResponse.json({
      success: true,
      message: 'อัปเกรดสำเร็จ! คุณสามารถเข้าถึงฟีเจอร์ใหม่ได้ทันที',
      subscription: {
        id: updatedStripeSubscription.id,
        tier: newTier,
        status: updatedStripeSubscription.status,
      },
    });

  } catch (error) {
    console.error('[Upgrade API] Error:', error);
    
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
