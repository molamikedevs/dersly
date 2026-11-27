import { Skeleton } from '@/components/ui/skeleton';

const EARLIER = ['w-56', 'w-44'];

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-16"
    >
      <span role="status" className="sr-only">
        Loading your homework
      </span>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-40 sm:h-12 sm:w-52" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:items-start lg:gap-10">
        <div className="flex flex-col gap-9">
          <div className="surface-card flex flex-col gap-5 p-6 sm:p-8">
            <div className="flex flex-col gap-2.5">
              <Skeleton className="h-3.5 w-44" />
              <Skeleton className="h-8 w-72 max-w-full" />
              <Skeleton className="h-4 w-full max-w-lg" />
              <Skeleton className="h-4 w-3/4 max-w-md" />
            </div>
            <div className="flex items-center gap-4 pt-1">
              <Skeleton className="h-11 w-36 rounded-xl" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-20" />
            <div className="surface-card flex flex-col overflow-hidden">
              {EARLIER.map((width) => (
                <div
                  key={width}
                  className="surface-row flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className={`h-5 ${width} max-w-full`} />
                    <Skeleton className="h-3.5 w-40" />
                  </div>
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="surface-card flex flex-col gap-4 p-5 sm:p-6">
          <Skeleton className="h-3.5 w-28" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
