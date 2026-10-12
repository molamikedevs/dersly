import { Skeleton } from '@/components/ui/skeleton';

// Mirrors the level test start page block for block
export default function Loading() {
  return (
    <div aria-busy className="mx-auto flex w-full max-w-lg flex-col pb-10">
      <span role="status" className="sr-only">
        Loading the level test
      </span>

      <Skeleton className="h-10 w-80 max-w-full sm:h-12" />
      <Skeleton className="mt-2 h-10 w-48 sm:hidden" />

      <Skeleton className="mt-5 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />

      <div className="mt-8 flex flex-col divide-y divide-border border-y border-border">
        {['w-60', 'w-72', 'w-64'].map((width) => (
          <div key={width} className="flex gap-4 py-4">
            <Skeleton className="h-5 w-5 shrink-0" />
            <Skeleton className={`h-5 ${width} max-w-full`} />
          </div>
        ))}
      </div>

      <Skeleton className="mt-6 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-1/2" />

      <Skeleton className="mt-8 h-12 w-full rounded-xl" />
    </div>
  );
}
