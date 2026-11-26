import { BookOpen, Link2, Play } from 'lucide-react';
import Image from 'next/image';

import { AppLink } from '@/features/app/app-mode';
import { youTubeId } from '@/lib/utils';

type Item = StudentHome['materials'][number];

function describe(kind: Item['kind'], isVideo: boolean, level: string | null) {
  const label = kind === 'guide' ? 'guide' : isVideo ? 'video' : 'link';
  const text = level ? `${level} ${label}` : label;

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function RecentMaterials({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-lg leading-snug font-semibold tracking-tight text-foreground">
          Recent materials
        </h2>
        <AppLink
          href="/materials"
          className="inline-flex shrink-0 touch-manipulation items-center text-xs font-semibold text-primary underline-offset-4 hover:underline"
        >
          See all
        </AppLink>
      </div>

      <ul className="flex flex-col gap-2">
        {items.map(({ id, title, kind, level, url }) => {
          const videoId = url ? youTubeId(url) : null;
          const KindIcon = kind === 'guide' ? BookOpen : Link2;

          return (
            <li key={id}>
              <AppLink
                href={`/materials/${id}`}
                className="surface-card group flex min-h-14 touch-manipulation items-center gap-3.5 px-4 py-3 transition-all duration-150 hover:border-input-border/70 hover:bg-accent/35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {!videoId && (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-secondary text-muted-foreground transition-colors group-hover:text-primary">
                    <KindIcon className="size-4" aria-hidden />
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm leading-snug font-semibold wrap-break-word text-foreground transition-colors group-hover:text-primary">
                    {title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {describe(kind, Boolean(videoId), level)}
                  </span>
                </span>

                {videoId && (
                  <span className="relative block aspect-video w-20 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-muted">
                    <Image
                      src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center bg-black/20"
                    >
                      <span className="flex size-6 items-center justify-center rounded-full bg-card/95 shadow-xs">
                        <Play className="size-2.5 fill-foreground text-foreground" />
                      </span>
                    </span>
                  </span>
                )}
              </AppLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
