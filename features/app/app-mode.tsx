'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from 'react';

// The same pages run in two modes. In the real app every link is used as
// written. In the demo, links are moved under /demo, so the demo can never
// open the real dashboard or the real student pages.

export type DemoSide = 'teacher' | 'student';

type AppMode = { demo: boolean; side: DemoSide | null };

const AppModeContext = createContext<AppMode>({ demo: false, side: null });

const DEMO_BASE: Record<DemoSide, string> = {
  teacher: '/demo/teacher',
  student: '/demo/student',
};

// Pages that are the same for everyone and stay outside the demo
const SHARED = ['/login', '/register', '/forgot-password'];

function startsWithPath(href: string, path: string) {
  return (
    href === path ||
    href.startsWith(`${path}/`) ||
    href.startsWith(`${path}?`) ||
    href.startsWith(`${path}#`)
  );
}

// "/dashboard/classes/1" becomes "/demo/teacher/classes/1", and a student
// path like "/homework" becomes "/demo/student/homework"
export function toDemoHref(href: string, side: DemoSide) {
  // External links, "?page=2" and "#notes" are left alone
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  if (startsWithPath(href, '/demo')) return href;
  if (SHARED.some((path) => startsWithPath(href, path))) return href;

  if (startsWithPath(href, '/dashboard')) {
    return DEMO_BASE.teacher + href.slice('/dashboard'.length);
  }

  const base = DEMO_BASE[side];
  return href === '/'
    ? base
    : href.startsWith('/?')
      ? base + href.slice(1)
      : base + href;
}

export function AppModeProvider({
  side,
  children,
}: {
  side: DemoSide;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ demo: true, side }), [side]);
  return (
    <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
  );
}

export function useAppMode() {
  return useContext(AppModeContext);
}

export function useAppHref() {
  const { demo, side } = useContext(AppModeContext);

  return (href: string) => (demo && side ? toDemoHref(href, side) : href);
}

// next/link that knows about the demo. Use it for every link inside the app.
export function AppLink({ href, ...props }: ComponentProps<typeof Link>) {
  const toHref = useAppHref();
  return (
    <Link href={typeof href === 'string' ? toHref(href) : href} {...props} />
  );
}

// useRouter that knows about the demo
export function useAppRouter() {
  const router = useRouter();
  const toHref = useAppHref();

  return useMemo(
    () => ({
      ...router,
      push: (href: string) => router.push(toHref(href)),
      replace: (href: string) => router.replace(toHref(href)),
    }),
    [router, toHref],
  );
}
