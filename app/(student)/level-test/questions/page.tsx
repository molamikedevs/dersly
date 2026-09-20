import { notFound } from 'next/navigation';

import QuestionsScreen from '@/features/level-test/components/questions-screen';
import { getPlacementTest } from '@/features/level-test/queries';

export const metadata = { title: 'Questions' };

export default async function Page() {
  const { data, success } = await getPlacementTest();

  if (!success || !data) notFound();

  return <QuestionsScreen quizId={data.quizId} questions={data.questions} />;
}
