'use client';

import { notFound } from 'next/navigation';

import { useDemoData } from '@/features/demo/components/store';
import TestResult from '@/features/level-test/components/test-result';

// The newest attempt, which is the one just taken
export default function DemoLevelTestResult() {
  const [latest] = useDemoData().attempts;

  if (!latest) notFound();

  return (
    <TestResult
      score={latest.score}
      total={latest.total}
      level={latest.level}
    />
  );
}
