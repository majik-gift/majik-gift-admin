import { NextResponse } from 'next/server';

// Send unauthenticated users to main site so admin login is not shown as public
function redirectToMainSiteOrLogin(request) {
  const mainSiteUrl = process.env.NEXT_PUBLIC_WEB_APP_URL;
  if (mainSiteUrl) {
    const base = mainSiteUrl.replace(/\/$/, '');
    return NextResponse.redirect(new URL(`${base}/log-in`, base));
  }
  return NextResponse.redirect(new URL('/login', request.url));
}

const ADMIN_AUTH_ROUTES = ['/login', '/log-in', '/forgot-password', '/reset-password', '/auth-callback'];

function isAdminAuthRoute(pathname) {
  return ADMIN_AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin login and auth pages: always allow access so admins can log in
  if (isAdminAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // Retrieve the token value from the cookies in the request, if it exists
  const userCookie = request.cookies.get('currentUser')?.value;
  let usrData = {};

  try {
    // Safely parse the user data from the cookie
    usrData = JSON.parse(userCookie || '{}');
  } catch (error) {
    console.error('Error parsing user data:', error);
    // Invalid cookie: redirect to main site (except we already returned for auth routes above)
    return redirectToMainSiteOrLogin(request);
  }

  // If there is no user data or the role is missing, redirect to main site (not admin login)
  if (!usrData?.user?.role) {
    if (pathname.split('/').includes('event-invite')) {
      return NextResponse.redirect(new URL(`/login?redirectUrl=${pathname}`, request.url));
    }
    return redirectToMainSiteOrLogin(request);
  }

  if (pathname.startsWith('/event-invite/') || pathname.startsWith('/zoom-documentation')) {
    return NextResponse.next(); // Allow the request to proceed without middleware logic
  }

  // Check if stripe_status is "connect_required" and redirect accordingly,
  // but avoid redirecting if already on the connect-stripe routes
  // console.log('🚀 ~ middleware ~ !usrData?.user?.zoom_connected:', usrData?.user);
  if (usrData?.user?.paypal_connect && usrData?.user?.country !== 'Australia') {
    console.log('m hu');
  }

  if (
    usrData?.user?.stripe_status === 'connect_required' ||
    usrData?.user?.stripe_status === 'under_review' ||
    usrData?.user?.country === 'Australia'
    // ||
    // (usrData?.user?.role === 'light_worker' && !usrData?.user?.zoom_connected)
  ) {
    if (
      usrData?.user?.role === 'light_worker' &&
      usrData?.user?.country === 'Australia' &&
      usrData?.user?.stripe_status === 'connect_required' &&
      !pathname.startsWith('/light-worker/connect-stripe')
    ) {
      return NextResponse.redirect(new URL('/light-worker/connect-stripe', request.url));
    }
    if (
      usrData?.user?.role === 'stall_holder' &&
      usrData?.user?.country === 'Australia' &&
      usrData?.user?.stripe_status === 'connect_required' &&
      !pathname.startsWith('/stall-holder/connect-stripe')
    ) {
      return NextResponse.redirect(new URL('/stall-holder/connect-stripe', request.url));
    }
  }

  // Admin user - Redirect if they are not on an /admin route
  if (
    usrData?.user?.role === 'admin' &&
    !(pathname.startsWith('/admin') || pathname.startsWith('/notifications'))
  ) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Light Worker user - Redirect if they are not on a /light-worker route
  if (
    usrData?.user?.role === 'light_worker' &&
    !(pathname.startsWith('/light-worker') || pathname.startsWith('/notifications'))
  ) {
    return NextResponse.redirect(new URL('/light-worker/dashboard', request.url));
  }

  // Stall Holder user - Redirect if they are not on a /stall-holder route
  if (
    usrData?.user?.role === 'stall_holder' &&
    !(pathname.startsWith('/stall-holder') || pathname.startsWith('/notifications'))
  ) {
    return NextResponse.redirect(new URL('/stall-holder/dashboard', request.url));
  }

  // If the user is on the correct route, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - firebase-messaging-sw.js (service worker)
     * - firebase-cloud-messaging-push-scope (Firebase FCM)
     */
    '/admin/:path*',
    '/stall-holder/:path*',
    '/light-worker/:path*',
    // '/zoom-documentation',
    '/((?!api|_next/static|_next/image|favicon.ico|firebase-messaging-sw.js|firebase-cloud-messaging-push-scope|zoom-documentation).*)',
    // '/((?!zoom-documentation).*)',
  ],
};
