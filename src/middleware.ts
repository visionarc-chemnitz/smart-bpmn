// middleware.ts add auth middleware to the app
// use this only for serverless db like vercel postgres

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the paths that require authentication
const protectedPaths = ['/dashboard'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the request path is protected
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = req.cookies.get('authjs.session-token');

    if (!token) {
      // Redirect to the signin page if not authenticated
      const loginUrl = new URL('/auth/signin', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to proceed if authenticated or not a protected path
  return NextResponse.next();
}

// Specify the paths that the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*'],
};
