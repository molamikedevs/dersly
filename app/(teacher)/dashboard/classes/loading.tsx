import { Skeleton } from '@/components/ui/skeleton';

const SECTIONS = [
  { title: 'w-36', rows: ['w-32', 'w-44', 'w-36'], tracker: true },
  { title: 'w-44', rows: ['w-40', 'w-28'], tracker: false },
];

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16"
    >
      <span role="status" className="sr-only">
        Loading classes
      </span>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-44 sm:h-12 sm:w-52" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      {SECTIONS.map(({ title, rows, tracker }, section) => (
        <div key={section} className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-4">
            <Skeleton className={`h-7 ${title}`} />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {rows.map((width, index) => (
              <div
                key={index}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-3 py-4 pr-2 pl-5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-4 sm:pr-3 sm:pl-6"
              >
                <div className="flex min-w-0 flex-col gap-2 pt-2.5 sm:pt-0">
                  <Skeleton className={`h-5 max-w-full ${width}`} />
                  <Skeleton className="h-4 w-40 max-w-full" />
                </div>

                <Skeleton className="size-9 rounded-lg sm:order-last" />

                <div className="col-span-2 pr-3 sm:col-span-1 sm:pr-0">
                  {tracker ? (
                    <div className="flex items-center justify-between gap-4 sm:w-72">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-2 w-31 rounded-full" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-11 w-32 rounded-xl" />
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-24 sm:ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
