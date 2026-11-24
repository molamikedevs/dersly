import OverviewError from '@/components/common/overview-error';
import RefreshOnReturn from '@/components/common/refresh-on-return';
import Overview from '@/features/classes/components/overview';
import { getGroupedClasses } from '@/features/classes/queries';
import { getClassIdsWithHomework } from '@/features/homework/queries';

export const metadata = {
  title: 'Overview',
};

export default async function Page() {
  const [classResult, homeworkResult] = await Promise.all([
    getGroupedClasses({ page: 1, pageSize: 50 }),
    getClassIdsWithHomework(),
  ]);

  if (!classResult.success || !classResult.data) return <OverviewError />;

  const { groups, private: oneToOne } = classResult.data;

  const withHomework =
    homeworkResult.success && homeworkResult.data
      ? new Set(homeworkResult.data)
      : null;

  return (
    <>
      <RefreshOnReturn />
      <Overview
        groups={groups}
        oneToOne={oneToOne}
        withHomework={withHomework}
        now={new Date()}
      />
    </>
  );
}
