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
  const fileName = attachmentName ?? 'Attachment';

  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:p-7">
      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="text-xl leading-snug font-bold tracking-tight break-words text-foreground">
          {title}
        </h3>

        {/* pre-line keeps the line breaks the teacher typed */}
        {instructions && !showAsList && (
          <p className="max-w-prose text-base leading-relaxed break-words whitespace-pre-line text-muted-foreground">
            {instructions}
          </p>
        )}
      </div>

      {showAsList && (
        <ol className="flex flex-col gap-px overflow-hidden rounded-xl">
          {lines.map((line, index) => (
            <li key={index} className="flex gap-3 bg-muted px-4 py-3.5">
              <span className="w-5 shrink-0 font-serif text-base font-medium text-primary tabular-nums">
                {index + 1}
              </span>
              <span className="min-w-0 text-[15px] leading-relaxed break-words text-foreground">
                {line}
              </span>
            </li>
          ))}
        </ol>
      )}

      {readHref ? (
        <Link
          href={readHref}
          className="inline-flex h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none active:scale-[0.97] sm:w-auto sm:self-start"
        >
          <BookOpen className="size-4" aria-hidden />
          Read guide
        </Link>
      ) : (
        (signedUrl || downloadUrl) && (
          // The name takes the first line on a narrow phone and the two
          // actions wrap under it, so a long file name is never squeezed.
          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted p-3 sm:px-4">
            <FileText
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden
            />

            <p
              title={fileName}
              className="line-clamp-2 min-w-0 flex-1 basis-40 text-[15px] font-semibold break-words text-foreground"
            >
              {fileName}
            </p>

            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              {signedUrl && (
                <a
                  href={signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 touch-manipulation items-center gap-2 rounded-lg border border-input bg-card px-4 text-sm font-semibold text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
                >
                  Open
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              )}

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={attachmentName ?? undefined}
                  aria-label={`Download ${fileName}`}
                  className="inline-flex size-11 touch-manipulation items-center justify-center rounded-lg border border-input bg-card text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
                >
                  <Download className="size-4" aria-hidden />
                </a>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
