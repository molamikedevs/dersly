import { ArrowRight, Video } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import { formatLessonTime, formatNextLesson } from '@/lib/schedule';
import { describe } from '../constants/index';

// The lesson to act on. This is the only filled block on the page, the same
// way the next lesson is the only filled block on the student home.
export default function UpNextBlock({
  upNext,
  now,
}: {
  upNext: UpNext;
  now: Date;
}) {
  const { class: item, start, started, isToday } = upNext;

  return (
    <li className="group relative my-3 rounded-3xl bg-hero text-hero-foreground first:mt-0 last:mb-0">
      <AppLink
        href={`/dashboard/classes/${item.id}`}
        aria-label={`Open ${item.name}`}
        className="absolute inset-0 rounded-3xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      />

      <div className="pointer-events-none relative flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-sm font-medium text-hero-foreground/85">
            {started ? 'On now' : 'Next lesson'}
          </p>

          <p className="font-serif text-4xl leading-[1.08] font-medium tracking-tight text-balance tabular-nums sm:text-6xl sm:leading-[1.04]">
            <time dateTime={start.toISOString()}>
              {isToday ? formatLessonTime(start) : formatNextLesson(start, now)}
            </time>
          </p>

          <p className="mt-1 text-base leading-snug font-semibold wrap-break-word sm:text-lg">
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
            className="pointer-events-auto flex h-12 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl bg-hero-foreground px-6 text-[15px] font-bold text-hero transition-[scale,background-color] duration-150 ease-out select-none hover:bg-hero-foreground/90 focus-visible:ring-2 focus-visible:ring-hero-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-hero focus-visible:outline-none active:scale-[0.97]"
          >
            <Video className="size-4" aria-hidden />
            Join lesson
          </a>
        ) : (
          // The whole card already opens the class. This only says so, and
          // fills the side the Join button takes on a lesson day.
          <span
            aria-hidden
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold underline-offset-4 group-hover:underline"
          >
            Open class
            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </li>
  );
}
