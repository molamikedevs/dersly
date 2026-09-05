import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getProfile() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, level')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');
  return profile;
}

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
