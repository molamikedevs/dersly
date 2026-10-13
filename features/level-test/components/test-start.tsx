'use client';

import { AppLink } from '@/features/app/app-mode';
import { saveProgress, useSavedProgress } from '@/features/level-test/progress';

type Props = {
  storageKey: string;
  isRetake: boolean;
};

const PRIMARY =
  'flex h-12 w-full touch-manipulation items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.97]';

const SECONDARY =
  'flex h-12 w-full touch-manipulation items-center justify-center rounded-xl px-6 text-base font-semibold text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]';

// Picks up a test left half done, so a closed tab never means starting over
export default function TestStart({ storageKey, isRetake }: Props) {
  const saved = useSavedProgress(storageKey);
  const answered = saved ? Object.keys(saved.answers).length : 0;

  if (answered > 0) {
    return (
      <div className="flex flex-col gap-2">
        <AppLink href="/level-test/questions" className={PRIMARY}>
          Carry on from question {answered + 1}
        </AppLink>
        <AppLink
          href="/level-test/questions?q=1"
          onClick={() => saveProgress(storageKey, null)}
          className={SECONDARY}
        >
          Start again from the beginning
        </AppLink>
      </div>
    );
  }

  return (
    <AppLink href="/level-test/questions" className={PRIMARY}>
      {isRetake ? 'Take the test again' : 'Start the test'}
    </AppLink>
  );
}
