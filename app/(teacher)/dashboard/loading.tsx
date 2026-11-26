import { Skeleton } from '@/components/ui/skeleton';

const LESSONS = ['w-28', 'w-40', 'w-32'];
const ASIDE = [
  { heading: 'w-32', rows: ['w-28', 'w-24'] },
  { heading: 'w-28', rows: ['w-36'] },
];

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-10 sm:gap-9"
    >
      <span role="status" className="sr-only">
        Loading today
      </span>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-9 w-56 max-w-full sm:h-12 sm:w-80" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 lg:gap-2.5">
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-2xl border border-border-subtle bg-card/75 p-3.5"
          >
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-7 w-8" />
            <Skeleton className="mt-1 h-3 w-14" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-12">
        <div className="flex min-w-0 flex-col gap-4">
          <Skeleton className="h-6 w-28" />

          <div className="surface-hero flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-7">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3.5 w-20 bg-white/10" />
              <Skeleton className="h-10 w-32 bg-white/10 sm:h-12 sm:w-44" />
              <Skeleton className="h-5 w-40 bg-white/10" />
              <Skeleton className="h-4 w-32 bg-white/10" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl bg-white/15 sm:w-32" />
          </div>

          <div className="surface-card flex flex-col overflow-hidden">
            {LESSONS.map((width) => (
              <div
                key={width}
                className="surface-row flex items-center gap-4 px-4 py-3.5"
              >
                <Skeleton className="h-7 w-16 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className={`h-4 ${width}`} />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-9 w-20 shrink-0 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-8">
          {ASIDE.map(({ heading, rows }) => (
            <div key={heading} className="flex flex-col gap-3">
              <Skeleton className={`h-6 ${heading} max-w-full`} />
              <div className="surface-card flex flex-col overflow-hidden">
                {rows.map((width) => (
                  <div
                    key={width}
                    className="surface-row flex min-h-14 flex-col justify-center gap-2 px-4 py-3"
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
