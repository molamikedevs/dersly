'use client';

import Logo from '@/components/ui/layout/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { TEACHER_NAV } from '@/constants/nav';
import UserAvatar from '@/features/profile/components/user-avatar';
import { cn, isActive } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

type TeacherSidebarProps = {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
};

export function TeacherSidebar({
  name = 'Kevin Roberts',
  email = 'teacher@dersly.app',
  avatarUrl,
}: TeacherSidebarProps) {
  const pathname = usePathname();
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar();
  const hoverOpened = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleEnter() {
    if (isMobile || open || hoverOpened.current) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
      return;
    if (timer.current) clearTimeout(timer.current);
    hoverOpened.current = true;
    setOpen(true);
  }

  function handleLeave() {
    if (isMobile || !hoverOpened.current) return;
    timer.current = setTimeout(() => {
      hoverOpened.current = false;
      setOpen(false);
    }, 200);
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <SidebarHeader className="h-14 justify-center px-3 group-data-[collapsible=icon]:px-2">
        <Logo href="/dashboard" />
      </SidebarHeader>

      <SidebarContent className="px-3 py-2 group-data-[collapsible=icon]:px-2">
        <nav aria-label="Dashboard">
          <ul className="flex flex-col gap-0.5">
            {TEACHER_NAV.map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href, href === '/dashboard');
              return (
                <li key={href}>
                  <Link
                    onClick={() => {
                      if (isMobile) {
                        setOpenMobile(false);
                      } else {
                        hoverOpened.current = false;
                        setOpen(false);
                      }
                    }}
                    href={href}
                    title={label}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'tap-row relative flex items-center gap-3 rounded-md px-3 text-sm transition-colors',
                      'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      active
                        ? 'bg-accent font-medium text-accent-foreground'
                        : 'font-normal text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0',
                        active ? 'text-primary' : 'text-current',
                      )}
                      aria-hidden
                      strokeWidth={active ? 2.25 : 1.75}
                    />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3 group-data-[collapsible=icon]:px-2">
        <UserAvatar
          name={name}
          email={email}
          avatarUrl={avatarUrl}
          variant="row"
          profileHref="/dashboard/profile"
        />
      </SidebarFooter>
    </Sidebar>
  );
}
