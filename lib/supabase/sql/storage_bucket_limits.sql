-- Avatars: images only, 2 MB. The bucket is public and any signed-in user
-- can upload to their own folder, so the limits must live on the bucket.
update storage.buckets
set file_size_limit = 2097152,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'avatars';

-- Homework: 10 MB. Only the teacher uploads here.
update storage.buckets
set file_size_limit = 10485760
where id = 'homework';
