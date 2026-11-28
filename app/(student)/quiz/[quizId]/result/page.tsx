import { notFound, redirect } from 'next/navigation';

import QuizResultView from '@/features/quizzes/components/quiz-result-view';
import { getQuiz } from '@/features/quizzes/queries';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'Quiz result' };

export default async function StudentQuizResultPage({
  params,
}: RouteParams<{ quizId: string }>) {
  const { quizId } = await params;
  const { data, success } = await getQuiz(quizId);

  if (!success || !data) notFound();
  if (!data.attempt?.submittedAt) redirect(`/quiz/${quizId}`);

  return <QuizResultView quiz={data} backHref="/" backLabel="Back to home" />;
}
