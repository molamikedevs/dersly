import { type TodayClass } from '@/features/classes/today';
import { formatNextLesson } from '@/lib/schedule';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

// "Next lesson tomorrow, 21:00" or "Next lesson Monday 12 Oct, 21:00"
function nextLessonLine(next: Date | null, now: Date) {
  if (!next) return 'No lesson times set';

  const when = formatNextLesson(next, now);
  const text = /^(Today|Tonight|Tomorrow)/.test(when)
    ? when[0].toLowerCase() + when.slice(1)
    : when;

  return `
  Next lesson ${text}`;
}

const HEADING = 'text-xl leading-snug font-bold tracking-tight text-foreground';

const ROW_LINK =
  'group flex min-h-14 touch-manipulation items-center gap-4 py-3 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset';

export default function MissingHomework({
  classes,
  now,
}: {
  classes: { class: TodayClass; next: Date | null }[] | null;
  now: Date;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className={HEADING}>No homework posted</h2>

      {classes === null ? (
        <p
          role="alert"
          className="text-[15px] leading-relaxed text-muted-foreground"
        >
          Homework could not be checked. Try again in a moment.
        </p>
      ) : classes.length === 0 ? (
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Every class has homework.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {classes.map(({ class: { id, name }, next }) => (
            <li key={id}>
              <Link href={`/dashboard/classes/${id}`} className={ROW_LINK}>
                <span className="min-w-0 flex-1">
                  <span className="block text-base leading-snug font-semibold wrap-break-word text-foreground underline-offset-4 group-hover:underline">
                    {name}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground tabular-nums">
                    {nextLessonLine(next, now)}
                  </span>
                </span>

                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
