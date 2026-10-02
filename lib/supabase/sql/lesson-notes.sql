begin;

-- 1. The note lives on the lesson it belongs to.
alter table public.lessons
  add column note text check (char_length(note) <= 1000);

-- 2. mark_lesson gets an optional note. A function's parameters are part of
--    its identity, so the old one is dropped and a new one created.
drop function public.mark_lesson(uuid);

create function public.mark_lesson(p_enrollment_id uuid, p_note text default null)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_started timestamptz;
  v_count int;
begin
  select e.package_started_at into v_started
  from public.enrollments e
  join public.classes c on c.id = e.class_id
  where e.id = p_enrollment_id
    and c.teacher_id = (select auth.uid())
  for update of e;

  if not found then
    raise exception 'Enrollment not found' using errcode = '42501';
  end if;

  select count(*) into v_count
  from public.lessons
  where enrollment_id = p_enrollment_id
    and taught_at >= v_started;

  -- Must match LESSONS_PER_PACKAGE in the app
  if v_count >= 8 then
    raise exception 'Package complete' using errcode = 'P0001';
  end if;

  -- An empty or whitespace-only note is stored as null
  insert into public.lessons (enrollment_id, note)
  values (p_enrollment_id, nullif(btrim(p_note), ''));

  return v_count + 1;
end;
$$;

revoke execute on function public.mark_lesson(uuid, text) from public, anon;
grant execute on function public.mark_lesson(uuid, text) to authenticated;

commit;
