import TodayLessons from '@/features/classes/components/today-lessons';
import { buildToday, type TodayClass } from '@/features/classes/today';
import { classSlots, getNextLesson } from '@/lib/schedule';
import { formatDate } from '@/lib/utils';
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
        <div className="flex min-w-0 flex-col gap-10">
          <TodayLessons today={today} now={now} />

          <ComingUp
            lessons={upcomingLessons(classes, today.upNext, now)}
            now={now}
          />
        </div>

        <aside className="flex min-w-0 flex-col gap-10">
          <PaymentDue students={paymentDue} />
          <MissingHomework classes={missingHomework} now={now} />
        </aside>
      </div>
    </div>
  );
}
