-- 1. Quizzes belonging to a class
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  title text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Questions (supports 'mcq' and 'word_bank')
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  position int not null,
  kind text not null check (kind in ('mcq', 'word_bank')),
  prompt text not null,
  options text[] not null,
  correct_answer text not null
);

-- 3. Student attempts (auto-saves progress in answers jsonb, finalized on submit)
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  score int,
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (quiz_id, student_id)
);

create index if not exists idx_quizzes_class_id on public.quizzes(class_id);
create index if not exists idx_quiz_questions_quiz_id on public.quiz_questions(quiz_id, position);
create index if not exists idx_quiz_attempts_quiz_id on public.quiz_attempts(quiz_id);

-- Row Level Security
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;

-- Teachers manage quizzes in their own classes
create policy "Teachers manage own class quizzes"
  on public.quizzes for all
  using (
    exists (
      select 1 from public.classes c
      where c.id = quizzes.class_id and c.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.classes c
      where c.id = quizzes.class_id and c.teacher_id = auth.uid()
    )
  );

-- Students read published quizzes for their active classes
create policy "Students read published class quizzes"
  on public.quizzes for select
  using (
    is_published = true and exists (
      select 1 from public.enrollments e
      where e.class_id = quizzes.class_id
        and e.student_id = auth.uid()
        and e.status = 'active'
    )
  );

-- Teachers manage questions for their quizzes
create policy "Teachers manage own quiz questions"
  on public.quiz_questions for all
  using (
    exists (
      select 1 from public.quizzes q
      join public.classes c on c.id = q.class_id
      where q.id = quiz_questions.quiz_id and c.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.quizzes q
      join public.classes c on c.id = q.class_id
      where q.id = quiz_questions.quiz_id and c.teacher_id = auth.uid()
    )
  );

-- Students read questions of published quizzes they are enrolled in
create policy "Students read published quiz questions"
  on public.quiz_questions for select
  using (
    exists (
      select 1 from public.quizzes q
      join public.enrollments e on e.class_id = q.class_id
      where q.id = quiz_questions.quiz_id
        and q.is_published = true
        and e.student_id = auth.uid()
        and e.status = 'active'
    )
  );

-- Students manage their own quiz attempts
create policy "Students manage own quiz attempts"
  on public.quiz_attempts for all
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- Teachers view attempts for their classes
create policy "Teachers view class quiz attempts"
  on public.quiz_attempts for select
  using (
    exists (
      select 1 from public.quizzes q
      join public.classes c on c.id = q.class_id
      where q.id = quiz_attempts.quiz_id and c.teacher_id = auth.uid()
    )
  );
