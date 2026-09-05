'use client';

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

type TeacherSidebarProps = {
  name?: string;
  email?: string;
};

export function TeacherSidebar({
  name = 'Kevin Roberts',
  email = 'teacher@dersly.app',
}: TeacherSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b px-4 group-data-[collapsible=icon]:px-2">
        <Logo href="/dashboard" />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-2">
        <nav aria-label="Dashboard">
          <ul className="flex flex-col gap-1">
            {TEACHER_NAV.map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href, href === '/dashboard');
              return (
                <li key={href}>
                  <Link
                    onClick={() => {
                      if (isMobile) setOpenMobile(false);
                    }}
                    href={href}
                    title={label}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'tap-row relative flex items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                      'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0',
                      'before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2',
                      'before:rounded-r-full before:bg-primary before:transition-opacity',
                      active
                        ? 'bg-accent text-accent-foreground before:opacity-100'
                        : 'text-muted-foreground before:opacity-0 hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon
                      className="size-4 shrink-0"
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

      <SidebarFooter className="gap-2 border-t p-3">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          >
            {initials}
          </span>
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

        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <SignOutButton className="min-w-0 flex-1" />
          <ThemeSwitch />
        </div>

        <div className="hidden flex-col gap-2 group-data-[collapsible=icon]:flex">
          <SignOutButton collapsed />
          <ThemeSwitch />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
