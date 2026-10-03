begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lesson-images',
  'lesson-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
);

create policy "teacher uploads lesson images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'lesson-images'
  and (select public.is_teacher())
);

commit;
