import { BookOpen, Download, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

type Props = {
  title: string;
  instructions: string | null;
  attachmentName: string | null;
  signedUrl?: string | null;
  downloadUrl?: string | null;
  asQuestions?: boolean;
  readHref?: string;
};

export default function CurrentWorkCard({
  title,
  instructions,
  attachmentName,
  signedUrl,
  downloadUrl,
  asQuestions = false,
  readHref,
}: Props) {
  const lines =
    asQuestions && instructions
      ? instructions
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

  const showAsList = lines.length > 1;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:p-7">
      <div className="flex flex-col gap-2">
        <p className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </p>

        {instructions && !showAsList && (
          <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
            {instructions}
          </p>
        )}
      </div>

      {showAsList && (
        <ol className="flex flex-col gap-px overflow-hidden rounded-xl">
          {lines.map((line, index) => (
            <li key={index} className="flex gap-4 bg-muted px-4 py-3.5">
              <span className="shrink-0 font-serif text-base font-medium text-primary">
                {index + 1}
              </span>
              <span className="text-[15px] leading-relaxed text-foreground">
                {line}
              </span>
            </li>
          ))}
        </ol>
      )}

      {readHref ? (
        <Link
          href={readHref}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <BookOpen className="size-4" aria-hidden />
          Read guide
        </Link>
      ) : (
        (signedUrl || downloadUrl) && (
          <div className="flex items-center gap-3 rounded-xl bg-muted p-3 sm:gap-4 sm:px-4">
            <span
              aria-hidden
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-highlight"
            >
              <FileText className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-foreground">
                {attachmentName ?? 'Attachment'}
              </p>
            </div>

            {signedUrl && (
              <a
                href={signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border border-input bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-input bg-card text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Download className="size-4" aria-hidden />
              </a>
            )}
          </div>
        )
      )}
    </div>
  );
}
