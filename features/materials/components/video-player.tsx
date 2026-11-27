'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  videoId: string;
  title: string;
};

export default function VideoPlayer({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="surface-card relative aspect-video w-full overflow-hidden bg-black">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full touch-manipulation select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 760px, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />

          <span
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent transition-opacity group-hover:opacity-90"
          />

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full border border-white/15 bg-background/90 text-foreground shadow-xl backdrop-blur-md transition-all duration-150 ease-out group-hover:scale-105 group-hover:border-primary/50 group-hover:text-primary group-active:scale-95 sm:size-20">
              <Play
                className="size-6 translate-x-0.5 fill-current sm:size-7"
                aria-hidden
              />
            </span>
          </span>

          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
    </div>
  );
}
