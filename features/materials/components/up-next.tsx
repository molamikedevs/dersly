import { Play } from 'lucide-react';
import Image from 'next/image';

import { AppLink } from '@/features/app/app-mode';
import { youTubeId } from '@/lib/utils';
import type { MaterialRecord } from '@/types/materials';

type Props = {
  items: MaterialRecord[];
  hrefBase: string;
};

export default function UpNext({ items, hrefBase }: Props) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="up-next-heading" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2
          id="up-next-heading"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Up next
        </h2>
      </div>

      <ul className="surface-card flex flex-col overflow-hidden">
        {items.map(({ id, title, level, url }) => {
          const videoId = url ? youTubeId(url) : null;

          return (
            <li key={id} className="surface-row">
              <AppLink
                href={`${hrefBase}/${id}`}
                className="group flex touch-manipulation items-center gap-3 p-3 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
              >
                <span className="relative block aspect-video w-28 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-secondary">
                  {videoId && (
                    <Image
                      src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-xs">
                      <Play className="size-3 translate-x-px fill-current" />
                    </span>
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 font-serif text-sm leading-snug font-medium wrap-break-word text-foreground transition-colors group-hover:text-primary">
                    {title}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground capitalize">
                    {level ?? 'All levels'}
                  </span>
                </span>
              </AppLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
