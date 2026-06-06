import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Gracefully skip auth checks if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  const { supabaseResponse, user, supabase } = await updateSession(request);
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // ── Unauthenticated user trying to access protected route ──
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // ── Authenticated user trying to access login/register ──
  if (user && isPublicRoute) {
    // Check if user has a company membership
    const { data: membership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    const url = request.nextUrl.clone();
    if (membership) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    } else {
      // No company yet — send to onboarding
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }
  }

  // ── Authenticated user accessing protected routes: check onboarding ──
  if (user && !isPublicRoute && pathname !== '/onboarding') {
    const { data: membership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (!membership) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
