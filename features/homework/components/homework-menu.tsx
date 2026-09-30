'use client';

import RowMenu from '@/components/common/row-menu';
import { deleteHomeWork } from '@/features/homework/actions';
import AddHomeworkForm from './add-homework-form';

export default function HomeworkMenu({ data }: { data: HomeWorkRecord }) {
  return (
    <RowMenu
      label={data.title}
      editTitle="Edit homework"
      editClassName="sm:max-w-2xl"
      editForm={(close) => (
        <AddHomeworkForm
          classId={data.classId}
          homework={data}
          onSuccess={close}
        />
      )}
      onDelete={() => deleteHomeWork(data.id)}
      deleteTitle="Delete this homework?"
      deleteDescription={`${data.title} will be removed for your students. This cannot be undone.`}
      deletedToast="Homework deleted"
      deleteErrorToast="Could not delete homework"
    />
  );
}
