'use client';

import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useDerslyActions } from '@/features/app/actions-context';
import { useAppRouter } from '@/features/app/app-mode';
import { saveProgress, useSavedProgress } from '@/features/level-test/progress';
import { cn } from '@/lib/utils';

interface Props {
  quizId: string;
  questions: TestQuestion[];
  // Where this student's answers are kept on the phone
  storageKey: string;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Long enough to see the choice land, short enough not to wait for it
const ADVANCE_DELAY = 300;

// Each question has its own address (?q=12), so the phone's back gesture
// steps back one question instead of leaving the test.
function goToQuestion(number: number, mode: 'push' | 'replace') {
  const url = `?q=${number}`;
  const state = { levelTestStep: number };

  if (mode === 'push') window.history.pushState(state, '', url);
  else window.history.replaceState(state, '', url);
}

export default function QuestionsScreen({
  quizId,
  questions,
  storageKey,
}: Props) {
  // Real or demo, the action and the result page come from the app mode
  const { submitAttempt } = useDerslyActions();
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIndex = useRef<number | null>(null);

  const saved = useSavedProgress(storageKey);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [shownIndex, setShownIndex] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Saved answers for this test only, and only for questions it still has
  const answers: Record<string, string> = {};
  if (saved && saved.quizId === quizId) {
    for (const question of questions) {
      const optionId = saved.answers[question.id];
      if (optionId) answers[question.id] = optionId;
    }
  }

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const firstUnanswered = questions.findIndex((q) => !answers[q.id]);
  const allAnswered = firstUnanswered === -1;

  // The question in the address, never further than the first one left
  // unanswered, so nobody can skip ahead by editing the link
  const furthest = allAnswered ? total - 1 : firstUnanswered;
  const requested = Number(searchParams.get('q')) - 1;
  const index = Number.isInteger(requested)
    ? Math.min(Math.max(requested, 0), furthest)
    : furthest;

  // Slide the way the student is going, whether they used the buttons or
  // the phone's back gesture
  if (saved !== undefined && shownIndex !== index) {
    if (shownIndex !== null) {
      setDirection(index > shownIndex ? 'forward' : 'back');
    }
    setShownIndex(index);
  }

  const question = questions[index] as TestQuestion | undefined;
  const chosen = question ? (answers[question.id] ?? null) : null;
  const isLast = index === total - 1;

  // Coming back to a test left half done: say so once, on arrival
  const [arrived, setArrived] = useState(false);
  const [resumedWith, setResumedWith] = useState(0);

  if (saved !== undefined && !arrived) {
    setArrived(true);
    setResumedWith(searchParams.get('q') ? 0 : answeredCount);
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // Keep the address in step with the question on screen, and move focus to
  // the new question so screen readers read it out. Stops once the test is
  // finished: rewriting the address then would cancel the move to the result.
  useEffect(() => {
    if (saved === undefined || finished) return;

    if (searchParams.get('q') !== String(index + 1)) {
      goToQuestion(index + 1, 'replace');
    }

    if (lastIndex.current !== null && lastIndex.current !== index) {
      headingRef.current?.focus({ preventScroll: true });
      if (window.scrollY > 0) window.scrollTo({ top: 0 });
    }

    lastIndex.current = index;
  }, [index, saved, searchParams, finished]);

  if (!question) {
    return (
      <p className="mx-auto w-full max-w-lg text-base text-muted-foreground">
        The test has no questions yet. Ask your teacher.
      </p>
    );
  }

  if (finished) {
    return (
      <p
        role="status"
        className="mx-auto flex min-h-[70svh] w-full max-w-lg items-center justify-center gap-2 text-base text-muted-foreground"
      >
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Working out your level
      </p>
    );
  }

  // The page is rendered on the server, which cannot see saved answers.
  // Wait one moment for them instead of flashing question 1.
  if (saved === undefined) {
    return (
      <div
        aria-busy
        className="mx-auto min-h-[70svh] w-full max-w-lg"
        role="status"
      >
        <span className="sr-only">Loading your answers</span>
      </div>
    );
  }

  const currentId = question.id;

  function handleSelect(optionId: string) {
    if (advancing || pending) return;

    setSubmitError(null);
    saveProgress(storageKey, {
      quizId,
      answers: { ...answers, [currentId]: optionId },
    });

    if (isLast) return;

    setAdvancing(true);
    timer.current = setTimeout(() => {
      setAdvancing(false);
      goToQuestion(index + 2, 'push');
    }, ADVANCE_DELAY);
  }

  function handleNext() {
    goToQuestion(index + 2, 'push');
  }

  function handleBack() {
    if (index === 0) return;

    // Step back through the history this test added, so the phone's own
    // back gesture and this button stay in agreement
    const state = window.history.state as { levelTestStep?: number } | null;
    if (state?.levelTestStep === index + 1 && index > 0) {
      window.history.back();
    } else {
      goToQuestion(index, 'replace');
    }
  }

  async function handleFinish() {
    if (!allAnswered || pending) return;

    setPending(true);
    setSubmitError(null);

    const result = await submitAttempt({
      quizId,
      answers: questions.map((q) => ({
        questionId: q.id,
        optionId: answers[q.id],
      })),
    });

    if (!result.success) {
      setPending(false);
      setSubmitError(
        'Your level could not be saved. Your answers are kept, so try again.',
      );
      return;
    }

    // Saved for good now, so the copy on the phone can go
    setFinished(true);
    saveProgress(storageKey, null);
    router.replace('/level-test/result');
  }

  return (
    <div className="mx-auto flex min-h-[70svh] w-full max-w-lg flex-col">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={index === 0 || pending}
          aria-label="Previous question"
          className="-ml-2.5 flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-muted-foreground transition-[scale,color,background-color] duration-150 ease-out select-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.94] disabled:pointer-events-none disabled:opacity-0"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </button>

        <div
          role="progressbar"
          aria-label="Answered"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={answeredCount}
          aria-valuetext={`${answeredCount} of ${total} answered`}
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full origin-left rounded-full bg-primary transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${answeredCount / total})` }}
          />
        </div>

        <p className="shrink-0 text-sm font-medium text-muted-foreground tabular-nums">
          <span className="sr-only">Question </span>
          <span className="text-foreground">{index + 1}</span> of {total}
        </p>
      </div>

      {resumedWith > 0 && index === firstUnanswered && (
        <p role="status" className="mt-6 text-[15px] text-muted-foreground">
          Welcome back. Your first {resumedWith}{' '}
          {resumedWith === 1 ? 'answer is' : 'answers are'} saved.
        </p>
      )}

      {/* The key restarts the entrance on every question. It slides in from
          the side the student is heading. Reduced motion is handled in
          globals.css. */}
      <div
        key={question.id}
        className={cn(
          'mt-10 flex flex-1 animate-in flex-col duration-200 ease-out fade-in-0',
          direction === 'forward'
            ? 'slide-in-from-right-4'
            : 'slide-in-from-left-4',
        )}
      >
        <h1
          ref={headingRef}
          id="question-prompt"
          tabIndex={-1}
          className="font-serif text-3xl leading-tight font-medium tracking-tight text-balance wrap-break-word text-foreground outline-none sm:text-4xl"
        >
          {question.prompt}
        </h1>

        <div
          role="group"
          aria-labelledby="question-prompt"
          className="mt-8 flex flex-col gap-3"
        >
          {question.options.map((option, optionIndex) => {
            const isChosen = chosen === option.id;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isChosen}
                disabled={pending}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  'flex min-h-15 w-full touch-manipulation items-center gap-4 rounded-2xl border px-5 py-3.5 text-left select-none',
                  'transition-[scale,background-color,border-color,color] duration-150 ease-out active:scale-[0.98]',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
                  'disabled:cursor-default',
                  isChosen
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-input-border',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'w-4 shrink-0 font-mono text-sm',
                    isChosen
                      ? 'text-primary-foreground/80'
                      : 'text-muted-foreground',
                  )}
                >
                  {LETTERS[optionIndex]}
                </span>
                <span className="min-w-0 text-lg leading-snug font-medium wrap-break-word">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-10">
          {submitError && (
            <p
              role="alert"
              className="flex gap-3 rounded-xl bg-destructive-subtle px-4 py-3 text-[15px] leading-snug text-destructive-subtle-foreground"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {submitError}
            </p>
          )}

          {isLast && allAnswered ? (
            <button
              type="button"
              onClick={handleFinish}
              disabled={pending}
              className="flex h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.97] disabled:opacity-70"
            >
              {pending && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {pending ? 'Working out your level' : 'See my level'}
            </button>
          ) : (
            chosen &&
            !advancing && (
              // Back on a question already answered: carry on without
              // changing it
              <button
                type="button"
                onClick={handleNext}
                className="flex h-12 w-full touch-manipulation items-center justify-center rounded-xl border border-input-border px-6 text-base font-semibold text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
              >
                Next question
              </button>
            )
          )}

          <p className="text-center text-sm text-muted-foreground">
            Your answers are saved as you go.
          </p>
        </div>
      </div>
    </div>
  );
}
