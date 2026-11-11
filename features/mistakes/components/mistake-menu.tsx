'use client';

import RowMenu from '@/components/common/row-menu';
import { useDerslyActions } from '@/features/app/actions-context';
import MistakeForm from './mistake-form';

export default function MistakeMenu({ data }: { data: MistakeRecord }) {
  // The real action in the app, a local one in the demo
  const { deleteMistake } = useDerslyActions();

  return (
    <RowMenu
      label={data.wrong}
      editTitle="Edit mistake"
      editForm={(close) => (
        <MistakeForm
          enrollmentId={data.enrollmentId}
          mistake={data}
          onSuccess={close}
        />
      )}
      onDelete={() => deleteMistake(data.id)}
      deleteTitle="Delete this mistake?"
      deleteDescription="It will be removed from your student's Home page. This cannot be undone."
      deletedToast="Mistake deleted"
      deleteErrorToast="Could not delete the mistake"
    />
  );
}
