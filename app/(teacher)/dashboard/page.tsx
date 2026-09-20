import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import PageHeader from '@/components/common/page-header';
import { getClasses } from '@/features/classes/queries';
import { getAllHomework } from '@/features/homework/queries';

export const metadata = {
  title: 'Dashboard',
};

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
    <div className="max-w-5xl pb-16">
      <PageHeader title="Overview" subText="What needs your attention today." />

      <section className="mt-10 sm:mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Homework posted
          </h2>

          {missing > 0 ? (
            <span className="flex items-center gap-1.5 text-sm font-medium text-warning">
              <AlertCircle className="size-4" aria-hidden />
              {missing === 1
                ? '1 class needs homework'
                : `${missing} classes need homework`}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-success" aria-hidden />
              Every class has homework
            </span>
          )}
        </div>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {latestByClass.map(({ class: item, current }) => (
            <li key={item.id}>
              <Link
                href={`/dashboard/classes/${item.id}`}
                className="flex h-full min-h-11 flex-col rounded-lg bg-card p-4 shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <p className="truncate font-medium text-foreground">
                  {item.name}
                </p>

                {item.schedule && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {item.schedule}
                  </p>
                )}

                <div className="mt-4 border-t border-border pt-3">
                  {current ? (
                    <>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Latest
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-foreground">
                        {current.title}
                      </p>
                    </>
                  ) : (
                    <p className="flex items-center gap-1.5 text-sm font-medium text-warning">
                      <AlertCircle className="size-4 shrink-0" aria-hidden />
                      Nothing posted
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
