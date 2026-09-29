import { FolderOpen } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import FormDialog from '@/components/common/form-dialog';
import PageHeader from '@/components/common/page-header';
import Pagination from '@/components/common/pagination';
import AddMaterialForm from '@/features/materials/components/add-material-form';
import MaterialCard from '@/features/materials/components/material-card';
import MaterialTabs from '@/features/materials/components/material-tabs';
import ReadingRow from '@/features/materials/components/reading-row';
import { getMaterials } from '@/features/materials/queries';
import { toMaterialKind } from '@/lib/utils';
import type { RouteParams } from '@/types/global';

export const metadata = { title: 'Materials' };

export default async function Materials({ searchParams }: RouteParams) {
  const { page, pageSize, kind } = await searchParams;
  const activeKind = toMaterialKind(kind);

  const { data, success, error } = await getMaterials(
    { page: Number(page) || 1, pageSize: Number(pageSize) || 8 },
    activeKind,
  );

  const { materials } = data || {};

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          title="Materials"
          subText="Reading, listening and reference material for all students."
        />

        <FormDialog triggerLabel="Add material" title="New material">
          <AddMaterialForm />
        </FormDialog>
      </div>

      <MaterialTabs />
      <DataRenderer
        success={success}
        error={error}
        data={materials}
        empty={{
          icon: FolderOpen,
          title: 'Nothing here yet',
          message:
            activeKind === 'article'
              ? 'Add a reading link and students will see it on their home page.'
              : 'Add material here and every student will be able to see it.',
          action: (
            <div className="mt-6">
              <FormDialog triggerLabel="Add material" title="New material">
                <AddMaterialForm />
              </FormDialog>
            </div>
          ),
        }}
        render={(materials) =>
          activeKind === 'article' ? (
            <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card px-5">
              {materials.map((item) => (
                <ReadingRow key={item.id} data={item} editable />
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {materials.map((item) => (
                <MaterialCard key={item.id} data={item} editable />
              ))}
            </div>
          )
        }
      />

      <Pagination isNext={data?.isNext ?? false} />
    </div>
  );
}
