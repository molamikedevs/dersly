import { Clock, ListChecks } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { requireStudent } from '@/features/auth/guard';

export default async function Page() {
  const profile = await requireStudent();
  const isRetake = Boolean(profile.level);

  return (
    <div className="mx-auto max-w-lg pb-16 pt-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {isRetake ? 'Check your level again' : 'Find your English level'}
      </h1>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {isRetake
          ? `Your level is currently ${profile.level}. Take the test again to see how far you have come.`
          : 'Answer thirty questions and we will tell you which level suits you best.'}
      </p>

      <ul className="mt-8 flex flex-col gap-3 text-left">
        <li className="flex items-center gap-3 rounded-lg bg-card p-4 shadow-sm">
          <ListChecks
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <span className="text-sm text-foreground">
            Thirty questions, easy to hard
          </span>
        </li>
        <li className="flex items-center gap-3 rounded-lg bg-card p-4 shadow-sm">
          <Clock
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <span className="text-sm text-foreground">
            About ten minutes, no time limit
          </span>
        </li>
      </ul>

      <p className="mt-6 text-sm text-muted-foreground">
        Answer on your own. A guess is fine, but do not look anything up.
      </p>

      <Button className="mt-8 h-12 w-full">
        <Link href="/level-test/questions">
          {isRetake ? 'Start again' : 'Start the test'}
        </Link>
      </Button>
    </div>
  );
}
