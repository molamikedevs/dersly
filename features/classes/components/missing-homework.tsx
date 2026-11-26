import { CheckCircle2, ChevronRight } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import { nextLessonLine } from '../constants/index';

const HEADING =
  'text-lg leading-snug font-semibold tracking-tight text-foreground';

const ROW_LINK =
  'group flex min-h-14 touch-manipulation items-center gap-4 px-4 py-3 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset';

export default function MissingHomework({
  classes,
  now,
}: {
  classes: { class: TodayClass; next: Date | null }[] | null;
  now: Date;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className={HEADING}>Homework</h2>
        <AppLink
          href="/dashboard/homework"
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          See all
        </AppLink>
      </div>

      {classes === null ? (
        <div className="surface-card p-4">
          <p
            role="alert"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            Homework could not be checked. Try again in a moment.
          </p>
        </div>
      ) : classes.length === 0 ? (
        <div className="surface-card flex items-start gap-3 p-4">
          <CheckCircle2
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden
          />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every class has homework for its next lesson.
          </p>
        </div>
      ) : (
        <ul className="surface-card flex flex-col overflow-hidden">
          {classes.map(({ class: { id, name }, next }) => (
            <li key={id} className="surface-row">
              <AppLink href={`/dashboard/classes/${id}`} className={ROW_LINK}>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm leading-snug font-semibold wrap-break-word text-foreground transition-colors group-hover:text-primary">
                    {name}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground tabular-nums">
                    {nextLessonLine(next, now)}
                  </span>
                </span>

                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-foreground"
                  aria-hidden
                />
              </AppLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
