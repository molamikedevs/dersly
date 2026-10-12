import type { Metadata, Viewport } from 'next';

import ScrollToTop from '@/components/common/scroll-to-top';
import { TeacherSidebar } from '@/components/ui/layout/navigation/teacher-sidebar';
import TeacherTabBar from '@/components/ui/layout/navigation/teacher-tab-bar';
import TeacherTopBar from '@/components/ui/layout/navigation/teacher-top-bar';
import SkipLink from '@/components/ui/layout/skip-link';
import { SidebarProvider } from '@/components/ui/sidebar';
import { requireTeacher } from '@/features/auth/guard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

// Lets the page reach the screen edges, which is what makes
// env(safe-area-inset-*) report the real insets when Dersly is opened from
// the home screen. The root layout pads the sides, the two bars and the page
// padding add the top and bottom back.
export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireTeacher();

  return (
    <SidebarProvider>
      <SkipLink />
      <ScrollToTop />
      <TeacherSidebar
        name={profile.full_name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
      />

      <div className="relative flex w-full min-w-0 flex-1 flex-col">
        <TeacherTopBar
          name={profile.full_name}
          email={profile.email}
          avatarUrl={profile.avatarUrl}
        />

        {/* On phones the bottom padding is the tab bar (3.5rem), the home
            indicator and 2rem of air, so the last row always clears the bar. */}
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
