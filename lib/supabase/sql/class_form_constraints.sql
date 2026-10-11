-- The same limits the class form enforces with zod, held in the database so a
-- request that skips the form cannot store anything else.
alter table public.classes
  add constraint classes_name_length_check
    check (char_length(btrim(name)) between 2 and 60),
  add constraint classes_meeting_url_check
    check (
      meeting_url is null
      or (char_length(meeting_url) <= 500 and meeting_url ~* '^https?://\S+$')
    );
