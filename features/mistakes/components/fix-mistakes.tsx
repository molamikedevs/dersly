'use client';

import { Check, Loader2 } from 'lucide-react';
import { useState, useTransition, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDerslyActions } from '@/features/app/actions-context';
import { MISTAKE_MAX } from '@/lib/validation/mistake.schema';

// The student's open mistakes on their Home page. They see only what they
// said, write it correctly, and get the teacher's version once they have
// tried.

type Props = { data: StudentMistakes };

// Close enough to count as the same sentence: case, spaces, curly quotes
// and the full stop at the end do not matter
function sameSentence(a: string, b: string) {
  const plain = (value: string) =>
    value
      .normalize('NFC')
      .toLocaleLowerCase()
      .replace(/[‘’]/g, "'")
      .replace(/[.!?]+$/, '')
      .replace(/\s+/g, ' ')
      .trim();

  return plain(a) === plain(b);
}

export default function FixMistakes({ data }: Props) {
  const { open, fixedCount } = data;

  if (open.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
          Fix your mistakes
        </h2>
        {fixedCount > 0 && (
          <p className="text-sm text-muted-foreground tabular-nums">
            {fixedCount} fixed so far
          </p>
        )}
      </div>
      <p className="text-[15px] text-muted-foreground">
        From your lessons. Write each sentence the right way.
      </p>

      <ol className="flex flex-col divide-y divide-border border-y border-border">
        {open.map((item) => (
          <MistakeItem key={item.id} item={item} />
        ))}
      </ol>
    </section>
  );
}

function MistakeItem({ item }: { item: OpenMistake }) {
  const { submitMistakeFix, setMistakeFixed } = useDerslyActions();
  const [attempt, setAttempt] = useState('');
  const [answer, setAnswer] = useState<MistakeAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const inputId = `mistake-fix-${item.id}`;

  function handleCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!attempt.trim()) {
      setError('Write your fix first.');
      return;
    }

    startTransition(async () => {
      const result = await submitMistakeFix({
        mistakeId: item.id,
        attempt,
      });

      if (!result.success || !result.data) {
        setError('Could not check your fix. Try again.');
        return;
      }

      setAnswer(result.data);
    });
  }

  function handleGotIt() {
    setError(null);

    startTransition(async () => {
      const result = await setMistakeFixed({ mistakeId: item.id, fixed: true });

      if (!result.success) {
        setError('Could not save. Try again.');
      }
    });
  }

  // Stays open: they try again now, or the next time they open Home
  function handleTryAgain() {
    setAnswer(null);
    setAttempt('');
    setError(null);
  }

  const right = answer ? sameSentence(attempt, answer.correct) : false;

  return (
    <li className="flex flex-col gap-3 py-5">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">You said</p>
        <p className="text-base font-medium break-words text-foreground">
          {item.wrong}
        </p>
      </div>

      {!answer ? (
        <form
          onSubmit={handleCheck}
          noValidate
          className="flex flex-col gap-2 sm:flex-row"
        >
          <label htmlFor={inputId} className="sr-only">
            Your fix for: {item.wrong}
          </label>
          <Input
            id={inputId}
            value={attempt}
            onChange={(event) => setAttempt(event.target.value)}
            maxLength={MISTAKE_MAX}
            placeholder="Write it correctly"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
            spellCheck={false}
            enterKeyHint="done"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className="h-12 min-w-0 rounded-xl text-base sm:flex-1 md:text-base"
          />
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 shrink-0 touch-manipulation gap-2 rounded-xl px-5 text-[15px] font-semibold select-none active:scale-[0.97]"
          >
            {isPending && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            Check
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-3" aria-live="polite">
          <dl className="flex flex-col gap-2 rounded-xl bg-muted/60 px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-muted-foreground">You wrote</dt>
              <dd className="text-[15px] break-words text-foreground">
                {attempt.trim()}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-muted-foreground">
                Your teacher&apos;s version
              </dt>
              <dd className="text-[15px] font-semibold break-words text-foreground">
                {answer.correct}
              </dd>
            </div>
            {answer.tip && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-sm text-muted-foreground">Remember</dt>
                <dd className="text-[15px] break-words text-foreground">
                  {answer.tip}
                </dd>
              </div>
            )}
          </dl>

          <p className="text-[15px] font-medium text-foreground">
            {right
              ? 'You got it right.'
              : 'Compare the two. Did you fix the mistake?'}
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={handleGotIt}
              disabled={isPending}
              className="h-12 touch-manipulation gap-2 rounded-xl px-5 text-[15px] font-semibold select-none active:scale-[0.97]"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Check className="size-4" aria-hidden />
              )}
              Got it
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleTryAgain}
              disabled={isPending}
              className="h-12 touch-manipulation rounded-xl px-5 text-[15px] font-semibold select-none active:scale-[0.97]"
            >
              Still learning
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </li>
  );
}
