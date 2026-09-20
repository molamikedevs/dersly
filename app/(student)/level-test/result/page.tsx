import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getLatestAttempt } from '@/features/level-test/queries';

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
    <div className="mx-auto max-w-lg pb-16 pt-8 text-center">
      <p className="text-sm text-muted-foreground">Your level is</p>

      <h1 className="mt-2 text-4xl font-semibold capitalize tracking-tight text-foreground">
        {level}
      </h1>

      <p className="mt-3 font-mono text-sm text-muted-foreground">
        {score} out of {total} correct
      </p>

      <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {BLURB[level]}
      </p>

      <div className="mt-10 flex flex-col gap-3">
        <Button className="h-12">
          <Link href={`/materials?filter=${level}`}>
            See material for your level
          </Link>
        </Button>

        <Button variant="ghost" className="h-12">
          <Link href="/">Back to home</Link>
        </Button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Your teacher can see this result. You can take the test again any time.
      </p>
    </div>
  );
}
