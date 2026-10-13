import { Check } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import { LEVEL_ORDER, LEVELS, type Level } from '@/features/level-test/levels';
import { cn } from '@/lib/utils';

// The level test result, without the fetching. The page passes the latest
// attempt, the demo passes the invented student's.

type Props = {
  score: number;
  total: number;
  level: Level;
};

export default function TestResult({ score, total, level }: Props) {
  const copy = LEVELS[level];
  const position = LEVEL_ORDER.indexOf(level);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col pb-10">
      <p className="text-base text-muted-foreground">Your level is</p>
      <h1 className="mt-1 font-serif text-6xl leading-none font-medium tracking-tight wrap-break-word text-foreground sm:text-7xl">
        {copy.name}
      </h1>

      <p className="mt-5 text-base leading-relaxed text-foreground">
        {copy.summary}
      </p>
      <p className="mt-2 text-[15px] text-muted-foreground tabular-nums">
        {score} of {total} correct. Roughly {copy.cefr} on the European scale
        (CEFR).
      </p>

      {/* Where this level sits among the four, so the word means something */}
      <ol
        aria-label="The four levels"
        className="mt-8 grid grid-cols-4 gap-1.5"
      >
        {LEVEL_ORDER.map((name, index) => (
          <li key={name} className="flex min-w-0 flex-col gap-2">
            <span
              aria-hidden
              className={cn(
                'h-1.5 rounded-full',
                index <= position ? 'bg-primary' : 'bg-muted',
              )}
            />
            <span
              className={cn(
                'truncate text-xs',
                index === position
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {LEVELS[name].name}
              {index === position && <span className="sr-only"> (you)</span>}
            </span>
          </li>
        ))}
      </ol>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
          What you can do
        </h2>
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {copy.canDo.map((item) => (
            <li key={item} className="flex gap-3 py-3.5">
              <Check
                className="mt-1 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <span className="text-base leading-snug text-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 flex flex-col gap-2">
        <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
          What to work on next
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          {copy.next}
        </p>
      </section>

      <div className="mt-10 flex flex-col gap-2">
        <AppLink
          href="/materials"
          className="flex h-12 w-full touch-manipulation items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.97]"
        >
          See the materials
        </AppLink>
        <AppLink
          href="/"
          className="flex h-12 w-full touch-manipulation items-center justify-center rounded-xl px-6 text-base font-semibold text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
        >
          Back to home
        </AppLink>
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        Your teacher sees this result. You can take the test again any time.
      </p>
    </div>
  );
}
