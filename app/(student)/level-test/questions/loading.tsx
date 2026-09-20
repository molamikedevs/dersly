import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-lg flex-col pb-16 pt-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-1 flex-1 rounded-full" />
        <Skeleton className="h-4 w-10" />
      </div>

      <div className="mt-10">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="mt-2 h-7 w-2/3" />

        <div className="mt-8 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
