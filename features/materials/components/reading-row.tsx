import { ArrowUpRight } from 'lucide-react';

import { hostname } from '@/lib/utils';
import { MaterialRecord } from '@/types/materials';
import MaterialMenu from './material-menu';

export default function ReadingRow({
  data,
  editable = false,
}: {
  data: MaterialRecord;
  editable?: boolean;
}) {
  const { title, url, level } = data;

  if (!url) return null;

  return (
    <li className="flex items-center gap-3 py-3.5">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-w-0 flex-1 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium text-foreground">
            {title}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {level && <span className="capitalize">{level} &middot; </span>}
            {hostname(url)}
          </span>
        </span>

        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </a>

      {editable && (
        <div className="shrink-0">
          <MaterialMenu data={data} />
        </div>
      )}
    </li>
  );
}
