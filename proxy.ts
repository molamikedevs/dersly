import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { updateSession } from '@/lib/supabase/proxy';

// The demo runs on invented data in the browser. It is answered here, before
// a Supabase client is created, so a demo visit never reads or sets a
// session and never reaches the database.
function isDemo(pathname: string) {
  return pathname === '/demo' || pathname.startsWith('/demo/');
}

export default async function proxy(request: NextRequest) {
  if (isDemo(request.nextUrl.pathname)) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|site.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
