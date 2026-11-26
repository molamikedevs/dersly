'use client';

import { useEffect, useRef } from 'react';

import Logo from '@/components/ui/layout/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { TEACHER_NAV } from '@/constants/nav';
import { AppLink, useAppPathname } from '@/features/app/app-mode';
import UserAvatar from '@/features/profile/components/user-avatar';
import { cn, isActive } from '@/lib/utils';

type TeacherSidebarProps = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export function TeacherSidebar({
  name,
  email,
  avatarUrl,
}: TeacherSidebarProps) {
  const pathname = useAppPathname();
  const { open, setOpen, isMobile } = useSidebar();
  const hoverOpened = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleEnter() {
    if (open || hoverOpened.current) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
      return;
    if (timer.current) clearTimeout(timer.current);
    hoverOpened.current = true;
    setOpen(true);
  }

  function handleLeave() {
    if (!hoverOpened.current) return;
    timer.current = setTimeout(() => {
      hoverOpened.current = false;
      setOpen(false);
    }, 200);
  }

  // Phones use the bottom tab bar. Rendering nothing here also keeps the
  // sidebar from mounting its slide-in drawer.
  if (isMobile) return null;

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="data-[side=left]:left-[env(safe-area-inset-left)]"
    >
      <SidebarHeader className="h-16 justify-center px-4 group-data-[collapsible=icon]:px-2">
        <Logo href="/dashboard" />
      </SidebarHeader>

      <SidebarContent className="px-3 py-3 group-data-[collapsible=icon]:px-2">
        <nav aria-label="Dashboard">
          <ul className="flex flex-col gap-1.5">
            {TEACHER_NAV.map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href, href === '/dashboard');
              return (
                <li key={href}>
                  <AppLink
                    onClick={() => {
                      hoverOpened.current = false;
                      setOpen(false);
                    }}
                    href={href}
                    title={label}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] transition-all duration-150',
                      'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0',
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                      active
                        ? 'bg-accent/90 font-semibold text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)] ring-1 ring-border'
                        : 'font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-[18px] shrink-0 transition-colors',
                        active ? 'text-primary' : 'text-current',
                      )}
                      aria-hidden
                      strokeWidth={active ? 2.25 : 1.75}
                    />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {label}
                    </span>
                    {active && (
                      <span
                        aria-hidden
                        className="ml-auto size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] group-data-[collapsible=icon]:hidden"
                      />
                    )}
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-border-subtle p-3 group-data-[collapsible=icon]:px-2">
        <UserAvatar
          name={name}
          email={email}
          avatarUrl={avatarUrl}
          variant="row"
          href="/dashboard/profile"
          active={isActive(pathname, '/dashboard/profile')}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
