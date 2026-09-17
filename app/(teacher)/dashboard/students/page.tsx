import { Users } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import PageHeader from '@/components/common/page-header';
import StudentRow from '@/features/students/components/student-row';
import { getStudents } from '@/features/students/queries';
import { RouteParams } from '@/types/global';

export default async function Students({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getStudents({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 50,
  });

  const students = data?.students ?? [];
  console.log(data);

  return (
    <div className="pb-16">
      <PageHeader
        title="Students"
        subText={
          students.length === 1
            ? '1 student across your classes'
            : `${students.length} students across your classes`
        }
      />

      <div className="mt-8">
        <DataRenderer
          success={success}
          error={error}
          data={students}
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
