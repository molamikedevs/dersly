import { Users } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import PageHeader from '@/components/common/page-header';
import Pagination from '@/components/common/pagination';
import StudentList from '@/features/students/components/student-list';
import { getStudents } from '@/features/students/queries';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'Students' };

function countLine(total: number) {
  return total === 1
    ? '1 enrolment across your classes'
    : `${total} enrolments across your classes`;
}

export default async function Students({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getStudents({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const students = data?.students ?? [];

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-8 pb-16">
      <PageHeader title="Students" subText={countLine(data?.total ?? 0)} />

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
        render={(students) => <StudentList students={students} />}
      />

      <Pagination isNext={data?.isNext ?? false} />
    </div>
  );
}
