import { Download, ExternalLink, FileText } from 'lucide-react';

import HomeworkMenu from './homework-menu';

type Props = {
  data: HomeWorkRecord;
  action?: React.ReactNode;
};

export default function HomeWorkCard({ data, action }: Props) {
  const {
    title,
    instructions,
    attachmentPath,
    attachmentName,
    isPublished,
    signedUrl,
    downloadUrl,
  } = data;

  return (
    <article className="rounded-xl border bg-card">
      <div className="p-5 sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="min-w-0 text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {title}
              </h3>

              {!isPublished && (
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Draft
                </span>
              )}
            </div>

            {instructions && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {instructions}
              </p>
            )}
          </div>

          <div className="shrink-0">
            {action ?? <HomeworkMenu data={data} />}
          </div>
        </header>
      </div>

      {attachmentPath && (
        <div className="border-t px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50"
            >
              <FileText className="size-4 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {attachmentName ?? 'Attachment'}
              </p>

              <p className="text-xs text-muted-foreground">
                Homework attachment
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {signedUrl && (
                <a
                  href={signedUrl}
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Open
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              )}

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={attachmentName ?? undefined}
                  aria-label={`Download ${attachmentName ?? 'attachment'}`}
                  className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Download className="size-4" aria-hidden />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
