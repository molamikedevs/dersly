import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { cn } from '@/lib/utils';

export default function LessonPackageCard({
  lessonsDone,
}: {
  lessonsDone: number;
}) {
  const done = Math.min(Math.max(lessonsDone, 0), LESSONS_PER_PACKAGE);

  if (done >= LESSONS_PER_PACKAGE) {
    return (
      <section className="flex flex-col gap-1 rounded-2xl bg-warning-subtle px-6 py-5 text-warning-subtle-foreground">
        <h2 className="font-serif text-xl font-medium tracking-tight">
          Package complete
        </h2>
        <p className="text-[15px]">
          You have finished all {LESSONS_PER_PACKAGE} lessons. Payment is due.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-6 py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your lessons
        </h2>
        <p className="text-[15px] font-semibold text-foreground tabular-nums">
          {done === 0
            ? `New package, ${LESSONS_PER_PACKAGE} lessons`
            : `${done} of ${LESSONS_PER_PACKAGE} done`}
        </p>
      </div>

      <div aria-hidden className="flex gap-1.5">
        {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-2 flex-1 rounded-full',
              index < done ? 'bg-primary' : 'bg-border',
            )}
          />
        ))}
      </div>
    </section>
  );
}
