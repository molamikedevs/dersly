import { requireStudent } from '@/features/auth/guard';
import TestIntro from '@/features/level-test/components/test-intro';
import { progressKey } from '@/features/level-test/storage-key';

export const metadata = { title: 'Level test' };

export default async function Page() {
  const profile = await requireStudent();

  return (
    <TestIntro
      level={profile.level}
      questionCount={30}
      storageKey={progressKey(profile.id)}
    />
  );
}
