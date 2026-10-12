import { Skeleton } from '@/components/ui/skeleton';

// Mirrors one question block for block
export default function Loading() {
  return (
    <div
      aria-busy
      className="mx-auto flex min-h-[70svh] w-full max-w-lg flex-col"
    >
      <span role="status" className="sr-only">
        Loading the test
      </span>

      <div className="flex items-center gap-3">
        <div className="size-11 shrink-0" />
        <Skeleton className="h-1.5 flex-1 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </div>

      <div className="mt-10 flex flex-col">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="mt-2 h-9 w-2/3" />

        <div className="mt-8 flex flex-col gap-3">
          {['w-2/5', 'w-1/3', 'w-1/2', 'w-1/4'].map((width) => (
            <div
              key={width}
              className="flex min-h-15 items-center gap-4 rounded-2xl border border-border bg-card px-5 py-3.5"
            >
              <Skeleton className="h-4 w-4 shrink-0" />
              <Skeleton className={`h-5 ${width}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
