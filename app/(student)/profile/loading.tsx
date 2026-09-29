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
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <Skeleton className="h-3 w-12" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Skeleton className="h-7 w-36" />

        <div className="rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-6 py-5">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-11 w-32 shrink-0 rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
