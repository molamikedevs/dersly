-- The own-profile policy was open to every role. Signed-out visitors already
-- matched no rows, but the policy should name the role it is for.
alter policy "read own profile" on public.profiles to authenticated;

-- Students read questions and options of active tests only, matching the
-- existing rule on quizzes. Teachers keep full access through their own policies.
alter policy "authenticated read questions" on public.questions
  using (
    exists (
      select 1
      from public.quizzes z
      where z.id = questions.quiz_id
        and z.is_active = true
    )
  );

alter policy "authenticated read options" on public.options
  using (
    exists (
      select 1
      from public.questions q
      join public.quizzes z on z.id = q.quiz_id
      where q.id = options.question_id
        and z.is_active = true
    )
  );
