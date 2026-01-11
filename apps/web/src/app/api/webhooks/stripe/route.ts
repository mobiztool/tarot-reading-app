/**
 * Stripe Webhook Handler
 * Receives and processes events from Stripe
 * 
 * Endpoint: POST /api/webhooks/stripe
 */
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { config } from '@/lib/config';
import { prisma } from '@/lib/prisma';
import * as Sentry from '@sentry/nextjs';

// Lazy import stripe to prevent build-time API key requirement
const getStripe = async () => {
  const { stripe } = await import('@/lib/stripe/server');
  return stripe;
};

/**
 * Webhook handler - must be POST
 */
export async function POST(req: Request): Promise<Response> {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('[Stripe Webhook] Missing signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = await getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      config.stripeWebhookSecret
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe Webhook] Signature verification failed:', errorMessage);
    Sentry.captureException(err, {
      tags: { service: 'stripe-webhook', error: 'signature_verification' },
    });
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Log event for debugging
  console.log(`[Stripe Webhook] Received event: ${event.type}`, {
    eventId: event.id,
    livemode: event.livemode,
  });

  try {
    // Handle different event types
    switch (event.type) {
      // Customer events
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer);
        break;

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;

      case 'customer.deleted':
        // customer.deleted event returns the deleted customer object
        await handleCustomerDeleted(event.data.object as unknown as { id: string; deleted: true });
        break;

      // Payment Intent events
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

      // Subscription events
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      // Invoice events
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      // Checkout Session events
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[Stripe Webhook] Error handling ${event.type}:`, error);
    Sentry.captureException(error, {
      tags: { service: 'stripe-webhook', eventType: event.type },
      extra: { eventId: event.id },
    });
    
    // Return 200 to prevent Stripe from retrying
    // Errors are logged and can be handled later
    return NextResponse.json({ received: true, error: 'Handler error logged' });
  }
}

// ============================================================================
// Customer Handlers
// ============================================================================

async function handleCustomerCreated(customer: Stripe.Customer): Promise<void> {
  console.log('[Stripe Webhook] Customer created:', customer.id);
  
  // Customer might be created via webhook before our API call updates the user
  // Check if we need to link this customer to an existing user
  const userId = customer.metadata?.userId;
  
  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    }).catch((err) => {
      // User might not exist yet, that's okay
      console.log('[Stripe Webhook] Could not link customer to user:', err);
    });
  }
}

async function handleCustomerUpdated(customer: Stripe.Customer): Promise<void> {
  console.log('[Stripe Webhook] Customer updated:', customer.id);
  
  // Could sync customer info back to our database if needed
  // For now, we log the event
}

async function handleCustomerDeleted(customer: { id: string; deleted: true }): Promise<void> {
  console.log('[Stripe Webhook] Customer deleted:', customer.id);
  
  // Clear stripe customer ID from user
  await prisma.user.updateMany({
    where: { stripeCustomerId: customer.id },
    data: { stripeCustomerId: null },
  });
}

// ============================================================================
// Payment Intent Handlers
// ============================================================================

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log('[Stripe Webhook] Payment succeeded:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    customer: paymentIntent.customer,
  });
  
  // TODO: Implement payment success logic
  // - Update subscription status
  // - Send confirmation email
  // - Grant access to premium features
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.error('[Stripe Webhook] Payment failed:', {
    id: paymentIntent.id,
    lastError: paymentIntent.last_payment_error?.message,
    customer: paymentIntent.customer,
  });
  
  // TODO: Implement payment failure logic
  // - Notify user of failed payment
  // - Update subscription status
}

// ============================================================================
// Subscription Handlers (Story 6.2)
// ============================================================================

// Helper to safely extract subscription period dates
// Stripe SDK v20+ may have different property access patterns
function getSubscriptionPeriod(subscription: Stripe.Subscription): {
  periodStart: Date;
  periodEnd: Date;
  canceledAt: Date | null;
  endedAt: Date | null;
  cancelAt: Date | null;
} {
  // Access as any to handle different Stripe API versions
  const sub = subscription as unknown as Record<string, unknown>;
  
  const periodStart = sub.current_period_start as number;
  const periodEnd = sub.current_period_end as number;
  const canceledAt = sub.canceled_at as number | null;
  const endedAt = sub.ended_at as number | null;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  return {
    periodStart: new Date(periodStart * 1000),
    periodEnd: new Date(periodEnd * 1000),
    canceledAt: canceledAt ? new Date(canceledAt * 1000) : null,
    endedAt: endedAt ? new Date(endedAt * 1000) : null,
    // If cancel_at_period_end is true, set cancel_at to period end
    cancelAt: cancelAtPeriodEnd ? new Date(periodEnd * 1000) : null,
  };
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  console.log('[Stripe Webhook] Subscription created:', {
    id: subscription.id,
    status: subscription.status,
    customer: subscription.customer,
  });

  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('[Stripe Webhook] No userId in subscription metadata');
    return;
  }

  const period = getSubscriptionPeriod(subscription);

  // Create subscription record in database
  // Note: tier is derived from stripe_price_id, not stored separately
  await prisma.subscription.upsert({
    where: { stripe_subscription_id: subscription.id },
    update: {
      status: subscription.status as 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid' | 'paused',
      stripe_price_id: subscription.items.data[0]?.price.id || '',
      current_period_start: period.periodStart,
      current_period_end: period.periodEnd,
      cancel_at: period.cancelAt,
      canceled_at: period.canceledAt,
      ended_at: period.endedAt,
    },
    create: {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      stripe_price_id: subscription.items.data[0]?.price.id || '',
      status: subscription.status as 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid' | 'paused',
      current_period_start: period.periodStart,
      current_period_end: period.periodEnd,
      cancel_at: period.cancelAt,
      canceled_at: period.canceledAt,
      ended_at: period.endedAt,
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  console.log('[Stripe Webhook] Subscription updated:', {
    id: subscription.id,
    status: subscription.status,
    customer: subscription.customer,
  });

  // Update subscription record in database
  const existingSub = await prisma.subscription.findUnique({
    where: { stripe_subscription_id: subscription.id },
  });

  if (!existingSub) {
    console.log('[Stripe Webhook] Subscription not found in database, skipping');
    return;
  }

  const period = getSubscriptionPeriod(subscription);
  const newPriceId = subscription.items.data[0]?.price.id || '';
  const oldPriceId = existingSub.stripe_price_id;

  // Track tier change (upgrade/downgrade)
  if (oldPriceId && newPriceId && oldPriceId !== newPriceId) {
    const tierOrder: Record<string, number> = {};
    const basicPriceId = process.env.STRIPE_PRICE_ID_BASIC || '';
    const proPriceId = process.env.STRIPE_PRICE_ID_PRO || '';
    const vipPriceId = process.env.STRIPE_PRICE_ID_VIP || '';
    
    tierOrder[basicPriceId] = 1;
    tierOrder[proPriceId] = 2;
    tierOrder[vipPriceId] = 3;

    const oldTierLevel = tierOrder[oldPriceId] || 0;
    const newTierLevel = tierOrder[newPriceId] || 0;
    const changeType = newTierLevel > oldTierLevel ? 'upgrade' : 'downgrade';

    console.log('[Analytics] subscription_tier_changed:', {
      userId: existingSub.user_id,
      oldPriceId,
      newPriceId,
      changeType,
    });

    // Track in analytics events table
    await prisma.analyticsEvent.create({
      data: {
        event_type: 'spread_page_view', // Using existing enum, should add subscription events
        user_id: existingSub.user_id,
        metadata: {
          eventName: 'subscription_tier_changed',
          oldPriceId,
          newPriceId,
          changeType,
        },
      },
    }).catch(err => {
      console.error('[Analytics] Failed to track tier change:', err);
    });
  }

  // Track trial conversion (trialing -> active)
  if (existingSub.status === 'trialing' && subscription.status === 'active') {
    console.log('[Analytics] trial_converted:', {
      userId: existingSub.user_id,
      subscriptionId: existingSub.id,
    });

    await prisma.analyticsEvent.create({
      data: {
        event_type: 'spread_page_view',
        user_id: existingSub.user_id,
        metadata: {
          eventName: 'trial_converted',
          subscriptionId: existingSub.id,
          tier: newPriceId,
        },
      },
    }).catch(err => console.error('[Analytics] Failed to track trial_converted:', err));
  }

  await prisma.subscription.update({
    where: { stripe_subscription_id: subscription.id },
    data: {
      status: subscription.status as 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid' | 'paused',
      stripe_price_id: newPriceId,
      current_period_start: period.periodStart,
      current_period_end: period.periodEnd,
      cancel_at: period.cancelAt,
      canceled_at: period.canceledAt,
      ended_at: period.endedAt,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  console.log('[Stripe Webhook] Subscription deleted:', {
    id: subscription.id,
    customer: subscription.customer,
  });

  const existingSub = await prisma.subscription.findUnique({
    where: { stripe_subscription_id: subscription.id },
  });

  if (!existingSub) {
    return;
  }

  // Check if this was a trial cancellation
  const wasTrial = existingSub.status === 'trialing';
  const daysUsed = Math.floor(
    (new Date().getTime() - existingSub.created_at.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Track analytics
  if (wasTrial) {
    console.log('[Analytics] trial_canceled:', {
      userId: existingSub.user_id,
      subscriptionId: existingSub.id,
      daysUsed,
    });

    await prisma.analyticsEvent.create({
      data: {
        event_type: 'spread_page_view',
        user_id: existingSub.user_id,
        metadata: {
          eventName: 'trial_canceled',
          subscriptionId: existingSub.id,
          daysUsed,
          cancellationReason: existingSub.cancellation_reason,
        },
      },
    }).catch(err => console.error('[Analytics] Failed to track trial_canceled:', err));
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { stripe_subscription_id: subscription.id },
    data: {
      status: 'canceled',
      ended_at: new Date(),
    },
  });
}

// ============================================================================
// Invoice Handlers
// ============================================================================

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  console.log('[Stripe Webhook] Invoice paid:', {
    id: invoice.id,
    amountPaid: invoice.amount_paid,
    customer: invoice.customer,
    subscriptionId: invoice.parent?.subscription_details?.subscription ?? null,
  });
  
  try {
    // Find user by Stripe customer ID
    const customerId = typeof invoice.customer === 'string' 
      ? invoice.customer 
      : invoice.customer?.id;
    
    if (!customerId) {
      console.error('[Stripe Webhook] No customer ID in invoice');
      return;
    }
    
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    
    if (!user) {
      console.error('[Stripe Webhook] User not found for customer:', customerId);
      return;
    }
    
    // Get subscription ID from invoice (handle API version differences)
    const stripeSubscriptionId = invoice.parent?.subscription_details?.subscription 
      ?? (invoice as unknown as { subscription?: string | Stripe.Subscription }).subscription;
    
    // Find subscription in our database
    let subscription = null;
    if (stripeSubscriptionId) {
      subscription = await prisma.subscription.findFirst({
        where: { 
          stripe_subscription_id: typeof stripeSubscriptionId === 'string' 
            ? stripeSubscriptionId 
            : stripeSubscriptionId.id 
        },
      });
    }
    
    // Get period dates
    const periodStart = invoice.lines?.data?.[0]?.period?.start;
    const periodEnd = invoice.lines?.data?.[0]?.period?.end;
    
    // Save invoice to database (upsert to handle duplicates)
    await prisma.invoice.upsert({
      where: { stripe_invoice_id: invoice.id },
      update: {
        status: 'paid',
        paid_at: invoice.status_transitions?.paid_at 
          ? new Date(invoice.status_transitions.paid_at * 1000)
          : new Date(),
        invoice_pdf_url: invoice.invoice_pdf ?? null,
        hosted_invoice_url: invoice.hosted_invoice_url ?? null,
        updated_at: new Date(),
      },
      create: {
        user_id: user.id,
        subscription_id: subscription?.id ?? null,
        stripe_invoice_id: invoice.id,
        stripe_invoice_number: invoice.number ?? null,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'paid',
        description: invoice.description ?? null,
        paid_at: invoice.status_transitions?.paid_at 
          ? new Date(invoice.status_transitions.paid_at * 1000)
          : new Date(),
        period_start: periodStart ? new Date(periodStart * 1000) : null,
        period_end: periodEnd ? new Date(periodEnd * 1000) : null,
        invoice_pdf_url: invoice.invoice_pdf ?? null,
        hosted_invoice_url: invoice.hosted_invoice_url ?? null,
      },
    });
    
    console.log('[Stripe Webhook] Invoice saved:', invoice.id);
    
    // TODO: Send email receipt (requires email service like Resend)
    // await sendInvoiceEmail(user.email, invoice);
    
  } catch (error) {
    console.error('[Stripe Webhook] Error saving invoice:', error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  console.error('[Stripe Webhook] Invoice payment failed:', {
    id: invoice.id,
    amountDue: invoice.amount_due,
    customer: invoice.customer,
    subscriptionId: invoice.parent?.subscription_details?.subscription ?? null,
  });
  
  try {
    // Find user by Stripe customer ID
    const customerId = typeof invoice.customer === 'string' 
      ? invoice.customer 
      : invoice.customer?.id;
    
    if (!customerId) {
      console.error('[Stripe Webhook] No customer ID in invoice');
      return;
    }
    
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    
    if (!user) {
      console.error('[Stripe Webhook] User not found for customer:', customerId);
      return;
    }
    
    // Get subscription ID from invoice (handle API version differences for failed invoice)
    const stripeSubscriptionIdFailed = invoice.parent?.subscription_details?.subscription 
      ?? (invoice as unknown as { subscription?: string | Stripe.Subscription }).subscription;
    
    // Find subscription in our database
    let subscription = null;
    if (stripeSubscriptionIdFailed) {
      subscription = await prisma.subscription.findFirst({
        where: { 
          stripe_subscription_id: typeof stripeSubscriptionIdFailed === 'string' 
            ? stripeSubscriptionIdFailed 
            : stripeSubscriptionIdFailed.id 
        },
      });
    }
    
    // Get period dates for failed invoice
    const periodStart = invoice.lines?.data?.[0]?.period?.start;
    const periodEnd = invoice.lines?.data?.[0]?.period?.end;
    
    // Save failed invoice to database
    await prisma.invoice.upsert({
      where: { stripe_invoice_id: invoice.id },
      update: {
        status: 'open', // Payment failed, invoice still open
        updated_at: new Date(),
      },
      create: {
        user_id: user.id,
        subscription_id: subscription?.id ?? null,
        stripe_invoice_id: invoice.id,
        stripe_invoice_number: invoice.number ?? null,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: 'open',
        description: invoice.description ?? null,
        period_start: periodStart ? new Date(periodStart * 1000) : null,
        period_end: periodEnd ? new Date(periodEnd * 1000) : null,
        invoice_pdf_url: invoice.invoice_pdf ?? null,
        hosted_invoice_url: invoice.hosted_invoice_url ?? null,
      },
    });
    
    console.log('[Stripe Webhook] Failed invoice saved:', invoice.id);
    
    // TODO: Send payment failure notification email
    // await sendPaymentFailedEmail(user.email, invoice);
    
  } catch (error) {
    console.error('[Stripe Webhook] Error saving failed invoice:', error);
    throw error;
  }
}

// ============================================================================
// Checkout Session Handlers
// ============================================================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  console.log('[Stripe Webhook] Checkout completed:', {
    id: session.id,
    customerId: session.customer,
    subscriptionId: session.subscription,
    mode: session.mode,
  });

  // Only handle subscription mode
  if (session.mode !== 'subscription') {
    return;
  }

  const userId = session.metadata?.userId;
  const tierId = session.metadata?.tierId;
  const subscriptionId = session.subscription as string;

  if (!userId || !subscriptionId) {
    console.error('[Stripe Webhook] Missing userId or subscriptionId in checkout session');
    return;
  }

  // Check if this is a trial subscription
  const stripe = await getStripe();
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  const isTrial = stripeSubscription.status === 'trialing';

  // Track analytics - trial or direct payment
  if (isTrial) {
    console.log('[Analytics] trial_started:', {
      userId,
      tier: tierId,
      subscriptionId,
      trialEnd: stripeSubscription.trial_end,
    });

    // Track in database
    await prisma.analyticsEvent.create({
      data: {
        event_type: 'spread_page_view', // Using existing enum
        user_id: userId,
        metadata: {
          eventName: 'trial_started',
          tier: tierId,
          subscriptionId,
          trialEnd: stripeSubscription.trial_end,
        },
      },
    }).catch(err => console.error('[Analytics] Failed to track trial_started:', err));
  } else {
    console.log('[Analytics] payment_completed:', {
      userId,
      tier: tierId,
      subscriptionId,
      amountTotal: session.amount_total,
    });
  }

  // Send subscription confirmation email
  // TODO: Integrate with email service (e.g., Resend, SendGrid)
  await sendSubscriptionConfirmationEmail(userId, tierId || 'unknown');
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session): Promise<void> {
  console.log('[Stripe Webhook] Checkout session expired:', {
    id: session.id,
    userId: session.metadata?.userId,
    tier: session.metadata?.tierId,
  });

  // Track analytics
  console.log('[Analytics] checkout_session_expired:', {
    userId: session.metadata?.userId,
    tier: session.metadata?.tierId,
  });
}

/**
 * Send subscription confirmation email
 * TODO: Replace with actual email service integration
 */
async function sendSubscriptionConfirmationEmail(userId: string, tierId: string): Promise<void> {
  try {
    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user?.email) {
      console.warn('[Email] No email found for user:', userId);
      return;
    }

    // TODO: Send actual email via email service
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'ไพ่ยิปซีออนไลน์ <noreply@tarot.app>',
    //   to: user.email,
    //   subject: '🎉 ยินดีต้อนรับสู่แพ็คเกจ Premium!',
    //   template: 'subscription-welcome',
    //   data: { name: user.name, tier: tierId },
    // });

    console.log('[Email] Subscription confirmation would be sent to:', {
      email: user.email,
      name: user.name,
      tier: tierId,
    });
  } catch (error) {
    console.error('[Email] Failed to send subscription confirmation:', error);
    Sentry.captureException(error, {
      tags: { service: 'email', action: 'subscription_confirmation' },
      extra: { userId, tierId },
    });
  }
}

// ============================================================================
// Config
// ============================================================================

/**
 * Disable body parsing - we need raw body for signature verification
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
