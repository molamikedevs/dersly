'use client';

import Overview from '@/features/classes/components/overview';
import { useDemoData } from '@/features/demo/components/store';
import {
  classIdsWithHomework,
  groupedClasses,
} from '@/features/demo/selectors';

export default function DemoTeacherToday() {
  const data = useDemoData();
  const { groups, oneToOne } = groupedClasses(data);

  return (
    <Overview
      groups={groups}
      oneToOne={oneToOne}
      withHomework={classIdsWithHomework(data)}
      // The moment the demo opened, so the server and the browser agree
      now={new Date(data.now)}
    />
  );
}
