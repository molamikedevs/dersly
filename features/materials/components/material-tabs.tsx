'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

const TABS = [
  { label: 'Videos', value: 'link' },
  { label: 'Guides', value: 'guide' },
  { label: 'Reading', value: 'article' },
];

export default function MaterialTabs({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('kind') ?? 'link';

  function hrefFor(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set('kind', value);
    params.delete('page');
    return `${pathname}?${params.toString()}`;
  }

  return (
    <nav
      aria-label="Material type"
      className={cn(
        'inline-flex w-fit flex-wrap gap-1 rounded-xl border border-border-subtle bg-secondary/75 p-1',
        className,
      )}
    >
      {TABS.map(({ label, value }) => {
        const active = current === value;
        return (
          <Link
            key={value}
            href={hrefFor(value)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              active
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
