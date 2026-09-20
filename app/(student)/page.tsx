import HomeSkeleton from '@/components/common/home-skeleton';
import PromptCard from '@/features/level-test/components/prompt-card';
import RecentMaterials from '@/features/materials/components/recent-materials';
import CurrentWorkCard from '@/features/students/components/current-work-card';
import NextLessonCard from '@/features/students/components/next-lesson-card';
import {
  WORK_LABEL,
  WORK_LINK_LABEL,
} from '@/features/students/constants/index';
import { getStudentHome } from '@/features/students/queries';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata = {
  title: 'Home',
};

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomContent />
    </Suspense>
  );
}

async function HomContent() {
  const { data } = await getStudentHome();

  if (!data) return null;

  const { firstName, studentLevel, enrolment, current, materials } = data;
  const { type, lessonsCompleted } = enrolment;

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex max-w-5xl flex-col gap-6 pb-8 sm:gap-7">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Hi {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{today}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-5">
        <div className="flex flex-col gap-6 lg:col-span-2 lg:gap-5">
          {!studentLevel && <PromptCard />}
          <NextLessonCard
            className={enrolment.className}
            level={enrolment.level}
            schedule={enrolment.schedule}
            meetingUrl={enrolment.meetingUrl}
          />

          {current && (
            <section>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                  {WORK_LABEL[type]}
                </h2>
                <Link
                  href="/homework"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {WORK_LINK_LABEL[type]}
                </Link>
              </div>

              <div className="mt-2">
                <CurrentWorkCard
                  title={current.title}
                  instructions={current.instructions}
                  attachmentName={current.attachmentName}
                  signedUrl={current.signedUrl}
                  downloadUrl={current.downloadUrl}
                  asQuestions={type === 'conversation'}
                />
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:gap-5">
          {lessonsCompleted > 0 && (
            <section className="flex items-center justify-between gap-4 rounded-lg bg-card p-4 shadow-sm">
              <span className="text-sm text-muted-foreground">
                Lessons completed
              </span>
              <span className="text-xl font-semibold tracking-tight text-foreground">
                {lessonsCompleted}
              </span>
            </section>
          )}

          <RecentMaterials items={materials} />
        </div>
      </div>
    </div>
  );
}
