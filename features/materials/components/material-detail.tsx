import { ExternalLink } from 'lucide-react';

import BackLink from '@/components/common/back-link';
import { buttonVariants } from '@/components/ui/button';
import MarkdownContent from '@/features/homework/components/markdown-content';
import { cn, youTubeId } from '@/lib/utils';
import type { MaterialRecord } from '@/types/materials';

type Props = {
  data: MaterialRecord;
  backHref: string;
  backLabel: string;
};

export default function MaterialDetail({ data, backHref, backLabel }: Props) {
  const { title, description, url, content, kind, level } = data;

  const isGuide = kind === 'guide';
  const videoId = url ? youTubeId(url) : null;
  const isPlainLink = Boolean(url) && !videoId;

  return (
    <article
      className={cn(
        'mx-auto flex w-full min-w-0 flex-col gap-6 pb-16',
        isGuide ? 'max-w-3xl' : 'max-w-4xl',
      )}
    >
      <BackLink href={backHref} label={backLabel} />

      <header
        className={cn(
          'flex flex-col gap-3',
          isGuide && 'border-b border-border pb-8',
        )}
      >
        {level && (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {level}
          </p>
        )}

        <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </header>

      {videoId && (
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full border-0"
          />
        </div>
      )}

      {isGuide && content && (
        <div className="mt-2">
          <MarkdownContent content={content} />
        </div>
      )}

      {isPlainLink && (
        <a
          href={url!}
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
