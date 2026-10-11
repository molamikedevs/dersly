import { ArrowUpRight } from 'lucide-react';

import { hostname } from '@/lib/utils';

type Item = {
  id: string;
  title: string;
  url: string | null;
};

export default function ReadingList({ items }: { items: Item[] }) {
  // A reading link without a URL has nothing to open
  const links = items.filter((item) => item.url);

  if (links.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
        Worth reading
      </h2>

      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {links.map(({ id, title, url }) => (
          <li key={id}>
            <a
              href={url!}
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-2 flex min-h-14 touch-manipulation items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:bg-accent"
            >
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 text-base leading-snug font-semibold wrap-break-word text-foreground">
                  {title}
                </span>
                <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                  {hostname(url!)}
                </span>
                <span className="sr-only">Opens in a new tab</span>
              </span>

              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
