import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 marker:text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6 marker:text-muted-foreground">
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
    <div className="mt-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[32rem] border-collapse text-left text-[15px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-3 font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-t border-border px-4 py-3 align-top text-foreground">
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
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  );
}
