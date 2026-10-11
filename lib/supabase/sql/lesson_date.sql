-- Lessons get a real lesson date.
-- Until now the only date on a lesson was taught_at, the moment the teacher
-- pressed "Lesson done". Several lessons marked in one sitting all showed the
-- same day, and a lesson marked after midnight showed the next day.
-- taught_at stays as it is, because the package count and "undo" rely on it.
-- lesson_date is the calendar day in Baku on which the lesson happened.

begin;

alter table public.lessons add column lesson_date date;

-- Existing lessons: place each one on the class's own schedule. The newest
-- lesson of a student takes the last scheduled lesson that had started when
-- the button was pressed, the one before it takes the scheduled lesson before
-- that, and so on. A class without a schedule is left for the fallback below.
with marks as (
  select
    l.id,
    l.enrollment_id,
    e.class_id,
    l.taught_at at time zone 'Asia/Baku' as marked_local,
    row_number() over (
      partition by l.enrollment_id
      order by l.taught_at desc, l.id
    ) as r
  from public.lessons l
  join public.enrollments e on e.id = l.enrollment_id
),
span as (
  select
    class_id,
    min(marked_local)::date - 120 as first_day,
    max(marked_local)::date as last_day
  from marks
  group by class_id
),
slots as (
  select
    s.class_id,
    d.day::date + t.start_time as starts_local,
    row_number() over (
      partition by s.class_id
      order by d.day::date + t.start_time
    ) as n
  from span s
  join public.classes c on c.id = s.class_id
  cross join lateral unnest(c.schedule_days, c.schedule_times)
    as t(weekday, start_time)
  cross join lateral generate_series(
    s.first_day::timestamp, s.last_day::timestamp, interval '1 day'
  ) as d(day)
  where extract(isodow from d.day) = t.weekday
),
latest as (
  select
    m.*,
    (
      select max(s.n)
      from slots s
      where s.class_id = m.class_id
        and s.starts_local <= m.marked_local
    ) as n
  from marks m
),
placed as (
  select
    id,
    class_id,
    min(n + r) over (partition by enrollment_id order by r) - r as n
  from latest
)
update public.lessons l
set lesson_date = s.starts_local::date
from placed p
join slots s on s.class_id = p.class_id and s.n = p.n
where p.id = l.id;

-- Fallback: the day the button was pressed
update public.lessons
set lesson_date = (taught_at at time zone 'Asia/Baku')::date
where lesson_date is null;

alter table public.lessons
  alter column lesson_date set not null,
  alter column lesson_date set default ((now() at time zone 'Asia/Baku')::date),
  -- A lesson cannot be dated after the moment it was recorded
  add constraint lessons_lesson_date_check
    check (lesson_date <= (taught_at at time zone 'Asia/Baku')::date);

create index lessons_enrollment_date_idx
  on public.lessons using btree (enrollment_id, lesson_date desc, taught_at desc);

-- mark_lesson takes the lesson date. The old two-argument version is dropped
-- first, otherwise both would exist and a two-argument call would be
-- ambiguous. Calls without a date keep working and use today in Baku.
drop function public.mark_lesson(uuid, text);

create function public.mark_lesson(
  p_enrollment_id uuid,
  p_note text default null,
  p_lesson_date date default null
)
returns integer
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_started timestamptz;
  v_count int;
  v_today date := (now() at time zone 'Asia/Baku')::date;
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

  if p_lesson_date > v_today then
    raise exception 'Lesson date cannot be in the future'
      using errcode = 'P0001';
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
  insert into public.lessons (enrollment_id, note, lesson_date)
  values (
    p_enrollment_id,
    nullif(btrim(p_note), ''),
    coalesce(p_lesson_date, v_today)
  );

  return v_count + 1;
end;
$function$;

revoke all on function public.mark_lesson(uuid, text, date) from public, anon;
grant execute on function public.mark_lesson(uuid, text, date)
  to authenticated, service_role;

commit;

-- Tells the API layer about the new function signature straight away
notify pgrst, 'reload schema';
