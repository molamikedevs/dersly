import { Users } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import PageHeader from '@/components/common/page-header';
import Pagination from '@/components/common/pagination';
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

export const metadata = { title: 'Students' };

const headClass =
  'h-12 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground';

export default async function Students({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getStudents({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const students = data?.students ?? [];

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16">
      <PageHeader
        title="Students"
        subText={
          students.length === 1
            ? '1 enrolment across your classes'
            : `${students.length} enrolments across your classes`
        }
      />

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
          <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
            <ul className="divide-y divide-border md:hidden">
              {students.map((item) => (
                <StudentCard
                  key={`${item.student.id}-${item.class.id}`}
                  data={item}
                />
              ))}
            </ul>

            <div className="hidden min-w-0 md:block">
              <Table className="w-full table-fixed">
                <TableHeader className="bg-muted">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className={`w-[28%] ${headClass}`}>
                      Student
                    </TableHead>
                    <TableHead className={`w-[30%] ${headClass}`}>
                      Email
                    </TableHead>
                    <TableHead className={`w-[22%] ${headClass}`}>
                      Class
                    </TableHead>
                    <TableHead className={`w-[20%] ${headClass}`}>
                      Level
                    </TableHead>
                    <TableHead
                      className={`hidden w-[18%] lg:table-cell ${headClass}`}
                    >
                      Last seen
                    </TableHead>
                    <TableHead
                      className={`hidden w-[20%] xl:table-cell ${headClass}`}
                    >
                      Schedule
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="[&_td]:px-5">
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

      <Pagination isNext={data?.isNext ?? false} />
    </div>
  );
}
