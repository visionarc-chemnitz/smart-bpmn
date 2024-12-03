import {auth} from '@/auth'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {                                
  const { pathname } = req.nextUrl;
  const session = await auth();
  const user = session?.user;

  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      // Redirect to the signin page if not authenticated
      const loginUrl = new URL('/auth/signin', req.url);
      console.log("loginUrl", loginUrl);
      return NextResponse.redirect(loginUrl);
    }
  } else if (user && pathname.startsWith('/auth/signin')) {
    // Redirect to the dashboard if authenticated   
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Specify the paths that the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/auth/signin']
};
