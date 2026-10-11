import OverviewError from '@/components/common/overview-error';
import PaymentDue from '@/components/common/payment-due';
import RefreshOnReturn from '@/components/common/refresh-on-return';
import NoClasses from '@/features/classes/components/no-class';
import TodayLessons from '@/features/classes/components/today-lessons';
import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { getGroupedClasses } from '@/features/classes/queries';
import { buildToday, type TodayClass } from '@/features/classes/today';
import MissingHomework from '@/features/homework/components/missing-homework';
import { getClassIdsWithHomework } from '@/features/homework/queries';
import { classSlots, getNextLesson } from '@/lib/schedule';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Overview',
};

const PAYMENT_SOON = LESSONS_PER_PACKAGE - 1;

function lessonCountTitle(count: number) {
  if (count === 0) return 'No lessons today';
  if (count === 1) return '1 lesson today';
  return `${count} lessons today`;
}

export default async function Overview() {
  const [classResult, homeworkResult] = await Promise.all([
    getGroupedClasses({ page: 1, pageSize: 50 }),
    getClassIdsWithHomework(),
  ]);

  if (!classResult.success || !classResult.data) return <OverviewError />;

  const { groups, private: oneToOne } = classResult.data;
  const classes: TodayClass[] = [...oneToOne, ...groups];

  if (classes.length === 0) return <NoClasses />;

  const now = new Date();
  const today = buildToday(classes, now);
  const { lessons } = today;
  const allDone =
    lessons.length > 0 && lessons.every(({ state }) => state === 'earlier');

  const paymentDue = oneToOne
    .filter((item) => item.enrollmentId && item.lessonsDone >= PAYMENT_SOON)
    .sort(
      (a, b) => b.lessonsDone - a.lessonsDone || a.name.localeCompare(b.name),
    );

  const withHomework =
    homeworkResult.success && homeworkResult.data
      ? new Set(homeworkResult.data)
      : null;

  const missingHomework =
    withHomework &&
    classes
      .filter((item) => !withHomework.has(item.id))
      .map((item) => ({
        class: item,
        next: getNextLesson(classSlots(item), now, 0),
      }))
      .sort(
        (a, b) =>
          (a.next?.getTime() ?? Infinity) - (b.next?.getTime() ?? Infinity) ||
          a.class.name.localeCompare(b.class.name),
      );

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-10 sm:gap-10">
      <RefreshOnReturn />

      <header className="flex min-w-0 flex-col gap-1.5">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-balance text-foreground sm:text-5xl">
          {lessonCountTitle(lessons.length)}
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {formatDate(now, 'long')}
          {allDone && '. All done for today.'}
        </p>
      </header>

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
