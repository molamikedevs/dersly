import { notFound } from 'next/navigation';

import BackLink from '@/components/common/back-link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassHeader from '@/features/classes/components/class-header';
import StudentsSection from '@/features/classes/components/student-section';
import { getClass, getLessonProgress } from '@/features/classes/queries';
import HomeWorkSection from '@/features/homework/components/homework-section';
import { getClassHomework } from '@/features/homework/queries';
import MistakesSection from '@/features/mistakes/components/mistakes-section';
import { getStudentMistakes } from '@/features/mistakes/queries';
import { getClassStudents } from '@/features/students/queries';
import VocabularySection from '@/features/vocabulary/components/vocabulary-section';
import { getStudentWords } from '@/features/vocabulary/queries';
import { weekStart } from '@/features/vocabulary/week';
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

  const [classResult, homeworkResult, studentResult] = await Promise.all([
    getClass(classId),
    // This page has no homework pager, so it always shows the latest.
    // ?page= belongs to the student list below.
    getClassHomework(classId, { page: 1, pageSize: 10 }),
    getClassStudents(classId, {
      page: Number(page) || 1,
      pageSize: STUDENTS_PER_PAGE,
    }),
  ]);

  if (!classResult.success || !classResult.data) notFound();

  const data = classResult.data;
  const homework = homeworkResult.data?.homework ?? [];
  const students = studentResult.data?.students ?? [];
  const totalStudents = studentResult.data?.total ?? 0;
  const hasMoreStudents = studentResult.data?.isNext ?? false;
  const isOneToOne = data.type === 'one_to_one';

  // A one-to-one class has one enrolment, which vocabulary and mistakes
  // belong to
  const progress = isOneToOne
    ? ((await getLessonProgress(classId)).data ?? null)
    : null;

  // Vocabulary and mistakes are for one-to-one students only, once they
  // have joined
  const enrollmentId = progress?.enrollmentId ?? null;
  const [words, mistakes] = enrollmentId
    ? await Promise.all([
        getStudentWords(enrollmentId).then((result) => result.data ?? []),
        getStudentMistakes(enrollmentId).then((result) => result.data ?? []),
      ])
    : [[], []];

  const thisWeek = weekStart();
  const wordCount = words.filter((item) => item.weekStart === thisWeek).length;
  const openMistakes = mistakes.filter((item) => !item.fixedAt).length;

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16">
      <div className="flex flex-col gap-5">
        <BackLink href="/dashboard/classes" label="Back to classes" />
        <ClassHeader data={data} />
      </div>

      {/* A one-to-one student's work, one part at a time. Every part is
          rendered on the server; the tabs only choose which one shows. */}
      {enrollmentId ? (
        <Tabs defaultValue="homework" className="gap-6">
          <TabsList>
            <TabsTrigger value="homework">Homework</TabsTrigger>
            <TabsTrigger value="vocabulary">
              Vocabulary
              {wordCount > 0 && <Count>{wordCount}</Count>}
            </TabsTrigger>
            <TabsTrigger value="mistakes">
              Mistakes
              {openMistakes > 0 && <Count>{openMistakes}</Count>}
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
            <MistakesSection enrollmentId={enrollmentId} mistakes={mistakes} />
          </TabsContent>
        </Tabs>
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

// What still needs the student, next to the tab name
function Count({ children }: { children: number }) {
  return (
    <span className="rounded-full bg-muted px-1.5 text-xs text-muted-foreground tabular-nums">
      {children}
    </span>
  );
}
