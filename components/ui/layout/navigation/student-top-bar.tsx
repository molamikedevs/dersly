'use client';

import ThemeSwitch from '@/components/theme/theme-switch';
import { STUDENT_TOP_NAV } from '@/constants/nav';
import SignOutButton from '@/features/auth/components/signout-button';
import { cn, isActive } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../logo';

export default function StudentTopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="container-app flex h-14 items-center justify-between gap-4 md:h-16">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {STUDENT_TOP_NAV.map(({ label, href }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex h-16 items-center text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'font-medium text-foreground'
                    : 'font-normal text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-primary transition-opacity',
                    active ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeSwitch />
          <SignOutButton collapsed className="md:hidden" />
          <SignOutButton className="hidden w-auto md:block" />
        </div>
      </div>
    </header>
  );
}
