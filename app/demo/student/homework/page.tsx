'use client';

import { useDemoData } from '@/features/demo/components/store';
import { viewerClasses, viewerHomework } from '@/features/demo/selectors';
import HomeworkTimeline from '@/features/homework/components/homework-timeline';

export default function DemoStudentHomework() {
  const data = useDemoData();

  return (
    <HomeworkTimeline
      homework={viewerHomework(data)}
      enrolment={viewerClasses(data)[0] ?? null}
      now={new Date(data.now)}
    />
  );
}
