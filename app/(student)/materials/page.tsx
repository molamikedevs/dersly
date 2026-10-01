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
    <div className="flex w-full min-w-0 flex-col gap-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          title="Materials"
          subText="Guides, videos and reading for all students."
        />

        <Filter
          options={[
            { label: 'Beginner', value: 'beginner' },
            { label: 'Elementary', value: 'elementary' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ]}
          allLabel="All levels"
        />
      </div>

      <MaterialTabs />

      <Suspense
        key={`${activeKind}-${currentPage}-${activeFilter ?? 'all'}`}
        fallback={<MaterialListSkeleton kind={activeKind} wide />}
      >
        <MaterialList
          kind={activeKind}
          page={currentPage}
          pageSize={Number(pageSize) || 8}
          filter={activeFilter}
          wide
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
