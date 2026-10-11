-- Cover the two foreign keys the performance advisor reports.
-- classes.teacher_id is also read by most teacher policies.
create index if not exists classes_teacher_id_idx
  on public.classes using btree (teacher_id);
create index if not exists quiz_attempts_quiz_id_idx
  on public.quiz_attempts using btree (quiz_id);
