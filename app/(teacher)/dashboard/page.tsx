import Link from 'next/link';

import RefreshOnReturn from '@/components/common/refresh-on-return';
import Overview from '@/features/classes/components/overview';
import { getGroupedClasses } from '@/features/classes/queries';
import { getClassIdsWithHomework } from '@/features/homework/queries';

export const metadata = {
  title: 'Overview',
};

const BUTTON =
  'inline-flex h-12 touch-manipulation items-center justify-center self-start rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]';

// Shown when the classes cannot be read, so a failed query is never a blank
// page.
function OverviewError() {
  return (
    <div role="alert" className="flex max-w-prose flex-col gap-4 pb-10">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Today did not load
      </h1>
      <p className="text-base leading-relaxed text-muted-foreground">
        Check your internet connection and try again.
      </p>
      <Link href="/dashboard" className={BUTTON}>
        Try again
      </Link>
    </div>
  );
}

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
