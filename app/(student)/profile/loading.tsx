import { Skeleton } from '@/components/ui/skeleton';
import AccountSettingsSkeleton from '@/features/profile/components/account-settings-skeleton';

// Mirrors the student profile page block for block
export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-2xl min-w-0 flex-col gap-10 pb-16"
    >
      <span role="status" className="sr-only">
        Loading your profile
      </span>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4 sm:gap-6">
          <Skeleton className="size-20 shrink-0 rounded-full sm:size-24" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-8 w-48 max-w-full sm:h-10 sm:w-64" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </div>
        </div>
        <div className="min-h-5" />
      </div>

      <div className="flex items-end justify-between gap-6 border-y border-border py-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>

      <section className="flex flex-col gap-3">
        <Skeleton className="h-7 w-28" />
        <div className="flex items-center justify-between gap-4 border-y border-border py-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-11 w-28 rounded-xl" />
        </div>
      </section>

      <AccountSettingsSkeleton allowDelete />
    </div>
  );
}
