import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/history', '/profile', '/settings', '/reading/love', '/reading/career', '/reading/yes-no'];

// Routes that require admin access
const adminRoutes = ['/admin'];

// Routes that authenticated users shouldn't access (like login/signup)
const authRoutes = ['/auth/login', '/auth/signup'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the auth token and get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Check if current route is admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Check if current route is auth route (login/signup)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check admin access
  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user is admin
    const isAdminRole = user.user_metadata?.role === 'admin';
    const isAdminEmail = user.email?.endsWith('@admin.tarotapp.com') ?? false;
    const isAdmin = isAdminRole || isAdminEmail;
    
    if (!isAdmin) {
      // Redirect non-admin users to home with error
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('error', 'admin_required');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect to home if accessing auth routes while already logged in
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}


