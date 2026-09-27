import { ArrowUpRight } from 'lucide-react';

import { hostname } from '@/lib/utils';

type Item = {
  id: string;
  title: string;
  url: string | null;
};

export default function ReadingList({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground">
        Worth reading
      </h2>

      <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card px-5">
        {items.map(({ id, title, url }) => {
          if (!url) return null;

          return (
            <li key={id}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-14 items-center gap-3 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium text-foreground">
                    {title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {hostname(url)}
                  </span>
                </span>

                <ArrowUpRight
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
