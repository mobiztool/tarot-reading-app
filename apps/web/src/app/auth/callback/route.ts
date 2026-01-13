import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/';

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');
  redirectTo.searchParams.delete('next');

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type as 'email' | 'signup' | 'magiclink' | 'recovery' | 'email_change',
      token_hash,
    });

    if (!error) {
      // For password recovery, redirect to reset-password page
      if (type === 'recovery') {
        redirectTo.pathname = '/auth/reset-password';
        return NextResponse.redirect(redirectTo);
      }
      
      // For signup confirmation, add welcome param to trigger celebration
      if (type === 'signup') {
        redirectTo.searchParams.set('welcome', 'true');
      }
      
      return NextResponse.redirect(redirectTo);
    }
  }

  // Check for code (OAuth flow)
  const code = searchParams.get('code');
  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  // Return the user to an error page with some instructions
  redirectTo.pathname = '/auth/error';
  return NextResponse.redirect(redirectTo);
}


