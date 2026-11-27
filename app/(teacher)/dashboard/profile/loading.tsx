import { Skeleton } from '@/components/ui/skeleton';
import AccountSettingsSkeleton from '@/features/profile/components/account-settings-skeleton';

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-4xl min-w-0 flex-col gap-7 pb-16"
    >
      <span role="status" className="sr-only">
        Loading your settings
      </span>

      <Skeleton className="h-9 w-36 sm:h-12 sm:w-44" />

      <div className="surface-card flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-start sm:gap-8 sm:px-7 sm:py-7">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="flex max-w-md flex-col gap-5">
            <div className="flex items-center gap-4">
              <Skeleton className="size-16 shrink-0 rounded-full sm:size-18" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>

        <AccountSettingsSkeleton embedded />
      </div>
    </div>
  );
}
