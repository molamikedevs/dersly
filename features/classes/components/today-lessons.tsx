import { Video } from 'lucide-react';
import Link from 'next/link';

import {
  LESSONS_PER_PACKAGE,
  TYPES,
  studentCountLabel,
} from '@/features/classes/constants';
import {
  isUpNext,
  type Today,
  type TodayClass,
  type TodayLesson,
  type UpNext,
} from '@/features/classes/today';
import { formatLessonTime, formatNextLesson } from '@/lib/schedule';
import { cn } from '@/lib/utils';

type Props = {
  today: Today;
  now: Date;
};

// One line under the class name. One-to-one classes show the lesson package,
// everything else shows what kind of class it is and how many students.
function describe(item: TodayClass) {
  if ('lessonsDone' in item) {
    if (!item.enrollmentId) return { text: 'Not joined yet', due: false };

    const done = Math.min(Math.max(item.lessonsDone, 0), LESSONS_PER_PACKAGE);

    return done >= LESSONS_PER_PACKAGE
      ? {
          text: `${done} of ${LESSONS_PER_PACKAGE} done, payment due`,
          due: true,
        }
      : { text: `${done} of ${LESSONS_PER_PACKAGE} lessons done`, due: false };
  }

  const type = TYPES.find((entry) => entry.value === item.type)?.label;
  const students = studentCountLabel(item.studentCount).toLowerCase();

  return { text: type ? `${type}, ${students}` : students, due: false };
}

// The lesson to act on. This is the only filled block on the page, the same
// way the next lesson is the only filled block on the student home.
function UpNextBlock({ upNext, now }: { upNext: UpNext; now: Date }) {
  const { class: item, start, started, isToday } = upNext;

  return (
    <li className="relative my-3 rounded-3xl bg-primary text-primary-foreground first:mt-0 last:mb-0">
      <Link
        href={`/dashboard/classes/${item.id}`}
        aria-label={`Open ${item.name}`}
        className="absolute inset-0 rounded-3xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      />

      <div className="pointer-events-none relative flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-sm font-medium text-primary-foreground/85">
            {started ? 'On now' : 'Next lesson'}
          </p>

          <p className="font-serif text-4xl leading-[1.08] font-medium tracking-tight text-balance tabular-nums sm:text-5xl">
            <time dateTime={start.toISOString()}>
              {isToday ? formatLessonTime(start) : formatNextLesson(start, now)}
            </time>
          </p>

          <p className="mt-1 text-base leading-snug font-semibold wrap-break-word sm:text-lg">
            {item.name}
          </p>

          <p className="text-sm text-primary-foreground/85">
            {describe(item).text}
          </p>
        </div>

        {/* A lesson on another day has nothing to join yet */}
        {item.meetingUrl && (isToday || started) && (
          <a
            href={item.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Join the lesson with ${item.name}`}
            className="pointer-events-auto flex h-12 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl bg-background px-6 text-[15px] font-bold text-primary transition-[scale,background-color] duration-150 ease-out select-none hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none active:scale-[0.97]"
          >
            <Video className="size-4" aria-hidden />
            Join lesson
          </a>
        )}
      </div>
    </li>
  );
}

function LessonRow({
  lesson,
  ruleAbove,
  ruleBelow,
}: {
  lesson: TodayLesson;
  ruleAbove: boolean;
  ruleBelow: boolean;
}) {
  const { class: item, start, state } = lesson;
  const over = state === 'earlier';
  const { text, due } = describe(item);

  return (
    <li
      className={cn(
        'group relative border-border',
        ruleAbove && 'border-t',
        ruleBelow && 'border-b',
      )}
    >
      <Link
        href={`/dashboard/classes/${item.id}`}
        aria-label={`Open ${item.name}`}
        className="absolute inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
      />

      {/* The Join button drops under the text when the row gets too narrow,
          which is what happens on a small phone at a large text size. */}
      <div className="pointer-events-none relative flex flex-wrap items-center gap-x-4 gap-y-1 py-3.5">
        <p
          className={cn(
            'w-18 shrink-0 font-serif text-2xl font-medium tracking-tight tabular-nums',
            over ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {over && <span className="sr-only">Earlier today, </span>}
          <time dateTime={start.toISOString()}>{formatLessonTime(start)}</time>
        </p>

        <div className="min-w-32 flex-1">
          <p
            className={cn(
              'text-base leading-snug font-semibold wrap-break-word underline-offset-4 group-hover:underline',
              over ? 'text-muted-foreground' : 'text-foreground',
            )}
          >
            {item.name}
          </p>
          <p
            className={cn(
              'mt-0.5 text-sm',
              due
                ? 'font-semibold text-warning-subtle-foreground'
                : 'text-muted-foreground',
            )}
          >
            {text}
          </p>
        </div>

        {item.meetingUrl && (
          <a
            href={item.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Join the lesson with ${item.name}`}
            className={cn(
              'pointer-events-auto inline-flex h-11 shrink-0 touch-manipulation items-center gap-2 rounded-xl text-sm font-semibold select-none',
              'transition-[scale,background-color] duration-150 ease-out active:scale-[0.97]',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              over
                ? '-mr-2 px-2 text-muted-foreground underline-offset-4 hover:underline'
                : 'border border-input-border bg-card px-4 text-foreground hover:bg-muted',
            )}
          >
            {!over && <Video className="size-4" aria-hidden />}
            Join
          </a>
        )}
      </div>
    </li>
  );
}

export default function TodayLessons({ today, now }: Props) {
  const { lessons, upNext } = today;

  // Today's lessons in time order. The lesson to act on is drawn as the
  // filled block in its place in the list. When today has nothing left, the
  // block comes last and shows the next lesson on another day.
  const entries: (TodayLesson | 'upNext')[] = lessons.map((lesson) =>
    isUpNext(lesson, upNext) ? 'upNext' : lesson,
  );

  if (upNext && !upNext.isToday) entries.push('upNext');

  return (
    <section aria-labelledby="lessons-heading" className="min-w-0">
      <h2 id="lessons-heading" className="sr-only">
        {lessons.length > 0 ? 'Lessons today' : 'Next lesson'}
      </h2>

      {entries.length === 0 ? (
        <div className="flex flex-col items-start gap-4 border-y border-border py-6">
          <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
            No class has lesson times yet. Add the days and times to a class and
            its lessons show up here.
          </p>
          <Link
            href="/dashboard/classes"
            className="inline-flex h-11 touch-manipulation items-center rounded-xl border border-input-border bg-card px-4 text-sm font-semibold text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
          >
            Open classes
          </Link>
        </div>
      ) : (
        <ol className="flex flex-col">
          {entries.map((entry, index) => {
            if (entry === 'upNext') {
              return <UpNextBlock key="up-next" upNext={upNext!} now={now} />;
            }

            // Rules sit between plain rows and close the list at both ends.
            // The filled block needs none around it.
            return (
              <LessonRow
                key={entry.class.id}
                lesson={entry}
                ruleAbove={entries[index - 1] !== 'upNext'}
                ruleBelow={index === entries.length - 1}
              />
            );
          })}
        </ol>
      )}
    </section>
  );
}
