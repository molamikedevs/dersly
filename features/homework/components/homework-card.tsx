import { BookOpen, Download, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

import HomeworkMenu from './homework-menu';

type Props = {
  data: HomeWorkRecord;
  action?: React.ReactNode;
  readHref?: string;
};

export default function HomeWorkCard({ data, action, readHref }: Props) {
  const {
    title,
    instructions,
    content,
    attachmentPath,
    attachmentName,
    isPublished,
    signedUrl,
    downloadUrl,
  } = data;

  const canRead = Boolean(content && readHref);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="p-6 sm:p-7">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="min-w-0 text-xl font-bold tracking-tight text-foreground">
                {title}
              </h3>

              {!isPublished && (
                <span className="shrink-0 rounded-full border border-input-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  Draft
                </span>
              )}
            </div>

            {instructions && (
              <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
                {instructions}
              </p>
            )}
          </div>

          <div className="-mr-2 -mt-1 shrink-0">
            {action ?? <HomeworkMenu data={data} />}
          </div>
        </header>
      </div>

      {canRead ? (
        <div className="flex items-center gap-2 border-t border-border bg-muted/50 px-6 py-4 sm:px-7">
          <Link
            href={readHref!}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <BookOpen className="size-4" aria-hidden />
            Read guide
          </Link>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={attachmentName ?? undefined}
              aria-label={`Download ${attachmentName ?? 'file'}`}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-input-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download className="size-4" aria-hidden />
            </a>
          )}
        </div>
      ) : (
        attachmentPath && (
          <div className="border-t border-border bg-muted/50 px-6 py-4 sm:px-7">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-warning-subtle-foreground"
              >
                <FileText className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-foreground">
                  {attachmentName ?? 'Attachment'}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  Homework attachment
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {signedUrl && (
                  <a
                    href={signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-lg border border-input-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    className="inline-flex size-11 items-center justify-center rounded-lg border border-input-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Download className="size-4" aria-hidden />
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </article>
  );
}
