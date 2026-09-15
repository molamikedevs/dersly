import { uploadFile } from '@/lib/supabase/upload-file';

export const VIDEO_BUCKET = 'video_materials';
export const DOCUMENT_BUCKET = 'document_materials';

export function bucketFor(file: File) {
  return file.type.startsWith('video/') ? VIDEO_BUCKET : DOCUMENT_BUCKET;
}

export async function uploadMaterialFile(file: File) {
  return uploadFile(file, bucketFor(file));
}
