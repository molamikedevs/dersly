import { notFound } from 'next/navigation';

import { requireStudent } from '@/features/auth/guard';
import QuestionsScreen from '@/features/level-test/components/questions-screen';
import { getPlacementTest } from '@/features/level-test/queries';
import { progressKey } from '@/features/level-test/storage-key';

export const metadata = { title: 'Level test' };

export default async function Page() {
  const [profile, { data, success }] = await Promise.all([
    requireStudent(),
    getPlacementTest(),
  ]);

  if (!success || !data) notFound();

  return (
    <QuestionsScreen
      quizId={data.quizId}
      questions={data.questions}
      storageKey={progressKey(profile.id)}
    />
  );
}
