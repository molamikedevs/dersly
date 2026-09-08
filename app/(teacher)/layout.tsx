import { TeacherSidebar } from '@/components/ui/layout/navigation/teacher-sidebar';
import SkipLink from '@/components/ui/layout/skip-link';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { requireTeacher } from '@/features/auth/guard';

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireTeacher();
  return (
    <SidebarProvider>
      <SkipLink />
      <TeacherSidebar name={profile.full_name} email={profile.email} />
      <SidebarInset className="bg-transparent">
        <SidebarTrigger className="tap-target -ml-1 md:hidden" />
        <main id="main" className="flex-1 p-4 sm:p-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
