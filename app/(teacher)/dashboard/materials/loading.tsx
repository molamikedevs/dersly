import { Skeleton } from '@/components/ui/skeleton';
import MaterialListSkeleton from '@/features/materials/components/material-list-skeleton';

export default function Loading() {
  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-44 sm:h-12 sm:w-52" />
          <Skeleton className="h-5 w-72 max-w-full" />
        </div>
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>

      <Skeleton className="h-13 w-64 rounded-xl" />

      <MaterialListSkeleton kind="link" />
    </div>
  );
}
