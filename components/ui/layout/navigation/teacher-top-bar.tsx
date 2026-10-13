'use client';

import Logo from '@/components/ui/layout/logo';
import { useAppPathname } from '@/features/app/app-mode';
import UserAvatar from '@/features/profile/components/user-avatar';
import { isActive } from '@/lib/utils';

type Props = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

/** Phone header for the teacher side. The sidebar takes over from md up. */
export default function TeacherTopBar({ name, email, avatarUrl }: Props) {
  const pathname = useAppPathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Logo href="/dashboard" />

        <UserAvatar
          name={name}
          email={email}
          avatarUrl={avatarUrl}
          href="/dashboard/profile"
          active={isActive(pathname, '/dashboard/profile')}
          className="-mr-1.5"
        />
      </div>
    </header>
  );
}
