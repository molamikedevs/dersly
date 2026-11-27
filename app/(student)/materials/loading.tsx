import { Skeleton } from '@/components/ui/skeleton';
import MaterialListSkeleton from '@/features/materials/components/material-list-skeleton';

export default function Loading() {
  return (
    <div aria-busy className="flex w-full min-w-0 flex-col gap-7 pb-16">
      <span role="status" className="sr-only">
        Loading materials
      </span>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-40 sm:h-12 sm:w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-9" />
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
      </div>

      <MaterialListSkeleton kind="link" />
    </div>
  );
}
