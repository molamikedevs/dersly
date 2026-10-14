'use client';

import type { ReactNode } from 'react';

import ScrollToTop from '@/components/common/scroll-to-top';
import { TeacherSidebar } from '@/components/ui/layout/navigation/teacher-sidebar';
import TeacherTabBar from '@/components/ui/layout/navigation/teacher-tab-bar';
import TeacherTopBar from '@/components/ui/layout/navigation/teacher-top-bar';
import SkipLink from '@/components/ui/layout/skip-link';
import { SidebarProvider } from '@/components/ui/sidebar';
import DemoBanner from '@/features/demo/components/demo-banner';
import { useDemoData } from '@/features/demo/components/store';

// The teacher layout, with the invented teacher in place of the signed-in
// one. The banner and the phone top bar stick together, so nothing jumps
// when the page scrolls.
export default function DemoTeacherShell({
  children,
}: {
  children: ReactNode;
}) {
  const { teacher } = useDemoData();

  return (
    <SidebarProvider>
      <SkipLink />
      <ScrollToTop />
      <TeacherSidebar
        name={teacher.fullName}
        email={teacher.email}
        avatarUrl={teacher.avatarUrl}
      />

      <div className="relative flex w-full min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30">
          <DemoBanner side="teacher" />
          <TeacherTopBar
            name={teacher.fullName}
            email={teacher.email}
            avatarUrl={teacher.avatarUrl}
          />
        </div>

        <main
          id="main"
          className="flex-1 px-4 pt-8 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 md:px-10 md:pt-14 md:pb-16"
        >
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      <TeacherTabBar />
    </SidebarProvider>
  );
}
