/**
 * Trial Reminder Cron Job
 * Sends reminder emails to users whose trial is ending in 2 days
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/trial-reminders",
 *     "schedule": "0 9 * * *"  // Daily at 9 AM
 *   }]
 * }
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTierFromPriceId, getTierNameTh, SUBSCRIPTION_TIERS } from '@/lib/subscription';

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max

export async function GET(req: Request): Promise<Response> {
  // Verify authorization
  const authHeader = req.headers.get('authorization');
  
  // In production, verify the cron secret
  if (process.env.NODE_ENV === 'production' && CRON_SECRET) {
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    // Find trials ending in 2 days
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0);

    const endOfDay = new Date(twoDaysFromNow);
    endOfDay.setHours(23, 59, 59, 999);

    const expiringTrials = await prisma.subscription.findMany({
      where: {
        status: 'trialing',
        current_period_end: {
          gte: twoDaysFromNow,
          lte: endOfDay,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    console.log(`[Cron] Found ${expiringTrials.length} trials ending in 2 days`);

    const results = [];

    for (const subscription of expiringTrials) {
      if (!subscription.user.email) continue;

      const tier = getTierFromPriceId(subscription.stripe_price_id);
      const tierName = getTierNameTh(tier);
      const price = SUBSCRIPTION_TIERS[tier].price;

      // Track analytics event
      await prisma.analyticsEvent.create({
        data: {
          event_type: 'spread_page_view',
          user_id: subscription.user.id,
          metadata: {
            eventName: 'trial_reminder_sent',
            tier,
            daysLeft: 2,
            subscriptionId: subscription.id,
          },
        },
      }).catch(err => console.error('[Cron] Failed to track event:', err));

      // Send email (placeholder - integrate with email service)
      console.log('[Cron] Would send trial ending email:', {
        to: subscription.user.email,
        name: subscription.user.name,
        tier: tierName,
        price,
        trialEndDate: subscription.current_period_end,
      });

      // TODO: Integrate with email service (Resend, SendGrid, etc.)
      // await sendTrialEndingEmail({
      //   to: subscription.user.email,
      //   userName: subscription.user.name || 'คุณ',
      //   tierName,
      //   price,
      //   trialEndDate: subscription.current_period_end,
      // });

      results.push({
        userId: subscription.user.id,
        email: subscription.user.email,
        tier,
        trialEndDate: subscription.current_period_end,
        status: 'reminder_queued',
      });
    }

    return NextResponse.json({
      success: true,
      processedCount: results.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Trial reminders error:', error);
    return NextResponse.json(
      { error: 'Failed to process trial reminders' },
      { status: 500 }
    );
  }
}
