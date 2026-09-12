import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

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
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Overview
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        What needs your attention today.
      </p>

      <section className="mt-8">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Needs review
        </h2>

        {needsReview.length === 0 ? (
          <div className="mt-4 flex items-center gap-3 rounded-lg border bg-card px-4 py-5 text-sm">
            <CheckCircle2 className="size-5 text-success" aria-hidden />
            <span className="text-muted-foreground">
              Nothing waiting. Every submission has been reviewed.
            </span>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
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

      <section className="mt-8">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Homework posted
        </h2>

        <ul className="mt-4 divide-y rounded-lg border bg-card">
          {latestByClass.map(({ class: item, current }) => (
            <li key={item.id} className="flex items-center gap-3 px-4 py-3">
              <Link
                href={`/dashboard/classes/${item.id}`}
                className="min-w-0 flex-1 truncate text-sm font-medium text-foreground hover:underline"
              >
                {item.name}
              </Link>

              {current ? (
                <span className="truncate text-sm text-muted-foreground">
                  {current.title}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm text-warning">
                  <AlertCircle className="size-4" aria-hidden />
                  Nothing posted
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
