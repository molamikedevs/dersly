import { ArrowLeft, BookOpen } from 'lucide-react';
import { ReactNode } from 'react';

import { AppLink } from '@/features/app/app-mode';
import MarkdownContent from './markdown-content';

type Props = {
  data: HomeWorkRecord;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
};

export default function HomeworkReader({
  data,
  backHref,
  backLabel,
  actions,
}: Props) {
  const { title, instructions, content, classes } = data;
  const isTopic = classes?.type === 'conversation';
  const hasBackLink = Boolean(backHref && backLabel);

  return (
    <article className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-6 pb-16">
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

          {actions}
        </div>
      )}

      <div className="surface-card flex flex-col overflow-hidden">
        <header className="flex flex-col gap-3.5 border-b border-border-subtle p-6 sm:p-9">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-secondary/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              <BookOpen className="size-3.5 text-primary" aria-hidden />
              {isTopic ? 'Club topic' : 'Lesson guide'}
            </span>

            {classes?.name && (
              <span className="inline-flex items-center rounded-full border border-border-subtle bg-secondary/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                {classes.name}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl leading-[1.15] font-medium tracking-tight text-balance wrap-break-word text-foreground sm:text-4xl">
            {title}
          </h1>

          {instructions && (
            <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {instructions}
            </p>
          )}
        </header>

        <div className="px-6 py-7 sm:px-9 sm:py-9">
          {content ? (
            <MarkdownContent content={content} />
          ) : (
            <p className="text-sm text-muted-foreground sm:text-base">
              There is no written guide for this homework yet.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
