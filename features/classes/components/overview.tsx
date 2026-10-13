import { ChevronRight } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import TodayLessons from '@/features/classes/components/today-lessons';
import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { buildToday, type TodayClass } from '@/features/classes/today';
import { classSlots, formatNextLesson, getNextLesson } from '@/lib/schedule';
import { cn, formatDate } from '@/lib/utils';

// The teacher's Today page, without the fetching. The dashboard passes it
// the database rows, the demo passes it invented ones.

const HEADING = 'text-xl leading-snug font-bold tracking-tight text-foreground';

const ROW_LINK =
  'group flex min-h-14 touch-manipulation items-center gap-4 py-3 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset';

const BUTTON =
  'inline-flex h-12 touch-manipulation items-center justify-center self-start rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]';

// A package is nearly used up from this many lessons
const PAYMENT_SOON = LESSONS_PER_PACKAGE - 1;

function lessonCountTitle(count: number) {
  if (count === 0) return 'No lessons today';
  if (count === 1) return '1 lesson today';
  return `${count} lessons today`;
}

// "Next lesson tomorrow, 21:00" or "Next lesson Monday 12 Oct, 21:00"
function nextLessonLine(next: Date | null, now: Date) {
  if (!next) return 'No lesson times set';

  const when = formatNextLesson(next, now);
  const text = /^(Today|Tonight|Tomorrow)/.test(when)
    ? when[0].toLowerCase() + when.slice(1)
    : when;

  return `Next lesson ${text}`;
}

function NoClasses() {
  return (
    <div className="flex max-w-prose flex-col gap-4 pb-10">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
        No classes yet
      </h1>
      <p className="text-base leading-relaxed text-muted-foreground">
        Create your first class and add its lesson days. Your lessons for the
        day will be listed here.
      </p>
      <AppLink href="/dashboard/classes" className={BUTTON}>
        Open classes
      </AppLink>
    </div>
  );
}

// Students on lesson 7 or 8 of their package, the fullest package first
function PaymentDue({ students }: { students: PrivateClass[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className={HEADING}>Payment due</h2>

      {students.length === 0 ? (
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          No one is on lesson {PAYMENT_SOON} or {LESSONS_PER_PACKAGE}.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {students.map(({ id, name, lessonsDone }) => {
            const done = Math.min(lessonsDone, LESSONS_PER_PACKAGE);
            const complete = done >= LESSONS_PER_PACKAGE;

            return (
              <li key={id}>
                {/* The strip drops under the name when there is no room
                    beside it, as on a small phone at a large text size. */}
                <AppLink
                  href={`/dashboard/classes/${id}`}
                  className={cn(ROW_LINK, 'flex-wrap gap-y-2')}
                >
                  <span className="min-w-32 flex-1">
                    <span className="block text-base leading-snug font-semibold wrap-break-word text-foreground underline-offset-4 group-hover:underline">
                      {name}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 block text-sm tabular-nums',
                        complete
                          ? 'font-semibold text-warning-subtle-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {complete
                        ? `${done} of ${LESSONS_PER_PACKAGE}, payment due`
                        : `${done} of ${LESSONS_PER_PACKAGE}, one lesson left`}
                    </span>
                  </span>

                  <span aria-hidden className="flex w-31 shrink-0 gap-1">
                    {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => (
                      <span
                        key={index}
                        className={cn(
                          'h-2 flex-1 rounded-full',
                          index >= done
                            ? 'bg-border'
                            : complete
                              ? 'bg-warning'
                              : 'bg-primary',
                        )}
                      />
                    ))}
                  </span>
                </AppLink>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// Classes with nothing posted, the soonest lesson first. Null means the
// homework could not be read.
function MissingHomework({
  classes,
  now,
}: {
  classes: { class: TodayClass; next: Date | null }[] | null;
  now: Date;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className={HEADING}>No homework posted</h2>

      {classes === null ? (
        <p
          role="alert"
          className="text-[15px] leading-relaxed text-muted-foreground"
        >
          Homework could not be checked. Try again in a moment.
        </p>
      ) : classes.length === 0 ? (
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Every class has homework.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {classes.map(({ class: { id, name }, next }) => (
            <li key={id}>
              <AppLink href={`/dashboard/classes/${id}`} className={ROW_LINK}>
                <span className="min-w-0 flex-1">
                  <span className="block text-base leading-snug font-semibold wrap-break-word text-foreground underline-offset-4 group-hover:underline">
                    {name}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground tabular-nums">
                    {nextLessonLine(next, now)}
                  </span>
                </span>

                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </AppLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

type Props = {
  groups: ClassWithCount[];
  oneToOne: PrivateClass[];
  // Ids of classes with homework. Null when homework could not be read.
  withHomework: Set<string> | null;
  now: Date;
};

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
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-10 sm:gap-10">
      <header className="flex min-w-0 flex-col gap-1.5">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-balance text-foreground sm:text-5xl">
          {lessonCountTitle(lessons.length)}
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {formatDate(now, 'long')}
          {allDone && '. All done for today.'}
        </p>
      </header>

      {/* The lesson to act on is the only filled block. Everything else is a
          plain list on the page, as on the student home. */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-14">
        <TodayLessons today={today} now={now} />

        <aside className="flex min-w-0 flex-col gap-10">
          <PaymentDue students={paymentDue} />
          <MissingHomework classes={missingHomework} now={now} />
        </aside>
      </div>
    </div>
  );
}
