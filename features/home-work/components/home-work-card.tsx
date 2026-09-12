import { Download, FileText } from 'lucide-react';

import { formatDueDate } from '@/lib/utils';

type Props = {
  data: HomeWorkRecord;
  classType: ClassType;
  action?: React.ReactNode;
};

export default function HomeWorkCard({ data, classType, action }: Props) {
  const { title, attachmentPath, dueDate, isPublished, submission } = data;
  const showSubmission = classType === 'one_to_one';

  return (
    <article className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {!isPublished && (
              <span className="rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Draft
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {formatDueDate(dueDate)}
          </p>
        </div>

        {action}
      </div>

      {attachmentPath && (
        <a
          href={attachmentPath}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2.5 transition-colors hover:bg-muted"
        >
          <FileText
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">
            {attachmentPath.split('/').pop()}
          </span>
          <Download
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
        </a>
      )}

      {showSubmission && (
        <div className="mt-4 flex items-center gap-2 border-t pt-4 text-sm">
          <span
            aria-hidden
            className={
              submission
                ? 'size-1.5 rounded-full bg-success'
                : 'size-1.5 rounded-full bg-muted-foreground'
            }
          />
          <span
            className={submission ? 'text-foreground' : 'text-muted-foreground'}
          >
            {submission ? 'Submitted' : 'Not submitted yet'}
          </span>
          {submission && !submission.reviewedAt && (
            <span className="ml-auto text-warning">Needs review</span>
          )}
        </div>
      )}
    </article>
  );
}
