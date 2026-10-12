import { requireStudent } from '@/features/auth/guard';
import TestStart from '@/features/level-test/components/test-start';
import { isLevel, LEVELS } from '@/features/level-test/levels';
import { progressKey } from '@/features/level-test/storage-key';

export const metadata = { title: 'Level test' };

const STEPS = [
  'Thirty questions, from easy to hard.',
  'Pick one answer for each. If you are not sure, guess.',
  'Your answers are saved as you go, so you can stop and come back.',
];

export default async function Page() {
  const profile = await requireStudent();
  const current = isLevel(profile.level) ? LEVELS[profile.level] : null;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col pb-10">
      <h1 className="font-serif text-4xl leading-tight font-medium tracking-tight text-balance text-foreground sm:text-5xl">
        {current ? 'Check your level again.' : 'Find your English level.'}
      </h1>

      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        {current ? (
          <>
            Your level is{' '}
            <span className="font-semibold text-foreground">
              {current.name}
            </span>
            . Take the test again to see how far you have come.
          </>
        ) : (
          'About ten minutes, with no time limit. At the end you see your level and what it means.'
        )}
      </p>

      <ol className="mt-8 flex flex-col divide-y divide-border border-y border-border">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-4 py-4">
            <span
              aria-hidden
              className="w-5 shrink-0 font-serif text-lg leading-snug font-medium text-primary tabular-nums"
            >
              {index + 1}
            </span>
            <span className="text-base leading-snug text-foreground">
              {step}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
        Answer on your own, without a dictionary or translator. A guess tells
        your teacher more than a looked-up answer.
      </p>

      <div className="mt-8">
        <TestStart
          storageKey={progressKey(profile.id)}
          isRetake={Boolean(current)}
        />
      </div>
    </div>
  );
}
