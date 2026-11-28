import { Video } from 'lucide-react';

import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { cn } from '@/lib/utils';

type Props = {
  when: string | null;
  started?: boolean;
  className: string;
  level: string | null;
  schedule: string | null;
  meetingUrl: string | null;
  lessonsDone?: number | null;
};

function packageLabel(done: number) {
  if (done >= LESSONS_PER_PACKAGE) return 'Complete · Payment due';
  if (done === 0) return `New · ${LESSONS_PER_PACKAGE} lessons`;
  return `${done} of ${LESSONS_PER_PACKAGE} done`;
}

export default function NextLessonCard({
  when,
  started = false,
  className,
  level,
  schedule,
  meetingUrl,
  lessonsDone,
}: Props) {
  const hasPackage = lessonsDone !== null && lessonsDone !== undefined;
  const done = Math.min(Math.max(lessonsDone ?? 0, 0), LESSONS_PER_PACKAGE);
  const complete = done >= LESSONS_PER_PACKAGE;

  return (
    <section
      aria-labelledby="next-lesson-heading"
      className="surface-hero flex flex-col gap-6 p-6 text-hero-foreground sm:p-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h2
            id="next-lesson-heading"
            className="text-xs font-semibold tracking-wide text-hero-foreground/80 uppercase"
          >
            {started ? 'Your lesson has started' : 'Next lesson'}
          </h2>

          <p className="font-serif text-4xl leading-[1.06] font-medium tracking-tight text-balance text-[#8fd1b5] sm:text-5xl">
            {when ?? 'No lesson time yet'}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="min-w-0 text-base font-semibold wrap-break-word text-hero-foreground sm:text-lg">
              {className}
            </span>
            {level && (
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-hero-foreground/90 capitalize">
                {level}
              </span>
            )}
          </div>

          <p className="text-sm text-hero-foreground/85">
            {schedule
              ? `${schedule}, Baku time`
              : 'Your teacher will add your lesson days here.'}
          </p>
        </div>

        {meetingUrl && (
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-hero focus-visible:outline-none active:scale-[0.97] sm:self-start"
          >
            <Video className="size-4" aria-hidden />
            Join lesson
          </a>
        )}
      </div>

      {hasPackage && (
        <div className="flex flex-col gap-2.5 border-t border-white/10 pt-4">
          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-xs">
            <span className="text-hero-foreground/75">Lesson package</span>
            <span
              className={cn(
                'font-semibold tabular-nums',
                complete ? 'text-warning' : 'text-hero-foreground/95',
              )}
            >
              {packageLabel(done)}
            </span>
          </p>

          <div aria-hidden className="flex gap-1.5">
            {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => (
              <span
                key={index}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  index >= done
                    ? 'bg-white/15'
                    : complete
                      ? 'bg-warning'
                      : 'bg-primary',
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
