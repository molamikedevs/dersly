import { BookOpen, ExternalLink, Link2, Play } from 'lucide-react';
import Image from 'next/image';

import { AppLink } from '@/features/app/app-mode';
import { hostname, youTubeId } from '@/lib/utils';
import { MaterialRecord } from '@/types/materials';
import MaterialMenu from './material-menu';

const LEVEL_CODE: Record<string, string> = {
  beginner: 'A1',
  elementary: 'A2',
  intermediate: 'B1',
  'upper-intermediate': 'B2',
  advanced: 'C1',
};

function LevelBadge({ level }: { level: string | null }) {
  if (!level) {
    return (
      <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
        Any level
      </span>
    );
  }

  const code = LEVEL_CODE[level.toLowerCase()];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground capitalize">
      {code && (
        <span className="rounded border border-border-subtle bg-secondary px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-foreground uppercase">
          {code}
        </span>
      )}
      <span className="hidden sm:inline">{level}</span>
    </span>
  );
}

export default function MaterialCard({
  data,
  editable = false,
}: {
  data: MaterialRecord;
  editable?: boolean;
}) {
  const { id, title, url, level, kind } = data;

  const isGuide = kind === 'guide';
  const videoId = url ? youTubeId(url) : null;
  const site = url ? hostname(url) : null;
  const href = editable ? `/dashboard/materials/${id}` : `/materials/${id}`;

  const subtitle = isGuide
    ? 'Guide · written by you'
    : videoId
      ? 'Video · YouTube'
      : site
        ? `Video · ${site}`
        : 'Video';

  return (
    <li className="surface-row group relative transition-colors">
      <AppLink
        href={href}
        className="absolute inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
      >
        <span className="sr-only">Open {title}</span>
      </AppLink>

      <div className="pointer-events-none relative flex items-center gap-3.5 py-3 pr-3 pl-4 sm:gap-4 sm:py-3.5 sm:pr-4 sm:pl-5">
        {videoId ? (
          <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-secondary sm:h-16 sm:w-28">
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              fill
              sizes="112px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/15"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-xs transition-transform duration-200 group-hover:scale-105">
                <Play className="size-3.5 translate-x-px fill-current" />
              </span>
            </span>
          </div>
        ) : (
          <span
            aria-hidden
            className={
              isGuide
                ? 'flex h-11 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:border-primary/35 group-hover:bg-primary/15'
                : 'flex h-11 w-12 shrink-0 items-center justify-center rounded-xl border border-warning/25 bg-warning-subtle text-warning-subtle-foreground'
            }
          >
            {isGuide ? (
              <BookOpen className="size-4" />
            ) : (
              <Link2 className="size-4" />
            )}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-serif text-base leading-snug font-medium tracking-tight text-foreground transition-colors group-hover:text-primary sm:line-clamp-1 sm:text-[17px]">
            {title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <LevelBadge level={level} />

          {url && !videoId && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto relative z-10 inline-flex h-8 items-center gap-1.5 rounded-lg border border-input-border/80 bg-card px-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/45 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Open
              <ExternalLink className="size-3" aria-hidden />
            </a>
          )}

          {editable && (
            <div className="pointer-events-auto relative z-10">
              <MaterialMenu data={data} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
