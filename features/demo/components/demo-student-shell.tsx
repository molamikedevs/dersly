'use client';

import { useEffect, type ReactNode } from 'react';

import ScrollToTop from '@/components/common/scroll-to-top';
import StudentTabBar from '@/components/ui/layout/navigation/student-tab-bar';
import StudentTopBar from '@/components/ui/layout/navigation/student-top-bar';
import SkipLink from '@/components/ui/layout/skip-link';
import DemoBanner from '@/features/demo/components/demo-banner';
import { useDemoData } from '@/features/demo/components/store';
import {
  DEMO_TEST_KEY,
  viewer,
  viewerClasses,
} from '@/features/demo/selectors';
import { saveProgress } from '@/features/level-test/progress';

// The student layout, with the invented student in place of the signed-in
// one. The banner sits above the top bar and scrolls away, the top bar
// still sticks.
export default function DemoStudentShell({
  children,
}: {
  children: ReactNode;
}) {
  const data = useDemoData();
  const person = viewer(data);
  const classType = viewerClasses(data)[0]?.type ?? null;

  // The level test keeps answers in progress in the browser. Clear them when
  // the student side opens, so the demo starts fresh after a reload.
  useEffect(() => {
    saveProgress(DEMO_TEST_KEY, null);
  }, []);

  return (
    <>
      <SkipLink />
      <ScrollToTop />
      <DemoBanner side="student" />
      <StudentTopBar
        name={person.fullName}
        email={person.email}
        avatarUrl={person.avatarUrl}
        classType={classType}
      />
      <main
        id="main"
        className="container-app flex-1 pt-8 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pt-14 md:pb-16"
      >
        {children}
      </main>
      <StudentTabBar
        name={person.fullName}
        email={person.email}
        avatarUrl={person.avatarUrl}
        classType={classType}
      />
    </>
  );
}
