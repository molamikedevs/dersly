import { AlertCircle, ArrowUpRight, CheckCircle2, Wallet } from 'lucide-react';
import Link from 'next/link';

import PageHeader from '@/components/common/page-header';
import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { getClasses, getPaymentDue } from '@/features/classes/queries';
import { getAllHomework } from '@/features/homework/queries';

export const metadata = {
  title: 'Dashboard',
};

export default async function Dashboard() {
  const [classResult, homeworkResult, paymentResult] = await Promise.all([
    getClasses({ page: 1, pageSize: 50 }),
    getAllHomework({ page: 1, pageSize: 100 }),
    getPaymentDue(),
  ]);

  const classes = classResult.data?.classes ?? [];
  const homework = homeworkResult.data?.homework ?? [];

  const dueClassIds = new Set(
    (paymentResult.data ?? []).map((item) => item.classId),
  );
  const paymentDue = classes.filter((item) => dueClassIds.has(item.id));

  const latestByClass = classes.map((item) => ({
    class: item,
    current: homework.find((work) => work.classId === item.id) ?? null,
  }));

  const missing = latestByClass.filter(({ current }) => !current).length;

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16">
      <PageHeader title="Overview" subText="What needs your attention today." />

      {paymentDue.length > 0 && (
        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
              Payment due
            </h2>

            <span className="inline-flex items-center gap-2 rounded-full bg-warning-subtle px-3.5 py-1.5 text-sm font-semibold text-warning-subtle-foreground">
              <Wallet className="size-4" aria-hidden />
              {paymentDue.length === 1
                ? '1 student'
                : `${paymentDue.length} students`}
            </span>
          </div>

          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {paymentDue.map((item) => (
              <li key={item.id}>
                <Link
                  href="/dashboard/classes"
                  className="group flex min-h-11 items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      All {LESSONS_PER_PACKAGE} lessons done
                    </p>
                  </div>

                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
            Homework posted
          </h2>

          {missing > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-warning-subtle px-3.5 py-1.5 text-sm font-semibold text-warning-subtle-foreground">
              <AlertCircle className="size-4" aria-hidden />
              {missing === 1
                ? '1 class needs homework'
                : `${missing} classes need homework`}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-success-subtle px-3.5 py-1.5 text-sm font-semibold text-success-subtle-foreground">
              <CheckCircle2 className="size-4" aria-hidden />
              Every class has homework
            </span>
          )}
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestByClass.map(({ class: item, current }) => (
            <li key={item.id} className="min-w-0">
              <Link
                href={`/dashboard/classes/${item.id}`}
                className="group flex h-full flex-col gap-5 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-input-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-serif text-xl font-medium tracking-tight text-foreground">
                      {item.name}
                    </p>
                    {item.schedule && (
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {item.schedule}
                      </p>
                    )}
                  </div>

                  <ArrowUpRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    aria-hidden
                  />
                </div>

                <div className="mt-auto">
                  {current ? (
                    <div className="rounded-xl bg-muted px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Latest homework
                      </p>
                      <p className="mt-1 line-clamp-2 text-[15px] font-medium text-foreground">
                        {current.title}
                      </p>
                    </div>
                  ) : (
                    <p className="flex items-center gap-2 rounded-xl bg-warning-subtle px-4 py-3 text-sm font-semibold text-warning-subtle-foreground">
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
