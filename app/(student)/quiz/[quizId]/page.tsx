import { notFound, redirect } from 'next/navigation';

import QuizRunner from '@/features/quizzes/components/quiz-runner';
import { getQuiz } from '@/features/quizzes/queries';
import { RouteParams } from '@/types/global';

export async function generateMetadata({
  params,
}: RouteParams<{ quizId: string }>) {
  const { quizId } = await params;
  const { data } = await getQuiz(quizId);
  return { title: data?.title ?? 'Quiz' };
}

export default async function StudentQuizPage({
  params,
}: RouteParams<{ quizId: string }>) {
  const { quizId } = await params;
  const { data, success } = await getQuiz(quizId);

  if (!success || !data || !data.isPublished) notFound();

  if (data.attempt?.submittedAt) {
    redirect(`/quiz/${quizId}/result`);
  }

  return <QuizRunner quiz={data} />;
}
