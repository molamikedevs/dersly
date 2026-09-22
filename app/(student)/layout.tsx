import StudentTabBar from '@/components/ui/layout/navigation/student-tab-bar';
import StudentTopBar from '@/components/ui/layout/navigation/student-top-bar';
import SkipLink from '@/components/ui/layout/skip-link';
import { requireStudent } from '@/features/auth/guard';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireStudent();
  return (
    <>
      <SkipLink />
      <StudentTopBar
        name={profile.full_name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
      />
      <main
        id="main"
        className="container-app flex-1 pb-28 pt-8 md:pb-16 md:pt-14"
      >
        {children}
      </main>
      <StudentTabBar
        name={profile.full_name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
      />
    </>
  );
}
