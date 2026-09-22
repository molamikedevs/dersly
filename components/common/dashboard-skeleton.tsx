import { Skeleton } from '@/components/ui/skeleton';

const WIDTHS = ['w-32', 'w-40', 'w-28', 'w-36', 'w-32', 'w-44'];

export default function DashboardSkeleton() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16"
    >
      <span role="status" className="sr-only">
        Loading overview
      </span>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-48 sm:h-12 sm:w-56" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-8 w-44 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WIDTHS.map((width, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <Skeleton className={`h-6 ${width}`} />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="size-4 shrink-0" />
              </div>

              <div className="flex flex-col gap-2 rounded-xl bg-muted px-4 py-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
