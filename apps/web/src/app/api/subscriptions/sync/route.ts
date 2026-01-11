/**
 * Sync Subscription from Stripe
 * This endpoint syncs subscription data from Stripe to local database
 * Useful when webhooks are not set up (local development)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { SubscriptionTier, SubscriptionStatus } from '@/types/subscription';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const getStripe = async () => {
  const { stripe } = await import('@/lib/stripe/server');
  return stripe;
};

// Map Stripe status to our SubscriptionStatus enum
function mapStripeStatus(status: string): SubscriptionStatus {
  switch (status) {
    case 'active':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'canceled':
      return 'canceled';
    case 'incomplete':
      return 'incomplete';
    case 'incomplete_expired':
      return 'incomplete_expired';
    case 'trialing':
      return 'trialing';
    case 'unpaid':
      return 'unpaid';
    case 'paused':
      return 'paused';
    default:
      return 'incomplete';
  }
}

// Map price ID to tier
function getTierFromPriceId(priceId: string): SubscriptionTier {
  const basicPriceId = process.env.STRIPE_PRICE_ID_BASIC;
  const proPriceId = process.env.STRIPE_PRICE_ID_PRO;
  const vipPriceId = process.env.STRIPE_PRICE_ID_VIP;

  if (priceId === basicPriceId) return 'basic';
  if (priceId === proPriceId) return 'pro';
  if (priceId === vipPriceId) return 'vip';
  return 'free';
}

export async function POST(): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's Stripe customer ID
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    const stripe = await getStripe();

    // Get all subscriptions for this customer from Stripe
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: dbUser.stripeCustomerId,
      status: 'all',
      limit: 10,
    });

    console.log('[Sync] Found subscriptions:', stripeSubscriptions.data.length);

    const results = [];

    for (const sub of stripeSubscriptions.data as Stripe.Subscription[]) {
      const subscriptionItem = sub.items.data[0];
      const priceId = subscriptionItem?.price.id || '';
      const tier = getTierFromPriceId(priceId);

      // Get current period from subscription item (new Stripe SDK structure)
      const currentPeriodStart = subscriptionItem?.current_period_start;
      const currentPeriodEnd = subscriptionItem?.current_period_end;

      // Helper function to safely convert timestamps
      const toDate = (timestamp: number | null | undefined): Date => {
        if (!timestamp || timestamp <= 0) {
          return new Date(); // Default to now if invalid
        }
        return new Date(timestamp * 1000);
      };

      const toNullableDate = (timestamp: number | null | undefined): Date | null => {
        if (!timestamp || timestamp <= 0) return null;
        return new Date(timestamp * 1000);
      };

      // Upsert subscription in database
      // Note: We only use fields that exist in the Subscription model
      const subscription = await prisma.subscription.upsert({
        where: { stripe_subscription_id: sub.id },
        update: {
          status: mapStripeStatus(sub.status),
          stripe_price_id: priceId,
          current_period_start: toDate(currentPeriodStart),
          current_period_end: toDate(currentPeriodEnd),
          // Use cancel_at to store period end if cancel_at_period_end is true
          cancel_at: sub.cancel_at_period_end ? toDate(currentPeriodEnd) : null,
          canceled_at: toNullableDate(sub.canceled_at),
          ended_at: toNullableDate(sub.ended_at),
        },
        create: {
          user_id: user.id,
          stripe_subscription_id: sub.id,
          stripe_customer_id: dbUser.stripeCustomerId,
          stripe_price_id: priceId,
          status: mapStripeStatus(sub.status),
          current_period_start: toDate(currentPeriodStart),
          current_period_end: toDate(currentPeriodEnd),
          cancel_at: sub.cancel_at_period_end ? toDate(currentPeriodEnd) : null,
          canceled_at: toNullableDate(sub.canceled_at),
          ended_at: toNullableDate(sub.ended_at),
        },
      });

      results.push({
        id: subscription.id,
        stripeId: sub.id,
        status: sub.status,
        tier,
      });
    }

    return NextResponse.json({
      message: 'Synced successfully',
      subscriptions: results,
    });
  } catch (error) {
    console.error('[Sync] Error:', error);
    return NextResponse.json(
      { error: 'Failed to sync subscriptions' },
      { status: 500 }
    );
  }
}
