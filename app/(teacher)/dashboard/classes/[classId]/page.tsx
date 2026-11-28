import { notFound } from 'next/navigation';

import BackLink from '@/components/common/back-link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassHeader from '@/features/classes/components/class-header';
import LessonLog from '@/features/classes/components/lesson-log';
import StudentsSection from '@/features/classes/components/student-section';
import { getClass, getLessonProgress } from '@/features/classes/queries';
import HomeWorkSection from '@/features/homework/components/homework-section';
import { getClassHomework } from '@/features/homework/queries';
import MistakesSection from '@/features/mistakes/components/mistakes-section';
import { getStudentMistakes } from '@/features/mistakes/queries';
import QuizzesSection from '@/features/quizzes/components/quizzes-section';
import { getClassQuizzes } from '@/features/quizzes/queries';
import { getClassStudents } from '@/features/students/queries';
import VocabularySection from '@/features/vocabulary/components/vocabulary-section';
import { getStudentWords } from '@/features/vocabulary/queries';
import { weekStart } from '@/features/vocabulary/week';
import { classSlots, formatNextLesson, getNextLesson } from '@/lib/schedule';
import { RouteParams } from '@/types/global';

const STUDENTS_PER_PAGE = 10;

export async function generateMetadata({
  params,
}: RouteParams<{ classId: string }>) {
  const { classId } = await params;
  const { data } = await getClass(classId);
  return { title: data?.name ?? 'Class' };
}

export default async function Page({
  params,
  searchParams,
}: RouteParams<{ classId: string }>) {
  const { classId } = await params;
  const { page } = await searchParams;

  const [classResult, homeworkResult, studentResult, quizzesResult] =
    await Promise.all([
      getClass(classId),
      getClassHomework(classId, { page: 1, pageSize: 10 }),
      getClassStudents(classId, {
        page: Number(page) || 1,
        pageSize: STUDENTS_PER_PAGE,
      }),
      getClassQuizzes(classId),
    ]);

  if (!classResult.success || !classResult.data) notFound();

  const data = classResult.data;
  const homework = homeworkResult.data?.homework ?? [];
  const students = studentResult.data?.students ?? [];
  const totalStudents = studentResult.data?.total ?? 0;
  const hasMoreStudents = studentResult.data?.isNext ?? false;
  const quizzes = quizzesResult.data ?? [];
  const isOneToOne = data.type === 'one_to_one';

  const progress = isOneToOne
    ? ((await getLessonProgress(classId)).data ?? null)
    : null;

  const enrollmentId = progress?.enrollmentId ?? null;
  const [words, mistakes] = enrollmentId
    ? await Promise.all([
        getStudentWords(enrollmentId).then((result) => result.data ?? []),
        getStudentMistakes(enrollmentId).then((result) => result.data ?? []),
      ])
    : [[], []];

  const now = new Date();
  const thisWeek = weekStart(now);
  const wordCount = words.filter((item) => item.weekStart === thisWeek).length;
  const openMistakes = mistakes.filter((item) => !item.fixedAt).length;

  const nextDate = getNextLesson(classSlots(data), now);
  const nextLesson = nextDate ? formatNextLesson(nextDate, now) : null;

  const tabTriggerClass =
    'rounded-lg px-3.5 py-1.5 text-sm font-semibold text-muted-foreground transition-all data-active:bg-card data-active:text-foreground data-active:shadow-xs';

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-16">
      <div className="flex flex-col gap-3">
        <BackLink href="/dashboard/classes" label="Classes" />
        <ClassHeader data={data} hasJoined={Boolean(enrollmentId)} />
      </div>

      {enrollmentId && progress ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:items-start lg:gap-10">
          <Tabs defaultValue="homework" className="min-w-0 gap-6">
            <TabsList className="inline-flex h-auto w-fit flex-wrap gap-1 rounded-xl border border-border-subtle bg-secondary/75 p-1">
              <TabsTrigger value="homework" className={tabTriggerClass}>
                Homework
              </TabsTrigger>
              <TabsTrigger value="vocabulary" className={tabTriggerClass}>
                Vocabulary
                {wordCount > 0 && <Count>{wordCount}</Count>}
              </TabsTrigger>
              <TabsTrigger value="mistakes" className={tabTriggerClass}>
                Mistakes
                {openMistakes > 0 && <Count>{openMistakes}</Count>}
              </TabsTrigger>
              <TabsTrigger value="quizzes" className={tabTriggerClass}>
                Quizzes
                {quizzes.length > 0 && <Count>{quizzes.length}</Count>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="homework">
              <HomeWorkSection
                homeWork={homework}
                classId={classId}
                showTitle={false}
              />
            </TabsContent>

            <TabsContent value="vocabulary">
              <VocabularySection enrollmentId={enrollmentId} words={words} />
            </TabsContent>

            <TabsContent value="mistakes">
              <MistakesSection
                enrollmentId={enrollmentId}
                mistakes={mistakes}
              />
            </TabsContent>

            <TabsContent value="quizzes">
              <QuizzesSection classId={classId} quizzes={quizzes} />
            </TabsContent>
          </Tabs>

          <div className="lg:sticky lg:top-24">
            <LessonLog
              studentName={data.name}
              lessonsDone={progress.lessonsDone}
              nextLesson={nextLesson}
            />
          </div>
        </div>
      ) : (
        <HomeWorkSection homeWork={homework} classId={classId} />
      )}

      {!isOneToOne && (
        <StudentsSection
          students={students}
          total={totalStudents}
          isNext={hasMoreStudents}
          inviteCode={data.inviteCode}
        />
      )}
    </div>
  );
}

function Count({ children }: { children: number }) {
  return (
    <span className="ml-1.5 inline-flex items-center rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
      {children}
    </span>
  );
}
