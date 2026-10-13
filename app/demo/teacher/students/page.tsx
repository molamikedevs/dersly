'use client';

import { Users } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import PageHeader from '@/components/common/page-header';
import { useDemoData } from '@/features/demo/components/store';
import { studentRecords } from '@/features/demo/selectors';
import StudentList from '@/features/students/components/student-list';

function countLine(total: number) {
  return total === 1
    ? '1 enrolment across your classes'
    : `${total} enrolments across your classes`;
}

// Every invented student fits on one page, so there is no pagination
export default function DemoTeacherStudents() {
  const students = studentRecords(useDemoData());

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-8 pb-16">
      <PageHeader title="Students" subText={countLine(students.length)} />

      <DataRenderer
        success
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
    </div>
  );
}
