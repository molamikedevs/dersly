import { Skeleton } from '@/components/ui/skeleton';

const SECTIONS = [
  { title: 'w-48', rows: ['w-1/2', 'w-2/5'] },
  { title: 'w-36', rows: ['w-2/5', 'w-1/2', 'w-1/3'] },
];

export default function Loading() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16"
    >
      <span role="status" className="sr-only">
        Loading homework
      </span>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-48 sm:h-12 sm:w-56" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>

      {SECTIONS.map(({ title, rows }, section) => (
        <div key={section} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className={`h-7 ${title}`} />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {rows.map((width, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-5 py-4 sm:px-6"
              >
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className={`h-5 ${width}`} />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="size-4 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
