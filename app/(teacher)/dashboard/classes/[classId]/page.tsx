import { notFound } from 'next/navigation';

import BackLink from '@/components/common/back-link';
import ClassHeader from '@/features/classes/components/class-header';
import StudentsSection from '@/features/classes/components/student-section';
import { mockStudents } from '@/features/classes/constants/index';
import { mockClasses } from '@/features/classes/mock';
import HomeWorkSection from '@/features/home-work/components/home-work-section';
import { mockhomeWorks } from '@/features/home-work/mock';
import { RouteParams } from '@/types/global';

export default async function Page({
  params,
}: RouteParams<{ classId: string }>) {
  const { classId } = await params;
  const data = mockClasses.find((item) => item.id === classId);

  if (!data) notFound();

  return (
    <div className="pb-16">
      <BackLink
        href="/dashboard/classes"
        label="Back to classes"
        className="mb-6"
      />
      <ClassHeader data={data} />
      <HomeWorkSection homeWork={mockhomeWorks} classType={data.type} />
      {data.type === 'course' && (
        <StudentsSection students={mockStudents} inviteCode={data.inviteCode} />
      )}
    </div>
  );
}
