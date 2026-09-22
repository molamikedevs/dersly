import { Skeleton } from '@/components/ui/skeleton';

export default function MaterialSkeleton() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-4xl min-w-0 flex-col gap-6 pb-16"
    >
      <span role="status" className="sr-only">
        Loading this material
      </span>

      <Skeleton className="h-11 w-44 rounded-lg" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-3/4 max-w-lg" />
        <Skeleton className="h-9 w-2/5 max-w-xs sm:hidden" />
      </div>

      <Skeleton className="aspect-video w-full rounded-2xl" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full max-w-prose" />
        <Skeleton className="h-4 w-3/5 max-w-md" />
      </div>
    </div>
  );
}
