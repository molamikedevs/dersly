import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="pb-16">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-11 w-32" />
      </div>

      <div className="mt-8 space-y-10">
        {[3, 3].map((count, section) => (
          <div key={section}>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <span className="h-px flex-1 bg-border" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
