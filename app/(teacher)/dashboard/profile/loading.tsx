import { Skeleton } from '@/components/ui/skeleton';
import AccountSettingsSkeleton from '@/features/profile/components/account-settings-skeleton';

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-3xl min-w-0 flex-col gap-10 pb-16"
    >
      <span role="status" className="sr-only">
        Loading your profile
      </span>

      <Skeleton className="h-10 w-40 sm:h-12 sm:w-48" />

      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <Skeleton className="size-24 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-col gap-2">
            <Skeleton className="h-8 w-48 sm:h-9 sm:w-56" />
            <Skeleton className="h-4 w-56 max-w-full" />
            <Skeleton className="mt-1 h-7 w-20 rounded-full" />
          </div>
        </div>
      </section>

      <AccountSettingsSkeleton />
    </div>
  );
}
