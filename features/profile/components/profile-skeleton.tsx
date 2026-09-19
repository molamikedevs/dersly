import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileSkeleton() {
  return (
    <div aria-busy aria-live="polite" className="max-w-3xl pb-16">
      <span className="sr-only">Loading your profile</span>

      <Skeleton className="h-8 w-32 sm:h-9" />

      <section className="mt-8 rounded-lg bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Skeleton className="size-20 shrink-0 rounded-full" />

          <div className="min-w-0">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-52" />
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <div className="flex items-center justify-between gap-4 py-1.5">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <Skeleton className="h-3 w-24" />

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="mt-2 h-4 w-44" />
          </div>
          <Skeleton className="h-4 w-24 shrink-0" />
        </div>
      </section>
    </div>
  );
}
