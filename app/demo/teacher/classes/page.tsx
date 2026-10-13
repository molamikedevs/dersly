'use client';

import ClassList from '@/features/classes/components/class-list';
import { useDemoData } from '@/features/demo/components/store';
import { groupedClasses } from '@/features/demo/selectors';

export default function DemoTeacherClasses() {
  const data = useDemoData();
  const { groups, oneToOne } = groupedClasses(data);

  return (
    <ClassList groups={groups} oneToOne={oneToOne} now={new Date(data.now)} />
  );
}
