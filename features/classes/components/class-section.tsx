import { ArrowRight, Video } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import { classSlots, formatSchedule } from '@/lib/schedule';

type Props<T extends ClassWithCount> = {
  title: string;
  meta?: string;
  classes: T[];
  now?: Date;
  variant?: 'table' | 'cards';
  showColumnHeaders?: boolean;
  asideHeader?: string;
  rowSchedule?: (item: T) => string | null;
  rowAside?: (item: T) => React.ReactNode;
  rowMenu?: (item: T) => React.ReactNode;
};

export default function ClassSection<T extends ClassWithCount>({
  title,
  meta,
  classes,
  variant = 'table',
  showColumnHeaders = false,
  asideHeader = 'Progress',
  rowSchedule,
  rowAside,
  rowMenu,
}: Props<T>) {
  if (classes.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg leading-snug font-semibold tracking-tight text-foreground sm:text-xl">
          {title}
        </h2>
        {meta && (
          <p className="shrink-0 text-xs font-medium text-muted-foreground sm:text-sm">
            {meta}
          </p>
        )}
      </div>

      {variant === 'cards' ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {classes.map((item) => {
            const { id, name, level, studentCount, meetingUrl } = item;
            const slots = classSlots(item);
            const schedule = rowSchedule
              ? rowSchedule(item)
              : formatSchedule(slots);

            return (
              <li
                key={id}
                className="surface-card group relative flex flex-col justify-between transition-all duration-150 hover:border-input-border/70 hover:bg-accent/35"
              >
                <AppLink
                  href={`/dashboard/classes/${id}`}
                  aria-label={`Open ${name}`}
                  className="absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                />

                <div className="pointer-events-none relative flex flex-col gap-5 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-serif text-2xl leading-tight font-medium tracking-tight wrap-break-word text-foreground transition-colors group-hover:text-primary">
                        {name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-muted-foreground capitalize">
                        {level ?? 'All levels'}
                      </p>
                    </div>

                    {rowMenu && (
                      <div className="pointer-events-auto relative z-10 -mt-1 -mr-2">
                        {rowMenu(item)}
                      </div>
                    )}
                  </div>

                  <dl className="flex items-start justify-between gap-4 border-t border-border-subtle pt-4">
                    <div className="min-w-0">
                      <dt className="text-[11px] font-medium text-muted-foreground">
                        Meets
                      </dt>
                      <dd className="mt-0.5 truncate text-xs font-semibold text-foreground sm:text-sm">
                        {schedule ?? 'Not set'}
                      </dd>
                    </div>

                    <div className="shrink-0 text-right">
                      <dt className="text-[11px] font-medium text-muted-foreground">
                        Students
                      </dt>
                      <dd className="mt-0.5 text-xs font-semibold text-foreground tabular-nums sm:text-sm">
                        {studentCount}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-3.5 text-xs">
                    {meetingUrl ? (
                      <a
                        href={meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto relative z-10 inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        <Video className="size-3.5" aria-hidden />
                        Join lesson
                      </a>
                    ) : (
                      <span />
                    )}

                    <span
                      aria-hidden
                      className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors group-hover:text-foreground"
                    >
                      Open
                      <ArrowRight className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="surface-card overflow-hidden">
          {showColumnHeaders && (
            <div
              aria-hidden
              className="hidden border-b border-border-subtle bg-secondary/50 px-6 py-2.5 text-xs font-semibold text-muted-foreground sm:grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.5fr)_2.5rem] sm:items-center sm:gap-4"
            >
              <span>Student</span>
              <span>Schedule</span>
              <span>{asideHeader}</span>
              <span />
            </div>
          )}

          <ul className="flex flex-col">
            {classes.map((item) => {
              const { id, name, level } = item;
              const slots = classSlots(item);
              const schedule = rowSchedule
                ? rowSchedule(item)
                : formatSchedule(slots);

              return (
                <li
                  key={id}
                  className="surface-row group relative transition-colors"
                >
                  <AppLink
                    href={`/dashboard/classes/${id}`}
                    aria-label={`Open ${name}`}
                    className="absolute inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
                  />

                  <div className="pointer-events-none relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2.5 py-4 pr-3 pl-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.5fr)_2.5rem] sm:items-center sm:gap-x-4 sm:pr-4 sm:pl-6">
                    {/* Column 1: Name & level */}
                    <div className="min-w-0 pt-0.5 sm:pt-0">
                      <p className="text-[15px] leading-snug font-semibold break-words text-foreground transition-colors group-hover:text-primary">
                        {name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                        {level ?? 'No level yet'}
                      </p>
                    </div>

                    {/* Menu button (top-right on mobile, last column on desktop) */}
                    {rowMenu && (
                      <div className="pointer-events-auto relative z-10 justify-self-end sm:order-last">
                        {rowMenu(item)}
                      </div>
                    )}

                    {/* Column 2: Schedule */}
                    <div className="col-span-2 min-w-0 text-xs text-muted-foreground sm:col-span-1 sm:text-sm">
                      <span className="font-medium text-foreground/85 sm:font-normal sm:text-muted-foreground">
                        {schedule ?? 'No schedule set'}
                      </span>
                    </div>

                    {/* Column 3: LessonTracker / student count */}
                    {rowAside && (
                      <div className="col-span-2 min-w-0 pr-2 sm:col-span-1 sm:pr-0 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
                        {rowAside(item)}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
