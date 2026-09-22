import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      aria-busy
      className="mx-auto flex w-full max-w-lg flex-col items-center pb-16"
    >
      <span role="status" className="sr-only">
        Loading your result
      </span>

      <div className="flex w-full flex-col items-center gap-4 rounded-3xl bg-primary px-6 py-10 sm:px-10 sm:py-12">
        <Skeleton className="h-3 w-24 bg-primary-foreground/15" />
        <Skeleton className="h-14 w-56 bg-primary-foreground/15 sm:h-16" />
        <Skeleton className="h-7 w-40 rounded-full bg-primary-foreground/15" />
      </div>

      <Skeleton className="mt-8 h-4 w-full max-w-sm" />
      <Skeleton className="mt-2 h-4 w-3/4 max-w-sm" />

      <Skeleton className="mt-10 h-12 w-full rounded-xl" />
      <Skeleton className="mt-3 h-12 w-full rounded-xl" />
    </div>
  );
}
