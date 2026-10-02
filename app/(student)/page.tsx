import HomeSkeleton from '@/components/common/home-skeleton';
import PromptCard from '@/features/level-test/components/prompt-card';
import ReadingList from '@/features/materials/components/reading-list';
import RecentMaterials from '@/features/materials/components/recent-materials';
import CurrentWorkCard from '@/features/students/components/current-work-card';
import LessonNotes from '@/features/students/components/lesson-notes';
import LessonPackageCard from '@/features/students/components/lesson-package-card';
import NextLessonCard from '@/features/students/components/next-lesson-card';
import {
  WORK_LABEL,
  WORK_LINK_LABEL,
} from '@/features/students/constants/index';
import { getStudentHome } from '@/features/students/queries';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

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

async function HomeContent() {
  const { data } = await getStudentHome();

  if (!data) return null;

  const {
    firstName,
    studentLevel,
    enrolment,
    lessonNotes,
    current,
    materials,
    reading,
  } = data;
  const { type, lessonsDone } = enrolment;

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-8 pb-10 sm:gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {formatDate(new Date(), 'long')}
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          Welcome back, {firstName}.
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-8">
          <NextLessonCard
            className={enrolment.className}
            level={enrolment.level}
            schedule={enrolment.schedule}
            meetingUrl={enrolment.meetingUrl}
          />

          {type === 'one_to_one' && (
            <LessonPackageCard lessonsDone={lessonsDone} />
          )}

          {current && (
            <section className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
                  {WORK_LABEL[type]}
                </h2>
                <Link
                  href="/homework"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  {WORK_LINK_LABEL[type]}
                </Link>
              </div>

              <CurrentWorkCard
                title={current.title}
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

        <aside className="flex min-w-0 flex-col gap-8">
          {!studentLevel && <PromptCard />}

          <RecentMaterials items={materials} />

          <ReadingList items={reading} />
        </aside>
      </div>
    </div>
  );
}
