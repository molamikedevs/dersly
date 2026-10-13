import { redirect } from 'next/navigation';

import TestResult from '@/features/level-test/components/test-result';
import { isLevel } from '@/features/level-test/levels';
import { getLatestAttempt } from '@/features/level-test/queries';

export const metadata = { title: 'Your level' };

export default async function Result() {
  const { data, success } = await getLatestAttempt();

  if (!success || !data || !isLevel(data.level)) redirect('/level-test');

  return (
    <TestResult score={data.score} total={data.total} level={data.level} />
  );
}
