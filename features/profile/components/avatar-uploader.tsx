'use client';

import { Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import InitialsAvatar from '@/components/common/initials-avatar';
import { updateAvatar } from '@/features/profile/actions';
import { resizeImage } from '@/lib/resize-image';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  src?: string | null;
  children: ReactNode;
};

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

// Phones take big photos. They are shrunk before upload, so only refuse
// files far too big to shrink. The storage bucket still refuses anything
// over 2 MB after that.
const MAX_ORIGINAL = 20 * 1024 * 1024;

type Status =
  | { kind: 'idle' }
  | { kind: 'uploading' }
  | { kind: 'saved' }
  | { kind: 'error'; message: string };

export default function AvatarUploader({ name, src, children }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState<string | null>(src ?? null);
  // The chosen photo, shown at once while it uploads
  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const uploading = status.kind === 'uploading';
  const shown = draft ?? saved;

  // Free the temporary preview once it is no longer shown
  useEffect(() => {
    if (!draft) return;
    return () => URL.revokeObjectURL(draft);
  }, [draft]);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setStatus({
        kind: 'error',
        message: 'Choose a JPG, PNG or WebP photo.',
      });
      return;
    }

    if (file.size > MAX_ORIGINAL) {
      setStatus({
        kind: 'error',
        message: 'This photo is too big. Choose one under 20 MB.',
      });
      return;
    }

    setDraft(URL.createObjectURL(file));
    setStatus({ kind: 'uploading' });

    try {
      const resized = await resizeImage(file);
      const result = await updateAvatar({ file: resized });

      if (!result.success) {
        setDraft(null);
        setStatus({
          kind: 'error',
          message: 'Your photo could not be saved. Try again.',
        });
        return;
      }

      setSaved(result.data!.avatarUrl);
      setDraft(null);
      setStatus({ kind: 'saved' });
      // The top bar and tab bar show the photo too
      router.refresh();
    } catch {
      setDraft(null);
      setStatus({
        kind: 'error',
        message:
          'Your photo could not be read. Try another one, or take a new photo.',
      });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 sm:gap-6">
        <input
          ref={inputRef}
          id="avatar"
          type="file"
          accept={ACCEPTED.join(',')}
          className="sr-only"
          tabIndex={-1}
          onChange={handleChange}
        />

        {/* The whole photo is the button. The camera badge says it can be
            changed. */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label={shown ? 'Change your photo' : 'Add a photo'}
          className="group relative shrink-0 touch-manipulation rounded-full select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-default"
        >
          <span className="block size-20 overflow-hidden rounded-full bg-muted ring-1 ring-border transition-[scale] duration-150 ease-out group-active:scale-[0.96] sm:size-24">
            {shown ? (
              <Image
                src={shown}
                alt=""
                width={96}
                height={96}
                unoptimized={shown.startsWith('blob:')}
                className={cn(
                  'size-full object-cover transition-opacity duration-200',
                  uploading && 'opacity-60',
                )}
              />
            ) : (
              <InitialsAvatar
                name={name}
                className="size-full text-2xl sm:text-3xl"
              />
            )}
          </span>

          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2
                className="size-6 animate-spin text-foreground"
                aria-hidden
              />
            </span>
          )}

          <span
            aria-hidden
            className="absolute -right-0.5 -bottom-0.5 flex size-9 items-center justify-center rounded-full bg-foreground text-background ring-4 ring-background transition-colors group-hover:bg-foreground/85"
          >
            <Camera className="size-4" />
          </span>
        </button>

        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <p
        role={status.kind === 'error' ? 'alert' : 'status'}
        className={cn(
          'min-h-5 text-sm',
          status.kind === 'error'
            ? 'font-medium text-destructive'
            : 'text-muted-foreground',
        )}
      >
        {status.kind === 'uploading' && 'Saving your photo'}
        {status.kind === 'saved' && 'Photo saved.'}
        {status.kind === 'error' && status.message}
      </p>
    </div>
  );
}
