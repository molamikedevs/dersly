begin;

-- 1. Scoring happens here, where students cannot see or change it.
create function public.submit_level_test(p_quiz_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
  v_total int;
  v_score int;
  v_ratio numeric;
  v_level text;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;

  -- The total is the number of questions in the test, not the number of answers sent
  select count(*) into v_total
  from public.questions q
  join public.quizzes z on z.id = q.quiz_id
  where q.quiz_id = p_quiz_id
    and z.is_active = true;

  if v_total = 0 then
    raise exception 'Test not found' using errcode = 'P0001';
  end if;

  -- One answer per question, so nobody can send every option and hit the right one
  if exists (
    select 1
    from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid)
    group by a.question_id
    having count(*) > 1
  ) then
    raise exception 'Only one answer per question is allowed' using errcode = 'P0001';
  end if;

  -- An answer counts only if the option is correct, belongs to that question,
  -- and the question belongs to this test
  select count(*) into v_score
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid)
  join public.questions q
    on q.id = a.question_id
   and q.quiz_id = p_quiz_id
  join public.options o
    on o.id = a.option_id
   and o.question_id = q.id
  where o.is_correct = true;

  v_ratio := v_score::numeric / v_total;

  v_level := case
    when v_ratio < 0.27 then 'beginner'
    when v_ratio < 0.53 then 'elementary'
    when v_ratio < 0.80 then 'intermediate'
    else 'advanced'
  end;

  -- The quiz_attempts_apply_level trigger copies the level to the profile
  insert into public.quiz_attempts (quiz_id, student_id, score, total, level_result)
  values (p_quiz_id, v_user, v_score, v_total, v_level);

  return jsonb_build_object('score', v_score, 'total', v_total, 'level', v_level);
end;
$$;

revoke execute on function public.submit_level_test(uuid, jsonb) from public, anon;
grant execute on function public.submit_level_test(uuid, jsonb) to authenticated;

-- 2. Students can no longer write attempts directly. Only the function can.
drop policy "students create own attempts" on public.quiz_attempts;

-- 3. Hide the answer key. Signed-in users can read every options column except is_correct.
revoke select on public.options from anon, authenticated;
grant select (id, question_id, text, position) on public.options to authenticated;

commit;
