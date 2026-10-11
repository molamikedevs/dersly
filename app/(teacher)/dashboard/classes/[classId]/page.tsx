import { notFound } from 'next/navigation';

import BackLink from '@/components/common/back-link';
import ClassHeader from '@/features/classes/components/class-header';
import LessonTracker from '@/features/classes/components/lesson-tracker';
import StudentsSection from '@/features/classes/components/student-section';
import { getClass, getLessonProgress } from '@/features/classes/queries';
import HomeWorkSection from '@/features/homework/components/homework-section';
import { getClassHomework } from '@/features/homework/queries';
import { getClassStudents } from '@/features/students/queries';
import { RouteParams } from '@/types/global';

const STUDENTS_PER_PAGE = 10;

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
  const { page } = await searchParams;

  const [classResult, homeworkResult, studentResult] = await Promise.all([
    getClass(classId),
    // This page has no homework pager, so it always shows the latest.
    // ?page= belongs to the student list below.
    getClassHomework(classId, { page: 1, pageSize: 10 }),
    getClassStudents(classId, {
      page: Number(page) || 1,
      pageSize: STUDENTS_PER_PAGE,
    }),
  ]);

  if (!classResult.success || !classResult.data) notFound();

  const data = classResult.data;
  const homework = homeworkResult.data?.homework ?? [];
  const students = studentResult.data?.students ?? [];
  const totalStudents = studentResult.data?.total ?? 0;
  const hasMoreStudents = studentResult.data?.isNext ?? false;
  const isOneToOne = data.type === 'one_to_one';

  // Only a one-to-one class has a single lesson count to show
  const progress = isOneToOne
    ? ((await getLessonProgress(classId)).data ?? null)
    : null;

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16">
      <div className="flex flex-col gap-5">
        <BackLink href="/dashboard/classes" label="Back to classes" />
        <ClassHeader data={data}>
          {isOneToOne && (
            <LessonTracker
              name={data.name}
              enrollmentId={progress?.enrollmentId ?? null}
              lessonsDone={progress?.lessonsDone ?? 0}
            />
          )}
        </ClassHeader>
      </div>

      <HomeWorkSection homeWork={homework} classId={classId} />

      {!isOneToOne && (
        <StudentsSection
          students={students}
          total={totalStudents}
          isNext={hasMoreStudents}
          inviteCode={data.inviteCode}
        />
      )}
    </div>
  );
}
