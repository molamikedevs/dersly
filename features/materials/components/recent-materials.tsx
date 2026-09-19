import { FileText, Play } from 'lucide-react';
import Link from 'next/link';

import { youTubeId } from '@/lib/utils';

type Item = {
  id: string;
  title: string;
  level: string | null;
  url: string | null;
};

export default function RecentMaterials({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
          Recent materials
        </h2>
        <Link
          href="/materials"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          See all
        </Link>
      </div>

      <ul className="mt-2 divide-y divide-border rounded-lg bg-card px-3.5 shadow-sm">
        {items.map(({ id, title, level, url }) => {
          const isVideo = url ? Boolean(youTubeId(url)) : false;
          const Icon = isVideo ? Play : FileText;

          return (
            <li key={id}>
              <Link
                href="/materials"
                className="flex min-h-14 items-center gap-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
                >
                  <Icon
                    className={isVideo ? 'size-4 fill-current' : 'size-4'}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {level && (
                      <span className="capitalize">{level} &middot; </span>
                    )}
                    {isVideo ? 'Video' : 'Document'}
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
