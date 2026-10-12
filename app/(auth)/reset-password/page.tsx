import { cookies } from 'next/headers';

import ResetPasswordForm from '@/features/auth/components/reset-password-form';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Choose a new password' };

type Props = {
  searchParams: Promise<{ expired?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { expired } = await searchParams;

  // A working reset link signs the person in on its way here. No session
  // means the link expired, was already used, or the page was opened
  // directly, and all three get the same clear message straight away.
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);

  return <ResetPasswordForm expired={expired === '1' || !signedIn} />;
}
