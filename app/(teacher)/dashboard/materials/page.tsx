import { FolderOpen } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import FormDialog from '@/components/common/form-dialog';
import PageHeader from '@/components/common/page-header';
import AddMaterialForm from '@/features/materials/components/add-material-form';
import MaterialCard from '@/features/materials/components/material-card';
import { getMaterials } from '@/features/materials/queries';
import type { RouteParams } from '@/types/global';

export default async function Materials({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getMaterials({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 12,
  });

  const { materials } = data || {};

  return (
    <div className="pb-16">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Materials"
          subText="Reading, listening and reference material for all students."
        />

        <FormDialog triggerLabel="Add material" title="New material">
          <AddMaterialForm />
        </FormDialog>
      </div>

      <div className="mt-6">
        <DataRenderer
          success={success}
          error={error}
          data={materials}
          empty={{
            icon: FolderOpen,
            title: 'No materials yet',
            message:
              'Add a document or a link and every student will be able to see it.',
            action: (
              <div className="mt-6">
                <FormDialog triggerLabel="Add material" title="New material">
                  <AddMaterialForm />
                </FormDialog>
              </div>
            ),
          }}
          render={(materials) => (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {materials.map((item) => (
                <MaterialCard key={item.id} data={item} />
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
}
