import { Skeleton } from '@/components/ui/skeleton';

const WIDTHS = [
  { name: 'w-32', email: 'w-40', class: 'w-24', level: 'w-20', meta: 'w-3/4' },
  { name: 'w-40', email: 'w-48', class: 'w-16', level: 'w-24', meta: 'w-2/3' },
  { name: 'w-28', email: 'w-36', class: 'w-28', level: 'w-16', meta: 'w-4/5' },
  { name: 'w-36', email: 'w-44', class: 'w-20', level: 'w-20', meta: 'w-1/2' },
  { name: 'w-32', email: 'w-40', class: 'w-24', level: 'w-24', meta: 'w-3/5' },
];

export default function StudentSkeleton() {
  return (
    <div aria-busy aria-live="polite" className="rounded-lg bg-card shadow-sm">
      <span className="sr-only">Loading students</span>

      <ul className="divide-y divide-border md:hidden">
        {WIDTHS.map((w, index) => (
          <li key={index} className="flex items-start gap-3 p-4">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className={`h-5 ${w.name}`} />
              <Skeleton className={`mt-1.5 h-4 ${w.email}`} />
              <Skeleton className={`mt-2.5 h-4 ${w.meta}`} />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <div className="flex h-11 items-center gap-4 border-b border-border px-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="hidden h-3 w-16 lg:block" />
        </div>

        {WIDTHS.map((w, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
          >
            <div className="flex min-w-0 flex-[2] items-center gap-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <Skeleton className={`h-4 ${w.name}`} />
            </div>
            <Skeleton className={`h-4 flex-[2] ${w.email}`} />
            <Skeleton className={`h-4 flex-1 ${w.class}`} />
            <Skeleton className={`h-4 flex-1 ${w.level}`} />
            <Skeleton className={`hidden h-4 flex-1 lg:block ${w.meta}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
