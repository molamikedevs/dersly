import { Users } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import PageHeader from '@/components/common/page-header';
import StudentRow from '@/features/students/components/student-row';
import { mockStudents } from '@/features/students/mock';

export default function Students() {
  const result = { success: true, data: mockStudents };

  return (
    <div className="pb-16">
      <PageHeader
        title="Students"
        subText={`${result.data.length} students across your classes`}
      />

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
            <ul className="divide-y divide-border">
              {students.map((item) => (
                <StudentRow key={item.id} data={item} />
              ))}
            </ul>
          )}
        />
      </div>
    </div>
  );
}
