'use client';

import { useDemoData } from '@/features/demo/components/store';
import { viewerHome } from '@/features/demo/selectors';
import StudentHomeView from '@/features/students/components/student-home';

export default function DemoStudentHome() {
  const data = useDemoData();
  const home = viewerHome(data);

  // The invented student is always in a class, so this never shows
  if (!home) return null;

  return <StudentHomeView data={home} now={new Date(data.now)} />;
}
