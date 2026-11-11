'use client';

import RowMenu from '@/components/common/row-menu';
import { useDerslyActions } from '@/features/app/actions-context';
import WordForm from './word-form';

export default function WordMenu({ data }: { data: WordRecord }) {
  // The real action in the app, a local one in the demo
  const { deleteWord } = useDerslyActions();

  return (
    <RowMenu
      label={data.word}
      editTitle="Edit word"
      editForm={(close) => (
        <WordForm
          enrollmentId={data.enrollmentId}
          word={data}
          onSuccess={close}
        />
      )}
      onDelete={() => deleteWord(data.id)}
      deleteTitle="Delete this word?"
      deleteDescription={`${data.word} will be removed from your student's Home page. This cannot be undone.`}
      deletedToast="Word deleted"
      deleteErrorToast="Could not delete the word"
    />
  );
}
