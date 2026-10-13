'use client';

import { DEMO_QUIZ } from '@/features/demo/data/level-test';
import { DEMO_TEST_KEY } from '@/features/demo/selectors';
import QuestionsScreen from '@/features/level-test/components/questions-screen';

// A short invented test. Submitting scores it in the browser and saves the
// result to the demo store only.
export default function DemoLevelTestQuestions() {
  return (
    <QuestionsScreen
      quizId={DEMO_QUIZ.quizId}
      questions={DEMO_QUIZ.questions}
      storageKey={DEMO_TEST_KEY}
    />
  );
}
