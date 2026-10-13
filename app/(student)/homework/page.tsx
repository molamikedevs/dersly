import { getStudentClasses } from '@/features/classes/queries';
import HomeworkTimeline from '@/features/homework/components/homework-timeline';
import { getAllHomework } from '@/features/homework/queries';
import type { RouteParams } from '@/types/global';

export const metadata = {
  title: 'Homework',
};

export default async function Homework({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const [homeworkResult, classResult] = await Promise.all([
    getAllHomework({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 20,
    }),
    getStudentClasses(),
  ]);

  const enrolment = classResult.data?.[0] ?? null;

  return (
    <HomeworkTimeline
      homework={homeworkResult.data?.homework ?? []}
      enrolment={enrolment}
      now={new Date()}
      success={homeworkResult.success}
    />
  );
}
