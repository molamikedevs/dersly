import type { Metadata } from 'next';

import DemoStudentShell from '@/features/demo/components/demo-student-shell';
import { DemoSideProvider } from '@/features/demo/components/store';

export const metadata: Metadata = {
  title: 'Student',
};

// No viewport-fit=cover, for the same reason as the teacher demo layout
export default function DemoStudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoSideProvider side="student">
      <DemoStudentShell>{children}</DemoStudentShell>
    </DemoSideProvider>
  );
}
