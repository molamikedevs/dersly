import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { youTubeId } from '@/lib/utils';

type Item = StudentHome['materials'][number];

// "Elementary video", or just "Video" when the material has no level
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
        <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
          Recent materials
        </h2>
        <Link
          href="/materials"
          className="-my-3 inline-flex shrink-0 touch-manipulation items-center text-sm font-semibold text-primary underline-offset-4 tap-row hover:underline"
        >
          See all
        </Link>
      </div>

      {/* Every title starts on the same left edge. Only a video has a
          picture, and it sits at the end of its row. */}
      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {items.map(({ id, title, kind, level, url }) => {
          const videoId = url ? youTubeId(url) : null;

          return (
            <li key={id}>
              <Link
                href={`/materials/${id}`}
                className="-mx-2 flex min-h-14 touch-manipulation items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:bg-accent"
              >
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-base leading-snug font-semibold wrap-break-word text-foreground">
                    {title}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                    {describe(kind, Boolean(videoId), level)}
                  </span>
                </span>

                {videoId && (
                  <span className="relative block aspect-video w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex size-6 items-center justify-center rounded-full bg-card/95">
                        <Play className="size-2.5 fill-foreground text-foreground" />
                      </span>
                    </span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
