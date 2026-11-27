import { FolderOpen } from 'lucide-react';
import { Suspense } from 'react';

import Filter from '@/components/common/filter';
import PageHeader from '@/components/common/page-header';
import MaterialList from '@/features/materials/components/material-list';
import MaterialListSkeleton from '@/features/materials/components/material-list-skeleton';
import MaterialTabs from '@/features/materials/components/material-tabs';
import { toMaterialKind } from '@/lib/utils';
import type { RouteParams } from '@/types/global';

export const metadata = {
  title: 'Materials',
};

const EMPTY_LABEL = {
  link: 'No videos yet',
  guide: 'No guides yet',
  article: 'Nothing to read yet',
} as const;

export default async function Materials({ searchParams }: RouteParams) {
  const { page, pageSize, filter, kind } = await searchParams;

  const activeKind = toMaterialKind(kind);
  const activeFilter = typeof filter === 'string' ? filter : undefined;
  const currentPage = Number(page) || 1;

  return (
    <div className="flex w-full min-w-0 flex-col gap-7 pb-16">
      <PageHeader
        title="Materials"
        subText="Videos, guides and reading your teacher picked for you."
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <MaterialTabs />

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-muted-foreground">
            Level
          </span>
          <Filter
            options={[
              { label: 'Beginner', value: 'beginner' },
              { label: 'Elementary', value: 'elementary' },
              { label: 'Intermediate', value: 'intermediate' },
              { label: 'Advanced', value: 'advanced' },
            ]}
            allLabel="All levels"
            className="h-10 w-44 rounded-xl border-border-subtle bg-card text-sm font-medium"
          />
        </div>
      </div>

      <Suspense
        key={`${activeKind}-${currentPage}-${activeFilter ?? 'all'}`}
        fallback={<MaterialListSkeleton kind={activeKind} />}
      >
        <MaterialList
          kind={activeKind}
          page={currentPage}
          pageSize={Number(pageSize) || 8}
          filter={activeFilter}
          empty={
            activeFilter
              ? {
                  icon: FolderOpen,
                  title: 'Nothing at this level',
                  message:
                    'Try another level, or clear the filter to see everything.',
                }
              : {
                  icon: FolderOpen,
                  title: EMPTY_LABEL[activeKind],
                  message: 'New material will appear here when it is added.',
                }
          }
        />
      </Suspense>
    </div>
  );
}
