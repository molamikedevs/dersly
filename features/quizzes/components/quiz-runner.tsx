'use client';

import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { AppLink } from '@/features/app/app-mode';
import { saveQuizProgress, submitQuiz } from '@/features/quizzes/actions';
import { cn } from '@/lib/utils';

type Props = {
  quiz: QuizWithQuestions;
};

function deterministicShuffle(items: string[], seed: string) {
  const copy = [...items];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  for (let i = copy.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) | 0;
    const j = Math.abs(hash) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizRunner({ quiz }: Props) {
  const router = useRouter();
  const [isSubmitting, startSubmit] = useTransition();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(
    () => quiz.attempt?.answers ?? {},
  );
  const [dragOver, setDragOver] = useState(false);

  const questions = quiz.questions;
  const current = questions[index];

  const shuffledOptions = useMemo(() => {
    if (!current) return [];
    return current.kind === 'word_bank'
      ? deterministicShuffle(current.options, current.id)
      : current.options;
  }, [current]);

  if (!current) return null;

  const picked = answers[current.id] ?? '';
  const isLast = index === questions.length - 1;
  const answeredCount = questions.filter((q) => Boolean(answers[q.id])).length;

  function selectAnswer(value: string) {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    void saveQuizProgress({ quizId: quiz.id, answers: next });
  }

  function clearAnswer() {
    const next = { ...answers };
    delete next[current.id];
    setAnswers(next);
    void saveQuizProgress({ quizId: quiz.id, answers: next });
  }

  function handleFinish() {
    startSubmit(async () => {
      const res = await submitQuiz({ quizId: quiz.id, answers });
      if (!res.success) {
        toast.error(res.error?.message ?? 'Could not submit quiz.');
        return;
      }
      router.push(`/quiz/${quiz.id}/result`);
      router.refresh();
    });
  }

  const parts = current.prompt.split('___');

  return (
    <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-8 pb-20">
      {/* Top progress header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <AppLink
            href="/"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Save and exit
          </AppLink>

          <span className="text-xs font-semibold text-muted-foreground tabular-nums">
            {index + 1} of {questions.length}
          </span>
        </div>

        <div className="flex gap-1.5" aria-hidden>
          {questions.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setIndex(idx)}
              aria-label={`Question ${idx + 1}`}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                idx === index
                  ? 'bg-primary'
                  : answers[q.id]
                    ? 'bg-primary/45'
                    : 'bg-border',
              )}
            />
          ))}
        </div>
      </div>

      {/* Question body */}
      <div className="flex flex-col gap-7 pt-2">
        {current.kind === 'word_bank' ? (
          <>
            <div className="font-serif text-2xl leading-[1.45] font-medium tracking-tight text-foreground sm:text-3xl">
              {parts[0]}
              <button
                type="button"
                onClick={() => picked && clearAnswer()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const word = e.dataTransfer.getData('text/plain');
                  if (word) selectAnswer(word);
                }}
                className={cn(
                  'mx-1.5 inline-flex min-h-10 min-w-28 items-center justify-center rounded-xl border-2 px-3.5 align-baseline font-sans text-base font-semibold transition-all sm:text-lg',
                  picked
                    ? 'border-primary bg-primary/15 text-primary'
                    : dragOver
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-dashed border-border bg-secondary/75 text-muted-foreground',
                )}
              >
                {picked || 'drop word'}
              </button>
              {parts.slice(1).join('___')}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {shuffledOptions.map((word) => {
                const selected = picked === word;

                return (
                  <button
                    key={word}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', word);
                    }}
                    onClick={() =>
                      selected ? clearAnswer() : selectAnswer(word)
                    }
                    className={cn(
                      'inline-flex h-11 cursor-grab touch-manipulation items-center rounded-xl border px-4 text-sm font-semibold transition-all select-none active:scale-[0.97] active:cursor-grabbing',
                      selected
                        ? 'border-primary/40 bg-primary/15 text-primary'
                        : 'border-border-subtle bg-card text-foreground hover:border-primary/45 hover:bg-accent/50',
                    )}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h1 className="font-serif text-2xl leading-[1.3] font-medium tracking-tight text-balance text-foreground sm:text-3xl">
              {current.prompt}
            </h1>

            <div className="flex flex-col gap-3">
              {shuffledOptions.map((option, optIndex) => {
                const letter = String.fromCharCode(65 + optIndex);
                const selected = picked === option;

                return (
                  <button
                    key={`${current.id}-${optIndex}`}
                    type="button"
                    onClick={() => selectAnswer(option)}
                    className={cn(
                      'flex min-h-14 w-full touch-manipulation items-center gap-3.5 rounded-2xl border px-4 py-3 text-left transition-all select-none active:scale-[0.99]',
                      selected
                        ? 'border-primary bg-primary/12 text-foreground shadow-xs'
                        : 'border-border-subtle bg-card text-foreground hover:border-primary/40 hover:bg-accent/35',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors',
                        selected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground',
                      )}
                    >
                      {letter}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-medium sm:text-base">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between gap-4 border-t border-border-subtle pt-5">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Previous
        </button>

        {isLast ? (
          <button
            type="button"
            disabled={isSubmitting || answeredCount === 0}
            onClick={handleFinish}
            className="inline-flex h-11 touch-manipulation items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.22),0_1px_2px_0_oklch(0_0_0/0.35)] transition-[scale,background-color] duration-150 hover:bg-primary/90 active:scale-[0.97] disabled:opacity-50"
          >
            <Check className="size-4" aria-hidden />
            {isSubmitting ? 'Submitting…' : 'Submit quiz'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              setIndex((i) => Math.min(questions.length - 1, i + 1))
            }
            className="inline-flex h-11 touch-manipulation items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.22),0_1px_2px_0_oklch(0_0_0/0.35)] transition-[scale,background-color] duration-150 hover:bg-primary/90 active:scale-[0.97]"
          >
            Next
            <ArrowRight className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
