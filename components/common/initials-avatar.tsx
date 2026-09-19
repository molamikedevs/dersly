import Image from 'next/image';

import { cn, initials } from '@/lib/utils';

type Props = {
  name: string;
  src?: string | null;
  shape?: 'circle' | 'square';
  className?: string;
};

export default function InitialsAvatar({
  name,
  src,
  shape = 'circle',
  className,
}: Props) {
  const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-md';

  if (src) {
    return (
      <span
        className={cn(
          'relative block size-9 shrink-0 overflow-hidden bg-muted',
          rounded,
          className,
        )}
      >
        <Image src={src} alt="" fill sizes="64px" className="object-cover" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        'flex size-9 shrink-0 items-center justify-center text-xs font-semibold',
        shape === 'circle'
          ? 'rounded-full bg-primary text-primary-foreground'
          : 'rounded-md bg-muted text-muted-foreground',
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
