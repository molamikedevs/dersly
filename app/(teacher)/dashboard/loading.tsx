import { Skeleton } from '@/components/ui/skeleton';

const LESSONS = ['w-28', 'w-40', 'w-32'];
const ASIDE = [
  { heading: 'w-32', rows: ['w-28'] },
  { heading: 'w-48', rows: ['w-24', 'w-36'] },
];

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-10 sm:gap-10"
    >
      <span role="status" className="sr-only">
        Loading today
      </span>

      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-9 w-56 max-w-full sm:h-12 sm:w-80" />
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-14">
        <div className="flex min-w-0 flex-col">
          <div className="mb-3 flex flex-col gap-6 rounded-3xl bg-primary p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-20 bg-primary-foreground/15" />
              <Skeleton className="h-10 w-32 bg-primary-foreground/15 sm:h-12 sm:w-40" />
              <Skeleton className="h-5 w-40 bg-primary-foreground/15" />
              <Skeleton className="h-4 w-32 bg-primary-foreground/15" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl bg-primary-foreground/15 sm:w-36" />
          </div>

          <div className="flex flex-col divide-y divide-border border-b border-border">
            {LESSONS.map((width) => (
              <div key={width} className="flex items-center gap-4 py-3.5">
                <Skeleton className="h-7 w-18 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className={`h-4 ${width}`} />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-11 w-20 shrink-0 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-10">
          {ASIDE.map(({ heading, rows }) => (
            <div key={heading} className="flex flex-col gap-3">
              <Skeleton className={`h-6 ${heading} max-w-full`} />
              <div className="flex flex-col divide-y divide-border border-y border-border">
                {rows.map((width) => (
                  <div
                    key={width}
                    className="flex min-h-14 flex-col justify-center gap-2 py-3"
                  >
                    <Skeleton className={`h-4 ${width}`} />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
