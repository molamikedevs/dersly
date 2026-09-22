import { Skeleton } from '@/components/ui/skeleton';

const SHAPES = [
  { title: ['w-full', 'w-3/5'], description: ['w-full', 'w-4/5'] },
  { title: ['w-4/5'], description: ['w-full', 'w-1/2'] },
  { title: ['w-full', 'w-2/5'], description: ['w-full', 'w-3/5'] },
  { title: ['w-3/4'], description: ['w-full', 'w-2/3'] },
  { title: ['w-full', 'w-1/2'], description: ['w-4/5'] },
  { title: ['w-2/3'], description: ['w-full', 'w-1/3'] },
  { title: ['w-full', 'w-3/5'], description: ['w-full', 'w-1/2'] },
  { title: ['w-4/5'], description: ['w-full', 'w-2/3'] },
];

export default function MaterialSkeletons() {
  return (
    <div
      aria-busy
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <span role="status" className="sr-only">
        Loading materials
      </span>

      {SHAPES.map(({ title, description }, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
        >
          <Skeleton className="aspect-video w-full rounded-none" />

          <div className="flex flex-1 flex-col gap-2 p-5">
            <div className="flex flex-col gap-1.5">
              {title.map((width, line) => (
                <Skeleton key={line} className={`h-5 ${width}`} />
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              {description.map((width, line) => (
                <Skeleton key={line} className={`h-4 ${width}`} />
              ))}
            </div>

            <Skeleton className="mt-2 h-3 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
