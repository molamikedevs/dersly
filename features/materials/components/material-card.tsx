import { ExternalLink, Link2 } from 'lucide-react';

import { hostname, youTubeId } from '@/lib/utils';
import { MaterialRecord } from '@/types/materials';
import MaterialMenu from './material-menu';

export default function MaterialCard({ data }: { data: MaterialRecord }) {
  const { title, description, url, level } = data;

  const videoId = url ? youTubeId(url) : null;
  const site = url ? hostname(url) : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-card shadow-sm transition-shadow hover:shadow-md">
      {videoId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full shrink-0 border-0 bg-muted"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-start gap-1">
          {!videoId && (
            <span
              aria-hidden
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
            >
              <Link2 className="size-4" />
            </span>
          )}

          <h3 className="ml-2 min-w-0 flex-1 text-sm font-medium leading-snug text-foreground line-clamp-2">
            {title}
          </h3>

          <div className="-mr-1.5 -mt-1.5 shrink-0">
            <MaterialMenu data={data} />
          </div>
        </div>

        {description && (
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-x-2 pt-0 text-xs text-muted-foreground">
          {level && <span className="capitalize">{level}</span>}
          {level && site && (
            <span aria-hidden className="text-border">
              ·
            </span>
          )}
          {site && <span className="truncate">{site}</span>}

          {url && !videoId && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Open
              <ExternalLink className="size-3" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
