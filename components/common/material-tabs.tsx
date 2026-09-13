'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

const TABS = [
  { label: 'All', value: '' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Elementary', value: 'elementary' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

export default function MaterialTabs({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('level') ?? '';

  function hrefFor(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('level', value);
    else params.delete('level');
    params.delete('page');
    return `${pathname}?${params.toString()}`;
  }

  return (
    <nav
      aria-label="Material type"
      className={cn('flex w-fit gap-1 rounded-md bg-muted p-1', className)}
    >
      {TABS.map(({ label, value }) => {
        const active = current === value;
        return (
          <Link
            key={value || 'all'}
            href={hrefFor(value)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-sm px-3 py-1.5 text-sm transition-colors',
              active
                ? 'bg-background font-medium text-foreground shadow-sm'
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
