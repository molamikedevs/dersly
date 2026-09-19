import { Download, ExternalLink, FileText } from 'lucide-react';

type Props = {
  title: string;
  instructions: string | null;
  attachmentName: string | null;
  signedUrl?: string | null;
  downloadUrl?: string | null;
  asQuestions?: boolean;
};

export default function CurrentWorkCard({
  title,
  instructions,
  attachmentName,
  signedUrl,
  downloadUrl,
  asQuestions = false,
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
    <div className="rounded-lg bg-card p-4 shadow-sm sm:p-5">
      <p className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </p>

      {instructions && !showAsList && (
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {instructions}
        </p>
      )}

      {showAsList && (
        <ol className="mt-3 overflow-hidden rounded-md">
          {lines.map((line, index) => (
            <li
              key={index}
              className="flex gap-3 bg-muted px-3.5 py-3 [&+li]:mt-px"
            >
              <span className="shrink-0 text-sm font-medium text-primary">
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed text-foreground">
                {line}
              </span>
            </li>
          ))}
        </ol>
      )}

      {(signedUrl || downloadUrl) && (
        <div className="mt-4 flex items-center gap-3 rounded-md bg-muted p-1.5 pl-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background"
          >
            <FileText className="size-4 text-muted-foreground" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {attachmentName ?? 'Attachment'}
            </p>
          </div>

          {signedUrl && (
            <a
              href={signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download className="size-4" aria-hidden />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
