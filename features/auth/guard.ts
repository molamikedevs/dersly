import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const getProfile = cache(async () => {
  const supabase = createClient(await cookies());

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, level')
    .eq('id', userId)
    .single();

  if (!profile) redirect('/login');
  return profile;
});

export async function requireTeacher() {
  const profile = await getProfile();
  if (profile.role !== 'teacher') redirect('/');
  return profile;
}

export async function requireStudent() {
  const profile = await getProfile();
  if (profile.role !== 'student') redirect('/dashboard');
  return profile;
}
