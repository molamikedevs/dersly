begin;

-- 1. A yes/no check for invite codes.
--    It replaces the anon policy that exposed whole class rows.
create function public.is_invite_code_valid(p_code text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.classes
    where upper(invite_code) = upper(p_code)
      and is_active = true
      and enrollment_open = true
  );
$$;

revoke execute on function public.is_invite_code_valid(text) from public;
grant execute on function public.is_invite_code_valid(text) to anon, authenticated;

-- 2. Strangers can no longer read the classes table at all.
drop policy "anon can check invite codes" on public.classes;

-- 3. Students can no longer enrol themselves by class ID.
--    Enrolment only happens inside handle_new_user, which requires a code.
drop policy "students join a class" on public.enrollments;

-- 4. Signup now fails without a valid code, even when the Auth API is called directly.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_class uuid;
begin
  select id into target_class
  from public.classes
  where upper(invite_code) = upper(new.raw_user_meta_data ->> 'invite_code')
    and is_active = true
    and enrollment_open = true;

  if target_class is null then
    raise exception 'A valid class code is required to sign up.';
  end if;

  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  );

  insert into public.enrollments (class_id, student_id)
  values (target_class, new.id);

  return new;
end;
$$;

-- 5. A trigger function should never be callable through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

commit;
