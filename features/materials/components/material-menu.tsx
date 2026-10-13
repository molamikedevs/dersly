'use client';

import RowMenu from '@/components/common/row-menu';
import { useDerslyActions } from '@/features/app/actions-context';
import AddMaterialForm from '@/features/materials/components/add-material-form';
import { MaterialRecord } from '@/types/materials';

export default function MaterialMenu({ data }: { data: MaterialRecord }) {
  // The real action in the app, a local one in the demo
  const { deleteMaterial } = useDerslyActions();

  return (
    <RowMenu
      label={data.title}
      editTitle="Edit material"
      editClassName="sm:max-w-3xl lg:max-w-4xl"
      editForm={(close) => (
        <AddMaterialForm material={data} onSuccess={close} />
      )}
      onDelete={() => deleteMaterial(data.id)}
      deleteTitle="Delete this material?"
      deleteDescription={`${data.title} will be removed for every student. This cannot be undone.`}
      deletedToast="Material deleted"
      deleteErrorToast="Could not delete material"
    />
  );
}
