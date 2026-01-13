/**
 * Analytics Metrics API Route (Story 5.7)
 * 
 * GET /api/analytics/metrics - Get spread metrics (admin only)
 * Uses Supabase client directly for database queries
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// =============================================================================
// TYPES
// =============================================================================

interface SpreadMetrics {
  spreadType: string;
  totalReadings: number;
  uniqueUsers: number;
  completionRate: number;
  avgDurationMs: number;
  repeatRate: number;
}

interface ConversionFunnel {
  spreadType: string;
  gateShown: number;
  loginClicked: number;
  signupCompleted: number;
  spreadCompleted: number;
  gateToLoginRate: number;
  loginToSignupRate: number;
  signupToCompletionRate: number;
  overallConversionRate: number;
}

interface RetentionData {
  spreadType: string;
  d1Retention: number;
  d7Retention: number;
  d30Retention: number;
  cohortSize: number;
}

// =============================================================================
// HELPERS
// =============================================================================

// Admin email whitelist - add your email here to access analytics dashboard
const ADMIN_EMAILS = [
  'test@admin.tarotapp.com',
  'sutthikit@hotmail.com',
  'sutt@hotmail.com',
  'nattsctu@gmail.com',
];

async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const isAdminRole = user.user_metadata?.role === 'admin';
    const isAdminEmail = user.email?.endsWith('@admin.tarotapp.com') ?? false;
    const isWhitelistedEmail = ADMIN_EMAILS.includes(user.email || '');
    return isAdminRole || isAdminEmail || isWhitelistedEmail;
  } catch {
    return false;
  }
}

// =============================================================================
// GET - Get Metrics
// =============================================================================

const QuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  metricType: z.enum(['overview', 'spreads', 'funnel', 'retention', 'all']).default('all'),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Auth check
    if (!await isAdmin(supabase)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse query
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const queryResult = QuerySchema.safeParse(searchParams);
    
    if (!queryResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query params' },
        { status: 400 }
      );
    }

    const { startDate, metricType } = queryResult.data;

    const response: Record<string, unknown> = { success: true };

    // Overview metrics
    if (metricType === 'overview' || metricType === 'all') {
      // Total completed readings
      const { count: totalReadings } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'spread_completed')
        .gte('created_at', startDate || '1970-01-01');

      // Total started readings
      const { count: startedCount } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'spread_started')
        .gte('created_at', startDate || '1970-01-01');

      // Unique users (approximate)
      const { data: uniqueUsersData } = await supabase
        .from('analytics_events')
        .select('user_id')
        .not('user_id', 'is', null)
        .gte('created_at', startDate || '1970-01-01');
      
      const uniqueUsers = new Set(uniqueUsersData?.map(d => d.user_id)).size;

      // Average duration
      const { data: durationData } = await supabase
        .from('analytics_events')
        .select('duration_ms')
        .eq('event_type', 'spread_completed')
        .not('duration_ms', 'is', null)
        .gte('created_at', startDate || '1970-01-01');
      
      const avgDurationMs = durationData && durationData.length > 0
        ? Math.round(durationData.reduce((sum, d) => sum + (d.duration_ms || 0), 0) / durationData.length)
        : 0;

      response.overview = {
        totalReadings: totalReadings || 0,
        totalUsers: uniqueUsers,
        avgCompletionRate: startedCount && startedCount > 0 
          ? Math.round(((totalReadings || 0) / startedCount) * 100) 
          : 0,
        avgDurationMs,
      };
    }

    // Spread metrics
    if (metricType === 'spreads' || metricType === 'all') {
      const spreadTypes = ['daily', 'three_card', 'love_relationships', 'career_money', 'yes_no'];
      const spreadMetrics: SpreadMetrics[] = [];

      for (const spreadType of spreadTypes) {
        // Total completed readings for this spread
        const { count: totalReadings } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'spread_completed')
          .eq('spread_type', spreadType)
          .gte('created_at', startDate || '1970-01-01');

        // Started count for this spread
        const { count: startedCount } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'spread_started')
          .eq('spread_type', spreadType)
          .gte('created_at', startDate || '1970-01-01');

        // Unique users for this spread
        const { data: usersData } = await supabase
          .from('analytics_events')
          .select('user_id')
          .eq('spread_type', spreadType)
          .not('user_id', 'is', null)
          .gte('created_at', startDate || '1970-01-01');
        
        const uniqueUsers = new Set(usersData?.map(d => d.user_id)).size;

        // Average duration for this spread
        const { data: durationData } = await supabase
          .from('analytics_events')
          .select('duration_ms')
          .eq('event_type', 'spread_completed')
          .eq('spread_type', spreadType)
          .not('duration_ms', 'is', null)
          .gte('created_at', startDate || '1970-01-01');
        
        const avgDurationMs = durationData && durationData.length > 0
          ? Math.round(durationData.reduce((sum, d) => sum + (d.duration_ms || 0), 0) / durationData.length)
          : 0;

        // Calculate repeat rate: users who completed more than once
        const { data: repeatData } = await supabase
          .from('analytics_events')
          .select('user_id')
          .eq('event_type', 'spread_completed')
          .eq('spread_type', spreadType)
          .not('user_id', 'is', null)
          .gte('created_at', startDate || '1970-01-01');
        
        let repeatRate = 0;
        if (repeatData && repeatData.length > 0) {
          const userCounts = new Map<string, number>();
          repeatData.forEach(d => {
            if (d.user_id) {
              userCounts.set(d.user_id, (userCounts.get(d.user_id) || 0) + 1);
            }
          });
          const totalUsersWithReadings = userCounts.size;
          const repeatUsers = Array.from(userCounts.values()).filter(count => count > 1).length;
          repeatRate = totalUsersWithReadings > 0 
            ? Math.round((repeatUsers / totalUsersWithReadings) * 100) 
            : 0;
        }

        spreadMetrics.push({
          spreadType,
          totalReadings: totalReadings || 0,
          uniqueUsers,
          completionRate: startedCount && startedCount > 0 
            ? Math.round(((totalReadings || 0) / startedCount) * 100) 
            : 0,
          avgDurationMs,
          repeatRate,
        });
      }

      // Sort by total readings
      spreadMetrics.sort((a, b) => b.totalReadings - a.totalReadings);
      response.spreadMetrics = spreadMetrics;
      
      if (spreadMetrics.length > 0) {
        response.topSpread = spreadMetrics[0].spreadType;
      }
    }

    // Conversion funnel
    if (metricType === 'funnel' || metricType === 'all') {
      const loginRequiredSpreads = ['love_relationships', 'career_money', 'yes_no'];
      const funnels: ConversionFunnel[] = [];

      for (const spreadType of loginRequiredSpreads) {
        const { count: gateShown } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'spread_gate_shown')
          .eq('spread_type', spreadType)
          .gte('created_at', startDate || '1970-01-01');

        const { count: loginClicked } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'login_prompt_clicked')
          .eq('spread_type', spreadType)
          .gte('created_at', startDate || '1970-01-01');

        const { count: signupCompleted } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'signup_completed')
          .eq('spread_type', spreadType)
          .gte('created_at', startDate || '1970-01-01');

        const { count: spreadCompleted } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'spread_completed')
          .eq('spread_type', spreadType)
          .gte('created_at', startDate || '1970-01-01');

        funnels.push({
          spreadType,
          gateShown: gateShown || 0,
          loginClicked: loginClicked || 0,
          signupCompleted: signupCompleted || 0,
          spreadCompleted: spreadCompleted || 0,
          gateToLoginRate: gateShown && gateShown > 0 
            ? Math.round(((loginClicked || 0) / gateShown) * 100) 
            : 0,
          loginToSignupRate: loginClicked && loginClicked > 0 
            ? Math.round(((signupCompleted || 0) / loginClicked) * 100) 
            : 0,
          signupToCompletionRate: signupCompleted && signupCompleted > 0 
            ? Math.round(((spreadCompleted || 0) / signupCompleted) * 100) 
            : 0,
          overallConversionRate: gateShown && gateShown > 0 
            ? Math.round(((spreadCompleted || 0) / gateShown) * 100) 
            : 0,
        });
      }

      response.conversionFunnels = funnels;
    }

    // Retention metrics - calculated from actual user return data
    if (metricType === 'retention' || metricType === 'all') {
      const spreadTypes = ['daily', 'three_card', 'love_relationships', 'career_money', 'yes_no'];
      const retentionData: RetentionData[] = [];

      for (const spreadType of spreadTypes) {
        // Get all completed events with user_id and timestamp
        const { data: eventsData } = await supabase
          .from('analytics_events')
          .select('user_id, created_at')
          .eq('event_type', 'spread_completed')
          .eq('spread_type', spreadType)
          .not('user_id', 'is', null)
          .gte('created_at', startDate || '1970-01-01')
          .order('created_at', { ascending: true });
        
        if (!eventsData || eventsData.length === 0) {
          retentionData.push({
            spreadType,
            d1Retention: 0,
            d7Retention: 0,
            d30Retention: 0,
            cohortSize: 0,
          });
          continue;
        }

        // Group events by user and find first activity date
        const userFirstActivity = new Map<string, Date>();
        const userAllActivities = new Map<string, Date[]>();
        
        eventsData.forEach(event => {
          if (event.user_id) {
            const eventDate = new Date(event.created_at);
            
            if (!userFirstActivity.has(event.user_id)) {
              userFirstActivity.set(event.user_id, eventDate);
            }
            
            if (!userAllActivities.has(event.user_id)) {
              userAllActivities.set(event.user_id, []);
            }
            userAllActivities.get(event.user_id)!.push(eventDate);
          }
        });

        const cohortSize = userFirstActivity.size;
        
        // Calculate retention: users who returned after D1, D7, D30
        let d1Returned = 0;
        let d7Returned = 0;
        let d30Returned = 0;

        userFirstActivity.forEach((firstDate, userId) => {
          const activities = userAllActivities.get(userId) || [];
          const d1Threshold = new Date(firstDate.getTime() + 1 * 24 * 60 * 60 * 1000);
          const d7Threshold = new Date(firstDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          const d30Threshold = new Date(firstDate.getTime() + 30 * 24 * 60 * 60 * 1000);

          // Check if user returned after each threshold
          const returnedAfterD1 = activities.some(date => date >= d1Threshold);
          const returnedAfterD7 = activities.some(date => date >= d7Threshold);
          const returnedAfterD30 = activities.some(date => date >= d30Threshold);

          if (returnedAfterD1) d1Returned++;
          if (returnedAfterD7) d7Returned++;
          if (returnedAfterD30) d30Returned++;
        });

        retentionData.push({
          spreadType,
          d1Retention: cohortSize > 0 ? Math.round((d1Returned / cohortSize) * 100) : 0,
          d7Retention: cohortSize > 0 ? Math.round((d7Returned / cohortSize) * 100) : 0,
          d30Retention: cohortSize > 0 ? Math.round((d30Returned / cohortSize) * 100) : 0,
          cohortSize,
        });
      }

      response.retentionMetrics = retentionData;
    }

    response.dateRange = {
      start: startDate || 'all time',
      end: 'now',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analytics metrics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
