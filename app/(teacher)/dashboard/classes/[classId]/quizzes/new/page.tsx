import { notFound } from 'next/navigation';

import { getClass, getLessonProgress } from '@/features/classes/queries';
import { getStudentMistakes } from '@/features/mistakes/queries';
import QuizBuilder from '@/features/quizzes/components/quiz-builder';
import { getStudentWords } from '@/features/vocabulary/queries';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'New quiz' };

export default async function NewQuizPage({
  params,
}: RouteParams<{ classId: string }>) {
  const { classId } = await params;
  const classRes = await getClass(classId);
  if (!classRes.success || !classRes.data) notFound();

  const progress =
    classRes.data.type === 'one_to_one'
      ? ((await getLessonProgress(classId)).data ?? null)
      : null;

  const [words, mistakes] = progress?.enrollmentId
    ? await Promise.all([
        getStudentWords(progress.enrollmentId).then((r) => r.data ?? []),
        getStudentMistakes(progress.enrollmentId).then((r) => r.data ?? []),
      ])
    : [[], []];

  return <QuizBuilder classId={classId} words={words} mistakes={mistakes} />;
}
