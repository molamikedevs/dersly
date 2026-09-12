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
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background px-2 md:hidden">
          <SidebarTrigger className="tap-target" />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Dersly
          </span>
        </header>

        <main id="main" className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
