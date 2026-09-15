import type { SupabaseClient } from '@supabase/supabase-js';

export async function signStoragePath(
  supabase: SupabaseClient,
  storagePath: string,
  downloadName: string,
) {
  const [bucket, ...rest] = storagePath.split('/');
  const path = rest.join('/');
  const extension = path.split('.').pop() ?? 'pdf';

  const [view, download] = await Promise.all([
    supabase.storage.from(bucket).createSignedUrl(path, 60 * 15),
    supabase.storage.from(bucket).createSignedUrl(path, 60 * 15, {
      download: `${downloadName}.${extension}`,
    }),
  ]);

  return {
    signedUrl: view.data?.signedUrl ?? null,
    downloadUrl: download.data?.signedUrl ?? null,
  };
}
