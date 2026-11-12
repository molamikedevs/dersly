'use client';

import { ArrowRight, Check, Loader2, X } from 'lucide-react';
import { useState, useTransition, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDerslyActions } from '@/features/app/actions-context';
import { cn } from '@/lib/utils';
import { MISTAKE_MAX } from '@/lib/validation/mistake.schema';
import { WORD_MAX } from '@/lib/validation/vocabulary.schema';

// Last week's word check and the open mistakes, as one card that shows one
// thing at a time. The student answers, sees the answer, and moves on, so
// Home never fills up with input boxes.

type Props = {
  check: CheckWord[];
  mistakes: OpenMistake[];
};

type Item =
  | { kind: 'word'; id: string; word: CheckWord }
  | { kind: 'mistake'; id: string; mistake: OpenMistake };

const BUTTON =
  'h-12 shrink-0 touch-manipulation gap-2 rounded-xl px-5 text-[15px] font-semibold select-none active:scale-[0.97]';
const INPUT = 'h-12 min-w-0 rounded-xl text-base sm:flex-1 md:text-base';

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

export default function Practice({ check, mistakes }: Props) {
  // The item on screen stays put while its answer shows, even after the
  // page data refreshes underneath it
  const [activeId, setActiveId] = useState<string | null>(null);
  // Mistakes put off with "Still learning" go to the back of the queue
  const [later, setLater] = useState<string[]>([]);
  // A fresh start for an item that comes round again
  const [round, setRound] = useState(0);

  const all: Item[] = [
    ...check.map((word) => ({ kind: 'word' as const, id: word.id, word })),
    ...mistakes.map((mistake) => ({
      kind: 'mistake' as const,
      id: mistake.id,
      mistake,
    })),
  ];

  if (all.length === 0) return null;

  const waiting = all.filter(
    (item) => item.kind === 'mistake' || !item.word.result,
  );
  const queue = [
    ...waiting.filter((item) => !later.includes(item.id)),
    ...waiting.filter((item) => later.includes(item.id)),
  ];
  const active = all.find((item) => item.id === activeId) ?? queue[0] ?? null;
  const left = queue.filter((item) => item.id !== active?.id).length;

  function next() {
    setActiveId(null);
  }

  function putOff(id: string) {
    setLater((current) => [...current.filter((item) => item !== id), id]);
    setRound((current) => current + 1);
    setActiveId(null);
  }

  return (
    <section id="practice" className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
          Practice
        </h2>
        {active && (
          <p className="text-sm text-muted-foreground tabular-nums">
            {left === 0 ? 'Last one' : `${left} more after this`}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        {!active ? (
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success-subtle text-success-subtle-foreground">
              <Check className="size-4" aria-hidden />
            </span>
            <p className="text-[15px] text-foreground">
              All done for now. New practice comes after your next lesson.
            </p>
          </div>
        ) : active.kind === 'word' ? (
          <WordCard
            key={`${active.id}-${round}`}
            item={active.word}
            onAnswered={() => setActiveId(active.id)}
            onNext={next}
          />
        ) : (
          <MistakeCard
            key={`${active.id}-${round}`}
            item={active.mistake}
            onAnswered={() => setActiveId(active.id)}
            onLater={() => putOff(active.id)}
            onDone={next}
          />
        )}
      </div>
    </section>
  );
}

function Kind({ children }: { children: string }) {
  return <p className="text-sm font-medium text-primary">{children}</p>;
}

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} role="alert" className="text-sm font-medium text-destructive">
      {children}
    </p>
  );
}

