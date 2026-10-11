import { Skeleton } from '@/components/ui/skeleton';

const ROWS = ['w-3/5', 'w-2/5', 'w-1/2'];

// Mirrors the student home block for block, so nothing jumps when the real
// page replaces it.
export default function HomeSkeleton() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-10 sm:gap-10"
    >
      <span role="status" className="sr-only">
        Loading your home page
      </span>

      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-9 w-48 max-w-full sm:h-12 sm:w-72" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-14">
        <div className="flex min-w-0 flex-col gap-10">
          <div className="flex flex-col gap-6 rounded-3xl bg-primary p-6 sm:p-9">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-24 bg-primary-foreground/15" />
              <Skeleton className="h-10 w-64 max-w-full bg-primary-foreground/15 sm:h-14 sm:w-96" />
              <Skeleton className="h-5 w-48 bg-primary-foreground/15" />
              <Skeleton className="h-4 w-56 max-w-full bg-primary-foreground/15" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl bg-primary-foreground/15 sm:w-40" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-14" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/5" />
              </div>
              <Skeleton className="h-17 w-full rounded-xl" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-28" />
            <div className="flex flex-col divide-y divide-border border-y border-border">
              {ROWS.map((width) => (
                <div
                  key={width}
                  className="flex min-h-13 items-center justify-between gap-4"
                >
                  <Skeleton className={`h-4 ${width}`} />
                  <Skeleton className="size-4 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-14" />
          </div>

          <div className="flex flex-col divide-y divide-border border-y border-border">
            {ROWS.map((width) => (
              <div
                key={width}
                className="flex min-h-14 flex-col justify-center gap-2 py-3"
              >
                <Skeleton className={`h-4 ${width}`} />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
