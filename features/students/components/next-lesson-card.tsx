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
  if (done >= LESSONS_PER_PACKAGE) return 'Complete. Payment is due.';
  if (done === 0) return `New, ${LESSONS_PER_PACKAGE} lessons`;
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

  return (
    <section
      aria-labelledby="next-lesson-heading"
      className="flex flex-col gap-6 rounded-3xl bg-primary p-6 text-primary-foreground sm:p-9"
    >
      <div className="flex min-w-0 flex-col gap-2">
        <h2
          id="next-lesson-heading"
          className="text-sm font-medium text-primary-foreground/85"
        >
          {started ? 'Your lesson has started' : 'Next lesson'}
        </h2>

        <p className="font-serif text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-6xl sm:leading-[1.04]">
          {when ?? 'No lesson time yet'}
        </p>

        <p className="flex flex-wrap items-baseline gap-x-2.5 text-base sm:text-lg">
          <span className="min-w-0 font-semibold wrap-break-word">
            {className}
          </span>
          {level && (
            <span className="text-primary-foreground/85 capitalize">
              {level}
            </span>
          )}
        </p>

        <p className="text-sm text-primary-foreground/85">
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
          className="flex h-12 touch-manipulation items-center justify-center gap-2 rounded-xl bg-background px-6 text-[15px] font-bold text-primary transition-[scale,background-color] duration-150 ease-out select-none hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none active:scale-[0.97] sm:self-start"
        >
          <Video className="size-4" aria-hidden />
          Join lesson
        </a>
      )}

      {hasPackage && (
        <div className="flex flex-col gap-2.5 border-t border-primary-foreground/20 pt-5">
          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-sm">
            <span className="text-primary-foreground/85">Lesson package</span>
            <span className="font-semibold tabular-nums">
              {packageLabel(done)}
            </span>
          </p>

          <div aria-hidden className="flex gap-1.5">
            {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => (
              <span
                key={index}
                className={cn(
                  'h-1.5 flex-1 rounded-full',
                  index < done
                    ? 'bg-primary-foreground'
                    : 'bg-primary-foreground/25',
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
