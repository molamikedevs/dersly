'use client';

import { studentTopNav } from '@/constants/nav';
import { AppLink, useAppPathname } from '@/features/app/app-mode';
import UserAvatar from '@/features/profile/components/user-avatar';
import { cn, isActive } from '@/lib/utils';
import Logo from '../logo';

type Props = {
  name: string;
  email: string;
  avatarUrl?: string | null;
  classType?: ClassType | null;
};

export default function StudentTopBar({
  name,
  email,
  avatarUrl,
  classType,
}: Props) {
  const pathname = useAppPathname();
  const items = studentTopNav(classType);

  return (
    // The top padding clears the status bar when Dersly is opened from the
    // home screen. In the browser it is zero.
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="container-app flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo />

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 rounded-full border border-border-subtle bg-card/75 p-1 shadow-[inset_0_1px_0_0_oklch(1_0_0/0.04)] md:flex"
        >
          {items.map(({ label, href }) => {
            const active = isActive(pathname, href);
            return (
              <AppLink
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-9 items-center rounded-full px-4 text-sm transition-all duration-150',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  active
                    ? 'bg-accent font-semibold text-foreground shadow-xs ring-1 ring-border'
                    : 'font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
              >
                {label}
              </AppLink>
            );
          })}
        </nav>

        <UserAvatar
          name={name}
          email={email}
          avatarUrl={avatarUrl}
          active={isActive(pathname, '/profile')}
          className="-mr-1.5 hidden md:flex"
        />
      </div>
    </header>
  );
}
