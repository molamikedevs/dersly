import { ChevronRight, ClipboardList, FileText, Paperclip } from 'lucide-react';
import Link from 'next/link';

import DataRenderer from '@/components/common/data-renderer';
import PageHeader from '@/components/common/page-header';
import { getGroupedHomework } from '@/features/homework/queries';
import { formatDueDate } from '@/lib/utils';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'Homework' };

export default async function HomeWork({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getGroupedHomework({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
  });

  const { groups } = data || {};

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16">
      <PageHeader
        title="Homework"
        subText="Everything you have posted, newest first."
      />

      <DataRenderer
        success={success}
        error={error}
        data={groups}
        empty={{
          icon: ClipboardList,
          title: 'No homework yet',
          message:
            'Open a class and post homework. Everything you post will appear here.',
          button: { text: 'Go to classes', href: '/dashboard/classes' },
        }}
        render={(groups) => (
          <div className="flex flex-col gap-10">
            {groups.map(({ id, name, items }) => (
              <section key={id} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="min-w-0">
                    <Link
                      href={`/dashboard/classes/${id}`}
                      className="block truncate font-serif text-2xl font-medium tracking-tight text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-[28px]"
                    >
                      {name}
                    </Link>
                  </h2>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    {items.length}
                  </span>
                </div>

                <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                  {items.map((work) => (
                    <li key={work.id}>
                      <Link
                        href={`/dashboard/classes/${id}`}
                        className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-6"
                      >
                        {work.attachmentPath ? (
                          <span
                            aria-hidden
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning-subtle-foreground"
                          >
                            <FileText className="size-4" />
                          </span>
                        ) : (
                          <span
                            aria-hidden
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                          >
                            <ClipboardList className="size-4" />
                          </span>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-base font-semibold text-foreground">
                              {work.title}
                            </span>
                            {!work.isPublished && (
                              <span className="shrink-0 rounded-full border border-input-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                                Draft
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                            <span>{formatDueDate(work.dueDate)}</span>
                            {work.attachmentPath && (
                              <>
                                <span aria-hidden>&middot;</span>
                                <span className="inline-flex min-w-0 items-center gap-1.5">
                                  <Paperclip
                                    className="size-3.5 shrink-0"
                                    aria-hidden
                                  />
                                  <span className="truncate">
                                    {work.attachmentName ?? 'Attachment'}
                                  </span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <ChevronRight
                          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      />
    </div>
  );
}
