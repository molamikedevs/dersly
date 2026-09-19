/**
 * Downscale + compress an image entirely in the browser before upload.
 *
 * Avatars are displayed small, so there's no reason to ship the original
 * multi-megabyte photo. We draw it onto a canvas capped at `maxSize` px on
 * its longest edge and re-encode it, which typically turns a several-MB
 * phone photo into a ~100-300 KB file.
 */
export async function resizeImage(
  file: File,
  { maxSize = 512, quality = 0.85, type = 'image/webp' } = {},
): Promise<File> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await loadImage(objectUrl);

    // Scale down only — never upscale a small image.
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return file; // canvas unavailable — fall back to original
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, quality),
    );
    if (!blob) return file; // encoding failed — fall back to original

    const ext = type.split('/')[1] ?? 'webp';
    const name = file.name.replace(/\.[^.]+$/, '') + `.${ext}`;
    return new File([blob], name, { type: blob.type });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read this image'));
    img.src = src;
  });
}
