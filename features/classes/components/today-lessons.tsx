import { AppLink } from '@/features/app/app-mode';
import { isUpNext } from '@/features/classes/today';
import LessonRow from './lesson-row';
import UpNextBlock from './up-next-block';

type Props = {
  today: Today;
  now: Date;
  withHomework?: Set<string> | null;
};

export default function TodayLessons({ today, now, withHomework }: Props) {
  const { lessons, upNext } = today;

  // Hide lessons that have already finished so the list stays focused on
  // what is on now or still ahead.
  const entries: (TodayLesson | 'upNext')[] = lessons
    .filter((lesson) => isUpNext(lesson, upNext) || lesson.state !== 'earlier')
    .map((lesson) => (isUpNext(lesson, upNext) ? 'upNext' : lesson));

  if (upNext && !upNext.isToday) entries.push('upNext');

  return (
    <section
      aria-labelledby="lessons-heading"
      className="flex min-w-0 flex-col gap-3"
    >
      <h2
        id="lessons-heading"
        className="text-lg leading-snug font-semibold tracking-tight text-foreground"
      >
        {lessons.length > 0 ? 'Your lessons' : 'Next lesson'}
      </h2>

      {entries.length === 0 ? (
        <div className="surface-card flex flex-col items-start gap-4 p-6">
          <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
            No class has lesson times yet. Add the days and times to a class and
            its lessons show up here.
          </p>
          <AppLink
            href="/dashboard/classes"
            className="inline-flex h-10 touch-manipulation items-center rounded-xl border border-input-border bg-secondary px-4 text-sm font-semibold text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
          >
            Open classes
          </AppLink>
        </div>
      ) : (
        <ol className="flex flex-col gap-2">
          {entries.map((entry) => {
            if (entry === 'upNext') {
              return (
                <UpNextBlock
                  key="up-next"
                  upNext={upNext!}
                  now={now}
                  hasHomework={
                    withHomework ? withHomework.has(upNext!.class.id) : null
                  }
                />
              );
            }

            return (
              <LessonRow
                key={entry.class.id}
                lesson={entry}
                ruleAbove={false}
                ruleBelow={false}
              />
            );
          })}
        </ol>
      )}
    </section>
  );
}
