import StudentTabBar from '@/components/ui/layout/navigation/student-tab-bar';
import StudentTopBar from '@/components/ui/layout/navigation/student-top-bar';
import SkipLink from '@/components/ui/layout/skip-link';
import { requireStudent } from '@/features/auth/guard';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStudent();
  return (
    <>
      <SkipLink />
      <StudentTopBar />
      <main
        id="main"
        className="container-app flex-1 pb-28 pt-6 md:pb-12 md:pt-8"
      >
        {children}
      </main>
      <StudentTabBar />
    </>
  );
}
