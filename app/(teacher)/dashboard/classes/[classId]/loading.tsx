import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="pb-16">
      <Skeleton className="mb-6 h-5 w-32" />

      <div className="border-b pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="h-11 w-36" />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-4 h-40 w-full rounded-lg" />
      </div>
    </div>
  );
}
