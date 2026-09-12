import { ExternalLink, FileText, Link2 } from 'lucide-react';

export default function MaterialCard({ data }: { data: MaterialRecord }) {
  const { title, description, kind, filePath, url, level } = data;

  const href = kind === 'link' ? url : filePath;
  const Icon = kind === 'link' ? Link2 : FileText;

  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
          aria-hidden
        >
          <Icon className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {level && (
              <span className="rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {level}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}

          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {kind === 'link' ? 'Open' : 'Download'}
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
