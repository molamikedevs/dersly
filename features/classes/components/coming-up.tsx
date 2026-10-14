import { AppLink } from '@/features/app/app-mode';
import { type TodayClass } from '@/features/classes/today';
import { formatNextLesson } from '@/lib/schedule';
import { ChevronRight } from 'lucide-react';

const HEADING = 'text-xl leading-snug font-bold tracking-tight text-foreground';

const ROW_LINK =
  'group flex min-h-14 touch-manipulation items-center gap-4 py-3 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset';

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

      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {lessons.map(({ class: { id, name }, start }) => (
          <li key={id}>
            <AppLink href={`/dashboard/classes/${id}`} className={ROW_LINK}>
              <span className="min-w-0 flex-1">
                <span className="block text-base leading-snug font-semibold wrap-break-word text-foreground underline-offset-4 group-hover:underline">
                  {name}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground tabular-nums">
                  <time dateTime={start.toISOString()}>
                    {formatNextLesson(start, now)}
                  </time>
                </span>
              </span>

              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </AppLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
