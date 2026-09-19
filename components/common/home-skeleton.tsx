import { Skeleton } from '@/components/ui/skeleton';

export default function HomeSkeleton() {
  return (
    <div
      aria-busy
      aria-live="polite"
      className="flex max-w-5xl flex-col gap-6 pb-8 sm:gap-7"
    >
      <span className="sr-only">Loading your home page</span>

      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-32" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-5">
        <div className="flex flex-col gap-6 lg:col-span-2 lg:gap-5">
          <div className="rounded-lg bg-accent p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-6 w-44" />
            <Skeleton className="mt-2 h-4 w-32" />
            <Skeleton className="mt-4 h-12 w-full rounded-md" />
          </div>

          <div>
            <Skeleton className="h-4 w-32" />
            <div className="mt-2 rounded-lg bg-card p-4 shadow-sm sm:p-5">
              <Skeleton className="h-5 w-52" />
              <Skeleton className="mt-2.5 h-4 w-full" />
              <Skeleton className="mt-1.5 h-4 w-3/5" />
              <Skeleton className="mt-4 h-14 w-full rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:gap-5">
          <div className="flex items-center justify-between gap-4 rounded-lg bg-card p-4 shadow-sm">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-6" />
          </div>

          <div>
            <Skeleton className="h-4 w-32" />
            <div className="mt-2 divide-y divide-border rounded-lg bg-card px-3.5 shadow-sm">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="flex min-h-14 items-center gap-3 py-2"
                >
                  <Skeleton className="size-9 shrink-0 rounded-md" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="mt-1.5 h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
