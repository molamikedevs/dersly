begin;

alter table public.lessons drop constraint lessons_note_check;

alter table public.lessons
  add constraint lessons_note_check check (char_length(note) <= 2000);

commit;
