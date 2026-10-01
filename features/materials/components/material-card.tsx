import { BookOpen, ExternalLink, Link2, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { hostname, youTubeId } from '@/lib/utils';
import { MaterialRecord } from '@/types/materials';
import MaterialMenu from './material-menu';

export default function MaterialCard({
  data,
  editable = false,
}: {
  data: MaterialRecord;
  editable?: boolean;
}) {
  const { id, title, description, url, level, kind } = data;

  const isGuide = kind === 'guide';
  const videoId = url ? youTubeId(url) : null;
  const site = url ? hostname(url) : null;
  const href = editable ? `/dashboard/materials/${id}` : `/materials/${id}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-input-border">
      {videoId && (
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-card/95 shadow-sm">
              <Play className="size-4 translate-x-px fill-foreground text-foreground" />
            </span>
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start gap-3">
          {!videoId && (
            <span
              aria-hidden
              className={
                isGuide
                  ? 'flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground'
                  : 'flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning-subtle-foreground'
              }
            >
              {isGuide ? (
                <BookOpen className="size-4" />
              ) : (
                <Link2 className="size-4" />
              )}
            </span>
          )}

          <h3 className="min-w-0 flex-1 text-base font-semibold leading-snug text-foreground line-clamp-2">
            <Link
              href={href}
              className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {title}
            </Link>
          </h3>

          {editable && (
            <div className="relative z-10 -mr-1.5 -mt-1.5 shrink-0">
              <MaterialMenu data={data} />
            </div>
          )}
        </div>

        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-x-2 pt-2 text-[13px] text-muted-foreground">
          {level && <span className="capitalize">{level}</span>}
          {level && (site || isGuide) && <span aria-hidden>&middot;</span>}
          {isGuide && <span>Guide</span>}
          {site && <span className="truncate">{site}</span>}

          {url && !videoId && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-input-border bg-card px-3 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Open
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
