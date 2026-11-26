import { ArrowRight, BookOpen, CheckCircle2, Video } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import {
  LESSONS_PER_PACKAGE,
  PAYMENT_SOON,
} from '@/features/classes/constants';
import { formatLessonTime, formatNextLesson } from '@/lib/schedule';
import { cn } from '@/lib/utils';
import { describe } from '../constants/index';

export default function UpNextBlock({
  upNext,
  now,
  hasHomework = null,
}: {
  upNext: UpNext;
  now: Date;
  hasHomework?: boolean | null;
}) {
  const { class: item, start, started, isToday } = upNext;

  const isPrivate =
    'lessonsDone' in item && typeof item.lessonsDone === 'number';
  const done = isPrivate ? Math.min(item.lessonsDone, LESSONS_PER_PACKAGE) : 0;
  const paymentDue = isPrivate && done >= PAYMENT_SOON;
  const packageComplete = isPrivate && done >= LESSONS_PER_PACKAGE;

  return (
    <li>
      <div className="surface-hero group relative text-hero-foreground transition-transform duration-150">
        <AppLink
          href={`/dashboard/classes/${item.id}`}
          aria-label={`Open ${item.name}`}
          className="absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        />

        <div className="pointer-events-none relative flex flex-col gap-5 p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-xs font-semibold tracking-wide text-hero-foreground/80 uppercase">
                {started ? 'On now' : 'Next lesson'}
              </p>

              <p className="font-serif text-4xl leading-[1.06] font-medium tracking-tight text-foreground tabular-nums sm:text-5xl">
                <time dateTime={start.toISOString()}>
                  {isToday
                    ? formatLessonTime(start)
                    : formatNextLesson(start, now)}
                </time>
              </p>

              <p className="mt-1.5 text-lg leading-snug font-semibold wrap-break-word text-foreground">
                {item.name}
              </p>

              <p className="text-sm text-hero-foreground/85">
                {describe(item).text}
              </p>
            </div>

            {/* A lesson on another day has nothing to join yet */}
            {item.meetingUrl && (isToday || started) ? (
              <a
                href={item.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Join the lesson with ${item.name}`}
                className="pointer-events-auto flex h-11 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-hero focus-visible:outline-none active:scale-[0.97]"
              >
                <Video className="size-4" aria-hidden />
                Join lesson
              </a>
            ) : (
              <span
                aria-hidden
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 group-hover:underline"
              >
                Open class
                <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
              </span>
            )}
          </div>

          {/* Package progress & homework metadata strip */}
          {(isPrivate || hasHomework !== null) && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs">
              {isPrivate && (
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-hero-foreground/75">
                    Lesson package
                  </span>
                  <span aria-hidden className="flex items-center gap-1">
                    {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => (
                      <span
                        key={index}
                        className={cn(
                          'size-2 rounded-full',
                          index >= done
                            ? 'bg-white/20'
                            : packageComplete
                              ? 'bg-warning'
                              : 'bg-primary',
                        )}
                      />
                    ))}
                  </span>
                  {paymentDue && (
                    <span className="rounded-md bg-warning px-2 py-0.5 text-[11px] font-bold text-warning-foreground">
                      {packageComplete ? 'Payment due' : '1 lesson left'}
                    </span>
                  )}
                </div>
              )}

              {hasHomework !== null && (
                <div className="flex items-center gap-1.5 text-hero-foreground/90">
                  {hasHomework ? (
                    <>
                      <CheckCircle2
                        className="size-3.5 text-primary"
                        aria-hidden
                      />
                      <span className="font-medium">Homework posted</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="size-3.5 text-warning" aria-hidden />
                      <span className="font-medium text-warning">
                        No homework yet
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
