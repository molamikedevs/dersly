import StudentTabBar from '@/components/ui/layout/navigation/student-tab-bar';
import StudentTopBar from '@/components/ui/layout/navigation/student-top-bar';
import SkipLink from '@/components/ui/layout/skip-link';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />
      <StudentTopBar />
      <main
        id="main"
        className="container-app flex-1 pt-4 pb-24 md:pt-6 md:pb-10"
      >
        {children}
      </main>
      <StudentTabBar />
    </>
  );
}
