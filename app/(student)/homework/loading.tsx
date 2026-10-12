import { Skeleton } from '@/components/ui/skeleton';

const EARLIER = ['w-56', 'w-44'];

// Mirrors the homework page block for block, so nothing jumps when the real
// page replaces it.
export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-4xl min-w-0 flex-col gap-7 pb-10 sm:gap-10"
    >
      <span role="status" className="sr-only">
        Loading your homework
      </span>

      <Skeleton className="h-9 w-44 sm:h-12 sm:w-56" />

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-6 w-72 max-w-full" />
            <Skeleton className="h-4 w-64 max-w-full" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl sm:w-40" />
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-24" />
          <div className="flex flex-col divide-y divide-border border-y border-border">
            {EARLIER.map((width) => (
              <div key={width} className="flex flex-col gap-4 py-6">
                <div className="flex flex-col gap-2.5">
                  <Skeleton className={`h-5 ${width} max-w-full`} />
                  <Skeleton className="h-4 w-60 max-w-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-11 w-32 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
