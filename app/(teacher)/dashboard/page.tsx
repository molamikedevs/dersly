import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import PageHeader from '@/components/common/page-header';
import { mockClasses } from '@/features/classes/mock';
import HomeWorkCard from '@/features/home-work/components/home-work-card';
import { mockhomeWorks } from '@/features/home-work/mock';

export default function Dashboard() {
  const needsReview = mockhomeWorks.filter(
    (item) => item.submission && !item.submission.reviewedAt,
  );

  const latestByClass = mockClasses.map((item) => {
    const posted = mockhomeWorks
      .filter((work) => work.classId === item.id)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    return { class: item, current: posted[0] ?? null };
  });

  return (
    <div className="pb-16">
      <PageHeader title="Overview" subText="What needs your attention today." />

      <section className="mt-10 sm:mt-12">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Needs review
          </h2>
          {needsReview.length > 0 && (
            <span className="text-sm font-medium text-muted-foreground">
              {needsReview.length}
            </span>
          )}
        </div>

        {needsReview.length === 0 ? (
          <div className="mt-5 flex items-center gap-3 py-6 text-sm">
            <CheckCircle2
              className="size-5 shrink-0 text-success"
              aria-hidden
            />
            <span className="text-muted-foreground">
              Nothing waiting. Every submission has been reviewed.
            </span>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-5">
            {needsReview.map((item) => {
              const owner = mockClasses.find((c) => c.id === item.classId);
              return (
                <HomeWorkCard
                  key={item.id}
                  data={item}
                  classType={owner?.type ?? 'one_to_one'}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-14 sm:mt-16">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Homework posted
        </h2>

        <ul className="mt-2 divide-y divide-border">
          {latestByClass.map(({ class: item, current }) => (
            <li key={item.id}>
              <Link
                href={`/dashboard/classes/${item.id}`}
                className="-mx-2 flex min-h-11 items-center gap-4 rounded-md px-2 py-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
