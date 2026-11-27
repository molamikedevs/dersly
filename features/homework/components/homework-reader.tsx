import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

import { AppLink } from '@/features/app/app-mode';
import { cn, formatDate } from '@/lib/utils';
import MarkdownContent, { headingSlug } from './markdown-content';
import TableOfContents, { type TocItem } from './table-of-contents';

type Props = {
  data: HomeWorkRecord;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
};

function extractSections(markdown: string | null): TocItem[] {
  if (!markdown) return [];

  const items: TocItem[] = [];
  const seen = new Set<string>();

  for (const line of markdown.split('\n')) {
    const match = line.match(/^##\s+(.+)$/);
    if (!match) continue;

    const label = match[1]
      .replace(/[*_`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();
    const id = headingSlug(label);

    if (id && !seen.has(id)) {
      seen.add(id);
      items.push({ id, label });
    }
  }

  return items;
}

export default function HomeworkReader({
  data,
  backHref,
  backLabel,
  actions,
}: Props) {
  const { title, instructions, content, classes, dueDate, createdAt } = data;
  const hasBackLink = Boolean(backHref && backLabel);
  const sections = extractSections(content);
  const hasToc = sections.length > 0;

  const metaParts = [
    classes?.name,
    dueDate
      ? `Due ${formatDate(dueDate, 'long')}`
      : createdAt
        ? `Posted ${formatDate(createdAt, 'long')}`
        : null,
  ].filter(Boolean);

  return (
    <article
      className={cn(
        'mx-auto flex w-full min-w-0 flex-col gap-8 pb-20',
        hasToc ? 'max-w-5xl' : 'max-w-3xl',
      )}
    >
      {/* Top navigation & Teacher Save PDF action */}
      {(hasBackLink || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {hasBackLink ? (
            <AppLink
              href={backHref!}
              className="inline-flex min-h-10 items-center gap-2 self-start rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ArrowLeft className="size-4" aria-hidden />
              {backLabel}
            </AppLink>
          ) : (
            <span />
          )}

          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      <div
        className={cn(
          'grid grid-cols-1 gap-10',
          hasToc &&
            'lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:items-start lg:gap-14',
        )}
      >
        {hasToc && <TableOfContents sections={sections} />}

        <div className="min-w-0 max-w-3xl">
          <header
            id="introduction"
            className="scroll-mt-24 border-b border-border-subtle pb-8"
          >
            {metaParts.length > 0 && (
              <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                {metaParts.join(' · ')}
              </p>
            )}

            <h1 className="mt-2 font-serif text-3xl leading-[1.12] font-medium tracking-tight text-balance wrap-break-word text-foreground sm:text-5xl">
              {title}
            </h1>

            {instructions && (
              <p className="mt-4 max-w-prose text-[15px] leading-[1.75] text-muted-foreground sm:text-base">
                {instructions}
              </p>
            )}
          </header>

          <div className="mt-8">
            {content ? (
              <MarkdownContent content={content} />
            ) : (
              <p className="text-sm text-muted-foreground sm:text-base">
                There is no written guide for this homework yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
