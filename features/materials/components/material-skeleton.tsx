import { Skeleton } from '@/components/ui/skeleton';

// Two lines on some cards, one on others, so the block does not read as a
// grid of identical bars. Deterministic, since a random layout would differ
// between server and client render.
const SHAPES = [
  { title: ['w-full', 'w-3/5'], description: ['w-full', 'w-4/5'] },
  { title: ['w-4/5'], description: ['w-full', 'w-1/2'] },
  { title: ['w-full', 'w-2/5'], description: ['w-full', 'w-3/5'] },
  { title: ['w-3/4'], description: ['w-full', 'w-2/3'] },
  { title: ['w-full', 'w-1/2'], description: ['w-4/5'] },
  { title: ['w-2/3'], description: ['w-full', 'w-1/3'] },
];

export default function MaterialSkeleton() {
  return (
    <div
      aria-busy
      aria-live="polite"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span className="sr-only">Loading materials</span>

      {SHAPES.map(({ title, description }, index) => (
        <div
          key={index}
          className="flex flex-col rounded-lg bg-card p-4 shadow-sm"
        >
          <Skeleton className="mb-4 aspect-video w-full rounded-md" />

          <div className="space-y-1.5">
            {title.map((width, line) => (
              <Skeleton key={line} className={`h-5 ${width}`} />
            ))}
          </div>

          <Skeleton className="mt-2 h-4 w-2/5" />

          <div className="mt-3 space-y-1.5">
            {description.map((width, line) => (
              <Skeleton key={line} className={`h-4 ${width}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
