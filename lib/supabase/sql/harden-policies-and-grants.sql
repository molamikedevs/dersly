begin;

-- 1. Only a teacher can create or change a class.
--    Before, any signed-in user could insert a class with themselves as teacher.
alter policy "teachers manage own classes" on public.classes
  using (teacher_id = (select auth.uid()))
  with check (
    teacher_id = (select auth.uid())
    and (select public.is_teacher())
  );

-- 2. Bring the older helper functions up to the same standard as the new ones:
--    empty search_path, schema on every table name, and stable.
create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'teacher'
  );
$$;

create or replace function public.is_teacher_of_class(p_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.classes
    where id = p_class_id
      and teacher_id = (select auth.uid())
  );
$$;

-- Now also requires an active enrollment
create or replace function public.is_enrolled_in_class(p_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollments
    where class_id = p_class_id
      and student_id = (select auth.uid())
      and status = 'active'
  );
$$;

-- Nothing uses this since the "students join a class" policy was dropped
drop function public.is_class_open(uuid);

-- Helpers are for signed-in users only
revoke execute on function
  public.is_teacher(),
  public.is_teacher_of_class(uuid),
  public.is_enrolled_in_class(uuid),
  public.touch_last_seen()
from public, anon;

grant execute on function
  public.is_teacher(),
  public.is_teacher_of_class(uuid),
  public.is_enrolled_in_class(uuid),
  public.touch_last_seen()
to authenticated;

-- 3. Homework is visible only with an active enrollment.
alter policy "students read class homework" on public.homework
  using (
    is_published = true
    and exists (
      select 1
      from public.enrollments e
      where e.class_id = homework.class_id
        and e.student_id = (select auth.uid())
        and e.status = 'active'
    )
  );

-- 4. Grants: the first lock, in front of RLS.
--    Visitors who are not signed in get nothing at all.
revoke all on all tables in schema public from anon;

--    Signed-in users never need these three.
revoke truncate, references, trigger
  on all tables in schema public from authenticated;

--    These tables are only written by triggers and functions.
revoke insert, update, delete
  on public.enrollments, public.quiz_attempts from authenticated;
revoke insert, delete on public.profiles from authenticated;

--    Unused tables stay fully closed until their features are built.
revoke all on public.submissions, public.payment_receipts from authenticated;

-- 5. Future tables and functions start closed to visitors too.
alter default privileges for role postgres in schema public
  revoke all on tables from anon;
alter default privileges for role postgres in schema public
  revoke execute on functions from anon;

commit;
