import { ExternalLink } from 'lucide-react';

import BackLink from '@/components/common/back-link';
import { buttonVariants } from '@/components/ui/button';
import MarkdownContent from '@/features/homework/components/markdown-content';
import { cn, youTubeId } from '@/lib/utils';
import type { MaterialRecord } from '@/types/materials';
import UpNext from './up-next';
import VideoPlayer from './video-player';

type Props = {
  data: MaterialRecord;
  backHref: string;
  backLabel: string;
  upNext?: { items: MaterialRecord[]; hrefBase: string };
};

function Header({
  title,
  description,
  level,
  className,
}: Pick<MaterialRecord, 'title' | 'description' | 'level'> & {
  className?: string;
}) {
  return (
    <header className={cn('flex flex-col gap-3', className)}>
      {level && (
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {level}
        </p>
      )}

      <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-balance wrap-break-word text-foreground sm:text-4xl">
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

  // A video: the player and its title, with what to watch next beside it on
  // wide screens and under it on a phone
  if (videoId) {
    return (
      <article className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6 pb-16">
        <BackLink href={backHref} label={backLabel} />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-12">
          <div className="flex min-w-0 flex-col gap-6">
            <VideoPlayer videoId={videoId} title={title} />
            <Header title={title} description={description} level={level} />
          </div>

          {upNext && (
            <aside className="min-w-0 lg:sticky lg:top-8">
              <UpNext items={upNext.items} hrefBase={upNext.hrefBase} />
            </aside>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'mx-auto flex w-full min-w-0 flex-col gap-6 pb-16',
        isGuide ? 'max-w-3xl' : 'max-w-4xl',
      )}
    >
      <BackLink href={backHref} label={backLabel} />

      <Header
        title={title}
        description={description}
        level={level}
        className={cn(isGuide && 'border-b border-border pb-8')}
      />

      {isGuide && content && (
        <div className="mt-2">
          <MarkdownContent content={content} />
        </div>
      )}

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants(),
            'h-12 gap-2 self-start rounded-xl px-6 text-[15px] font-semibold',
          )}
        >
          Open link
          <ExternalLink className="size-4" aria-hidden />
        </a>
      )}
    </article>
  );
}
