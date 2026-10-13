'use client';

import { FolderOpen } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import FormDialog from '@/components/common/form-dialog';
import PageHeader from '@/components/common/page-header';
import { useDemoData } from '@/features/demo/components/store';
import { materialsOf } from '@/features/demo/selectors';
import AddMaterialForm from '@/features/materials/components/add-material-form';
import MaterialGrid from '@/features/materials/components/material-grid';
import MaterialTabs from '@/features/materials/components/material-tabs';
import { toMaterialKind } from '@/lib/utils';

const DIALOG_WIDTH = 'sm:max-w-3xl lg:max-w-4xl';

const EMPTY_MESSAGE = {
  link: 'Add a video link and every student will be able to watch it.',
  guide: 'Write a guide and every student will be able to read it here.',
  article: 'Add a reading link and students will see it on their home page.',
} as const;

// The same page as /dashboard/materials. Every invented material fits on one
// page, so there is no pagination.
export default function DemoTeacherMaterials() {
  const kind = toMaterialKind(useSearchParams().get('kind'));
  const materials = materialsOf(useDemoData(), kind);

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          title="Materials"
          subText="Guides, videos and reading for all students."
        />

        <FormDialog
          triggerLabel="Add material"
          title="New material"
          contentClassName={DIALOG_WIDTH}
        >
          <AddMaterialForm />
        </FormDialog>
      </div>

      <MaterialTabs />

      <MaterialGrid
        kind={kind}
        materials={materials}
        editable
        empty={{
          icon: FolderOpen,
          title: 'Nothing here yet',
          message: EMPTY_MESSAGE[kind],
          action: (
            <div className="mt-6">
              <FormDialog
                triggerLabel="Add material"
                title="New material"
                contentClassName={DIALOG_WIDTH}
              >
                <AddMaterialForm />
              </FormDialog>
            </div>
          ),
        }}
      />
    </div>
  );
}
