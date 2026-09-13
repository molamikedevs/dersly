import { ExternalLink, Link2 } from 'lucide-react';

import { hostname, youTubeId } from '@/lib/utils';
import { MaterialRecord } from '@/types/materials';
import MaterialMenu from './material-menu';

export default function MaterialCard({ data }: { data: MaterialRecord }) {
  const { title, description, url, level } = data;

  const videoId = url ? youTubeId(url) : null;
  const site = url ? hostname(url) : null;

  return (
    <article className="flex flex-col rounded-lg bg-card p-4 shadow-sm">
      {videoId ? (
        <div className="mb-4 overflow-hidden rounded-md bg-muted">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full border-0"
          />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 items-start gap-3">
        {!videoId && (
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
          >
            <Link2 className="size-4" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 font-medium text-foreground">
              {title}
            </h3>
            <MaterialMenu data={data} />
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
            {level && <span className="capitalize">{level}</span>}
            {level && site && (
              <span aria-hidden className="text-border">
                ·
              </span>
            )}
            {site && <span className="truncate">{site}</span>}
          </div>

          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {url && !videoId && (
        <div className="mt-3 flex">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="-ml-2 inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      )}
    </article>
  );
}
