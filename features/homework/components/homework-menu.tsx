'use client';

import RowMenu from '@/components/common/row-menu';
import { useDerslyActions } from '@/features/app/actions-context';
import AddHomeworkForm from './add-homework-form';

export default function HomeworkMenu({ data }: { data: HomeWorkRecord }) {
  // The real action in the app, a local one in the demo
  const { deleteHomework } = useDerslyActions();

  return (
    <RowMenu
      label={data.title}
      editTitle="Edit homework"
      editClassName="sm:max-w-3xl lg:max-w-4xl"
      editForm={(close) => (
        <AddHomeworkForm
          classId={data.classId}
          homework={data}
          onSuccess={close}
        />
      )}
      onDelete={() => deleteHomework(data.id)}
      deleteTitle="Delete this homework?"
      deleteDescription={`${data.title} will be removed for your students. This cannot be undone.`}
      deletedToast="Homework deleted"
      deleteErrorToast="Could not delete homework"
    />
  );
}
