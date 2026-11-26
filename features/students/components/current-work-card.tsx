import { BookOpen, Download, ExternalLink, FileText } from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';

type Props = {
  title: string;
  // plain   - a normal line, when a section heading already sits above it
  // hidden  - no title at all
  titleDisplay?: 'heading' | 'plain' | 'hidden';
  instructions: string | null;
  attachmentName: string | null;
  signedUrl?: string | null;
  downloadUrl?: string | null;
  asQuestions?: boolean;
  readHref?: string;
  forLesson?: string | null;
  posted?: string | null;
  readStyle?: 'primary' | 'quiet';
};

export default function CurrentWorkCard({
  title,
  titleDisplay = 'heading',
  instructions,
  attachmentName,
  signedUrl,
  downloadUrl,
  asQuestions = false,
  readHref,
  forLesson,
  posted,
  readStyle = 'primary',
}: Props) {
  const lines =
    asQuestions && instructions
      ? instructions
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

  const showAsList = lines.length > 1;
  const showText = Boolean(instructions) && !showAsList;
  const fileName = attachmentName ?? 'Attachment';
  const hasDetails = Boolean(forLesson || posted);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {(titleDisplay !== 'hidden' || showText || hasDetails) && (
        <div className="flex min-w-0 flex-col gap-1.5">
          {titleDisplay === 'heading' && (
            <h3 className="text-xl leading-snug font-bold tracking-tight wrap-break-word text-foreground">
              {title}
            </h3>
          )}

          {titleDisplay === 'plain' && (
            <p className="text-[15px] leading-snug font-semibold wrap-break-word text-foreground">
              {title}
            </p>
          )}

          {/* What the work is for comes first, when it was posted second */}
          {hasDetails && (
            <p className="flex flex-col text-sm leading-relaxed">
              {forLesson && (
                <span className="font-medium wrap-break-word text-foreground">
                  {forLesson}
                </span>
              )}
              {posted && (
                <span className="text-muted-foreground">{posted}</span>
              )}
            </p>
          )}

          {/* pre-line keeps the line breaks the teacher typed */}
          {showText && (
            <p className="max-w-prose text-sm leading-relaxed wrap-break-word whitespace-pre-line text-muted-foreground">
              {instructions}
            </p>
          )}
        </div>
      )}

      {showAsList && (
        <ol className="flex flex-col gap-2">
          {lines.map((line, index) => (
            <li
              key={index}
              className="flex gap-3 rounded-xl border border-border-subtle bg-secondary/45 px-3.5 py-2.5"
            >
              <span className="w-5 shrink-0 font-serif text-base leading-snug font-medium text-primary tabular-nums">
                {index + 1}
              </span>
              <span className="min-w-0 text-sm leading-relaxed wrap-break-word text-foreground">
                {line}
              </span>
            </li>
          ))}
        </ol>
      )}

      {readHref ? (
        <AppLink
          href={readHref}
          className={
            readStyle === 'primary'
              ? 'inline-flex h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-xs transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.97] sm:w-auto sm:self-start'
              : 'inline-flex h-10 touch-manipulation items-center justify-center gap-2 self-start rounded-xl border border-input-border/80 bg-secondary/80 px-4 text-sm font-semibold text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.04)] transition-[scale,background-color,border-color] duration-150 ease-out select-none hover:border-primary/45 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]'
          }
        >
          <BookOpen className="size-4 text-primary" aria-hidden />
          Read guide
        </AppLink>
      ) : (
        (signedUrl || downloadUrl) && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle bg-secondary/55 p-3 sm:pl-4">
            <FileText className="size-5 shrink-0 text-primary" aria-hidden />

            <p
              title={fileName}
              className="line-clamp-2 min-w-0 flex-1 basis-40 text-sm font-semibold wrap-break-word text-foreground"
            >
              {fileName}
            </p>

            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              {signedUrl && (
                <a
                  href={signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 touch-manipulation items-center gap-2 rounded-lg border border-input-border/80 bg-card px-3.5 text-sm font-semibold text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
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
                  className="inline-flex size-10 touch-manipulation items-center justify-center rounded-lg border border-input-border/80 bg-card text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
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
