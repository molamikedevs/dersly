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
      <h2
        id="up-next-heading"
        className="text-xl leading-snug font-bold tracking-tight text-foreground"
      >
        Up next
      </h2>

      <ul className="flex flex-col gap-1">
        {items.map(({ id, title, level, url }) => {
          const videoId = url ? youTubeId(url) : null;

          return (
            <li key={id}>
              <AppLink
                href={`${hrefBase}/${id}`}
                className="group -mx-2 flex touch-manipulation gap-3 rounded-xl p-2 transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:bg-accent"
              >
                <span className="relative block aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-36">
                  {videoId && (
                    <Image
                      src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 144px, 128px"
                      className="object-cover"
                    />
                  )}
                </span>

                <span className="min-w-0 flex-1 py-0.5">
                  <span className="line-clamp-2 text-[15px] leading-snug font-semibold wrap-break-word text-foreground group-hover:underline group-hover:underline-offset-4">
                    {title}
                  </span>
                  {level && (
                    <span className="mt-1 block text-sm text-muted-foreground capitalize">
                      {level}
                    </span>
                  )}
                </span>
              </AppLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
