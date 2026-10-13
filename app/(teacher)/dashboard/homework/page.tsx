import HomeworkGroups from '@/features/homework/components/homework-groups';
import { getGroupedHomework } from '@/features/homework/queries';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'Homework' };

export default async function HomeWork({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getGroupedHomework({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
  });

  return (
    <HomeworkGroups groups={data?.groups} success={success} error={error} />
  );
}
