'use client';

import { useDemoData } from '@/features/demo/components/store';
import { DEMO_QUIZ } from '@/features/demo/data/level-test';
import { DEMO_TEST_KEY, viewer } from '@/features/demo/selectors';
import TestIntro from '@/features/level-test/components/test-intro';

export default function DemoLevelTest() {
  return (
    <TestIntro
      level={viewer(useDemoData()).level}
      questionCount={DEMO_QUIZ.questions.length}
      storageKey={DEMO_TEST_KEY}
    />
  );
}
