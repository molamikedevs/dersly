'use client';

import { CheckCircle2, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { AppLink } from '@/features/app/app-mode';
import { deleteQuiz } from '@/features/quizzes/actions';
import { formatDate } from '@/lib/utils';
import { QUIZ_MAX_SCORE } from '@/lib/validation/quiz.schema';

type Props = {
  classId: string;
  quizzes: QuizSummary[];
};

export default function QuizzesSection({ classId, quizzes }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(quizId: string) {
    startTransition(async () => {
      const res = await deleteQuiz(quizId);
      if (!res.success) {
        toast.error(res.error?.message ?? 'Could not delete quiz.');
        return;
      }
      toast.success('Quiz deleted');
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Class quizzes · {QUIZ_MAX_SCORE} pts
        </p>

        <AppLink
          href={`/dashboard/classes/${classId}/quizzes/new`}
          className="inline-flex h-10 shrink-0 touch-manipulation items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.22),0_1px_2px_0_oklch(0_0_0/0.35)] transition-[scale,background-color] duration-150 ease-out hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
        >
          <Plus className="size-4" aria-hidden />
          New quiz
        </AppLink>
      </div>

      {quizzes.length === 0 ? (
        <div className="surface-card flex flex-col items-start gap-3 p-6 sm:p-8">
          <p className="font-serif text-lg font-medium text-foreground">
            No quizzes yet
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Create a check-up quiz from your student&apos;s recent words and
            mistakes.
          </p>
        </div>
      ) : (
        <ul className="surface-card flex flex-col overflow-hidden">
          {quizzes.map((quiz) => {
            const completed = Boolean(quiz.latestAttempt?.submittedAt);

            return (
              <li
                key={quiz.id}
                className="surface-row flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6"
              >
                <div className="min-w-0 flex-1 basis-56">
                  <div className="flex flex-wrap items-center gap-2">
                    <AppLink
                      href={
                        completed
                          ? `/dashboard/classes/${classId}/quizzes/${quiz.id}`
                          : `/dashboard/classes/${classId}/quizzes/${quiz.id}/edit`
                      }
                      className="font-serif text-base font-medium tracking-tight text-foreground transition-colors hover:text-primary sm:text-[17px]"
                    >
                      {quiz.title}
                    </AppLink>

                    {completed ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary tabular-nums">
                        <CheckCircle2 className="size-3" aria-hidden />
                        {quiz.latestAttempt!.score} / {QUIZ_MAX_SCORE}
                      </span>
                    ) : quiz.isPublished ? (
                      <span className="inline-flex items-center rounded-full border border-border-subtle bg-secondary px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-border-subtle bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {quiz.questionCount}{' '}
                    {quiz.questionCount === 1 ? 'question' : 'questions'} ·{' '}
                    {formatDate(quiz.createdAt, 'long')}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {completed ? (
                    <AppLink
                      href={`/dashboard/classes/${classId}/quizzes/${quiz.id}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input-border/80 bg-secondary/75 px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/45 hover:bg-accent"
                    >
                      <FileText className="size-3.5 text-primary" aria-hidden />
                      Result
                    </AppLink>
                  ) : (
                    <AppLink
                      href={`/dashboard/classes/${classId}/quizzes/${quiz.id}/edit`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input-border/80 bg-secondary/75 px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/45 hover:bg-accent"
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      Edit
                    </AppLink>
                  )}

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(quiz.id)}
                    aria-label={`Delete ${quiz.title}`}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-border-subtle bg-secondary/50 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
