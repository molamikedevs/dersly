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

// field names the form input the error belongs to, so it can show inline
type ActionResult = { error: string; field?: string } | undefined;

export async function signIn(values: unknown): Promise<ActionResult> {
  const parsed = LogInSchema.safeParse(values);
  if (!parsed.success) return { error: 'Please check the form and try again.' };

  const supabase = createClient(await cookies());

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: 'Wrong email or password.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  redirect(profile?.role === 'teacher' ? '/dashboard' : '/');
}

export async function signUp(values: unknown): Promise<ActionResult> {
  const parsed = RegisterSchema.safeParse(values);
  if (!parsed.success) return { error: 'Please check the form and try again.' };

  const { fullname, email, password, code } = parsed.data;
  const supabase = createClient(await cookies());

  // Returns only true or false, so no class data is exposed before login
  const { data: isValid, error: codeError } = await supabase.rpc(
    'is_invite_code_valid',
    { p_code: code },
  );

  if (codeError) {
    return { error: 'Could not check your class code. Please try again.' };
  }

  if (!isValid) {
    return { error: 'That class code is not valid.', field: 'code' };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullname, invite_code: code } },
  });

  if (error) {
    return {
      error:
        error.code === 'user_already_exists'
          ? 'An account with this email already exists.'
          : 'Could not create your account. Please try again.',
    };
  }

  if (!data.user) return { error: 'Could not create your account.' };

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
  if (!parsed.success) return { error: 'Enter a valid email address.' };

  const supabase = createClient(await cookies());

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  return undefined;
}

export async function updatePassword(values: unknown): Promise<ActionResult> {
  const parsed = ResetPasswordSchema.safeParse(values);
  if (!parsed.success) return { error: 'Please check the form and try again.' };

  const supabase = createClient(await cookies());

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: 'Could not update your password. Try the link again.' };
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
  if (!parsed.success) return { error: 'Type delete to confirm.' };

  const supabase = createClient(await cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Please sign in again.' };

  // Storage files do not cascade, so remove the avatar folder first
  const { data: files, error: listError } = await supabase.storage
    .from('avatars')
    .list(user.id);

  if (listError) {
    return { error: 'Could not delete your account. Please try again.' };
  }

  if (files?.length) {
    const { error: removeError } = await supabase.storage
      .from('avatars')
      .remove(files.map((file) => `${user.id}/${file.name}`));

    if (removeError) {
      return { error: 'Could not delete your account. Please try again.' };
    }
  }

  const { error } = await supabase.rpc('delete_own_account');

  if (error) {
    return { error: 'Could not delete your account. Please try again.' };
  }

  // The user no longer exists, so only clear the local session cookies
  await supabase.auth.signOut({ scope: 'local' });

  redirect('/login');
}
