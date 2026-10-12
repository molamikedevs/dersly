import Link from 'next/link';

import { getStudentClasses } from '@/features/classes/queries';
import { getAllHomework } from '@/features/homework/queries';
import CurrentWorkCard from '@/features/students/components/current-work-card';
import { formatNextLesson } from '@/lib/schedule';
import { formatDate } from '@/lib/utils';
import type { RouteParams } from '@/types/global';

export const metadata = {
  title: 'Homework',
};

const BUTTON =
  'inline-flex h-12 touch-manipulation items-center justify-center self-start rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]';

const DAY = 86_400_000;

function readHref(item: HomeworkItem) {
  return item.content ? `/homework/${item.id}` : undefined;
}

// "Posted today", "Posted yesterday", "Posted Friday 9 October"
function postedLine(createdAt: string, now: Date) {
  const day = formatDate(createdAt, 'long');

  if (day === formatDate(now, 'long')) return 'Posted today';
  if (day === formatDate(new Date(now.getTime() - DAY), 'long')) {
    return 'Posted yesterday';
  }

  return `Posted ${day}`;
}

// Which lesson the work is for. A one-to-one class is named after the
// student, so it says "your lesson" instead of the class name.
//   For your lesson tomorrow, 21:00
//   For Learn & Speak on Friday 16 Oct, 18:30
function lessonLine(item: HomeworkItem, now: Date) {
  if (item.dueDate) return `Due ${formatDate(item.dueDate, 'long')}`;

  const owner = item.classes;
  const who =
    !owner || owner.type === 'one_to_one' ? 'your lesson' : owner.name;

  if (!item.lessonAt) {
    return owner && owner.type !== 'one_to_one' ? `For ${owner.name}` : null;
  }

  const when = formatNextLesson(new Date(item.lessonAt), now);
  const relative = /^(Today|Tonight|Tomorrow)/.test(when);

  return relative
    ? `For ${who} ${when[0].toLowerCase()}${when.slice(1)}`
    : `For ${who} on ${when}`;
}

function HomeworkError() {
  return (
    <div role="alert" className="flex max-w-prose flex-col gap-4">
      <p className="text-base leading-relaxed text-foreground">
        Your homework did not load. Check your internet connection and try
        again.
      </p>
      <Link href="/homework" className={BUTTON}>
        Try again
      </Link>
    </div>
  );
}

function NoHomework({
  isTopic,
  schedule,
}: {
  isTopic: boolean;
  schedule: string | null;
}) {
  return (
    <div className="flex max-w-prose flex-col gap-4 border-y border-border py-6">
      <p className="text-lg leading-snug font-semibold text-foreground">
        {isTopic ? 'No topic posted yet' : 'Nothing to do yet'}
      </p>
      <p className="text-base leading-relaxed text-muted-foreground">
        {isTopic
          ? 'Before each club meeting, the topic and its questions appear here.'
          : 'After each lesson, your teacher posts your homework here.'}
        {schedule &&
          ` ${isTopic ? 'Club times' : 'Lesson times'}: ${schedule}, Baku time.`}
      </p>
      <Link href="/" className={BUTTON}>
        Back to home
      </Link>
    </div>
  );
}

export default async function Homework({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const [homeworkResult, classResult] = await Promise.all([
    getAllHomework({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 20,
    }),
    getStudentClasses(),
  ]);

  const enrolment = classResult.data?.[0] ?? null;
  const homework = homeworkResult.data?.homework ?? [];
  const [current, ...past] = homework;

  const type = current?.classes?.type ?? enrolment?.type ?? null;
  const isTopic = type === 'conversation';
  const now = new Date();

  return (
    <div className="flex w-full max-w-4xl min-w-0 flex-col gap-7 pb-10 sm:gap-10">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
        {isTopic ? 'Next topic' : 'Homework'}
      </h1>

      {!homeworkResult.success ? (
        <HomeworkError />
      ) : !current ? (
        <NoHomework isTopic={isTopic} schedule={enrolment?.schedule ?? null} />
      ) : (
        <div className="flex flex-col gap-10">
          <CurrentWorkCard
            title={current.title}
            instructions={current.instructions}
            attachmentName={current.attachmentName}
            signedUrl={current.signedUrl}
            downloadUrl={current.downloadUrl}
            asQuestions={current.classes?.type === 'conversation'}
            readHref={readHref(current)}
            forLesson={lessonLine(current, now)}
            posted={postedLine(current.createdAt, now)}
          />

          {past.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
                Earlier
              </h2>
              {/* The work has no box of its own, so a line separates one
                  piece from the next */}
              <ol className="flex flex-col divide-y divide-border border-y border-border">
                {past.map((item) => (
                  <li key={item.id} className="py-6">
                    <CurrentWorkCard
                      title={item.title}
                      titleDisplay="plain"
                      instructions={item.instructions}
                      attachmentName={item.attachmentName}
                      signedUrl={item.signedUrl}
                      downloadUrl={item.downloadUrl}
                      asQuestions={item.classes?.type === 'conversation'}
                      readHref={readHref(item)}
                      readStyle="quiet"
                      forLesson={lessonLine(item, now)}
                      posted={postedLine(item.createdAt, now)}
                    />
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
