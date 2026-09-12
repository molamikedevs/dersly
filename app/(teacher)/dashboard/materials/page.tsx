import { FolderOpen } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import FormDialog from '@/components/common/form-dialog';
import AddMaterialForm from '@/features/materials/components/add-material-form';
import MaterialCard from '@/features/materials/components/material-card';
import { mockMaterials } from '@/features/materials/mock';

export default function Materials() {
  const result = { success: true, data: mockMaterials };

  const sorted = [...result.data].sort(
    (a, b) => Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt),
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Materials
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reading, listening and reference material for all students.
          </p>
        </div>

        <FormDialog triggerLabel="Add material" title="New material">
          <AddMaterialForm />
        </FormDialog>
      </div>

      <div className="mt-8">
        <DataRenderer
          success={result.success}
          data={sorted}
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
            <div className="flex flex-col gap-3">
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
