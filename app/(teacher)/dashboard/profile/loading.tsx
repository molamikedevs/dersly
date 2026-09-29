import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-3xl min-w-0 flex-col gap-10 pb-16"
    >
      <span role="status" className="sr-only">
        Loading your profile
      </span>

      <Skeleton className="h-10 w-40 sm:h-12 sm:w-48" />

      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <Skeleton className="size-24 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-col gap-2">
            <Skeleton className="h-8 w-48 sm:h-9 sm:w-56" />
            <Skeleton className="h-4 w-56 max-w-full" />
            <Skeleton className="mt-1 h-7 w-20 rounded-full" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Skeleton className="h-7 w-28" />

        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="flex min-w-0 flex-col gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-14 shrink-0 rounded-full" />
          </div>

          <div className="px-6 py-5">
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </section>
    </div>
  );
}
