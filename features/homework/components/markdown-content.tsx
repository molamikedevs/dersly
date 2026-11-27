import { Children, isValidElement, type ReactNode } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import rehypeTableLabels from '@/features/homework/constant/index';

export function headingSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function plainText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(plainText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return plainText(node.props.children);
  }
  return '';
}

const components: Components = {
  h1: ({ children }) => {
    const id = headingSlug(plainText(children));
    return (
      <h2
        id={id || undefined}
        className="mt-12 scroll-mt-24 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
      >
        {children}
      </h2>
    );
  },
  h2: ({ children }) => {
    const id = headingSlug(plainText(children));
    return (
      <h2
        id={id || undefined}
        className="mt-12 scroll-mt-24 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[26px]"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => (
    <h3 className="mt-8 text-base font-semibold tracking-tight text-foreground sm:text-lg">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-foreground/90 sm:text-base">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-primary underline decoration-primary/45 underline-offset-4 transition-colors hover:decoration-primary"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ''}
      loading="lazy"
      decoding="async"
      className="mt-6 block h-auto max-h-96 w-auto max-w-full rounded-xl border border-border-subtle [td_&]:mt-0 [td_&]:max-h-28"
    />
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2.5 pl-6 marker:text-primary/70">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 divide-y divide-border-subtle border-y border-border-subtle">
      {Children.map(children, (child, index) => {
        if (!isValidElement<{ children?: ReactNode }>(child)) return child;
        return (
          <li className="flex items-baseline gap-4 py-4 text-[15px] leading-relaxed text-foreground/95 sm:text-base">
            <span className="w-5 shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">{child.props.children}</div>
          </li>
        );
      })}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 text-[15px] leading-[1.75] text-foreground/90 sm:text-base">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-8 rounded-2xl border border-warning/20 bg-warning-subtle/85 px-6 py-5 text-warning-subtle-foreground [&_p]:mt-0 [&_p]:max-w-none [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-warning-subtle-foreground/90 [&_p+p]:mt-2.5 [&_strong]:text-warning-subtle-foreground">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mt-5 border-t border-border-subtle">
      <table className="block w-full text-left text-[15px] sm:table sm:border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="sr-only sm:not-sr-only sm:border-b sm:border-border-subtle">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="block divide-y divide-border-subtle sm:table-row-group">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="flex flex-col gap-1.5 border-b border-border-subtle py-4 sm:table-row sm:py-0">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="py-2.5 pr-6 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
      {children}
    </th>
  ),
  td: ({ children, style, ...props }) => (
    <td
      data-label={(props as { 'data-label'?: string })['data-label']}
      style={style}
      className="block leading-relaxed text-foreground/90 before:mb-0.5 before:block before:text-[11px] before:font-semibold before:tracking-[0.12em] before:text-muted-foreground before:uppercase before:content-[attr(data-label)] first:font-serif first:text-base first:font-medium first:text-foreground first:before:hidden sm:table-cell sm:border-b sm:border-border-subtle sm:py-4 sm:pr-6 sm:align-top sm:before:hidden sm:first:w-[36%] sm:first:text-[17px]"
    >
      {children}
    </td>
  ),
  hr: () => <hr className="my-10 border-border-subtle" />,
  pre: ({ children }) => (
    <pre className="mt-5 overflow-x-auto rounded-xl border border-border-subtle bg-secondary/75 px-4 py-3.5 font-sans text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-foreground/95 sm:text-[15px] [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:font-sans [&_code]:text-[1em]">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded-md border border-border-subtle bg-secondary px-1.5 py-0.5 font-mono text-[0.875em] text-primary">
      {children}
    </code>
  ),
};

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="min-w-0 wrap-break-word [&>*:first-child]:mt-0">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeTableLabels]}
        components={components}
      >
        {content}
      </Markdown>
    </div>
  );
}
