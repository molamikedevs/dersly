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
      <ul className="grid grid-cols-4 gap-1 px-2 pt-2">
        {STUDENT_TAB_NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href, href === '/');
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-16 w-full flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 transition-colors',
                  active
                    ? 'bg-accent text-primary'
                    : 'text-muted-foreground active:bg-muted',
                )}
              >
                <Icon
                  className={cn(
                    'size-6 shrink-0 transition-transform duration-200',
                    active && 'scale-110',
                  )}
                  aria-hidden
                  strokeWidth={active ? 2.25 : 1.75}
                />
                <span className="w-full truncate text-center text-xs font-medium leading-none">
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
