import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import MarkdownContent from './markdown-content';

type Props = {
  data: HomeWorkRecord;
  backHref: string;
  backLabel: string;
};

export default function HomeworkReader({ data, backHref, backLabel }: Props) {
  const { title, instructions, content, classes } = data;

  return (
    <article className="mx-auto flex w-full max-w-3xl min-w-0 flex-col pb-16">
      <Link
        href={backHref}
        className="inline-flex min-h-11 items-center gap-2 self-start rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {backLabel}
      </Link>

      <header className="mt-4 border-b border-border pb-8">
        {classes?.name && (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {classes.name}
          </p>
        )}

        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>

        {instructions && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {instructions}
          </p>
        )}
      </header>

      <div className="mt-8">
        {content ? (
          <MarkdownContent content={content} />
        ) : (
          <p className="text-base text-muted-foreground">
            There is no written guide for this homework yet.
          </p>
        )}
      </div>
    </article>
  );
}
