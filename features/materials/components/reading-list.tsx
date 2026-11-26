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
      <h2 className="text-lg leading-snug font-semibold tracking-tight text-foreground">
        Worth reading
      </h2>

      <ul className="surface-card flex flex-col overflow-hidden">
        {links.map(({ id, title, url }) => (
          <li key={id} className="surface-row">
            <a
              href={url!}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-14 touch-manipulation items-center gap-3 px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
            >
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 text-sm leading-snug font-semibold wrap-break-word text-foreground transition-colors group-hover:text-primary">
                  {title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {hostname(url!)}
                </span>
                <span className="sr-only">Opens in a new tab</span>
              </span>

              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
