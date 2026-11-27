import { ArrowUpRight, Link2 } from 'lucide-react';

import { hostname } from '@/lib/utils';
import { MaterialRecord } from '@/types/materials';
import MaterialMenu from './material-menu';

const LEVEL_CODE: Record<string, string> = {
  beginner: 'A1',
  elementary: 'A2',
  intermediate: 'B1',
  'upper-intermediate': 'B2',
  advanced: 'C1',
};

export default function ReadingRow({
  data,
  editable = false,
}: {
  data: MaterialRecord;
  editable?: boolean;
}) {
  const { title, url, level } = data;

  if (!url) return null;

  const code = level ? LEVEL_CODE[level.toLowerCase()] : null;

  return (
    <li className="surface-row group relative transition-colors">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
      >
        <span className="sr-only">Open {title}</span>
      </a>

      <div className="pointer-events-none relative flex items-center gap-3.5 py-3.5 pr-3 pl-4 sm:gap-4 sm:pr-4 sm:pl-5">
        <span
          aria-hidden
          className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-secondary/90 text-muted-foreground transition-colors group-hover:border-primary/35 group-hover:text-primary"
        >
          <Link2 className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 font-serif text-base font-medium tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-[17px]">
            <span className="truncate">{title}</span>
            <ArrowUpRight
              className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden
            />
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            Reading · {hostname(url)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {level ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground capitalize">
              {code && (
                <span className="rounded border border-border-subtle bg-secondary px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-foreground uppercase">
                  {code}
                </span>
              )}
              <span>{level}</span>
            </span>
          ) : (
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
              Any level
            </span>
          )}

          {editable && (
            <div className="pointer-events-auto relative z-10">
              <MaterialMenu data={data} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
