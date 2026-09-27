'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

const TABS = [
  { label: 'Videos', value: 'link' },
  { label: 'Documents', value: 'file' },
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
              'rounded-lg px-4 py-2 text-sm transition-colors',
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
