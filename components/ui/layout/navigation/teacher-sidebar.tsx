'use client';

import InitialsAvatar from '@/components/common/initials-avatar';
import ThemeSwitch from '@/components/theme/theme-switch';
import Logo from '@/components/ui/layout/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { TEACHER_NAV } from '@/constants/nav';
import SignOutButton from '@/features/auth/components/signout-button';
import { cn, isActive } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

type TeacherSidebarProps = {
  name?: string;
  email?: string;
};

export function TeacherSidebar({
  name = 'Kevin Roberts',
  email = 'teacher@dersly.app',
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

      <SidebarFooter className="gap-1 border-t border-border p-3 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-3 px-1 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <InitialsAvatar name={name} className="size-8 shrink-0" />
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-foreground">
              {name}
            </p>
            {/* Break on the @ rather than clipping "gmail...." mid-word. */}
            <p className="truncate text-xs text-muted-foreground" title={email}>
              {email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
          <SignOutButton className="min-w-0 flex-1" />
          <ThemeSwitch />
        </div>

        <div className="hidden flex-col gap-1 group-data-[collapsible=icon]:flex">
          <SignOutButton
            collapsed
            className="min-w-0 flex-1 [&>button]:w-full [&>button]:justify-start [&>button]:px-3"
          />
          <ThemeSwitch />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
