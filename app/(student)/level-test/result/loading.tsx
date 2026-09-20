import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center pb-16 pt-8">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-10 w-48" />
      <Skeleton className="mt-4 h-4 w-32" />

      <Skeleton className="mt-7 h-4 w-full max-w-sm" />
      <Skeleton className="mt-2 h-4 w-3/4 max-w-sm" />

      <Skeleton className="mt-10 h-12 w-full rounded-md" />
      <Skeleton className="mt-3 h-12 w-full rounded-md" />
    </div>
  );
}
