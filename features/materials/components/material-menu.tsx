'use client';

import RowMenu from '@/components/common/row-menu';
import AddMaterialForm from '@/features/materials/components/add-material-form';
import { MaterialRecord } from '@/types/materials';
import { deleteMaterialAction } from '../actions';

export default function MaterialMenu({ data }: { data: MaterialRecord }) {
  return (
    <RowMenu
      label={data.title}
      editTitle="Edit material"
      editClassName="sm:max-w-3xl lg:max-w-4xl"
      editForm={(close) => (
        <AddMaterialForm material={data} onSuccess={close} />
      )}
      onDelete={() => deleteMaterialAction(data.id)}
      deleteTitle="Delete this material?"
      deleteDescription={`${data.title} will be removed for every student. This cannot be undone.`}
      deletedToast="Material deleted"
      deleteErrorToast="Could not delete material"
    />
  );
}
