import { ChevronRight, ClipboardList } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import PageHeader from '@/components/common/page-header';
import Pagination from '@/components/common/pagination';
import { AppLink } from '@/features/app/app-mode';
import { formatDate } from '@/lib/utils';
import { countLabel } from '../constant/index';

type Props = {
  groups: HomeWorkGroup[] | undefined;
  isNext?: boolean;
  success?: boolean;
  error?: { message?: string; details?: Record<string, string[]> };
};

export default function HomeworkGroups({
  groups,
  isNext = false,
  success = true,
  error,
}: Props) {
  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-8 pb-16">
      <PageHeader
        title="Homework"
        subText="The latest homework in each class. Open a class to see all of it."
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
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {groups.map(({ id, name, items }) => {
              const [latest] = items;

              return (
                <li key={id}>
                  <AppLink
                    href={`/dashboard/classes/${id}`}
                    className="group flex min-h-16 touch-manipulation items-center gap-4 px-5 py-4 transition-colors select-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset active:bg-muted sm:px-6"
                  >
                    <span className="grid min-w-0 flex-1 gap-x-6 gap-y-1 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] md:items-center">
                      <span className="truncate text-base font-semibold text-foreground">
                        {name}
                      </span>

                      <span className="min-w-0 truncate text-[15px] text-foreground md:text-muted-foreground">
                        {latest?.title}
                      </span>

                      <span className="text-sm text-muted-foreground tabular-nums md:text-right">
                        {latest && `Posted ${formatDate(latest.createdAt)}, `}
                        {countLabel(items.length)}
                      </span>
                    </span>

                    <ChevronRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </AppLink>
                </li>
              );
            })}
          </ul>
        )}
      />

      <Pagination isNext={isNext} />
    </div>
  );
}
