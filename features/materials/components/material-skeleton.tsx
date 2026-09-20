import { Skeleton } from '@/components/ui/skeleton';

export default function MaterialSkeleton() {
  return (
    <div aria-busy aria-live="polite" className="max-w-4xl pb-16">
      <span className="sr-only">Loading this material</span>

      <Skeleton className="h-4 w-36" />

      <Skeleton className="mt-6 aspect-video w-full rounded-lg" />

      <Skeleton className="mt-5 h-4 w-3/5 max-w-md" />
    </div>
  );
}
