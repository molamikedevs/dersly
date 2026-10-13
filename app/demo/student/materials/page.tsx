'use client';

import { FolderOpen } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import Filter from '@/components/common/filter';
import PageHeader from '@/components/common/page-header';
import { useDemoData } from '@/features/demo/components/store';
import { materialsOf } from '@/features/demo/selectors';
import MaterialGrid from '@/features/materials/components/material-grid';
import MaterialTabs from '@/features/materials/components/material-tabs';
import { toMaterialKind } from '@/lib/utils';

const EMPTY_LABEL = {
  link: 'No videos yet',
  guide: 'No guides yet',
  article: 'Nothing to read yet',
} as const;

// The same page as /materials. Every invented material fits on one page, so
// there is no pagination.
export default function DemoStudentMaterials() {
  const searchParams = useSearchParams();
  const kind = toMaterialKind(searchParams.get('kind'));
  const filter = searchParams.get('filter') ?? undefined;
  const materials = materialsOf(useDemoData(), kind, filter);

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

      <MaterialGrid
        kind={kind}
        materials={materials}
        wide
        empty={
          filter
            ? {
                icon: FolderOpen,
                title: 'Nothing at this level',
                message:
                  'Try another level, or clear the filter to see everything.',
              }
            : {
                icon: FolderOpen,
                title: EMPTY_LABEL[kind],
                message: 'New material will appear here when it is added.',
              }
        }
      />
    </div>
  );
}
