import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import rehypeTableLabels from '@/features/homework/constant/index';

const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-10 font-serif text-3xl font-medium tracking-tight text-foreground">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-lg font-semibold text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-base leading-relaxed text-foreground">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-primary underline underline-offset-4"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-primary">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 text-base leading-relaxed text-foreground">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 rounded-xl bg-warning-subtle px-5 py-4 text-warning-subtle-foreground [&_p]:mt-0 [&_p]:text-warning-subtle-foreground [&_p+p]:mt-2">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mt-6 sm:overflow-x-auto sm:rounded-xl sm:border sm:border-border">
      <table className="block w-full text-left text-[15px] sm:table sm:min-w-[32rem] sm:border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="hidden bg-muted sm:table-header-group">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="flex flex-col gap-3 sm:table-row-group">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:table-row sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 font-semibold text-foreground">{children}</th>
  ),
  td: ({ node: _node, children, ...props }) => (
    <td
      {...props}
      className="block leading-relaxed text-foreground before:mb-0.5 before:block before:text-xs before:font-semibold before:uppercase before:tracking-[0.12em] before:text-muted-foreground before:content-[attr(data-label)] first:font-semibold first:before:hidden sm:table-cell sm:border-t sm:border-border sm:px-4 sm:py-3 sm:align-top sm:first:font-normal sm:before:hidden"
    >
      {children}
    </td>
  ),
  hr: () => <hr className="my-10 border-border" />,
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-[0.9em]">
      {children}
    </code>
  ),
};

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="min-w-0 [&>*:first-child]:mt-0">
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
