import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const proxy = auth(req => {
  // Check if the user is authenticated from the request
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  if (isOnAdmin) {
    if (isLoginPage) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', req.nextUrl));
      }
      return null;
    }

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
    }
  }
  return null;
});

export const config = {
  matcher: ['/admin/:path*'],
};
