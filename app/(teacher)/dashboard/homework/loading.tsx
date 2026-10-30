import { Skeleton } from '@/components/ui/skeleton';

// Same shape as the homework page: one row per class
const ROWS = [
  { name: 'w-28', title: 'w-3/5' },
  { name: 'w-36', title: 'w-2/5' },
  { name: 'w-24', title: 'w-1/2' },
  { name: 'w-32', title: 'w-2/3' },
  { name: 'w-28', title: 'w-1/3' },
  { name: 'w-40', title: 'w-1/2' },
];

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-8 pb-16"
    >
      <span role="status" className="sr-only">
        Loading homework
      </span>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-48 sm:h-12 sm:w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-full max-w-sm rounded-xl" />

        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {ROWS.map(({ name, title }, index) => (
            <div
              key={index}
              className="flex min-h-16 items-center gap-4 px-5 py-4 sm:px-6"
            >
              <div className="grid min-w-0 flex-1 gap-x-6 gap-y-2 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] md:items-center">
                <Skeleton className={`h-5 ${name}`} />
                <Skeleton className={`h-4 ${title}`} />
                <Skeleton className="h-4 w-44" />
              </div>
              <Skeleton className="size-4 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
