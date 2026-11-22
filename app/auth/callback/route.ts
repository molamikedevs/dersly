import type { EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/server';

// The email links this route accepts. Anything else is treated as expired.
const EMAIL_TYPES: EmailOtpType[] = [
  'recovery',
  'signup',
  'invite',
  'magiclink',
  'email',
  'email_change',
];

// Only paths on this site. "next" comes from the link, so without this check
// a crafted link like ?next=@evil.example could send someone to another site.
function safePath(value: string | null) {
  if (!value || !value.startsWith('/')) return '/';
  if (value.startsWith('//') || value.startsWith('/\\')) return '/';
  return value;
}

function emailType(value: string | null) {
  return EMAIL_TYPES.find((type) => type === value) ?? null;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = emailType(searchParams.get('type'));
  const next = safePath(searchParams.get('next'));

  // An expired or already used link arrives here with an error and no code.
  // Send the person to a page that says so instead of a blank form.
  const failed =
    next === '/reset-password'
      ? `${origin}/reset-password?expired=1`
      : `${origin}/login?link=expired`;

  if (searchParams.get('error')) return NextResponse.redirect(failed);

  const supabase = createClient(await cookies());

  // A link with a token hash is checked by Supabase directly. It works in any
  // browser, so a link opened on another device or in an email app's own
  // browser still signs the person in.
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (error) return NextResponse.redirect(failed);
    return NextResponse.redirect(`${origin}${next}`);
  }

  // A link with a code needs the code verifier saved in the browser that
  // asked for the email, so it only works in that same browser.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) return NextResponse.redirect(failed);
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(failed);
}
