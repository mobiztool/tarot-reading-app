/**
 * Access Check API Route
 * Check if user can access a specific spread type
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canAccessSpread, SpreadType, AccessCheckResult } from '@/lib/access-control/spreads';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spreadType = searchParams.get('spread') as SpreadType | null;

    if (!spreadType) {
      return NextResponse.json(
        { error: 'Missing spread parameter' },
        { status: 400 }
      );
    }

    // Get current user from Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check access
    const result: AccessCheckResult = await canAccessSpread(user?.id || null, spreadType);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Access check error:', error);
    return NextResponse.json(
      { 
        allowed: false, 
        currentTier: 'free' as const,
        reason: 'Error checking access' 
      },
      { status: 500 }
    );
  }
}
