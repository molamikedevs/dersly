import { FolderOpen } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import Filter from '@/components/common/filter';
import PageHeader from '@/components/common/page-header';
import Pagination from '@/components/common/pagination';
import MaterialCard from '@/features/materials/components/material-card';
import MaterialTabs from '@/features/materials/components/material-tabs';
import ReadingRow from '@/features/materials/components/reading-row';
import { getMaterials } from '@/features/materials/queries';
import { toMaterialKind } from '@/lib/utils';
import type { RouteParams } from '@/types/global';

export const metadata = {
  title: 'Materials',
};

const EMPTY_LABEL = {
  link: 'No videos yet',
  file: 'No documents yet',
  article: 'Nothing to read yet',
} as const;

export default async function Materials({ searchParams }: RouteParams) {
  const { page, pageSize, filter, kind } = await searchParams;

  const activeKind = toMaterialKind(kind);
  const activeFilter = typeof filter === 'string' ? filter : undefined;

  const { data, success, error } = await getMaterials(
    {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 8,
      filter: activeFilter,
    },
    activeKind,
  );

  const { materials } = data || {};

  return (
    <div className="flex w-full min-w-0 flex-col gap-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          title="Materials"
          subText="Reading, listening and reference material for all students."
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

      <DataRenderer
        success={success}
        error={error}
        data={materials}
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
        render={(materials) =>
          activeKind === 'article' ? (
            <ul className="flex flex-col gap-3">
              {materials.map((item) => (
                <ReadingRow key={item.id} data={item} />
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {materials.map((item) => (
                <MaterialCard key={item.id} data={item} />
              ))}
            </div>
          )
        }
      />

      <Pagination isNext={data?.isNext ?? false} />
    </div>
  );
}
