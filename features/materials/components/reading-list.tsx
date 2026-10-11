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
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
        Worth reading
      </h2>

      <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card px-5">
        {links.map(({ id, title, url }) => (
          <li key={id}>
            <a
              href={url!}
              target="_blank"
              rel="noopener noreferrer"
              className="group -mx-2 flex min-h-14 touch-manipulation items-center gap-3 rounded-lg px-2 py-3.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:bg-muted"
            >
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 text-[15px] leading-snug font-medium break-words text-foreground group-hover:underline group-hover:underline-offset-4">
                  {title}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
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
