/**
 * Dashboard Stats API
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * GET /api/dashboard/stats - Get dashboard statistics for Pro/VIP users
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserTier } from '@/lib/access-control';
import { getDashboardData, type TimeRange } from '@/lib/dashboard';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/dashboard/stats
 * Returns dashboard statistics for Pro/VIP users
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Tier check - Pro/VIP only
    const tier = await getUserTier(user.id);
    const isPro = tier === 'pro' || tier === 'vip';
    const isVip = tier === 'vip';

    if (!isPro) {
      return NextResponse.json(
        { error: 'Premium feature - Pro or VIP subscription required' },
        { status: 403 }
      );
    }

    // Get time range from query params
    const searchParams = req.nextUrl.searchParams;
    const timeRange = (searchParams.get('timeRange') || '30d') as TimeRange;

    // Validate time range
    const validTimeRanges: TimeRange[] = ['7d', '30d', '90d', 'all'];
    if (!validTimeRanges.includes(timeRange)) {
      return NextResponse.json(
        { error: 'Invalid time range. Use: 7d, 30d, 90d, or all' },
        { status: 400 }
      );
    }

    // Fetch dashboard data
    const dashboardData = await getDashboardData(user.id, timeRange, isVip);

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('[Dashboard API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
