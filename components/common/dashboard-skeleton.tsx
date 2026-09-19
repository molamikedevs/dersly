import { Skeleton } from '@/components/ui/skeleton';

const WIDTHS = ['w-32', 'w-40', 'w-28', 'w-36', 'w-32', 'w-44'];

export default function DashboardSkeleton() {
  return (
    <div aria-busy aria-live="polite" className="mt-10 max-w-5xl sm:mt-12">
      <span className="sr-only">Loading overview</span>

      <div className="flex items-baseline justify-between gap-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WIDTHS.map((width, index) => (
          <div key={index} className="rounded-lg bg-card p-4 shadow-sm">
            <Skeleton className={`h-5 ${width}`} />
            <Skeleton className="mt-1.5 h-4 w-24" />

            <div className="mt-4 border-t border-border pt-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
