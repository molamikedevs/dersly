import { FolderOpen } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import Filter from '@/components/common/filter';
import FormDialog from '@/components/common/form-dialog';
import PageHeader from '@/components/common/page-header';
import Pagination from '@/components/common/pagination';
import AddMaterialForm from '@/features/materials/components/add-material-form';
import MaterialCard from '@/features/materials/components/material-card';
import { getMaterials } from '@/features/materials/queries';
import type { RouteParams } from '@/types/global';

export const metadata = {
  title: 'Materials',
};

export default async function Materials({ searchParams }: RouteParams) {
  const { page, pageSize, filter } = await searchParams;

  const { data, success, error } = await getMaterials({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 8,
    filter: typeof filter === 'string' ? filter : undefined,
  });

  const { materials } = data || {};
  const activeFilter = typeof filter === 'string' ? filter : undefined;

  return (
    <div className="pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Materials"
          subText="Reading, listening and reference material for all students."
        />

        <FormDialog triggerLabel="Add material" title="New material">
          <AddMaterialForm />
        </FormDialog>
      </div>

      <div className="mt-6 flex justify-end">
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
      <div className="mt-6">
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
                  title: 'No materials yet',
                  message:
                    'Add a document or a link and every student will be able to see it.',
                  action: (
                    <div className="mt-6">
                      <FormDialog
                        triggerLabel="Add material"
                        title="New material"
                      >
                        <AddMaterialForm />
                      </FormDialog>
                    </div>
                  ),
                }
          }
          render={(materials) => (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {materials.map((item) => (
                <MaterialCard key={item.id} data={item} />
              ))}
            </div>
          )}
        />
      </div>
      <Pagination isNext={data?.isNext ?? false} />
    </div>
  );
}
