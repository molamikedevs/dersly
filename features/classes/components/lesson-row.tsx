import { Video } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import { formatLessonTime } from '@/lib/schedule';
import { cn } from '@/lib/utils';
import { describe } from '../constants/index';

type Props = {
  lesson: TodayLesson;
  ruleAbove?: boolean;
  ruleBelow?: boolean;
};

export default function LessonRow({ lesson }: Props) {
  const { class: item, start, state } = lesson;
  const isEarlier = state === 'earlier';

  return (
    <li
      className={cn(
        'surface-card group relative transition-all duration-150',
        'hover:border-input-border/70 hover:bg-accent/35',
        isEarlier && 'opacity-85 hover:opacity-100',
      )}
    >
      <AppLink
        href={`/dashboard/classes/${item.id}`}
        aria-label={`Open ${item.name}`}
        className="absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      />

      <div className="pointer-events-none relative flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
          <time
            dateTime={start.toISOString()}
            className={cn(
              'shrink-0 font-serif text-2xl font-medium tracking-tight tabular-nums sm:text-[28px]',
              isEarlier ? 'text-foreground/80' : 'text-foreground',
            )}
          >
            {formatLessonTime(start)}
          </time>

          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full bg-muted-foreground/45"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] leading-snug font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
              {item.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-[13px]">
              {describe(item).text}
            </p>
          </div>
        </div>

        {item.meetingUrl && (
          <a
            href={item.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Join the lesson with ${item.name}`}
            className={cn(
              'pointer-events-auto relative z-10 inline-flex h-10 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all duration-150 ease-out select-none active:scale-[0.97]',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
              isEarlier
                ? 'border-border bg-transparent text-muted-foreground hover:border-input-border hover:bg-secondary hover:text-foreground'
                : 'border-input-border/80 bg-secondary/80 text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.04)] hover:border-primary/45 hover:bg-accent',
            )}
          >
            {!isEarlier && (
              <Video
                className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden
              />
            )}
            Join
          </a>
        )}
      </div>
    </li>
  );
}
