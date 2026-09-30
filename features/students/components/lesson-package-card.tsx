import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { cn } from '@/lib/utils';

export default function LessonPackageCard({
  lessonsDone,
}: {
  lessonsDone: number;
}) {
  if (lessonsDone >= LESSONS_PER_PACKAGE) {
    return (
      <section
        role="status"
        className="flex flex-col gap-1 rounded-2xl border border-warning/40 bg-warning/10 px-6 py-5"
      >
        <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
          Package complete
        </h2>
        <p className="text-sm text-foreground">
          You have finished all {LESSONS_PER_PACKAGE} lessons. Payment is due.
        </p>
      </section>
    );
  }

  const label =
    lessonsDone === 0
      ? 'New package'
      : `Lesson ${lessonsDone} of ${LESSONS_PER_PACKAGE}`;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-6 py-5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-muted-foreground">
          Your lessons
        </span>
        <span className="font-serif text-2xl font-medium tracking-tight text-foreground">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2" aria-hidden>
        {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => (
          <span
            key={index}
            className={cn(
              'size-2.5 rounded-full',
              index < lessonsDone ? 'bg-primary' : 'bg-muted',
            )}
          />
        ))}
      </div>
    </section>
  );
}
