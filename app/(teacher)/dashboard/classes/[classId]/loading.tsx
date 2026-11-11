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

        <div className="flex flex-col gap-6">
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

      {/* The tabs of a one-to-one class, then the open tab's list */}
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-80 max-w-full rounded-lg" />

        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-64 max-w-full" />
          <Skeleton className="h-11 w-36 shrink-0 rounded-xl" />
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {['w-36', 'w-44', 'w-32'].map((width, index) => (
            <div key={index} className="flex flex-col gap-2 px-5 py-4 sm:px-6">
              <Skeleton className={`h-5 ${width}`} />
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-2/3 max-w-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
