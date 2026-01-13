/**
 * Subscription API Routes
 * GET: List user's subscriptions
 * POST: Create new subscription
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { handleStripeError } from '@/lib/stripe/errors';
import { getOrCreateStripeCustomer } from '@/lib/stripe/customer';
import { getTierPriceId, SUBSCRIPTION_TIERS } from '@/lib/subscription/tiers';
import { SubscriptionTier } from '@/types/subscription';

// Force dynamic rendering to prevent build-time initialization
export const dynamic = 'force-dynamic';

// Lazy import stripe to prevent build-time API key requirement
const getStripe = async () => {
  const { stripe } = await import('@/lib/stripe/server');
  return stripe;
};

/**
 * GET /api/subscriptions
 * Get current user's subscriptions
 */
export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
    });

    // Derive current tier from active subscription
    const activeSubscription = subscriptions.find(s => s.status === 'active' || s.status === 'trialing');
    let currentTier: SubscriptionTier = 'free';
    
    if (activeSubscription) {
      // Derive tier from stripe_price_id
      const priceId = activeSubscription.stripe_price_id;
      if (priceId === process.env.STRIPE_PRICE_ID_VIP) {
        currentTier = 'vip';
      } else if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
        currentTier = 'pro';
      } else if (priceId === process.env.STRIPE_PRICE_ID_BASIC) {
        currentTier = 'basic';
      }
    }

    return NextResponse.json({
      subscriptions,
      currentTier,
    });
  } catch (error) {
    console.error('[Subscriptions API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscriptions
 * Create a new subscription (initiates Stripe checkout)
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { tierId } = body as { tierId: SubscriptionTier };

    // Validate tier
    if (!tierId || !SUBSCRIPTION_TIERS[tierId]) {
      return NextResponse.json(
        { error: 'แพ็คเกจไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const priceId = getTierPriceId(tierId);
    if (!priceId) {
      return NextResponse.json(
        { error: 'แพ็คเกจนี้ยังไม่พร้อมจำหน่าย' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email!,
      user.user_metadata?.name
    );

    // Check for existing active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        user_id: user.id,
        status: { in: ['active', 'trialing', 'past_due'] },
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'คุณมีแพ็คเกจที่ใช้งานอยู่แล้ว กรุณาไปที่หน้าจัดการสมาชิกเพื่อเปลี่ยนแปลง' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session for subscription
    const stripe = await getStripe();
    
    // Get the origin from request headers
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          userId: user.id,
          tierId,
        },
      },
      metadata: {
        userId: user.id,
        tierId,
      },
    });

    console.log('[Subscriptions API] Checkout session created:', {
      sessionId: session.id,
      url: session.url,
    });

    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error('[Subscriptions API] POST error:', error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('[Subscriptions API] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5),
      });
    }
    
    const stripeError = handleStripeError(error);
    
    // Return more informative error in development
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      { 
        error: stripeError.messageTh,
        ...(isDev && { debug: error instanceof Error ? error.message : String(error) }),
      },
      { status: 500 }
    );
  }
}
