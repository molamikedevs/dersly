import { Plus } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import TodayLessons from '@/features/classes/components/today-lessons';
import { buildToday } from '@/features/classes/today';
import { classSlots, getNextLesson } from '@/lib/schedule';
import { cn, formatDate } from '@/lib/utils';
import {
  lessonCountTitle,
  PAYMENT_SOON,
  upcomingLessons,
} from '../constants/index';
import ComingUp from './coming-up';
import MissingHomework from './missing-homework';
import NoClasses from './no-class';
import PaymentDue from './payment-due';

type Props = {
  groups: ClassWithCount[];
  oneToOne: PrivateClass[];
  withHomework: Set<string> | null;
  now: Date;
};

function isSameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildWeekStrip(classes: TodayClass[], now: Date) {
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + offset,
    );
    const count = classes.reduce((total, item) => {
      const next = getNextLesson(classSlots(item), date, 0);
      return next && isSameCalendarDay(next, date) ? total + 1 : total;
    }, 0);

    return {
      date,
      isToday: offset === 0,
      dayLabel:
        offset === 0
          ? 'Today'
          : date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      count,
    };
  });
}

export default function Overview({
  groups,
  oneToOne,
  withHomework,
  now,
}: Props) {
  const classes: TodayClass[] = [...oneToOne, ...groups];

  if (classes.length === 0) return <NoClasses />;

  const today = buildToday(classes, now);
  const { lessons } = today;
  const allDone =
    lessons.length > 0 && lessons.every(({ state }) => state === 'earlier');

  const weekDays = buildWeekStrip(classes, now);

  const paymentDue = oneToOne
    .filter((item) => item.enrollmentId && item.lessonsDone >= PAYMENT_SOON)
    .sort(
      (a, b) => b.lessonsDone - a.lessonsDone || a.name.localeCompare(b.name),
    );

  const missingHomework =
    withHomework &&
    classes
      .filter((item) => !withHomework.has(item.id))
      .map((item) => ({
        class: item,
        // No grace period: a lesson that is on now is too late to post for
        next: getNextLesson(classSlots(item), now, 0),
      }))
      .sort(
        (a, b) =>
          (a.next?.getTime() ?? Infinity) - (b.next?.getTime() ?? Infinity) ||
          a.class.name.localeCompare(b.class.name),
      );

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-10 sm:gap-9">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-balance text-foreground sm:text-5xl">
            {lessonCountTitle(lessons.length)}
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {formatDate(now, 'long')}
            {allDone && '. All done for today.'}
          </p>
        </div>

        <AppLink
          href="/dashboard/homework"
          className="inline-flex h-10 shrink-0 touch-manipulation items-center justify-center gap-2 self-start rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.04)] transition-all duration-150 select-none hover:bg-accent/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98] sm:self-auto"
        >
          <Plus className="size-4 text-primary" aria-hidden />
          New homework
        </AppLink>
      </header>

      {/* 7-day at-a-glance strip */}
      <div
        aria-label="Upcoming 7 days"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 lg:gap-2.5"
      >
        {weekDays.map(({ date, isToday, dayLabel, dayNumber, count }) => (
          <AppLink
            key={date.toISOString()}
            href="/dashboard/classes"
            className={cn(
              'group flex flex-col justify-between rounded-2xl border p-3.5 transition-all duration-150',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              isToday
                ? 'border-hero-border bg-hero/35 shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)]'
                : 'border-border-subtle bg-card/75 hover:border-border hover:bg-card',
            )}
          >
            <span
              className={cn(
                'text-xs font-medium',
                isToday ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {dayLabel}
            </span>
            <span className="mt-1 font-serif text-2xl font-medium tracking-tight text-foreground tabular-nums">
              {dayNumber}
            </span>
            <span
              className={cn(
                'mt-2 text-xs tabular-nums',
                count > 0
                  ? isToday
                    ? 'font-medium text-foreground/90'
                    : 'text-muted-foreground'
                  : 'text-muted-foreground/60',
              )}
            >
              {count === 0
                ? 'Free'
                : `${count} ${count === 1 ? 'lesson' : 'lessons'}`}
            </span>
          </AppLink>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-12">
        <div className="flex min-w-0 flex-col gap-9">
          <TodayLessons today={today} now={now} withHomework={withHomework} />

          <ComingUp
            lessons={upcomingLessons(classes, today.upNext, now)}
            now={now}
          />
        </div>

        <aside className="flex min-w-0 flex-col gap-8">
          <PaymentDue students={paymentDue} />
          <MissingHomework classes={missingHomework} now={now} />
        </aside>
      </div>
    </div>
  );
}
