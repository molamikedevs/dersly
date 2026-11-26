import { ChevronRight } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import { formatNextLesson } from '@/lib/schedule';

const HEADING =
  'text-lg leading-snug font-semibold tracking-tight text-foreground';

const ROW_LINK =
  'group flex min-h-14 touch-manipulation items-center justify-between gap-4 px-4 py-3.5 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset';

export default function ComingUp({
  lessons,
  now,
}: {
  lessons: { class: TodayClass; start: Date }[];
  now: Date;
}) {
  if (lessons.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className={HEADING}>Coming up</h2>

      <ul className="surface-card flex flex-col overflow-hidden">
        {lessons.map(({ class: { id, name }, start }) => (
          <li key={id} className="surface-row">
            <AppLink href={`/dashboard/classes/${id}`} className={ROW_LINK}>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] leading-snug font-semibold wrap-break-word text-foreground transition-colors group-hover:text-primary">
                  {name}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground tabular-nums">
                  <time dateTime={start.toISOString()}>
                    {formatNextLesson(start, now)}
                  </time>
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
    </section>
  );
}
