'use client';

import { STUDENT_TAB_NAV } from '@/constants/nav';
import { cn, isActive } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StudentTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}
    >
      <ul className="grid grid-cols-4">
        {STUDENT_TAB_NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href, href === '/');

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex h-16 flex-col items-center justify-center gap-1 px-1',
                  'transition-colors active:bg-muted',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-4 top-0 h-0.5 rounded-b-full bg-primary transition-opacity',
                    active ? 'opacity-100' : 'opacity-0',
                  )}
                />

                <Icon
                  className="size-6 shrink-0"
                  aria-hidden
                  strokeWidth={active ? 2.25 : 1.75}
                />
                <span className="max-w-full truncate text-xs font-medium leading-tight">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
