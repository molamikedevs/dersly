'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';

import BackLink from '@/components/common/back-link';
import ClassHeader from '@/features/classes/components/class-header';
import LessonTracker from '@/features/classes/components/lesson-tracker';
import StudentsSection from '@/features/classes/components/student-section';
import { useDemoData } from '@/features/demo/components/store';
import {
  findClass,
  homeworkFor,
  studentRecords,
} from '@/features/demo/selectors';
import HomeWorkSection from '@/features/homework/components/homework-section';

// The same page as /dashboard/classes/[classId], built from the demo data
export default function DemoTeacherClass({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = use(params);
  const data = useDemoData();
  const { item, privateClass } = findClass(data, classId);

  if (!item) notFound();

  // Every invented student fits on one page, so there is never a next page
  const students = studentRecords(data, classId);

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16">
      <div className="flex flex-col gap-5">
        <BackLink href="/dashboard/classes" label="Back to classes" />
        <ClassHeader data={item}>
          {privateClass && (
            <LessonTracker
              name={privateClass.name}
              enrollmentId={privateClass.enrollmentId}
              lessonsDone={privateClass.lessonsDone}
            />
          )}
        </ClassHeader>
      </div>

      <HomeWorkSection
        homeWork={homeworkFor(data, classId)}
        classId={classId}
      />

      {item.type === 'course' && (
        <StudentsSection
          students={students}
          total={students.length}
          isNext={false}
          inviteCode={item.inviteCode}
        />
      )}
    </div>
  );
}
