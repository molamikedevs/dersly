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
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map(({ label, href }) => {
            const active = isActive(pathname, href);
            return (
              <AppLink
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-10 items-center rounded-full px-4 text-[15px] transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  active
                    ? 'bg-accent font-semibold text-accent-foreground'
                    : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
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
