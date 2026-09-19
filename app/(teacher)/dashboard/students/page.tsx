import { Users } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import PageHeader from '@/components/common/page-header';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StudentRow, {
  StudentCard,
} from '@/features/students/components/student-row';
import { getStudents } from '@/features/students/queries';
import { RouteParams } from '@/types/global';

export default async function Students({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getStudents({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 50,
  });

  const students = data?.students ?? [];

  return (
    <div className="pb-16">
      <PageHeader
        title="Students"
        subText={
          students.length === 1
            ? '1 enrolment across your classes'
            : `${students.length} enrolments across your classes`
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
            <div className="rounded-lg bg-card shadow-sm">
              <ul className="divide-y divide-border md:hidden">
                {students.map((item) => (
                  <StudentCard
                    key={`${item.student.id}-${item.class.id}`}
                    data={item}
                  />
                ))}
              </ul>

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Student
                      </TableHead>
                      <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Email
                      </TableHead>
                      <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Class
                      </TableHead>
                      <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Level
                      </TableHead>
                      <TableHead className="hidden h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:table-cell">
                        Schedule
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="[&_td]:px-4">
                    {students.map((item) => (
                      <StudentRow
                        key={`${item.student.id}-${item.class.id}`}
                        data={item}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
