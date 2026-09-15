import { ClipboardList, FileText, Paperclip } from 'lucide-react';
import Link from 'next/link';

import DataRenderer from '@/components/common/data-renderer';
import PageHeader from '@/components/common/page-header';
import { getGroupedHomework } from '@/features/homework/queries';
import { formatDueDate } from '@/lib/utils';
import { RouteParams } from '@/types/global';

export default async function HomeWork({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getGroupedHomework({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
  });

  const { groups } = data || {};

  return (
    <div className="pb-16">
      <PageHeader
        title="Homework"
        subText="Everything you have posted, newest first."
      />

      <div className="mt-8">
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
          render={(groups) =>
            groups.map(({ id, name, items }) => (
              <section key={id} className="mt-10 first:mt-0">
                <div className="flex items-baseline gap-2.5">
                  <Link
                    href={`/dashboard/classes/${id}`}
                    className="text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {name}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {items.length}
                  </span>
                </div>

                <ul className="mt-3 divide-y divide-border">
                  {items.map((work) => {
                    const fileName = work.attachmentPath?.split('/').pop();

                    return (
                      <li key={work.id}>
                        <Link
                          href={`/dashboard/classes/${id}`}
                          className="-mx-2 flex min-h-11 items-start gap-4 rounded-md px-2 py-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {work.attachmentPath ? (
                            <span
                              aria-hidden
                              className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-muted"
                            >
                              <FileText className="size-4 text-muted-foreground" />
                            </span>
                          ) : (
                            <span
                              aria-hidden
                              className="mt-0.5 size-9 shrink-0"
                            />
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="truncate font-medium text-foreground">
                                {work.title}
                              </span>
                              {!work.isPublished && (
                                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                  Draft
                                </span>
                              )}
                            </div>

                            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                              <span>{formatDueDate(work.dueDate)}</span>
                              {fileName && (
                                <>
                                  <span aria-hidden className="text-border">
                                    ·
                                  </span>
                                  <span className="inline-flex min-w-0 items-center gap-1.5">
                                    <Paperclip
                                      className="size-3.5 shrink-0"
                                      aria-hidden
                                    />
                                    <span className="truncate">{fileName}</span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          }
        />
      </div>
    </div>
  );
}
