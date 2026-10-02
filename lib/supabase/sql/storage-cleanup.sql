begin;

-- 1. Homework files: only students in that class can read them.
--    Before, every signed-in user could read every file in the bucket.
drop policy "authenticated reads homework" on storage.objects;

create policy "students read own class homework files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'homework'
    and exists (
      select 1
      from public.homework h
      join public.enrollments e on e.class_id = h.class_id
      where h.attachment_path = 'homework/' || objects.name
        and h.is_published = true
        and e.student_id = (select auth.uid())
        and e.status = 'active'
    )
  );

-- 2. Avatars: signed-in users can no longer list everyone's files.
--    Public avatar URLs keep working, and "users manage own avatar"
--    still lets each user list and manage their own folder.
drop policy "authenticated read avatars" on storage.objects;

-- 3. The two materials buckets are unused since guides replaced documents.
drop policy "teacher manages materials" on storage.objects;
drop policy "teacher uploads materials" on storage.objects;
drop policy "authenticated reads materials" on storage.objects;

-- 4. Dead column: nothing has read it since lesson tracking moved to the lessons table.
alter table public.enrollments drop column lessons_completed;

-- 5. The progress view is read-only.
revoke insert, update, delete on public.lesson_progress from authenticated;

-- 6. Future sequences start closed to visitors, like tables and functions.
alter default privileges for role postgres in schema public
  revoke all on sequences from anon;

commit;
