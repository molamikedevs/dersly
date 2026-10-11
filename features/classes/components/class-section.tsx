import { Video } from 'lucide-react';
import Link from 'next/link';

type Props<T extends ClassWithCount> = {
  title: string;
  meta: string;
  classes: T[];
  rowAside?: (item: T) => React.ReactNode;
  rowMenu?: (item: T) => React.ReactNode;
};

export default function ClassSection<T extends ClassWithCount>({
  title,
  meta,
  classes,
  rowAside,
  rowMenu,
}: Props<T>) {
  if (classes.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
          {title}
        </h2>
        <p className="shrink-0 text-sm text-muted-foreground">{meta}</p>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {classes.map((item) => {
          const { id, name, level, schedule, meetingUrl } = item;

          return (
            <li
              key={id}
              className="relative transition-colors hover:bg-muted/60"
            >
              <Link
                href={`/dashboard/classes/${id}`}
                aria-label={`Open ${name}`}
                className="absolute inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
              />

              {/* Phone: name and menu on the first line, then the aside on its
                  own full-width line. From sm up: name, aside, menu in one row.
                  The text column is minmax(0, 1fr), so nothing next to it can
                  squeeze it. */}
              <div className="pointer-events-none relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-3 py-4 pr-2 pl-5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-4 sm:pr-3 sm:pl-6">
                <div className="min-w-0 pt-2.5 sm:pt-0">
                  <p className="text-base leading-snug font-semibold break-words text-foreground">
                    {name}
                    {level && (
                      <>
                        {' '}
                        <span className="text-sm font-normal text-muted-foreground">
                          {level}
                        </span>
                      </>
                    )}
                  </p>

                  {(schedule || meetingUrl) && (
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      {schedule && (
                        <span className="min-w-0 break-words">{schedule}</span>
                      )}
                      {meetingUrl && (
                        <a
                          href={meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pointer-events-auto -my-2 inline-flex shrink-0 items-center gap-1.5 py-2 font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          <Video className="size-3.5" aria-hidden />
                          Join lesson
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {rowMenu && (
                  <div className="pointer-events-auto sm:order-last">
                    {rowMenu(item)}
                  </div>
                )}

                {rowAside && (
                  <div className="col-span-2 min-w-0 pr-3 sm:col-span-1 sm:pr-0 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
                    {rowAside(item)}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
