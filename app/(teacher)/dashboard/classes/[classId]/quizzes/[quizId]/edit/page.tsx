import { notFound, redirect } from 'next/navigation';

import { getLessonProgress } from '@/features/classes/queries';
import { getStudentMistakes } from '@/features/mistakes/queries';
import QuizBuilder from '@/features/quizzes/components/quiz-builder';
import { getQuiz } from '@/features/quizzes/queries';
import { getStudentWords } from '@/features/vocabulary/queries';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'Edit quiz' };

export default async function EditQuizPage({
  params,
}: RouteParams<{ classId: string; quizId: string }>) {
  const { classId, quizId } = await params;
  const [quizRes, progressRes] = await Promise.all([
    getQuiz(quizId),
    getLessonProgress(classId),
  ]);

  if (!quizRes.success || !quizRes.data) notFound();

  if (quizRes.data.attempt?.submittedAt) {
    redirect(`/dashboard/classes/${classId}/quizzes/${quizId}`);
  }

  const enrollmentId = progressRes.data?.enrollmentId ?? null;
  const [words, mistakes] = enrollmentId
    ? await Promise.all([
        getStudentWords(enrollmentId).then((r) => r.data ?? []),
        getStudentMistakes(enrollmentId).then((r) => r.data ?? []),
      ])
    : [[], []];

  return (
    <QuizBuilder
      classId={classId}
      initialQuiz={quizRes.data}
      words={words}
      mistakes={mistakes}
    />
  );
}
