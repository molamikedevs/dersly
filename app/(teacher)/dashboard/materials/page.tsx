import { FolderOpen } from 'lucide-react';
import { Suspense } from 'react';

import FormDialog from '@/components/common/form-dialog';
import PageHeader from '@/components/common/page-header';
import AddMaterialForm from '@/features/materials/components/add-material-form';
import MaterialList from '@/features/materials/components/material-list';
import MaterialListSkeleton from '@/features/materials/components/material-list-skeleton';
import MaterialTabs from '@/features/materials/components/material-tabs';
import { toMaterialKind } from '@/lib/utils';
import type { RouteParams } from '@/types/global';

export const metadata = { title: 'Materials' };

const DIALOG_WIDTH = 'sm:max-w-3xl lg:max-w-4xl';

const EMPTY_MESSAGE = {
  link: 'Add a video link and every student will be able to watch it.',
  guide: 'Write a guide and every student will be able to read it here.',
  article: 'Add a reading link and students will see it on their home page.',
} as const;

export default async function Materials({ searchParams }: RouteParams) {
  const { page, pageSize, kind } = await searchParams;
  const activeKind = toMaterialKind(kind);
  const currentPage = Number(page) || 1;

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

      <Suspense
        key={`${activeKind}-${currentPage}`}
        fallback={<MaterialListSkeleton kind={activeKind} />}
      >
        <MaterialList
          kind={activeKind}
          page={currentPage}
          pageSize={Number(pageSize) || 8}
          editable
          empty={{
            icon: FolderOpen,
            title: 'Nothing here yet',
            message: EMPTY_MESSAGE[activeKind],
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
      </Suspense>
    </div>
  );
}
