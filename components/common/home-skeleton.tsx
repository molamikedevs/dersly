import { Skeleton } from '@/components/ui/skeleton';

export default function HomeSkeleton() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-8 pb-10 sm:gap-10"
    >
      <span role="status" className="sr-only">
        Loading your home page
      </span>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-10 w-72 max-w-full sm:h-12 sm:w-96" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-col gap-3 rounded-3xl bg-primary p-6 sm:p-9">
            <Skeleton className="h-3 w-28 bg-primary-foreground/15" />
            <Skeleton className="h-10 w-64 max-w-full bg-primary-foreground/15 sm:h-14 sm:w-80" />
            <Skeleton className="h-4 w-48 bg-primary-foreground/15" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-4 w-14" />
            </div>

            <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:p-7">
              <div className="flex flex-col gap-2.5">
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/5" />
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-muted p-3 sm:gap-4">
                <Skeleton className="size-11 shrink-0 rounded-lg" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-11 w-20 shrink-0 rounded-lg" />
                <Skeleton className="size-11 shrink-0 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-14" />
          </div>

          <div className="flex flex-col rounded-2xl border border-border bg-card p-2">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex items-center gap-3.5 p-3">
                <Skeleton className="aspect-video w-24 shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
