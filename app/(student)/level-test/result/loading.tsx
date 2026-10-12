import { Skeleton } from '@/components/ui/skeleton';

// Mirrors the result page block for block
export default function Loading() {
  return (
    <div aria-busy className="mx-auto flex w-full max-w-lg flex-col pb-10">
      <span role="status" className="sr-only">
        Loading your result
      </span>

      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-14 w-64 max-w-full sm:h-16" />

      <Skeleton className="mt-6 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-3 h-4 w-1/2" />

      <div className="mt-8 grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-1.5 rounded-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-10 h-6 w-40" />
      <div className="mt-3 flex flex-col divide-y divide-border border-y border-border">
        {['w-4/5', 'w-3/4'].map((width) => (
          <div key={width} className="py-4">
            <Skeleton className={`h-4 ${width}`} />
          </div>
        ))}
      </div>

      <Skeleton className="mt-10 h-12 w-full rounded-xl" />
      <Skeleton className="mt-2 h-12 w-full rounded-xl" />
    </div>
  );
}
