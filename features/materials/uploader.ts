import { RequestError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export const VIDEO_BUCKET = 'video_materials';
export const DOCUMENT_BUCKET = 'document_materials';

export function bucketFor(file: File) {
  return file.type.startsWith('video/') ? VIDEO_BUCKET : DOCUMENT_BUCKET;
}

export async function uploadMaterialFile(file: File) {
  const supabase = createClient(await cookies());
  const bucket = bucketFor(file);

  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new RequestError(500, 'Could not upload the file.');

  return `${bucket}/${path}`;
}
