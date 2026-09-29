import { Skeleton } from '@/components/ui/skeleton';

const ROWS = [
  { name: 'w-32', email: 'w-40', class: 'w-24', level: 'w-16', seen: 'w-14' },
  { name: 'w-40', email: 'w-48', class: 'w-28', level: 'w-20', seen: 'w-16' },
  { name: 'w-28', email: 'w-36', class: 'w-24', level: 'w-16', seen: 'w-12' },
  { name: 'w-36', email: 'w-44', class: 'w-20', level: 'w-24', seen: 'w-16' },
  { name: 'w-32', email: 'w-40', class: 'w-28', level: 'w-16', seen: 'w-14' },
  { name: 'w-44', email: 'w-36', class: 'w-24', level: 'w-20', seen: 'w-12' },
];

export default function Loading() {
  return (
    <div
      aria-busy
      aria-live="polite"
      className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16"
    >
      <span className="sr-only">Loading students</span>

      <div>
        <Skeleton className="h-10 w-48 sm:h-12 sm:w-56" />
        <Skeleton className="mt-3 h-5 w-64" />
      </div>

      <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border md:hidden">
          {ROWS.map((row, index) => (
            <li key={index} className="flex items-start gap-3.5 px-5 py-4">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <Skeleton className={`h-5 ${row.name}`} />
                <Skeleton className={`mt-1.5 h-4 ${row.email}`} />
                <div className="mt-2.5 flex items-center gap-2">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="mt-2 h-4 w-36" />
                <Skeleton className="mt-1.5 h-4 w-28" />
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden min-w-0 md:block">
          <div className="flex h-12 items-center bg-muted px-5">
            <Skeleton className="h-3 w-[28%] max-w-16" />
            <div className="w-[2%]" />
            <Skeleton className="h-3 w-[30%] max-w-12" />
            <div className="w-[2%]" />
            <Skeleton className="h-3 w-[22%] max-w-12" />
            <Skeleton className="h-3 w-[20%] max-w-12" />
          </div>

          {ROWS.map((row, index) => (
            <div
              key={index}
              className="flex items-center border-b border-border px-5 py-4 last:border-b-0"
            >
              <div className="flex w-[28%] min-w-0 items-center gap-3 pr-4">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <Skeleton className={`h-4 ${row.name}`} />
              </div>
              <div className="w-[30%] pr-4">
                <Skeleton className={`h-4 ${row.email}`} />
              </div>
              <div className="w-[22%] pr-4">
                <Skeleton className={`h-4 ${row.class}`} />
              </div>
              <div className="w-[20%] pr-4">
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="hidden w-[18%] pr-4 lg:block">
                <Skeleton className={`h-4 ${row.seen}`} />
              </div>
              <div className="hidden w-[20%] xl:block">
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
