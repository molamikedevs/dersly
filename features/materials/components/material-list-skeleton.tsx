import { Skeleton } from '@/components/ui/skeleton';
import type { MaterialKind } from '@/lib/utils';
import { cn } from '@/lib/utils';

const TITLE_WIDTHS = [
  'w-full',
  'w-4/5',
  'w-3/4',
  'w-2/3',
  'w-full',
  'w-3/5',
  'w-4/5',
  'w-2/3',
];

export default function MaterialListSkeleton({
  kind,
  wide = false,
}: {
  kind: MaterialKind;
  wide?: boolean;
}) {
  if (kind === 'article') {
    return (
      <ul
        aria-busy
        className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card px-5"
      >
        <span role="status" className="sr-only">
          Loading reading
        </span>
        {TITLE_WIDTHS.slice(0, 6).map((width, index) => (
          <li key={index} className="flex items-center gap-3 py-3.5">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className={cn('h-4 max-w-md', width)} />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="size-4 shrink-0" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      aria-busy
      className={cn(
        'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3',
        wide && 'xl:grid-cols-4',
      )}
    >
      <span role="status" className="sr-only">
        Loading materials
      </span>

      {TITLE_WIDTHS.map((width, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
        >
          {kind === 'link' && (
            <Skeleton className="aspect-video w-full rounded-none" />
          )}

          <div className="flex flex-1 flex-col gap-2 p-5">
            <div className="flex items-start gap-3">
              {kind === 'guide' && (
                <Skeleton className="size-10 shrink-0 rounded-lg" />
              )}
              <Skeleton className={cn('h-5', width)} />
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-2 h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
