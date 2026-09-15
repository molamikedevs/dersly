'use client';

import RowMenu from '@/components/common/row-menu';
import { archiveClass } from '@/features/classes/actions';
import AddClassForm from './add-class-form';

export default function ClassMenu({ data }: { data: ClassWithCount }) {
  return (
    <RowMenu
      label={data.name}
      editTitle="Edit class"
      editForm={(close) => (
        <AddClassForm classRecord={data} onSuccess={close} />
      )}
      onDelete={() => archiveClass(data.id)}
      deleteTitle="Archive this class?"
      deleteDescription={`${data.name} will be hidden from your classes. Its homework and students are kept.`}
      deletedToast="Class archived"
      deleteErrorToast="Could not archive class"
      deleteLabel="Archive"
      deletePendingLabel="Archiving"
    />
  );
}
