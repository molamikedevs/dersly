import { requireStudent } from '@/features/auth/guard';
import { getStudentClasses } from '@/features/classes/queries';
import StudentProfile from '@/features/profile/components/student-profile';

export const metadata = {
  title: 'Profile',
};

export default async function Profile() {
  const profile = await requireStudent();
  const { data } = await getStudentClasses();

  return (
    <StudentProfile
      name={profile.full_name}
      email={profile.email}
      avatarUrl={profile.avatarUrl}
      level={profile.level}
      classes={data ?? []}
    />
  );
}
