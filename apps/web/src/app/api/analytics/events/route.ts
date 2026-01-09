/**
 * Analytics Events API Route (Story 5.7)
 * 
 * POST /api/analytics/events - Log analytics event
 * GET /api/analytics/events - Query events (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// =============================================================================
// SCHEMAS
// =============================================================================

const EventSchema = z.object({
  eventType: z.enum([
    'spread_page_view',
    'spread_started',
    'spread_completed',
    'spread_abandoned',
    'spread_gate_shown',
    'login_prompt_clicked',
    'signup_completed',
    'question_submitted',
    'card_drawn',
    'result_viewed',
    'result_shared',
    'user_returned',
    'spread_repeated',
  ]),
  spreadType: z.enum([
    'daily',
    'three_card',
    'love_relationships',
    'career_money',
    'yes_no',
  ]).optional(),
  userId: z.string().uuid().optional(),
  readingId: z.string().uuid().optional(),
  deviceType: z.enum(['mobile', 'tablet', 'desktop']).optional(),
  sessionId: z.string().optional(),
  durationMs: z.number().int().positive().optional(),
  step: z.string().max(50).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// =============================================================================
// POST - Log Analytics Event
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validationResult = EventSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid event data', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const event = validationResult.data;

    // Get user from session if not provided
    let userId = event.userId;
    if (!userId) {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      } catch {
        // Ignore auth errors - guest events are allowed
      }
    }

    // Use Supabase to insert analytics event
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: event.eventType,
        spread_type: event.spreadType,
        user_id: userId,
        reading_id: event.readingId,
        device_type: event.deviceType,
        session_id: event.sessionId,
        duration_ms: event.durationMs,
        step: event.step,
        metadata: event.metadata,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Analytics event logging error:', error);
      // Don't fail the request - analytics are non-critical
      return NextResponse.json({
        success: false,
        error: 'Failed to log event',
      });
    }

    return NextResponse.json({
      success: true,
      eventId: data?.id,
    });
  } catch (error) {
    console.error('Analytics event logging error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log event' },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Query Events (Admin Only)
// =============================================================================

const QuerySchema = z.object({
  eventType: z.string().optional(),
  spreadType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(1000).default(100),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    // Auth check - require admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin role (simple check - in production, use proper RBAC)
    const isAdminRole = user.user_metadata?.role === 'admin';
    const isAdminEmail = user.email?.endsWith('@admin.tarotapp.com') ?? false;
    const isAdmin = isAdminRole || isAdminEmail;

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse query params
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const queryResult = QuerySchema.safeParse(searchParams);
    
    if (!queryResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query params', details: queryResult.error.flatten() },
        { status: 400 }
      );
    }

    const query = queryResult.data;

    // Build query
    let dbQuery = supabase
      .from('analytics_events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(query.offset, query.offset + query.limit - 1);

    if (query.eventType) {
      dbQuery = dbQuery.eq('event_type', query.eventType);
    }
    if (query.spreadType) {
      dbQuery = dbQuery.eq('spread_type', query.spreadType);
    }
    if (query.startDate) {
      dbQuery = dbQuery.gte('created_at', query.startDate);
    }
    if (query.endDate) {
      dbQuery = dbQuery.lte('created_at', query.endDate);
    }

    const { data: events, count, error } = await dbQuery;

    if (error) {
      console.error('Analytics query error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to query events' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        total: count || 0,
        limit: query.limit,
        offset: query.offset,
        hasMore: query.offset + events.length < (count || 0),
      },
    });
  } catch (error) {
    console.error('Analytics query error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to query events' },
      { status: 500 }
    );
  }
}
