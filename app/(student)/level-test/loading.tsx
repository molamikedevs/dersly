import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      aria-busy
      className="mx-auto flex w-full max-w-lg flex-col items-center pb-16"
    >
      <span role="status" className="sr-only">
        Loading the level test
      </span>

      <Skeleton className="size-14 rounded-2xl" />

      <Skeleton className="mt-6 h-10 w-72 max-w-full sm:h-12 sm:w-96" />
      <Skeleton className="mt-2 h-10 w-40 sm:hidden" />

      <Skeleton className="mt-4 h-4 w-full max-w-sm" />
      <Skeleton className="mt-2 h-4 w-3/4 max-w-xs" />

      <div className="mt-10 w-full divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {[0, 1].map((index) => (
          <div key={index} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="size-10 shrink-0 rounded-lg" />
            <Skeleton className="h-4 w-52" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-6 h-4 w-80 max-w-full" />

      <Skeleton className="mt-8 h-12 w-full rounded-xl" />
    </div>
  );
}
