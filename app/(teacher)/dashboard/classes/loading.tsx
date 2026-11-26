import { Skeleton } from '@/components/ui/skeleton';

const ONE_TO_ONE = ['w-28', 'w-36', 'w-32', 'w-40'];
const GROUPS = ['w-44', 'w-48'];

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-9 pb-16"
    >
      <span role="status" className="sr-only">
        Loading classes
      </span>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-9 w-36 sm:h-12 sm:w-44" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      {/* One to one table skeleton */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-28" />

        <div className="surface-card overflow-hidden">
          <div className="hidden border-b border-border-subtle bg-secondary/50 px-6 py-3 sm:grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.5fr)_2.5rem] sm:gap-4">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-16" />
            <span />
          </div>

          <div className="flex flex-col">
            {ONE_TO_ONE.map((width, index) => (
              <div
                key={index}
                className="surface-row grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2.5 py-4 pr-3 pl-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.5fr)_2.5rem] sm:items-center sm:gap-x-4 sm:pr-4 sm:pl-6"
              >
                <div className="flex flex-col gap-1.5 pt-0.5 sm:pt-0">
                  <Skeleton className={`h-4 ${width}`} />
                  <Skeleton className="h-3 w-24" />
                </div>

                <Skeleton className="size-8 justify-self-end rounded-lg sm:order-last" />

                <Skeleton className="col-span-2 h-3.5 w-36 sm:col-span-1" />

                <div className="col-span-2 flex w-full max-w-64 items-center justify-between gap-3 sm:col-span-1">
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-2 w-24 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Groups & clubs cards skeleton */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-32" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {GROUPS.map((width, index) => (
            <div
              key={index}
              className="surface-card flex flex-col gap-5 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-2">
                <Skeleton className={`h-7 ${width}`} />
                <Skeleton className="h-3.5 w-24" />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-4">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
