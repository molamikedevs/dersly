import {
  LESSONS_PER_PACKAGE,
  PAYMENT_SOON,
} from '@/features/classes/constants';
import { cn } from '@/lib/utils';

type Props = {
  studentName: string;
  lessonsDone: number;
  nextLesson?: string | null;
};

export default function LessonLog({
  studentName,
  lessonsDone,
  nextLesson,
}: Props) {
  const done = Math.min(Math.max(lessonsDone, 0), LESSONS_PER_PACKAGE);
  const isComplete = done >= LESSONS_PER_PACKAGE;
  const isLastLesson = done === PAYMENT_SOON;

  const caption = isComplete
    ? `Package complete. ${studentName} sees that payment is due.`
    : isLastLesson
      ? `Marking lesson ${LESSONS_PER_PACKAGE} completes the package. ${studentName} will see that payment is due.`
      : done === 0
        ? `No lessons marked yet in this ${LESSONS_PER_PACKAGE}-lesson package.`
        : `${done} of ${LESSONS_PER_PACKAGE} lessons completed in this package.`;

  return (
    <aside aria-labelledby="lesson-log-heading" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id="lesson-log-heading"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Lesson log
        </h2>
      </div>

      <ol className="surface-card flex flex-col overflow-hidden">
        {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => {
          const step = index + 1;
          const completed = index < done;
          const isNext = index === done;

          return (
            <li
              key={step}
              className="surface-row flex items-center justify-between gap-3 px-4 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold tabular-nums',
                    completed
                      ? isComplete
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-primary text-primary-foreground'
                      : isNext
                        ? 'border border-primary/50 bg-primary/15 text-primary'
                        : 'border border-border-subtle bg-secondary/70 text-muted-foreground',
                  )}
                >
                  {step}
                </span>

                <span
                  className={cn(
                    'truncate text-xs font-medium sm:text-sm',
                    completed || isNext
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {isNext && nextLesson ? nextLesson : `Lesson ${step}`}
                </span>
              </div>

              <span
                className={cn(
                  'shrink-0 text-xs tabular-nums',
                  completed
                    ? 'font-medium text-muted-foreground'
                    : isNext
                      ? 'font-semibold text-primary'
                      : 'text-muted-foreground/65',
                )}
              >
                {completed ? 'Done' : isNext ? 'Not marked' : 'Upcoming'}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="text-xs leading-relaxed text-muted-foreground">{caption}</p>
    </aside>
  );
}
