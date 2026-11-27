import { Skeleton } from '@/components/ui/skeleton';
import MaterialListSkeleton from '@/features/materials/components/material-list-skeleton';

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-16"
    >
      <span role="status" className="sr-only">
        Loading materials
      </span>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-40 sm:h-12 sm:w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <Skeleton className="h-10 w-64 rounded-xl" />

      <MaterialListSkeleton kind="link" />
    </div>
  );
}
