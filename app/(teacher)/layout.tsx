import Logo from '@/components/ui/layout/logo';
import { TeacherSidebar } from '@/components/ui/layout/navigation/teacher-sidebar';
import SkipLink from '@/components/ui/layout/skip-link';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { requireTeacher } from '@/features/auth/guard';

export const metadata = {
  title: { default: 'Dashboard', template: '%s | Dashboard | Dersly' },
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
      <TeacherSidebar
        name={profile.full_name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
      />

      <SidebarInset className="bg-transparent">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-background/85 px-2 backdrop-blur-md md:hidden">
          <SidebarTrigger className="tap-target rounded-lg" />
          <Logo href="/dashboard" />
        </header>

        <main
          id="main"
          className="flex-1 px-4 pb-16 pt-8 sm:px-6 md:px-10 md:pt-14"
        >
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
