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
    <header className="sticky top-0 z-40 border-b bg-transparent backdrop-blur-sm">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {STUDENT_TOP_NAV.map(({ label, href }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 md:gap-2">
          <ThemeSwitch />
          <SignOutButton collapsed className="md:hidden" />
          <SignOutButton className="hidden w-auto md:block" />
        </div>
      </div>
    </header>
  );
}
