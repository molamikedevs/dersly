import { BookOpen, Link2, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { youTubeId } from '@/lib/utils';

type Item = StudentHome['materials'][number];

function labelFor(kind: Item['kind'], isVideo: boolean) {
  if (kind === 'guide') return 'Guide';
  return isVideo ? 'Video' : 'Link';
}

export default function RecentMaterials({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
          Recent materials
        </h2>
        <Link
          href="/materials"
          className="text-sm font-semibold text-primary hover:underline"
        >
          See all
        </Link>
      </div>

      <ul className="flex flex-col rounded-2xl border border-border bg-card p-2">
        {items.map(({ id, title, kind, level, url }) => {
          const videoId = url ? youTubeId(url) : null;
          const isGuide = kind === 'guide';

          return (
            <li key={id}>
              <Link
                href={`/materials/${id}`}
                className="flex items-center gap-3.5 rounded-xl p-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    className={
                      isGuide
                        ? 'flex aspect-video w-24 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground'
                        : 'flex aspect-video w-24 shrink-0 items-center justify-center rounded-lg bg-highlight-muted text-highlight'
                    }
                  >
                    {isGuide ? (
                      <BookOpen className="size-5" />
                    ) : (
                      <Link2 className="size-5" />
                    )}
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
                    {title}
                  </span>
                  <span className="mt-1 block truncate text-[13px] text-muted-foreground">
                    {level && (
                      <span className="capitalize">{level} &middot; </span>
                    )}
                    {labelFor(kind, Boolean(videoId))}
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
