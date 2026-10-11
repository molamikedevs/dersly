import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const HEADING = 'text-xl leading-snug font-bold tracking-tight text-foreground';

const ROW_LINK =
  'group flex min-h-14 touch-manipulation items-center gap-4 py-3 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset';

// A package is nearly used up from this many lessons
const PAYMENT_SOON = LESSONS_PER_PACKAGE - 1;

export default function PaymentDue({ students }: { students: PrivateClass[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className={HEADING}>Payment due</h2>

      {students.length === 0 ? (
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          No one is on lesson {PAYMENT_SOON} or {LESSONS_PER_PACKAGE}.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {students.map(({ id, name, lessonsDone }) => {
            const done = Math.min(lessonsDone, LESSONS_PER_PACKAGE);
            const complete = done >= LESSONS_PER_PACKAGE;

            return (
              <li key={id}>
                {/* The strip drops under the name when there is no room
                    beside it, as on a small phone at a large text size. */}

                <Link
                  href={`/dashboard/classes/${id}`}
                  className={cn(ROW_LINK, 'flex-wrap gap-y-2')}
                >
                  <span className="min-w-32 flex-1">
                    <span className="block text-base leading-snug font-semibold wrap-break-word text-foreground underline-offset-4 group-hover:underline">
                      {name}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 block text-sm tabular-nums',
                        complete
                          ? 'font-semibold text-warning-subtle-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {complete
                        ? `${done} of ${LESSONS_PER_PACKAGE}, payment due`
                        : `${done} of ${LESSONS_PER_PACKAGE}, one lesson left`}
                    </span>
                  </span>

                  <span aria-hidden className="flex w-31 shrink-0 gap-1">
                    {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => (
                      <span
                        key={index}
                        className={cn(
                          'h-2 flex-1 rounded-full',
                          index >= done
                            ? 'bg-border'
                            : complete
                              ? 'bg-warning'
                              : 'bg-primary',
                        )}
                      />
                    ))}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
