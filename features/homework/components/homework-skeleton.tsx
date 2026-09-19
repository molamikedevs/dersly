import { Skeleton } from '@/components/ui/skeleton';

const EARLIER = [
  { title: 'w-40', body: ['w-full', 'w-2/5'] },
  { title: 'w-52', body: ['w-full', 'w-3/5'] },
];

function AttachmentRow() {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-md bg-muted p-1.5 pl-3">
      <Skeleton className="size-9 shrink-0 rounded-md" />
      <Skeleton className="h-4 w-48 flex-1" />
      <Skeleton className="h-4 w-12 shrink-0" />
      <Skeleton className="size-5 shrink-0" />
    </div>
  );
}

export default function HomeworkSkeleton() {
  return (
    <div aria-busy aria-live="polite" className="max-w-5xl pb-16">
      <span className="sr-only">Loading your homework</span>

      <Skeleton className="h-8 w-44 sm:h-9" />

      <div className="mt-8 rounded-lg bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-2.5 h-4 w-full max-w-md" />
        <AttachmentRow />
      </div>

      <div className="mt-10">
        <Skeleton className="h-3 w-16" />

        <div className="mt-3 flex flex-col gap-4">
          {EARLIER.map(({ title, body }, index) => (
            <div
              key={index}
              className="rounded-lg bg-card p-4 shadow-sm sm:p-5"
            >
              <Skeleton className={`h-6 ${title}`} />
              <div className="mt-2.5 space-y-1.5">
                {body.map((width, line) => (
                  <Skeleton key={line} className={`h-4 ${width}`} />
                ))}
              </div>
              <AttachmentRow />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
