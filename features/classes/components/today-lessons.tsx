import { AppLink } from '@/features/app/app-mode';
import { isUpNext } from '@/features/classes/today';
import LessonRow from './lesson-row';
import UpNextBlock from './up-next-block';

type Props = {
  today: Today;
  now: Date;
};

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
          <AppLink
            href="/dashboard/classes"
            className="inline-flex h-11 touch-manipulation items-center rounded-xl border border-input-border bg-card px-4 text-sm font-semibold text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
          >
            Open classes
          </AppLink>
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
