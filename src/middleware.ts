import {auth} from '@/auth'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export async function middleware(req: NextRequest) {                                
  const { pathname } = req.nextUrl;
  const session = await auth();
  const user = session?.user;

  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const loginUrl = new URL('/auth/signin', req.url);
      return NextResponse.redirect(loginUrl);
    }
  } else if (user && pathname.startsWith('/auth/signin')) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/dashboard/:path*', '/auth/signin']
};
