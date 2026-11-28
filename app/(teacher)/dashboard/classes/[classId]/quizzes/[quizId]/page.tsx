import { notFound } from 'next/navigation';

import QuizResultView from '@/features/quizzes/components/quiz-result-view';
import { getQuiz } from '@/features/quizzes/queries';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'Quiz result' };

export default async function TeacherQuizResultPage({
  params,
}: RouteParams<{ classId: string; quizId: string }>) {
  const { classId, quizId } = await params;
  const { data, success } = await getQuiz(quizId);

  if (!success || !data) notFound();

  return (
    <QuizResultView
      quiz={data}
      backHref={`/dashboard/classes/${classId}`}
      backLabel="Back to class"
    />
  );
}
