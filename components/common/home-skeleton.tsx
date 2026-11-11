import { Skeleton } from '@/components/ui/skeleton';

// Same shape as the student home: the lesson card, the week list, homework,
// the word tiles and practice, with materials in the side column
function WeekRows({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Skeleton className="h-7 w-32" />
      <div className="mt-3 flex flex-col gap-1">
        {['w-28', 'w-24', 'w-28', 'w-20'].map((width, index) => (
          <div key={index} className="flex min-h-13 items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <Skeleton className={`h-4 ${width}`} />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeSkeleton() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-10 sm:gap-10"
    >
      <span role="status" className="sr-only">
        Loading your home page
      </span>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-56 max-w-full sm:h-12 sm:w-80" />
        <Skeleton className="h-4 w-44" />
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-14">
        <div className="flex min-w-0 flex-col gap-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 rounded-3xl bg-primary p-6 sm:p-9">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-24 bg-primary-foreground/15" />
                <Skeleton className="h-10 w-64 max-w-full bg-primary-foreground/15 sm:h-14 sm:w-96" />
                <Skeleton className="h-5 w-48 bg-primary-foreground/15" />
                <Skeleton className="h-4 w-56 max-w-full bg-primary-foreground/15" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl bg-primary-foreground/15 sm:w-40" />
            </div>

            <WeekRows className="lg:hidden" />
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-12 w-full rounded-xl sm:w-40" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3">
              {[0, 1, 2, 3, 4].map((index) => (
                <Skeleton key={index} className="h-22 rounded-2xl" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Skeleton className="h-7 w-28" />
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-10">
          <WeekRows className="hidden lg:block" />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-4 w-14" />
            </div>
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex flex-col gap-2 py-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
