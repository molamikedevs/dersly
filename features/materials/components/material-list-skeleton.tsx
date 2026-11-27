import { Skeleton } from '@/components/ui/skeleton';
import type { MaterialKind } from '@/lib/utils';
import { cn } from '@/lib/utils';

const TITLE_WIDTHS = ['w-64', 'w-80', 'w-72', 'w-60', 'w-76', 'w-64'];

export default function MaterialListSkeleton({
  kind,
}: {
  kind: MaterialKind;
  wide?: boolean;
}) {
  const isVideo = kind === 'link';
  const label =
    kind === 'article'
      ? 'Loading reading'
      : kind === 'guide'
        ? 'Loading guides'
        : 'Loading videos';

  return (
    <ul aria-busy className="surface-card flex flex-col overflow-hidden">
      <span role="status" className="sr-only">
        {label}
      </span>

      {TITLE_WIDTHS.map((width, index) => (
        <li
          key={index}
          className="surface-row flex items-center gap-3.5 py-3 pr-4 pl-4 sm:gap-4 sm:py-3.5 sm:pl-5"
        >
          <Skeleton
            className={
              isVideo
                ? 'h-14 w-24 shrink-0 rounded-lg sm:h-16 sm:w-28'
                : 'h-11 w-12 shrink-0 rounded-xl'
            }
          />

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className={cn('h-4 max-w-full', width)} />
            <Skeleton className="h-3 w-32" />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Skeleton className="hidden h-5 w-24 rounded sm:block" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </li>
      ))}
    </ul>
  );
}
