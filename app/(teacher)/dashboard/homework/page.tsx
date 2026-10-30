import HomeworkGroups from '@/features/homework/components/homework-groups';
import { getGroupedHomework } from '@/features/homework/queries';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'Homework' };

export default async function HomeWork({ searchParams }: RouteParams) {
  const { page } = await searchParams;

  const { data, success, error } = await getGroupedHomework({
    page: Number(page) || 1,
    pageSize: 10,
  });

  return (
    <HomeworkGroups
      groups={data?.groups}
      isNext={data?.isNext ?? false}
      success={success}
      error={error}
    />
  );
}
