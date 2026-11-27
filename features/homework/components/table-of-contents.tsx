'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export type TocItem = {
  id: string;
  label: string;
};

type Props = {
  sections: TocItem[];
};

const HEADER_OFFSET = 140;

export default function TableOfContents({ sections }: Props) {
  const items: TocItem[] = [
    { id: 'introduction', label: 'Introduction' },
    ...sections,
  ];
  const [activeId, setActiveId] = useState<string>('introduction');

  useEffect(() => {
    const ids = ['introduction', ...sections.map((item) => item.id)];
    let ticking = false;

    function updateActive() {
      ticking = false;

      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 40;

      if (nearBottom && ids.length > 0) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      let current = ids[0] ?? 'introduction';

      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;

        if (element.getBoundingClientRect().top <= HEADER_OFFSET) {
          current = id;
        } else {
          break;
        }
      }

      setActiveId(current);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateActive);
      }
    }

    updateActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);

  return (
    <nav
      aria-label="On this page"
      className="hidden lg:sticky lg:top-24 lg:block"
    >
      <p className="text-xs font-semibold tracking-wide text-muted-foreground">
        On this page
      </p>

      <ul className="mt-3 flex flex-col border-l border-border-subtle">
        {items.map(({ id, label }) => {
          const active = activeId === id;

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setActiveId(id)}
                aria-current={active ? 'location' : undefined}
                className={cn(
                  '-ml-px block border-l-2 py-1.5 pl-3.5 text-xs leading-snug transition-colors',
                  active
                    ? 'border-primary font-semibold text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                )}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
