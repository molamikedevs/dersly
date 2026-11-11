-- One mistake a teacher wrote down for a student
create table public.mistakes (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  wrong text not null check (char_length(btrim(wrong)) between 1 and 300),
  correct text not null check (char_length(btrim(correct)) between 1 and 300),
  tip text check (char_length(tip) <= 300),
  attempt text check (char_length(attempt) <= 300),
  fixed_at timestamptz,
  created_at timestamptz not null default now()
);

create index mistakes_enrollment_id_created_at_idx
  on public.mistakes (enrollment_id, created_at desc);

alter table public.mistakes enable row level security;

-- Teachers read, edit and delete mistakes in their own classes,
-- and can only add them to one-to-one classes for now
create policy "teachers manage mistakes in own classes"
  on public.mistakes for all
  using (
    exists (
      select 1
      from public.enrollments e
      join public.classes c on c.id = e.class_id
      where e.id = mistakes.enrollment_id
        and c.teacher_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.enrollments e
      join public.classes c on c.id = e.class_id
      where e.id = mistakes.enrollment_id
        and c.teacher_id = (select auth.uid())
        and c.type = 'one_to_one'
    )
  );

-- Students read only their own mistakes
create policy "students read own mistakes"
  on public.mistakes for select
  using (
    exists (
      select 1
      from public.enrollments e
      where e.id = mistakes.enrollment_id
        and e.student_id = (select auth.uid())
    )
  );

-- The student saves their fix and gets the correct version back
create or replace function public.submit_mistake_fix(
  p_mistake_id uuid,
  p_attempt text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_correct text;
  v_tip text;
begin
  if (select auth.uid()) is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;

  if char_length(btrim(coalesce(p_attempt, ''))) not between 1 and 300 then
    raise exception 'Write your fix first' using errcode = 'P0001';
  end if;

  update public.mistakes m
  set attempt = btrim(p_attempt)
  from public.enrollments e
  where m.id = p_mistake_id
    and e.id = m.enrollment_id
    and e.student_id = (select auth.uid())
  returning m.correct, m.tip into v_correct, v_tip;

  if not found then
    raise exception 'Mistake not found' using errcode = 'P0002';
  end if;

  return jsonb_build_object('correct', v_correct, 'tip', v_tip);
end;
$$;

-- The student marks a mistake as fixed, or back to still learning
create or replace function public.set_mistake_fixed(
  p_mistake_id uuid,
  p_fixed boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;

  update public.mistakes m
  set fixed_at = case when p_fixed then now() else null end
  from public.enrollments e
  where m.id = p_mistake_id
    and e.id = m.enrollment_id
    and e.student_id = (select auth.uid())
    and m.attempt is not null;

  if not found then
    raise exception 'Mistake not found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.submit_mistake_fix(uuid, text) from public, anon;
revoke execute on function public.set_mistake_fixed(uuid, boolean) from public, anon;
grant execute on function public.submit_mistake_fix(uuid, text) to authenticated;
grant execute on function public.set_mistake_fixed(uuid, boolean) to authenticated;

grant select, insert, update, delete on table public.mistakes to authenticated;
