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
      className={cn('flex w-fit gap-1 rounded-xl bg-muted p-1', className)}
    >
      {TABS.map(({ label, value }) => {
        const active = current === value;
        return (
          <Link
            key={value}
            href={hrefFor(value)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-h-11 items-center rounded-lg px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'bg-card font-semibold text-foreground shadow-sm'
                : 'font-medium text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
