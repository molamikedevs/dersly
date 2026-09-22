import Link from 'next/link';
import { redirect } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { getLatestAttempt } from '@/features/level-test/queries';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Your level' };

const BLURB: Record<string, string> = {
  beginner:
    'You know some words and simple sentences. Start with short, slow material and build from there.',
  elementary:
    'You can handle everyday situations. Focus on past tenses and longer conversations.',
  intermediate:
    'You can hold a real conversation. Work on natural phrasing and listening at normal speed.',
  advanced:
    'You are comfortable in English. Push into idioms, formal writing and faster speech.',
};

export default async function Result() {
  const { data, success } = await getLatestAttempt();

  if (!success || !data) redirect('/level-test');

  const { score, total, level } = data;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center pb-16 text-center">
      <section className="flex w-full flex-col items-center rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/75">
          Your level is
        </p>

        <h1 className="mt-3 font-serif text-6xl font-medium capitalize leading-none tracking-tight sm:text-7xl">
          {level}
        </h1>

        <p className="mt-5 rounded-full bg-primary-foreground/15 px-3.5 py-1 font-mono text-sm font-semibold">
          {score} out of {total} correct
        </p>
      </section>

      <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        {BLURB[level]}
      </p>

      <div className="mt-10 flex w-full flex-col gap-3">
        <Link
          href={`/materials?filter=${level}`}
          className={cn(
            buttonVariants(),
            'h-12 rounded-xl text-[15px] font-semibold',
          )}
        >
          See material for your level
        </Link>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'h-12 rounded-xl text-[15px] font-semibold',
          )}
        >
          Back to home
        </Link>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Your teacher can see this result. You can take the test again any time.
      </p>
    </div>
  );
}
