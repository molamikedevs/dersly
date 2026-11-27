import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import rehypeTableLabels from '@/features/homework/constant/index';

const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-10 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 border-b border-border-subtle pb-2.5 font-serif text-xl font-medium tracking-tight text-foreground sm:text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-7 text-base font-semibold tracking-tight text-foreground sm:text-lg">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-[15px] leading-[1.8] text-foreground/90 sm:text-base">
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
    <ol className="mt-4 list-decimal space-y-2.5 pl-6 marker:font-semibold marker:text-primary">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 text-[15px] leading-[1.75] text-foreground/90 sm:text-base">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 rounded-xl border border-primary/20 border-l-4 border-l-primary bg-secondary/65 px-5 py-4 text-foreground/95 [&_p]:mt-0 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p+p]:mt-2.5">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mt-6 sm:overflow-x-auto sm:rounded-xl sm:border sm:border-border-subtle sm:bg-background/40">
      <table className="block w-full text-left text-sm sm:table sm:min-w-[32rem] sm:border-collapse sm:text-[15px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="hidden border-b border-border-subtle bg-secondary/75 sm:table-header-group">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="flex flex-col gap-3 sm:table-row-group">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-secondary/50 p-4 sm:table-row sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
      {children}
    </th>
  ),
  td: ({ children, style, ...props }) => (
    <td
      data-label={(props as { 'data-label'?: string })['data-label']}
      style={style}
      className="block leading-relaxed text-foreground/90 before:mb-0.5 before:block before:text-[11px] before:font-semibold before:tracking-[0.12em] before:text-muted-foreground before:uppercase before:content-[attr(data-label)] first:font-semibold first:text-foreground first:before:hidden sm:table-cell sm:border-t sm:border-border-subtle sm:px-4 sm:py-3 sm:align-top sm:before:hidden sm:first:font-medium"
    >
      {children}
    </td>
  ),
  hr: () => <hr className="my-9 border-border-subtle" />,
  pre: ({ children }) => (
    <pre className="mt-5 overflow-x-auto rounded-xl border border-border-subtle bg-secondary/80 px-4 py-3.5 font-sans text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-foreground/95 sm:text-[15px] [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:font-sans [&_code]:text-[1em]">
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
