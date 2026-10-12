import type { Viewport } from 'next';
import { cookies } from 'next/headers';
import { after } from 'next/server';

import ScrollToTop from '@/components/common/scroll-to-top';
import StudentTabBar from '@/components/ui/layout/navigation/student-tab-bar';
import StudentTopBar from '@/components/ui/layout/navigation/student-top-bar';
import SkipLink from '@/components/ui/layout/skip-link';
import { requireStudent } from '@/features/auth/guard';
import { getStudentClasses } from '@/features/classes/queries';
import { createClient } from '@/lib/supabase/server';

// Lets the page reach the screen edges, which is what makes
// env(safe-area-inset-*) report the real insets when Dersly is opened from
// the home screen. The top bar, the tab bar and the page padding add them
// back.
export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient(await cookies());
  const profile = await requireStudent();
  const { data } = await getStudentClasses();
  const classType = data?.[0]?.type ?? null;

  after(async () => {
    const { error } = await supabase.rpc('touch_last_seen');
    if (error) console.error('touch_last_seen', error);
  });
  return (
    <>
      <SkipLink />
      <ScrollToTop />
      <StudentTopBar
        name={profile.full_name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
        classType={classType}
      />
      {/* On phones the bottom padding is the tab bar (3.5rem), the home
          indicator and 2rem of air, so the last row always clears the bar. */}
      <main
        id="main"
        className="container-app flex-1 pt-8 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pt-14 md:pb-16"
      >
        {children}
      </main>
      <StudentTabBar
        name={profile.full_name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
        classType={classType}
      />
    </>
  );
}
