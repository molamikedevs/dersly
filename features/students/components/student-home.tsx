import { ArrowRight, BookOpen, ClipboardCheck } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import PromptCard from '@/features/level-test/components/prompt-card';
import ReadingList from '@/features/materials/components/reading-list';
import RecentMaterials from '@/features/materials/components/recent-materials';
import LessonNotes from '@/features/students/components/lesson-notes';
import NextLessonCard from '@/features/students/components/next-lesson-card';
import Practice from '@/features/students/components/practice';
import WeekChecklist from '@/features/students/components/week-checklist';
import { WORK_LABEL } from '@/features/students/constants/index';
import VocabularyStudy from '@/features/vocabulary/components/vocabulary-study';
import { formatNextLesson } from '@/lib/schedule';
import { formatDate } from '@/lib/utils';

// The student home, without the fetching. The home page passes it the
// database rows, the demo passes it invented ones.
//
// Ordered by what the student does: the next lesson, the week at a glance,
// quiz, homework, this week's words, then practice. Lesson notes, materials
// and reading come after, as things to look back at.
export default function StudentHomeView({
  data,
  now,
  mistakes,
  vocabulary,
  quiz,
}: {
  data: StudentHome;
  now: Date;
  mistakes?: StudentMistakes;
  vocabulary?: StudentVocabulary;
  quiz?: QuizSummary | null;
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

  const homeworkHref = current?.hasGuide
    ? `/homework/${current.id}`
    : '/homework';

  const quizDone = Boolean(quiz?.latestAttempt?.submittedAt);

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-10 sm:gap-9">
      {/* Kept short on a phone so the next lesson is on the first screen */}
      <header className="flex min-w-0 flex-col gap-1.5">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-balance wrap-break-word text-foreground sm:text-5xl">
          {firstName ? `Hi, ${firstName}.` : 'Hi there.'}
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {formatDate(now, 'long')}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-12">
        <div className="flex min-w-0 flex-col gap-9">
          <div className="flex flex-col gap-6">
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

          {quiz && (
            <section
              id="quiz"
              aria-label="Monthly quiz"
              className="scroll-mt-24"
            >
              <AppLink
                href={quizDone ? `/quiz/${quiz.id}/result` : `/quiz/${quiz.id}`}
                className="surface-card group flex min-h-15 touch-manipulation items-center justify-between gap-4 border-primary/30 px-5 py-3.5 transition-all duration-150 hover:border-primary/55 hover:bg-accent/35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span className="flex min-w-0 items-center gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                    <ClipboardCheck className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold tracking-wide text-primary uppercase tabular-nums">
                      {quizDone
                        ? `Quiz complete · ${quiz.latestAttempt!.score} / 100`
                        : `Monthly quiz · ${quiz.questionCount} ${quiz.questionCount === 1 ? 'question' : 'questions'}`}
                    </span>
                    <span className="block truncate text-[15px] font-semibold text-foreground transition-colors group-hover:text-primary">
                      {quiz.title}
                    </span>
                  </span>
                </span>

                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">
                  <span className="hidden sm:inline">
                    {quizDone ? 'View result' : 'Start quiz'}
                  </span>
                  <ArrowRight
                    className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </AppLink>
            </section>
          )}

          {current && (
            <section id="homework" className="scroll-mt-24">
              <AppLink
                href={homeworkHref}
                className="surface-card group flex min-h-15 touch-manipulation items-center justify-between gap-4 px-5 py-3.5 transition-all duration-150 hover:border-primary/45 hover:bg-accent/35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span className="flex min-w-0 items-center gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-secondary text-primary">
                    <BookOpen className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {WORK_LABEL[type]}
                    </span>
                    <span className="block truncate text-[15px] font-semibold text-foreground transition-colors group-hover:text-primary">
                      {current.title}
                    </span>
                  </span>
                </span>

                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">
                  <span className="hidden sm:inline">
                    {current.hasGuide ? 'Read guide' : 'Open'}
                  </span>
                  <ArrowRight
                    className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </AppLink>
            </section>
          )}

          {(vocabulary || mistakes) && (
            <Practice
              check={vocabulary?.check.words ?? []}
              mistakes={mistakes?.open ?? []}
            />
          )}

          {vocabulary && <VocabularyStudy words={vocabulary.study.words} />}

          <LessonNotes notes={lessonNotes} />
        </div>

        <aside className="flex min-w-0 flex-col gap-8">
          <WeekChecklist {...week} className="hidden lg:flex" />

          {!studentLevel && <PromptCard />}

          <RecentMaterials items={materials} />

          <ReadingList items={reading} />
        </aside>
      </div>
    </div>
  );
}
