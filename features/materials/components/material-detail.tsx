import { BookOpen, ExternalLink, Link2 } from 'lucide-react';

import BackLink from '@/components/common/back-link';
import MarkdownContent from '@/features/homework/components/markdown-content';
import { cn, hostname, youTubeId } from '@/lib/utils';
import type { MaterialRecord } from '@/types/materials';
import UpNext from './up-next';
import VideoPlayer from './video-player';

type Props = {
  data: MaterialRecord;
  backHref: string;
  backLabel: string;
  upNext?: { items: MaterialRecord[]; hrefBase: string };
};

const LEVEL_CODE: Record<string, string> = {
  beginner: 'A1',
  elementary: 'A2',
  intermediate: 'B1',
  'upper-intermediate': 'B2',
  advanced: 'C1',
};

function MetaPills({
  kind,
  level,
  url,
}: Pick<MaterialRecord, 'kind' | 'level' | 'url'>) {
  const isGuide = kind === 'guide';
  const videoId = url ? youTubeId(url) : null;
  const site = url ? hostname(url) : null;
  const code = level ? LEVEL_CODE[level.toLowerCase()] : null;

  const typeLabel = isGuide
    ? 'Written guide'
    : videoId
      ? 'YouTube video'
      : site
        ? `Reading · ${site}`
        : 'Reading';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-secondary/80 px-3 py-1 text-xs font-medium text-muted-foreground">
        {isGuide ? (
          <BookOpen className="size-3.5 text-primary" aria-hidden />
        ) : (
          <Link2 className="size-3.5 text-primary" aria-hidden />
        )}
        {typeLabel}
      </span>

      {level ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-secondary/80 px-3 py-1 text-xs font-medium text-muted-foreground capitalize">
          {code && (
            <span className="font-bold tracking-wide text-foreground uppercase">
              {code}
            </span>
          )}
          <span>{level}</span>
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full border border-border-subtle bg-secondary/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          All levels
        </span>
      )}
    </div>
  );
}

function Header({
  title,
  description,
  kind,
  level,
  url,
  className,
}: Pick<MaterialRecord, 'title' | 'description' | 'kind' | 'level' | 'url'> & {
  className?: string;
}) {
  return (
    <header className={cn('flex flex-col gap-3.5', className)}>
      <MetaPills kind={kind} level={level} url={url} />

      <h1 className="font-serif text-3xl leading-[1.15] font-medium tracking-tight text-balance wrap-break-word text-foreground sm:text-4xl">
        {title}
      </h1>

      {description && (
        <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}

export default function MaterialDetail({
  data,
  backHref,
  backLabel,
  upNext,
}: Props) {
  const { title, description, url, content, kind, level } = data;

  const isGuide = kind === 'guide';
  const videoId = url ? youTubeId(url) : null;

  // Video stage with sticky Up next playlist
  if (videoId) {
    return (
      <article className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6 pb-16">
        <BackLink href={backHref} label={backLabel} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20.5rem] lg:items-start lg:gap-10">
          <div className="flex min-w-0 flex-col gap-6">
            <VideoPlayer videoId={videoId} title={title} />
            <Header
              title={title}
              description={description}
              kind={kind}
              level={level}
              url={url}
            />
          </div>

          {upNext && upNext.items.length > 0 && (
            <aside className="min-w-0 lg:sticky lg:top-24">
              <UpNext items={upNext.items} hrefBase={upNext.hrefBase} />
            </aside>
          )}
        </div>
      </article>
    );
  }

  // Guide reading sheet or external reading link
  return (
    <article
      className={cn(
        'mx-auto flex w-full min-w-0 flex-col gap-6 pb-16',
        isGuide ? 'max-w-3xl' : 'max-w-3xl',
      )}
    >
      <BackLink href={backHref} label={backLabel} />

      <div className="surface-card flex flex-col overflow-hidden">
        <div
          className={cn(
            'p-6 sm:p-9',
            (isGuide && content) || url ? 'border-b border-border-subtle' : '',
          )}
        >
          <Header
            title={title}
            description={description}
            kind={kind}
            level={level}
            url={url}
          />
        </div>

        {isGuide && content && (
          <div className="px-6 py-7 sm:px-9 sm:py-9">
            <MarkdownContent content={content} />
          </div>
        )}

        {url && (
          <div className="flex items-center justify-between gap-4 bg-secondary/40 px-6 py-4 sm:px-9">
            <span className="truncate text-xs font-medium text-muted-foreground">
              {hostname(url)}
            </span>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 shrink-0 touch-manipulation items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.22),0_1px_2px_0_oklch(0_0_0/0.35)] transition-[scale,background-color] duration-150 ease-out hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
            >
              Open article
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
