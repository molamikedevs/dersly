import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

import PageHeader from '@/components/common/page-header';
import { getClasses } from '@/features/classes/queries';
import { getAllHomework } from '@/features/homework/queries';

export default async function Dashboard() {
  const [classResult, homeworkResult] = await Promise.all([
    getClasses({ page: 1, pageSize: 50 }),
    getAllHomework({ page: 1, pageSize: 100 }),
  ]);

  const classes = classResult.data?.classes ?? [];
  const homework = homeworkResult.data?.homework ?? [];

  const latestByClass = classes.map((item) => ({
    class: item,
    current: homework.find((work) => work.classId === item.id) ?? null,
  }));

  const missing = latestByClass.filter(({ current }) => !current).length;

  return (
    <div className="pb-16">
      <PageHeader title="Overview" subText="What needs your attention today." />

      <section className="mt-10 sm:mt-12">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Homework posted
          </h2>
          {missing > 0 && (
            <span className="text-sm font-medium text-warning">
              {missing} missing
            </span>
          )}
        </div>

        <ul className="mt-4 divide-y divide-border">
          {latestByClass.map(({ class: item, current }) => (
            <li key={item.id}>
              <Link
                href={`/dashboard/classes/${item.id}`}
                className="-mx-2 flex min-h-11 items-center gap-4 rounded-md px-2 py-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {item.name}
                </span>

                {current ? (
                  <span className="min-w-0 max-w-[55%] truncate text-sm text-muted-foreground">
                    {current.title}
                  </span>
                ) : (
                  <span className="flex shrink-0 items-center gap-1.5 text-sm text-warning">
                    <AlertCircle className="size-4" aria-hidden />
                    Nothing posted
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
