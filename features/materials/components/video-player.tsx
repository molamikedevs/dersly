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
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
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
          className="group absolute inset-0 size-full touch-manipulation select-none focus-visible:outline-none"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 760px, 100vw"
            className="object-cover"
          />

          {/* Darker at the bottom, so the play button reads on any picture */}
          <span
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent"
          />

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-card/95 shadow-lg transition-transform duration-150 ease-out group-hover:scale-105 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-ring sm:size-20">
              <Play
                className="size-6 translate-x-0.5 fill-foreground text-foreground sm:size-7"
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
