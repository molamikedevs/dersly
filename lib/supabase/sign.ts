import type { SupabaseClient } from '@supabase/supabase-js';

export async function signStoragePath(
  supabase: SupabaseClient,
  storagePath: string,
  downloadName?: string | null,
) {
  const [bucket, ...rest] = storagePath.split('/');
  const path = rest.join('/');

  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 15);

  const signedUrl = data?.signedUrl ?? null;
  const extension = path.split('.').pop() ?? 'pdf';

  const name = downloadName
    ? downloadName.toLowerCase().endsWith(`.${extension}`)
      ? downloadName
      : `${downloadName}.${extension}`
    : path;

  return {
    signedUrl,
    downloadUrl: signedUrl
      ? `${signedUrl}&download=${encodeURIComponent(name)}`
      : null,
  };
}
