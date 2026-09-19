'use client';

import { STUDENT_TAB_NAV } from '@/constants/nav';
import UserAvatar from '@/features/profile/components/user-avatar';
import { cn, isActive } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  name: string;
  email: string;
};

export default function StudentTabBar({ name, email }: Props) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.25rem)' }}
    >
      <ul
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${STUDENT_TAB_NAV.length + 1}, minmax(0, 1fr))`,
        }}
      >
        {STUDENT_TAB_NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href, href === '/');

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-14 flex-col items-center justify-center gap-1 px-1',
                  'transition-colors active:bg-muted',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon
                  className="size-5 shrink-0"
                  aria-hidden
                  strokeWidth={active ? 2.25 : 1.75}
                />
                <span
                  className={cn(
                    'max-w-full truncate text-[11px] leading-tight',
                    active ? 'font-medium' : 'font-normal',
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}

        <li>
          <UserAvatar
            name={name}
            email={email}
            variant="tab"
            active={isActive(pathname, '/profile')}
          />
        </li>
      </ul>
    </nav>
  );
}
