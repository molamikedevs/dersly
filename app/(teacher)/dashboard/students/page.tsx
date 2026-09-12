import { Users } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import StudentRow from '@/features/students/components/student-row';
import { mockStudents } from '@/features/students/mock';

export default function Students() {
  const result = { success: true, data: mockStudents };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Students
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {result.data.length} students across your classes
      </p>

      <div className="mt-8">
        <DataRenderer
          success={result.success}
          data={result.data}
          empty={{
            icon: Users,
            title: 'No students yet',
            message:
              'Students appear here once they join a class with your invite code.',
            button: { text: 'Go to classes', href: '/dashboard/classes' },
          }}
          render={(students) => (
            <div className="flex flex-col gap-3">
              {students.map((item) => (
                <StudentRow key={item.id} data={item} />
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
}
