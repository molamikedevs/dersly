import { Skeleton } from '@/components/ui/skeleton';

const SECTIONS = [
  { title: 'w-44', rows: ['w-36', 'w-44'] },
  { title: 'w-32', rows: ['w-28', 'w-40', 'w-32'] },
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

      {SECTIONS.map(({ title, rows }, section) => (
        <div key={section} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className={`h-7 ${title}`} />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {rows.map((width, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-5 py-4 sm:px-6"
              >
                <Skeleton className="size-10 shrink-0 rounded-full sm:size-11" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className={`h-5 ${width}`} />
                  <Skeleton className="h-4 w-52 max-w-full" />
                </div>
                <Skeleton className="hidden h-11 w-32 shrink-0 rounded-xl sm:block" />
                <Skeleton className="size-9 shrink-0 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
