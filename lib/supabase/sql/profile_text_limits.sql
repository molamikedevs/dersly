-- full_name and phone are the only free-text columns a student can write.
-- Cap them in the database, because the API accepts writes that skip the form.
alter table public.profiles
  add constraint profiles_full_name_length_check
    check (char_length(btrim(full_name)) between 1 and 100),
  add constraint profiles_phone_length_check
    check (char_length(phone) <= 20);
