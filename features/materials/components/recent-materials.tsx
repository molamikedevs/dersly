import { BookOpen, Link2, Play } from 'lucide-react';
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
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
          Recent materials
        </h2>
        <Link
          href="/materials"
          className="-my-3 inline-flex shrink-0 touch-manipulation items-center text-sm font-semibold text-primary underline-offset-4 tap-row hover:underline"
        >
          See all
        </Link>
      </div>

      <ul className="flex flex-col rounded-2xl border border-border bg-card p-2">
        {items.map(({ id, title, kind, level, url }) => {
          const videoId = url ? youTubeId(url) : null;
          const Icon = kind === 'guide' ? BookOpen : Link2;

          return (
            <li key={id}>
              <Link
                href={`/materials/${id}`}
                className="flex touch-manipulation items-center gap-3.5 rounded-xl p-3 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:bg-muted"
              >
                {videoId ? (
                  <span className="relative block aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex size-7 items-center justify-center rounded-full bg-card/95">
                        <Play className="size-3 fill-foreground text-foreground" />
                      </span>
                    </span>
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="flex aspect-video w-24 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                  >
                    <Icon className="size-5" />
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[15px] leading-snug font-semibold break-words text-foreground">
                    {title}
                  </span>
                  <span className="mt-1 block truncate text-[13px] text-muted-foreground">
                    {describe(kind, Boolean(videoId), level)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
