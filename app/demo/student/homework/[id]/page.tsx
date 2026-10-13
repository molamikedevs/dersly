'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';

import { useDemoData } from '@/features/demo/components/store';
import { viewerHomework } from '@/features/demo/selectors';
import HomeworkReader from '@/features/homework/components/homework-reader';

export default function DemoStudentHomeworkItem({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  // Only the viewer's own homework, as RLS allows for a real student
  const work = viewerHomework(useDemoData()).find((item) => item.id === id);

  if (!work) notFound();

  const isTopic = work.classes?.type === 'conversation';

  return (
    <HomeworkReader
      data={work}
      backHref="/homework"
      backLabel={isTopic ? 'Back to topics' : 'Back to homework'}
    />
  );
}
