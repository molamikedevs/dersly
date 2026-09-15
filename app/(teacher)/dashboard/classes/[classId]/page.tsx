import { notFound } from 'next/navigation';

import BackLink from '@/components/common/back-link';
import ClassHeader from '@/features/classes/components/class-header';
import StudentsSection from '@/features/classes/components/student-section';
import { mockStudents } from '@/features/classes/constants/index';
import { getClass } from '@/features/classes/queries';
import HomeWorkSection from '@/features/homework/components/homework-section';
import { getClassHomework } from '@/features/homework/queries';

import { RouteParams } from '@/types/global';

export default async function Page({
  params,
  searchParams,
}: RouteParams<{ classId: string }>) {
  const { classId } = await params;
  const { page, pageSize } = await searchParams;

  const [classResult, homeworkResult] = await Promise.all([
    getClass(classId),
    getClassHomework(classId, {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
    }),
  ]);

  if (!classResult.success || !classResult.data) notFound();

  const data = classResult.data;
  const homework = homeworkResult.data?.homework ?? [];

  return (
    <div className="pb-16">
      <BackLink
        href="/dashboard/classes"
        label="Back to classes"
        className="mb-6"
      />
      <ClassHeader data={data} />
      <HomeWorkSection homeWork={homework} classId={classId} />
      {data.type === 'course' && (
        <StudentsSection students={mockStudents} inviteCode={data.inviteCode} />
      )}
    </div>
  );
}
