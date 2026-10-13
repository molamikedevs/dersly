import ClassList from '@/features/classes/components/class-list';
import { getGroupedClasses } from '@/features/classes/queries';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'Classes' };

export default async function Page({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getGroupedClasses({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
  });

  return (
    <ClassList
      groups={data?.groups ?? []}
      oneToOne={data?.private ?? []}
      now={new Date()}
      success={success}
      error={error}
    />
  );
}
