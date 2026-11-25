import { AppLink } from '@/features/app/app-mode';
import { formatLessonTime } from '@/lib/schedule';
import { cn } from '@/lib/utils';
import { Video } from 'lucide-react';
import { describe } from '../constants/index';

export default function LessonRow({
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
      <AppLink
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
