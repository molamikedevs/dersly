'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';

import { useDemoData } from '@/features/demo/components/store';
import { findHomework } from '@/features/demo/selectors';
import HomeworkReader from '@/features/homework/components/homework-reader';

export default function DemoTeacherHomework({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const work = findHomework(useDemoData(), id);

  if (!work) notFound();

  return (
    <HomeworkReader
      data={work}
      backHref={`/dashboard/classes/${work.classId}`}
      backLabel="Back to class"
    />
  );
}
