import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16"
    >
      <span role="status" className="sr-only">
        Loading class
      </span>

      <div className="flex flex-col gap-5">
        <Skeleton className="h-11 w-40 rounded-lg" />

        <div className="flex flex-col gap-6 border-b border-border pb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div className="flex min-w-0 flex-col gap-3">
              <Skeleton className="h-9 w-64 max-w-full sm:h-12 sm:w-96" />
              <Skeleton className="h-5 w-52 max-w-full" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-11 w-36 shrink-0 rounded-xl" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-col gap-2.5 p-6 sm:p-7">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-2/3 max-w-lg" />
          </div>
          <div className="flex items-center gap-4 border-t border-border bg-muted/50 px-6 py-4 sm:px-7">
            <Skeleton className="size-11 shrink-0 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-11 w-20 shrink-0 rounded-lg" />
            <Skeleton className="size-11 shrink-0 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-6" />
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {['w-36', 'w-44', 'w-32', 'w-40'].map((width, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-4"
            >
              <Skeleton className={`h-4 ${width}`} />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
