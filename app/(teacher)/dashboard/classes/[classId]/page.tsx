import { notFound } from 'next/navigation';

import BackLink from '@/components/common/back-link';
import ClassHeader from '@/features/classes/components/class-header';
import StudentsSection from '@/features/classes/components/student-section';
import { getClass } from '@/features/classes/queries';
import HomeWorkSection from '@/features/homework/components/homework-section';
import { getClassHomework } from '@/features/homework/queries';
import { getClassStudents } from '@/features/students/queries';
import { RouteParams } from '@/types/global';

export async function generateMetadata({
  params,
}: RouteParams<{ classId: string }>) {
  const { classId } = await params;
  const { data } = await getClass(classId);
  return { title: data?.name ?? 'Class' };
}

export default async function Page({
  params,
  searchParams,
}: RouteParams<{ classId: string }>) {
  const { classId } = await params;
  const { page, pageSize } = await searchParams;

  const [classResult, homeworkResult, studentResult] = await Promise.all([
    getClass(classId),
    getClassHomework(classId, {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
    }),
    getClassStudents(classId, { page: 1, pageSize: 100 }),
  ]);

  if (!classResult.success || !classResult.data) notFound();

  const data = classResult.data;
  const homework = homeworkResult.data?.homework ?? [];
  const students = studentResult.data?.students ?? [];

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16">
      <div className="flex flex-col gap-5">
        <BackLink href="/dashboard/classes" label="Back to classes" />
        <ClassHeader data={data} />
      </div>

      <HomeWorkSection homeWork={homework} classId={classId} />

      {data.type === 'course' && (
        <StudentsSection students={students} inviteCode={data.inviteCode} />
      )}
    </div>
  );
}
