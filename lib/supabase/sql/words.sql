-- A word a teacher set for a one-to-one student, for one week
create table public.words (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  -- The Monday the week starts, in Baku
  week_start date not null
    default (date_trunc('week', now() at time zone 'Asia/Baku'))::date
    check (extract(isodow from week_start) = 1),
  word text not null check (char_length(btrim(word)) between 1 and 60),
  meaning text not null check (char_length(btrim(meaning)) between 1 and 200),
  example text check (char_length(example) <= 300),
  attempts smallint not null default 0,
  learned_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index words_enrollment_week_word_key
  on public.words (enrollment_id, week_start, lower(btrim(word)));

create index words_enrollment_week_idx
  on public.words (enrollment_id, week_start desc);

-- Five words a week at most
create or replace function public.words_week_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (
    select count(*)
    from public.words w
    where w.enrollment_id = new.enrollment_id
      and w.week_start = new.week_start
      and w.id <> new.id
  ) >= 5 then
    raise exception 'A week has 5 words at most' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger words_week_limit
  before insert or update of enrollment_id, week_start on public.words
  for each row execute function public.words_week_limit();

alter table public.words enable row level security;

-- Teachers read, edit and delete words in their own classes,
-- and can only add them to one-to-one classes for now
create policy "teachers manage words in own classes"
  on public.words for all
  using (
    exists (
      select 1
      from public.enrollments e
      join public.classes c on c.id = e.class_id
      where e.id = words.enrollment_id
        and c.teacher_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.enrollments e
      join public.classes c on c.id = e.class_id
      where e.id = words.enrollment_id
        and c.teacher_id = (select auth.uid())
        and c.type = 'one_to_one'
    )
  );

-- Students read only their own words
create policy "students read own words"
  on public.words for select
  using (
    exists (
      select 1
      from public.enrollments e
      where e.id = words.enrollment_id
        and e.student_id = (select auth.uid())
    )
  );

grant select, insert, update, delete on table public.words to authenticated;

-- The student's answer. Right: the word is learned. Wrong: a hint the
-- first time, then the word itself.
create or replace function public.check_word(
  p_word_id uuid,
  p_answer text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_word text;
  v_attempts smallint;
  v_right boolean;
begin
  if (select auth.uid()) is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;

  if char_length(btrim(coalesce(p_answer, ''))) not between 1 and 60 then
    raise exception 'Write the word first' using errcode = 'P0001';
  end if;

  select w.word, w.attempts
  into v_word, v_attempts
  from public.words w
  join public.enrollments e on e.id = w.enrollment_id
  where w.id = p_word_id
    and e.student_id = (select auth.uid())
  for update of w;

  if not found then
    raise exception 'Word not found' using errcode = 'P0002';
  end if;

  v_right := lower(btrim(p_answer)) = lower(btrim(v_word));
  v_attempts := least(v_attempts + 1, 32000);

  update public.words
  set attempts = v_attempts,
      learned_at = case when v_right then coalesce(learned_at, now()) else learned_at end
  where id = p_word_id;

  return jsonb_build_object(
    'right', v_right,
    'word', case when v_right or v_attempts >= 2 then v_word end,
    'hint', case when not v_right and v_attempts = 1
      then upper(left(btrim(v_word), 1)) || ', ' || char_length(btrim(v_word)) || ' letters'
    end
  );
end;
$$;

revoke execute on function public.check_word(uuid, text) from public, anon;
grant execute on function public.check_word(uuid, text) to authenticated;