function WordCard({
  item,
  onAnswered,
  onNext,
}: {
  item: CheckWord;
  onAnswered: () => void;
  onNext: () => void;
}) {
  const { checkWord } = useDerslyActions();
  const [answer, setAnswer] = useState('');
  const [local, setLocal] = useState<WordCheck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const inputId = `practice-word-${item.id}`;
  const result = item.result ?? local;

  function handleCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!answer.trim()) {
      setError('Write the word first.');
      return;
    }

    startTransition(async () => {
      const response = await checkWord({ wordId: item.id, answer });

      if (!response.success || !response.data) {
        setError('Could not check your answer. Try again.');
        return;
      }

      setLocal(response.data);
      onAnswered();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Kind>Word check</Kind>
        <p className="text-lg leading-snug font-semibold break-words text-foreground">
          {item.meaning}
        </p>
        {item.example && (
          <p className="text-[15px] break-words text-muted-foreground">
            {item.example}
          </p>
        )}
      </div>

      {result ? (
        <div className="flex flex-col gap-4" aria-live="polite">
          <p
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-4 py-3 text-[15px]',
              result.right
                ? 'bg-success-subtle text-success-subtle-foreground'
                : 'bg-destructive-subtle text-destructive-subtle-foreground',
            )}
          >
            {result.right ? (
              <Check className="size-4 shrink-0" aria-hidden />
            ) : (
              <X className="size-4 shrink-0" aria-hidden />
            )}
            <span className="min-w-0 break-words">
              {result.right ? 'Right: ' : 'The word was '}
              <span className="font-semibold">{result.word}</span>
            </span>
          </p>
          <Button
            type="button"
            onClick={onNext}
            className={cn(BUTTON, 'sm:self-start')}
          >
            Next
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleCheck}
          noValidate
          className="flex flex-col gap-2 sm:flex-row"
        >
          <label htmlFor={inputId} className="sr-only">
            The word that means: {item.meaning}
          </label>
          <Input
            id={inputId}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            maxLength={WORD_MAX}
            placeholder="Type the word"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="done"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={INPUT}
          />
          <Button type="submit" disabled={isPending} className={BUTTON}>
            {isPending && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            Check
          </Button>
        </form>
      )}

      {error && <ErrorLine id={`${inputId}-error`}>{error}</ErrorLine>}
    </div>
  );
}

function MistakeCard({
  item,
  onAnswered,
  onLater,
  onDone,
}: {
  item: OpenMistake;
  onAnswered: () => void;
  onLater: () => void;
  onDone: () => void;
}) {
  const { submitMistakeFix, setMistakeFixed } = useDerslyActions();
  const [attempt, setAttempt] = useState('');
  const [answer, setAnswer] = useState<MistakeAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const inputId = `practice-mistake-${item.id}`;

  function handleCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!attempt.trim()) {
      setError('Write your fix first.');
      return;
    }

    startTransition(async () => {
      const result = await submitMistakeFix({ mistakeId: item.id, attempt });

      if (!result.success || !result.data) {
        setError('Could not check your fix. Try again.');
        return;
      }

      setAnswer(result.data);
      onAnswered();
    });
  }

  function handleGotIt() {
    setError(null);

    startTransition(async () => {
      const result = await setMistakeFixed({ mistakeId: item.id, fixed: true });

      if (!result.success) {
        setError('Could not save. Try again.');
        return;
      }

      onDone();
    });
  }

  const right = answer ? sameSentence(attempt, answer.correct) : false;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Kind>Fix your mistake</Kind>
        <p className="text-sm text-muted-foreground">You said</p>
        <p className="text-lg leading-snug font-semibold break-words text-foreground">
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
            className={INPUT}
          />
          <Button type="submit" disabled={isPending} className={BUTTON}>
            {isPending && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            Check
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-4" aria-live="polite">
          <dl className="flex flex-col gap-3 rounded-xl bg-muted/60 px-4 py-3">
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
              className={BUTTON}
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
              onClick={onLater}
              disabled={isPending}
              className={BUTTON}
            >
              Still learning
            </Button>
          </div>
        </div>
      )}

      {error && <ErrorLine id={`${inputId}-error`}>{error}</ErrorLine>}
    </div>
  );
}
