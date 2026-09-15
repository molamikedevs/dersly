import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="pb-16">
      <div className="space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="mt-8 space-y-10">
        {[2, 3].map((count, section) => (
          <div key={section}>
            <Skeleton className="h-6 w-40" />

            <div className="mt-3 divide-y divide-border">
              {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex items-start gap-4 py-3">
                  <Skeleton className="size-9 shrink-0 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
