'use client';

import { STUDENT_TOP_NAV } from '@/constants/nav';
import UserAvatar from '@/features/profile/components/user-avatar';
import { cn, isActive } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../logo';

type Props = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export default function StudentTopBar({ name, email, avatarUrl }: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {STUDENT_TOP_NAV.map(({ label, href }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-10 items-center rounded-full px-4 text-[15px] transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'bg-accent font-semibold text-accent-foreground'
                    : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <UserAvatar
          name={name}
          email={email}
          avatarUrl={avatarUrl}
          className="-mr-1.5 hidden md:flex"
        />
      </div>
    </header>
  );
}
