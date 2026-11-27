import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      aria-busy
      className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-6 pb-16"
    >
      <span role="status" className="sr-only">
        Loading this material
      </span>

      <Skeleton className="h-8 w-36 rounded-lg" />

      <div className="surface-card flex flex-col overflow-hidden">
        <div className="flex flex-col gap-3.5 border-b border-border-subtle p-6 sm:p-9">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-9 w-3/4 max-w-lg sm:h-10" />
          <Skeleton className="h-4 w-full max-w-prose" />
        </div>

        <div className="flex flex-col gap-4 px-6 py-7 sm:px-9 sm:py-9">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="mt-4 h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}
