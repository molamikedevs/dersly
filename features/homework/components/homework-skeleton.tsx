import { Skeleton } from '@/components/ui/skeleton';

const EARLIER = [
  { title: 'w-40', body: ['w-full', 'w-2/5'] },
  { title: 'w-52', body: ['w-full', 'w-3/5'] },
];

function AttachmentRow() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted p-3 sm:gap-4">
      <Skeleton className="size-11 shrink-0 rounded-lg" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-11 w-20 shrink-0 rounded-lg" />
      <Skeleton className="size-11 shrink-0 rounded-lg" />
    </div>
  );
}

function CardSkeleton({ title, body }: { title: string; body: string[] }) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:p-7">
      <div className="flex flex-col gap-2.5">
        <Skeleton className={`h-6 ${title}`} />
        {body.map((width, line) => (
          <Skeleton key={line} className={`h-4 ${width}`} />
        ))}
      </div>
      <AttachmentRow />
    </div>
  );
}

export default function HomeworkSkeleton() {
  return (
    <div
      aria-busy
      className="flex w-full max-w-4xl min-w-0 flex-col gap-10 pb-16"
    >
      <span role="status" className="sr-only">
        Loading your homework
      </span>

      <Skeleton className="h-10 w-48 sm:h-12 sm:w-56" />

      <CardSkeleton title="w-56" body={['w-full max-w-md']} />

      <div className="flex flex-col gap-4">
        <Skeleton className="h-7 w-28" />
        {EARLIER.map(({ title, body }, index) => (
          <CardSkeleton key={index} title={title} body={body} />
        ))}
      </div>
    </div>
  );
}
