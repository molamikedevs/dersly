'use client';

import { useDemoData } from '@/features/demo/components/store';
import { viewer, viewerClasses } from '@/features/demo/selectors';
import StudentProfile from '@/features/profile/components/student-profile';

export default function DemoStudentProfile() {
  const data = useDemoData();
  const person = viewer(data);

  return (
    <StudentProfile
      name={person.fullName}
      email={person.email}
      avatarUrl={person.avatarUrl}
      level={person.level}
      classes={viewerClasses(data)}
    />
  );
}
