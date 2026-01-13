/**
 * Retention Offers API
 * Handles retention actions (pause, discount, downgrade)
 * Story 6.11 - Cancellation & Retention Flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe/server';
import { getTierPriceId, getTierFromPriceId } from '@/lib/subscription';
import { SubscriptionTier } from '@/types/subscription';

// Simple analytics tracking - logs to console since events aren't in DB enum yet
// In production, these would be tracked via Mixpanel/Amplitude/GA4
function logAnalyticsEvent(
  eventType: string, 
  userId: string, 
  data?: Record<string, unknown>
) {
  console.log(`[Analytics] ${eventType}`, { userId, ...data });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscriptionId = params.id;
    const body = await request.json();
    const { action, reason, feedback } = body;

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { user: true },
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (subscription.user_id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get tier from price ID
    const currentTier = getTierFromPriceId(subscription.stripe_price_id);

    // Track cancellation attempt
    logAnalyticsEvent('cancellation_attempted', userId, {
      subscription_id: subscriptionId,
      tier: currentTier,
      reason,
      action,
    });

    // Save cancellation reason regardless of outcome
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancellation_reason: reason,
        cancellation_feedback: feedback,
      },
    });

    // Handle different retention actions
    switch (action) {
      case 'pause': {
        // Pause subscription for 1 month
        const resumeDate = new Date();
        resumeDate.setMonth(resumeDate.getMonth() + 1);

        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          pause_collection: {
            behavior: 'keep_as_draft',
            resumes_at: Math.floor(resumeDate.getTime() / 1000),
          },
        });

        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            status: 'paused',
            metadata: {
              ...(subscription.metadata as object || {}),
              pausedAt: new Date().toISOString(),
              resumesAt: resumeDate.toISOString(),
            },
          },
        });

        logAnalyticsEvent('retention_offer_accepted', userId, {
          subscription_id: subscriptionId,
          offer: 'pause',
          reason,
        });

        return NextResponse.json({
          success: true,
          message: 'Subscription paused successfully',
          resumeDate: resumeDate.toISOString(),
        });
      }

      case 'discount_20_3months': {
        // Apply 20% discount coupon for 3 months
        // Note: You need to create a coupon in Stripe Dashboard first
        // with ID 'RETENTION_20PCT' or use stripe.coupons.create()
        
        try {
          // Ensure coupon exists, create if not
          let couponExists = true;
          try {
            await stripe.coupons.retrieve('RETENTION_20PCT');
          } catch {
            couponExists = false;
          }
          
          if (!couponExists) {
            await stripe.coupons.create({
              id: 'RETENTION_20PCT',
              percent_off: 20,
              duration: 'repeating',
              duration_in_months: 3,
              name: 'Retention Discount 20%',
            });
          }
          
          // Apply coupon using discounts parameter
          await stripe.subscriptions.update(subscription.stripe_subscription_id, {
            discounts: [{ coupon: 'RETENTION_20PCT' }],
          });
        } catch (discountError) {
          console.error('Error applying discount:', discountError);
          return NextResponse.json(
            { success: false, error: 'Failed to apply discount' },
            { status: 500 }
          );
        }

        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            metadata: {
              ...(subscription.metadata as object || {}),
              discountApplied: true,
              discountType: '20_percent_3_months',
              discountAppliedAt: new Date().toISOString(),
            },
          },
        });

        logAnalyticsEvent('retention_offer_accepted', userId, {
          subscription_id: subscriptionId,
          offer: 'discount',
          discountPercent: 20,
          durationMonths: 3,
          reason,
        });

        return NextResponse.json({
          success: true,
          message: 'Discount applied successfully',
        });
      }

      case 'downgrade_basic':
      case 'downgrade_pro': {
        const newTier: SubscriptionTier = action === 'downgrade_basic' ? 'basic' : 'pro';
        const newPriceId = getTierPriceId(newTier);

        if (!newPriceId) {
          return NextResponse.json(
            { success: false, error: 'Invalid tier' },
            { status: 400 }
          );
        }

        // Get current subscription from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripe_subscription_id
        );

        // Schedule downgrade at period end (no proration)
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          items: [
            {
              id: stripeSubscription.items.data[0].id,
              price: newPriceId,
            },
          ],
          proration_behavior: 'none',
          billing_cycle_anchor: 'unchanged',
        });

        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            stripe_price_id: newPriceId,
            metadata: {
              ...(subscription.metadata as object || {}),
              downgradedFrom: currentTier,
              downgradedTo: newTier,
              downgradedAt: new Date().toISOString(),
              retentionDowngrade: true,
            },
          },
        });

        logAnalyticsEvent('retention_offer_accepted', userId, {
          subscription_id: subscriptionId,
          offer: 'downgrade',
          fromTier: currentTier,
          toTier: newTier,
          reason,
        });

        return NextResponse.json({
          success: true,
          message: 'Downgrade applied successfully',
          newTier,
        });
      }

      case 'request_feature': {
        // Just save the feedback
        logAnalyticsEvent('feature_request_from_cancellation', userId, {
          subscription_id: subscriptionId,
          feedback,
          reason,
        });

        return NextResponse.json({
          success: true,
          message: 'Feedback received',
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing retention offer:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
