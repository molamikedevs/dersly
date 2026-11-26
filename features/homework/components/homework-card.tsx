import { BookOpen, Download, ExternalLink, FileText } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
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
    <article className="surface-card overflow-hidden">
      <div className="px-5 py-4 sm:px-6 sm:py-5">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="min-w-0 font-serif text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                {title}
              </h3>

              {!isPublished && (
                <span className="shrink-0 rounded-full border border-border-subtle bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  Draft
                </span>
              )}
            </div>

            {instructions && (
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {instructions}
              </p>
            )}
          </div>

          <div className="-mt-1 -mr-2 shrink-0">
            {action ?? <HomeworkMenu data={data} />}
          </div>
        </header>
      </div>

      {canRead ? (
        <div className="flex items-center justify-between gap-4 border-t border-border-subtle bg-secondary/45 px-5 py-3 sm:px-6">
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <FileText className="size-4 text-primary" aria-hidden />
            Lesson guide
          </span>

          <AppLink
            href={readHref!}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-input-border/80 bg-card px-3.5 text-xs font-semibold text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.04)] transition-colors hover:border-primary/45 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-sm"
          >
            <BookOpen className="size-3.5 text-primary" aria-hidden />
            Preview guide
          </AppLink>
        </div>
      ) : (
        attachmentPath && (
          <div className="border-t border-border-subtle bg-secondary/45 px-5 py-3 sm:px-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-card text-primary"
              >
                <FileText className="size-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {attachmentName ?? 'Attachment'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Homework attachment
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {signedUrl && (
                  <a
                    href={signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input-border/80 bg-card px-3.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/45 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-input-border/80 bg-card text-foreground transition-colors hover:border-primary/45 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Download className="size-3.5" aria-hidden />
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
