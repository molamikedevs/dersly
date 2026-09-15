import { formatDueDate } from '@/lib/utils';
import { Download, FileText } from 'lucide-react';

type Props = {
  data: HomeWorkRecord;
  action?: React.ReactNode;
};

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif'];

export default function HomeWorkCard({ data, action }: Props) {
  const { title, attachmentPath, dueDate, isPublished } = data;

  const fileName = attachmentPath?.split('/').pop() ?? '';
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  const isPdf = extension === 'pdf';
  const isImage = IMAGE_EXTENSIONS.includes(extension);

  return (
    <article className="rounded-lg bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {title}
            </h3>
            {!isPublished && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
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
        <div className="mt-5">
          <div className="overflow-hidden rounded-lg bg-muted">
            {isPdf ? (
              <object
                data={`${attachmentPath}#toolbar=0&navpanes=0&view=FitH`}
                type="application/pdf"
                aria-label={fileName}
                className="h-60 w-full sm:h-80"
              >
                <div className="flex h-60 flex-col items-center justify-center gap-2 sm:h-80">
                  <FileText
                    className="size-6 text-muted-foreground"
                    aria-hidden
                  />
                  <p className="text-sm text-muted-foreground">
                    Preview not available in this browser.
                  </p>
                </div>
              </object>
            ) : isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={attachmentPath}
                alt={fileName}
                className="h-60 w-full object-cover sm:h-80"
              />
            ) : (
              <div className="flex h-24 items-center gap-3 px-4">
                <FileText
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {fileName}
                </span>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
              {fileName}
            </span>

            <a
              href={attachmentPath}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="-mr-3 inline-flex h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download className="size-4" aria-hidden />
              Download
            </a>
          </div>
        </div>
      )}
    </article>
  );
}
