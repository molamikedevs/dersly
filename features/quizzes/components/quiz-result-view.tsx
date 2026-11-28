import { Check, X } from 'lucide-react';

import BackLink from '@/components/common/back-link';
import { AppLink } from '@/features/app/app-mode';
import {
  calculateCorrectCount,
  QUIZ_MAX_SCORE,
} from '@/lib/validation/quiz.schema';

type Props = {
  quiz: QuizWithQuestions;
  backHref: string;
  backLabel: string;
};

export default function QuizResultView({ quiz, backHref, backLabel }: Props) {
  const answers = quiz.attempt?.answers ?? {};
  const score = quiz.attempt?.score ?? 0;
  const correctCount = calculateCorrectCount(score, quiz.questions.length);

  return (
    <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-7 pb-16">
      <BackLink href={backHref} label={backLabel} />

      <section className="surface-card flex flex-col gap-3 p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
          {quiz.title}
        </p>

        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground tabular-nums sm:text-5xl">
            {score} / {QUIZ_MAX_SCORE}
          </h1>
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            {correctCount} of {quiz.questions.length} correct
          </span>
        </div>
      </section>

      <ol className="surface-card flex flex-col overflow-hidden">
        {quiz.questions.map((q, index) => {
          const picked = (answers[q.id] ?? '').trim();
          const isRight =
            picked.toLowerCase() === q.correctAnswer.trim().toLowerCase();

          return (
            <li
              key={q.id}
              className="surface-row flex items-start gap-3.5 px-5 py-4 sm:px-6"
            >
              <span
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${
                  isRight
                    ? 'bg-primary/15 text-primary'
                    : 'bg-destructive/15 text-destructive'
                }`}
              >
                {isRight ? (
                  <Check className="size-3.5" aria-hidden />
                ) : (
                  <X className="size-3.5" aria-hidden />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground tabular-nums">
                  Question {index + 1}
                </p>
                <p className="mt-0.5 font-serif text-base font-medium text-foreground">
                  {q.prompt.replace('___', q.correctAnswer)}
                </p>

                {!isRight && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Answered:{' '}
                    <span className="font-medium text-destructive">
                      {picked || 'No answer'}
                    </span>{' '}
                    · Correct:{' '}
                    <span className="font-semibold text-primary">
                      {q.correctAnswer}
                    </span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <AppLink
        href={backHref}
        className="inline-flex h-11 items-center justify-center self-start rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.22),0_1px_2px_0_oklch(0_0_0/0.35)] hover:bg-primary/90"
      >
        {backLabel}
      </AppLink>
    </div>
  );
}
