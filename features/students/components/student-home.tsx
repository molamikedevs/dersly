import { AppLink } from '@/features/app/app-mode';
import PromptCard from '@/features/level-test/components/prompt-card';
import ReadingList from '@/features/materials/components/reading-list';
import RecentMaterials from '@/features/materials/components/recent-materials';
import CurrentWorkCard from '@/features/students/components/current-work-card';
import LessonNotes from '@/features/students/components/lesson-notes';
import NextLessonCard from '@/features/students/components/next-lesson-card';
import Practice from '@/features/students/components/practice';
import WeekChecklist from '@/features/students/components/week-checklist';
import {
  WORK_LABEL,
  WORK_LINK_LABEL,
} from '@/features/students/constants/index';
import VocabularyStudy from '@/features/vocabulary/components/vocabulary-study';
import { formatNextLesson } from '@/lib/schedule';
import { formatDate } from '@/lib/utils';

// The student home, without the fetching. The home page passes it the
// database rows, the demo passes it invented ones.
//
// Ordered by what the student does: the next lesson, the week at a glance,
// homework, this week's words, then practice. Lesson notes, materials and
// reading come after, as things to look back at.
export default function StudentHomeView({
  data,
  now,
  mistakes,
  vocabulary,
}: {
  data: StudentHome;
  now: Date;
  // A one-to-one student's open mistakes. The demo leaves this out.
  mistakes?: StudentMistakes;
  // A one-to-one student's words to study and to check. The demo leaves
  // this out.
  vocabulary?: StudentVocabulary;
}) {
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

  const nextLesson = nextLessonAt ? new Date(nextLessonAt) : null;
  const week = {
    homeworkLabel: current ? WORK_LABEL[type] : null,
    vocabulary,
    mistakes,
  };

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

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-14">
        <div className="flex min-w-0 flex-col gap-12">
          <div className="flex flex-col gap-8">
            <NextLessonCard
              when={nextLesson ? formatNextLesson(nextLesson, now) : null}
              started={Boolean(nextLesson && nextLesson <= now)}
              className={enrolment.className}
              level={enrolment.level}
              schedule={enrolment.schedule}
              meetingUrl={enrolment.meetingUrl}
              lessonsDone={type === 'one_to_one' ? lessonsDone : null}
            />

            {/* On a phone the week sits under the lesson card. On a wide
                screen it moves to the side column. */}
            <WeekChecklist {...week} className="lg:hidden" />
          </div>

          {/* The homework title is left out here, since the heading already
              says what this is and "See all" opens the full page. A
              conversation topic keeps its name as a plain line, because the
              questions under it make no sense without it. */}
          {current && (
            <section id="homework" className="flex scroll-mt-24 flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
                  {WORK_LABEL[type]}
                </h2>
                <AppLink
                  href="/homework"
                  className="-my-3 inline-flex shrink-0 touch-manipulation items-center text-sm font-semibold text-primary underline-offset-4 tap-row hover:underline"
                >
                  {WORK_LINK_LABEL[type]}
                </AppLink>
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

          {vocabulary && <VocabularyStudy words={vocabulary.study.words} />}

          {(vocabulary || mistakes) && (
            <Practice
              check={vocabulary?.check.words ?? []}
              mistakes={mistakes?.open ?? []}
            />
          )}

          <LessonNotes notes={lessonNotes} />
        </div>

        <aside className="flex min-w-0 flex-col gap-10">
          <WeekChecklist {...week} className="hidden lg:flex" />

          {!studentLevel && <PromptCard />}

          <RecentMaterials items={materials} />

          <ReadingList items={reading} />
        </aside>
      </div>
    </div>
  );
}
