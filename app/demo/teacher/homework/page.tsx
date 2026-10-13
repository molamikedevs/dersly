'use client';

import { useDemoData } from '@/features/demo/components/store';
import { homeworkGroups } from '@/features/demo/selectors';
import HomeworkGroups from '@/features/homework/components/homework-groups';

export default function DemoTeacherHomeworkList() {
  return <HomeworkGroups groups={homeworkGroups(useDemoData())} />;
}
