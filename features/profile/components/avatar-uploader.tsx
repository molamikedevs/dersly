'use client';

import { Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import InitialsAvatar from '@/components/common/initials-avatar';
import { toast } from '@/components/ui/toast';
import { updateAvatar } from '@/features/profile/actions';
import { resizeImage } from '@/lib/resize-image';

type Props = {
  name: string;
  src?: string | null;
  onUpload?: (file: File) => Promise<string | void>;
};

export default function AvatarUploader({ name, src }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(src ?? null);
  const [pending, setPending] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPending(true);

    try {
      const resized = await resizeImage(file);
      const result = await updateAvatar({ file: resized });

      if (!result.success) {
        toast.add({
          title: 'Could not update your photo',
          description: result.error?.message,
        });
        return;
      }

      setPreview(result.data!.avatarUrl);
      toast.add({ title: 'Photo updated' });
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="relative shrink-0">
      <input
        ref={inputRef}
        id="avatar"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleChange}
      />

      <div className="size-20 overflow-hidden rounded-full bg-muted">
        {preview ? (
          <Image
            src={preview}
            alt=""
            width={80}
            height={80}
            className="size-20 object-cover"
          />
        ) : (
          <InitialsAvatar name={name} className="size-20 text-xl" />
        )}
      </div>

      {pending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
          <Loader2
            className="size-5 animate-spin text-foreground"
            aria-hidden
          />
          <span className="sr-only">Uploading your photo</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={pending}
        aria-label="Change your photo"
        className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm ring-2 ring-background transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60"
      >
        <Camera className="size-4" aria-hidden />
      </button>
    </div>
  );
}
