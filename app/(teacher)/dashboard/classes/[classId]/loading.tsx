import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-16"
    >
      <span role="status" className="sr-only">
        Loading class
      </span>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-24 rounded-lg" />

        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-9 w-52 max-w-full sm:h-12 sm:w-72" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
      </div>

      {/* Pill tabs + content skeleton */}
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-72 max-w-full rounded-xl" />

        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-56 max-w-full" />
          <Skeleton className="h-11 w-36 shrink-0 rounded-xl" />
        </div>

        <div className="surface-card flex flex-col overflow-hidden">
          {['w-48', 'w-40'].map((width, index) => (
            <div
              key={index}
              className="surface-row flex flex-col gap-2 px-5 py-4 sm:px-6"
            >
              <Skeleton className={`h-5 ${width}`} />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
