'use server';

import { createClient } from '@/lib/supabase/server';
import { LogInSchema, RegisterSchema } from '@/lib/validation/auth.schema';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type ActionResult = { error: string } | undefined;

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

  const { data: classRow } = await supabase
    .from('classes')
    .select('id')
    .eq('invite_code', code)
    .eq('is_active', true)
    .maybeSingle();

  if (!classRow) return { error: 'That class code is not valid.' };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullname } },
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

  const { error: enrollError } = await supabase.from('enrollments').insert({
    class_id: classRow.id,
    student_id: data.user.id,
  });

  if (enrollError)
    return {
      error:
        'Account created, but joining the class failed. Tell your teacher.',
    };

  redirect('/');
}

export async function signOut() {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect('/login');
}
