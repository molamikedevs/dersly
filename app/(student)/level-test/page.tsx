import { Clock, ListChecks } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { requireStudent } from '@/features/auth/guard';
import { cn } from '@/lib/utils';

export default async function Page() {
  const profile = await requireStudent();
  const isRetake = Boolean(profile.level);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center pb-16 text-center">
      <span
        aria-hidden
        className="flex size-14 items-center justify-center rounded-2xl bg-warning-subtle text-warning-subtle-foreground"
      >
        <ListChecks className="size-6" />
      </span>

      <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
        {isRetake ? 'Check your level again.' : 'Find your English level.'}
      </h1>

      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        {isRetake ? (
          <>
            Your level is currently{' '}
            <span className="font-semibold capitalize text-foreground">
              {profile.level}
            </span>
            . Take the test again to see how far you have come.
          </>
        ) : (
          'Answer thirty questions and we will tell you which level suits you best.'
        )}
      </p>

      <ul className="mt-10 w-full divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card text-left">
        <li className="flex items-center gap-4 px-5 py-4">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          >
            <ListChecks className="size-4" />
          </span>
          <span className="text-[15px] font-medium text-foreground">
            Thirty questions, easy to hard
          </span>
        </li>
        <li className="flex items-center gap-4 px-5 py-4">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          >
            <Clock className="size-4" />
          </span>
          <span className="text-[15px] font-medium text-foreground">
            About ten minutes, no time limit
          </span>
        </li>
      </ul>

      <p className="mt-6 text-sm text-muted-foreground">
        Answer on your own. A guess is fine, but do not look anything up.
      </p>

      <Link
        href="/level-test/questions"
        className={cn(
          buttonVariants(),
          'mt-8 h-12 w-full rounded-xl text-[15px] font-semibold',
        )}
      >
        {isRetake ? 'Start again' : 'Start the test'}
      </Link>
    </div>
  );
}
