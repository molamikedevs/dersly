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

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-10 w-64 max-w-full sm:h-12 sm:w-80" />
              <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>

          <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-36 rounded-xl" />
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

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {['w-36', 'w-44', 'w-32'].map((width, index) => (
            <div
              key={index}
              className="flex min-h-16 items-center gap-3.5 px-5 py-3 sm:px-6"
            >
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <Skeleton className={`h-4 ${width}`} />
              <Skeleton className="ml-auto h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
