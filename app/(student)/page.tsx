import Link from 'next/link';
import { Suspense } from 'react';

import HomeSkeleton from '@/components/common/home-skeleton';
import PromptCard from '@/features/level-test/components/prompt-card';
import ReadingList from '@/features/materials/components/reading-list';
import RecentMaterials from '@/features/materials/components/recent-materials';
import CurrentWorkCard from '@/features/students/components/current-work-card';
import LessonNotes from '@/features/students/components/lesson-notes';
import NextLessonCard from '@/features/students/components/next-lesson-card';
import {
  WORK_LABEL,
  WORK_LINK_LABEL,
} from '@/features/students/constants/index';
import { getStudentHome } from '@/features/students/queries';
import { formatNextLesson } from '@/lib/schedule';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Home',
};

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

// Shown when the home data cannot be read, so a failed query is never a
// blank page.
function HomeError() {
  return (
    <div role="alert" className="flex max-w-prose flex-col gap-4 pb-10">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Your home page did not load
      </h1>
      <p className="text-base leading-relaxed text-muted-foreground">
        Check your internet connection and try again. If it keeps happening,
        tell your teacher.
      </p>
      <Link
        href="/"
        className="inline-flex h-12 touch-manipulation items-center justify-center self-start rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
      >
        Try again
      </Link>
    </div>
  );
}

async function HomeContent() {
  const { data } = await getStudentHome();

  if (!data) return <HomeError />;

  const {
    firstName,
    studentLevel,
    enrolment,
    lessonNotes,
    current,
    materials,
    reading,
  } = data;
  const { type, lessonsDone, nextLessonAt } = enrolment;

  const now = new Date();
  const nextLesson = nextLessonAt ? new Date(nextLessonAt) : null;

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-10 sm:gap-10">
      {/* Kept short on a phone so the next lesson is on the first screen */}
      <header className="flex min-w-0 flex-col gap-1.5">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-balance wrap-break-word text-foreground sm:text-5xl">
          {firstName ? `Hi, ${firstName}.` : 'Hi there.'}
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {formatDate(now, 'long')}
        </p>
      </header>

      {/* The lesson card is the only filled block. Everything under it is a
          plain list on the page, so text gets the full width of a phone. */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-14">
        <div className="flex min-w-0 flex-col gap-10">
          <NextLessonCard
            when={nextLesson ? formatNextLesson(nextLesson, now) : null}
            started={Boolean(nextLesson && nextLesson <= now)}
            className={enrolment.className}
            level={enrolment.level}
            schedule={enrolment.schedule}
            meetingUrl={enrolment.meetingUrl}
            lessonsDone={type === 'one_to_one' ? lessonsDone : null}
          />

          {/* One heading per section. The homework title is left out here,
              since the heading already says what this is and "See all" opens
              the full page. A conversation topic keeps its name as a plain
              line, because the questions under it make no sense without it. */}
          {current && (
            <section className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
                  {WORK_LABEL[type]}
                </h2>
                <Link
                  href="/homework"
                  className="-my-3 inline-flex shrink-0 touch-manipulation items-center text-sm font-semibold text-primary underline-offset-4 tap-row hover:underline"
                >
                  {WORK_LINK_LABEL[type]}
                </Link>
              </div>

              <CurrentWorkCard
                title={current.title}
                titleDisplay={type === 'conversation' ? 'plain' : 'hidden'}
                instructions={current.instructions}
                attachmentName={current.attachmentName}
                signedUrl={current.signedUrl}
                downloadUrl={current.downloadUrl}
                asQuestions={type === 'conversation'}
                readHref={
                  current.hasGuide ? `/homework/${current.id}` : undefined
                }
              />
            </section>
          )}

          <LessonNotes notes={lessonNotes} />
        </div>

        <aside className="flex min-w-0 flex-col gap-10">
          {!studentLevel && <PromptCard />}

          <RecentMaterials items={materials} />

          <ReadingList items={reading} />
        </aside>
      </div>
    </div>
  );
}
