'use server';

import { createClient } from '@/lib/supabase/server';
import {
  ForgotPasswordSchema,
  LogInSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from '@/lib/validation/auth.schema';
import {
  ChangePasswordSchema,
  DeleteAccountSchema,
} from '@/lib/validation/profile.schema';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// field: the input the error belongs to, so the form shows it there.
// expired: the reset link no longer works, so the form shows that screen.
export type ActionResult =
  | { error: string; field?: string; expired?: boolean }
  | undefined;

const NETWORK_ERROR =
  'Could not reach Dersly. Check your internet connection and try again.';

const TOO_MANY_TRIES =
  'Too many tries in a short time. Wait a few minutes, then try again.';

type AuthFailure = { code?: string; status?: number; name?: string };

function isNetworkFailure(error: AuthFailure) {
  return error.name === 'AuthRetryableFetchError' || error.status === 0;
}

function isRateLimited(error: AuthFailure) {
  return error.status === 429 || Boolean(error.code?.startsWith('over_'));
}

export async function signIn(values: unknown): Promise<ActionResult> {
  const parsed = LogInSchema.safeParse(values);
  if (!parsed.success) return { error: 'Check the highlighted fields.' };

  const supabase = createClient(await cookies());

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (isNetworkFailure(error)) return { error: NETWORK_ERROR };
    if (isRateLimited(error)) return { error: TOO_MANY_TRIES };

    if (error.code === 'email_not_confirmed') {
      return {
        error:
          'Confirm your email first. Open the link we sent when you signed up.',
      };
    }

    // Never say which of the two was wrong
    return { error: 'Email or password is incorrect.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  redirect(profile?.role === 'teacher' ? '/dashboard' : '/');
}

export async function signUp(values: unknown): Promise<ActionResult> {
  const parsed = RegisterSchema.safeParse(values);
  if (!parsed.success) return { error: 'Check the highlighted fields.' };

  const { fullname, email, password, code } = parsed.data;
  const supabase = createClient(await cookies());

  // Returns only true or false, so no class data is exposed before login
  const { data: isValid, error: codeError } = await supabase.rpc(
    'is_invite_code_valid',
    { p_code: code },
  );

  if (codeError) {
    return { error: 'Could not check your class code. Try again.' };
  }

  if (!isValid) {
    return {
      error:
        'This class code does not work. Check it with your teacher, it may have changed.',
      field: 'code',
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullname, invite_code: code } },
  });

  if (error) {
    if (isNetworkFailure(error)) return { error: NETWORK_ERROR };
    if (isRateLimited(error)) return { error: TOO_MANY_TRIES };

    if (error.code === 'user_already_exists') {
      return {
        error: 'There is already an account with this email. Log in instead.',
        field: 'email',
      };
    }

    if (error.code === 'weak_password') {
      return {
        error: 'Choose a stronger password, one that is harder to guess.',
        field: 'password',
      };
    }

    return { error: 'Could not create your account. Try again.' };
  }

  if (!data.user) return { error: 'Could not create your account. Try again.' };

  redirect('/');
}

export async function signOut() {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect('/login');
}

export async function requestPasswordReset(
  values: unknown,
): Promise<ActionResult> {
  const parsed = ForgotPasswordSchema.safeParse(values);
  if (!parsed.success) return { error: 'Check the highlighted fields.' };

  const supabase = createClient(await cookies());

  // The result is ignored on purpose: the answer is the same whether or not
  // the email has an account, so nobody can use this page to find students.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  return undefined;
}

export async function updatePassword(values: unknown): Promise<ActionResult> {
  const parsed = ResetPasswordSchema.safeParse(values);
  if (!parsed.success) return { error: 'Check the highlighted fields.' };

  const supabase = createClient(await cookies());

  // The reset link signs the person in. Without that session the link has
  // expired or was already used.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'This reset link has expired.', expired: true };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    if (isNetworkFailure(error)) return { error: NETWORK_ERROR };

    if (error.code === 'same_password') {
      return {
        error: 'Choose a password different from your old one.',
        field: 'password',
      };
    }

    if (error.code === 'weak_password') {
      return {
        error: 'Choose a stronger password, one that is harder to guess.',
        field: 'password',
      };
    }

    if (
      error.code === 'session_not_found' ||
      error.code === 'session_expired' ||
      error.status === 401
    ) {
      return { error: 'This reset link has expired.', expired: true };
    }

    return { error: 'Could not save your new password. Try again.' };
  }

  redirect('/');
}

export async function changePassword(values: unknown): Promise<ActionResult> {
  const parsed = ChangePasswordSchema.safeParse(values);
  if (!parsed.success) return { error: 'Please check the form and try again.' };

  const supabase = createClient(await cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { error: 'Please sign in again.' };

  // Verify the current password before allowing a change
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });

  if (verifyError) {
    return {
      error: 'Your current password is incorrect.',
      field: 'currentPassword',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (error) {
    return error.code === 'same_password'
      ? {
          error: 'Choose a password different from your current one.',
          field: 'newPassword',
        }
      : { error: 'Could not change your password. Please try again.' };
  }

  return undefined;
}

export async function deleteAccount(values: unknown): Promise<ActionResult> {
  const parsed = DeleteAccountSchema.safeParse(values);
  if (!parsed.success) {
    return { error: 'Type delete to confirm.', field: 'confirm' };
  }

  const supabase = createClient(await cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: 'Your session has ended. Log in again, then try once more.',
    };
  }

  // Only students can delete their account. Check before touching any file,
  // so a teacher's photo is never removed by a request that will fail.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'student') {
    return { error: 'Only student accounts can be deleted here.' };
  }

  // The photo goes first, through the Storage API, while the person is still
  // signed in. A database trigger cannot do this: Supabase blocks deleting
  // storage files from inside the database.
  const { data: files, error: listError } = await supabase.storage
    .from('avatars')
    .list(user.id);

  if (listError) {
    return {
      error: 'Could not delete your account. It is still here, so try again.',
    };
  }

  if (files?.length) {
    const { error: removeError } = await supabase.storage
      .from('avatars')
      .remove(files.map((file) => `${user.id}/${file.name}`));

    if (removeError) {
      return {
        error: 'Could not delete your account. It is still here, so try again.',
      };
    }
  }

  const { error } = await supabase.rpc('delete_own_account');

  if (error) {
    // The photo is already gone, so stop the profile pointing at it
    await supabase
      .from('profiles')
      .update({ avatar_path: null })
      .eq('id', user.id);

    return {
      error:
        'Could not delete your account. Your details are still here, so try again.',
    };
  }

  // The user no longer exists, so only clear the local session cookies
  await supabase.auth.signOut({ scope: 'local' });

  redirect('/login');
}
