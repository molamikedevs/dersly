import Link from 'next/link';

import { cn } from '@/lib/utils';

export default function Logo({
  href = '/',
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Dersly home"
      className={cn(
        'flex items-center gap-2.5 rounded-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <svg viewBox="0 0 64 64" className="size-9 shrink-0" aria-hidden>
        <rect width="64" height="64" rx="16" fill="var(--primary)" />
        <path
          d="M17 15 H30 A17 17 0 0 1 30 49 H17 Z M25 23 H30 A9 9 0 0 1 30 41 H25 Z"
          fillRule="evenodd"
          fill="var(--primary-foreground)"
        />
      </svg>
      <span className="font-serif text-[22px] font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
        Dersly
      </span>
    </Link>
  );
}
