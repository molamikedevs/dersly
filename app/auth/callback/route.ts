import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/server';

// Only paths on this site. "next" comes from the link, so without this check
// a crafted link like ?next=@evil.example could send someone to another site.
function safePath(value: string | null) {
  if (!value || !value.startsWith('/')) return '/';
  if (value.startsWith('//') || value.startsWith('/\\')) return '/';
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = safePath(searchParams.get('next'));

  // An expired or already used link arrives here with an error and no code.
  // Send the person to a page that says so instead of a blank form.
  const failed =
    next === '/reset-password'
      ? `${origin}/reset-password?expired=1`
      : `${origin}/login?link=expired`;

  if (!code || searchParams.get('error')) {
    return NextResponse.redirect(failed);
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return NextResponse.redirect(failed);

  return NextResponse.redirect(`${origin}${next}`);
}
