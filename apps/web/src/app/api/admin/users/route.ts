/**
 * Admin Users API Route
 * 
 * GET /api/admin/users - Get list of all users (admin only)
 * Uses Supabase service role to access auth.users
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

// =============================================================================
// HELPERS
// =============================================================================

async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const isAdminRole = user.user_metadata?.role === 'admin';
    const isAdminEmail = user.email?.endsWith('@admin.tarotapp.com') ?? false;
    return isAdminRole || isAdminEmail;
  } catch {
    return false;
  }
}

// Create service role client for admin operations
function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// =============================================================================
// GET - Get All Users
// =============================================================================

export async function GET() {
  try {
    // Auth check
    if (!await isAdmin()) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Try to fetch from auth.users using service role
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (serviceRoleKey) {
      // Use service role to get users from auth.users
      const serviceClient = createServiceClient();
      
      const { data: { users: authUsers }, error } = await serviceClient.auth.admin.listUsers();
      
      if (error) {
        console.error('Error fetching auth users:', error);
        // Fall through to public.users fallback
      } else {
        // Transform data
        const users = authUsers?.map(user => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          email_confirmed_at: user.email_confirmed_at,
          last_sign_in_at: user.last_sign_in_at,
          role: user.user_metadata?.role || null,
        })) || [];

        return NextResponse.json({
          success: true,
          users,
          total: users.length,
        });
      }
    }

    // Fallback: Fetch from public.users table
    const supabase = await createServerClient();
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (publicError) {
      console.error('Error fetching public users:', publicError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Transform public.users data
    const users = publicUsers?.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      email_confirmed_at: user.email_verified ? user.created_at : null,
      last_sign_in_at: user.last_login_at || null,
      role: null,
    })) || [];

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
      source: 'public.users' // Indicator for debugging
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

