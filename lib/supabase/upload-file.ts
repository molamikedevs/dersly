import { RequestError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function uploadFile(file: File, bucket: string, folder?: string) {
  const supabase = createClient(await cookies());

  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const path = folder
    ? `${folder}/${crypto.randomUUID()}.${extension}`
    : `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new RequestError(500, 'Could not upload the file.');

  return `${bucket}/${path}`;
}
