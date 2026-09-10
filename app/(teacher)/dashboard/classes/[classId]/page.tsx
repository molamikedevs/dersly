import { notFound } from 'next/navigation';

import BackLink from '@/components/common/back-link';
import ClassHeader from '@/features/classes/components/class-header';
import StudentsSection from '@/features/classes/components/student-section';
import { mockStudents } from '@/features/classes/constants/index';
import { mockClasses } from '@/features/classes/mock';
import { RouteParams } from '@/types/global';

export default async function Page({
  params,
}: RouteParams<{ classId: string }>) {
  const { classId } = await params;
  const data = mockClasses.find((item) => item.id === classId);

  if (!data) notFound();

  return (
    <>
      <BackLink
        href="/dashboard/classes"
        label="Back to classes"
        className="mb-4"
      />
      <ClassHeader data={data} />
      {data.type === 'course' && (
        <StudentsSection students={mockStudents} inviteCode={data.inviteCode} />
      )}
    </>
  );
}
