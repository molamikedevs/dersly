'use client';

import { TEACHER_NAV } from '@/constants/nav';
import { cn, isActive } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type MouseEvent } from 'react';

export default function TeacherTabBar() {
  const pathname = usePathname();

  const [tapped, setTapped] = useState<string | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setTapped(null);
  }

  const current = tapped ?? pathname;

  function handleClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    // Tapping the tab you are already on goes back to the top, as it does in
    // a native app.
    if (pathname === href) {
      event.preventDefault();
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }

    setTapped(href);
  }

  return (
    <nav
      aria-label="Dashboard"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pr-[env(safe-area-inset-right)] pb-[max(env(safe-area-inset-bottom),0.25rem)] pl-[env(safe-area-inset-left)] backdrop-blur-md md:hidden"
    >
      <ul
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${TEACHER_NAV.length}, minmax(0, 1fr))`,
        }}
      >
        {TEACHER_NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(current, href, href === '/dashboard');

          return (
            <li key={href}>
              <Link
                href={href}
                draggable={false}
                aria-current={active ? 'page' : undefined}
                onClick={(event) => handleClick(event, href)}
                className={cn(
                  'group flex h-14 touch-manipulation items-center justify-center px-0.5 select-none',
                  '[-webkit-touch-callout:none]',
                  'transition-colors duration-150 ease-out',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span className="flex w-full min-w-0 flex-col items-center gap-1 transition-transform duration-150 ease-out group-active:scale-[0.92]">
                  <Icon
                    className="size-5 shrink-0"
                    aria-hidden
                    strokeWidth={active ? 2.25 : 1.75}
                  />
                  <span
                    className={cn(
                      'max-w-full truncate text-[11px] leading-tight',
                      active ? 'font-semibold' : 'font-medium',
                    )}
                  >
                    {label}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
