import type { Metadata } from 'next';

import DemoTeacherShell from '@/features/demo/components/demo-teacher-shell';
import { DemoSideProvider } from '@/features/demo/components/store';

export const metadata: Metadata = {
  title: 'Teacher',
};

// No viewport-fit=cover here, unlike the real layout. The demo is opened in
// a browser tab, never from the home screen.
export default function DemoTeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoSideProvider side="teacher">
      <DemoTeacherShell>{children}</DemoTeacherShell>
    </DemoSideProvider>
  );
}
