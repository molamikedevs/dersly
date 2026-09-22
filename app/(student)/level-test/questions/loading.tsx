import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      aria-busy
      className="mx-auto flex min-h-[70svh] w-full max-w-lg flex-col pb-16"
    >
      <span role="status" className="sr-only">
        Loading the test
      </span>

      <div className="flex items-center gap-4">
        <Skeleton className="h-2 flex-1 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </div>

      <div className="mt-12 flex flex-col">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-9 w-full" />
        <Skeleton className="mt-2 h-9 w-2/3" />

        <div className="mt-10 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-14 items-center gap-4 rounded-xl border border-border bg-card px-4 py-3"
            >
              <Skeleton className="size-8 shrink-0 rounded-lg" />
              <Skeleton className="h-4 w-2/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
