import { createClient } from '@/lib/supabase/client';

const BUCKET = 'lesson-images';
const MAX_EDGE = 1200;
const QUALITY = 0.82;

export const LESSON_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function toBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error('Could not prepare the picture.')),
      'image/webp',
      QUALITY,
    );
  });
}

async function resize(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not prepare the picture.');

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return toBlob(canvas);
}

export async function uploadLessonImage(file: File) {
  if (!LESSON_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`${file.name}: use a JPEG, PNG or WebP picture.`);
  }

  const blob = await resize(file);
  const extension = blob.type === 'image/webp' ? 'webp' : 'png';
  const path = `${crypto.randomUUID()}.${extension}`;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: '31536000' });

  if (error) {
    throw new Error(`${file.name}: could not upload. ${error.message}`);
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
