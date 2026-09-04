import Link from 'next/link';

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
      aria-label="Dersly"
      className={`flex items-center gap-2.5 ${className ?? ''}`}
    >
      <svg viewBox="0 0 64 64" className="size-8 shrink-0" aria-hidden>
        <rect width="64" height="64" rx="16" fill="var(--primary)" />
        <path
          d="M17 15 H30 A17 17 0 0 1 30 49 H17 Z M25 23 H30 A9 9 0 0 1 30 41 H25 Z"
          fillRule="evenodd"
          fill="var(--primary-foreground)"
        />
      </svg>
      <span className="text-xl font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
        Dersly
      </span>
    </Link>
  );
}
