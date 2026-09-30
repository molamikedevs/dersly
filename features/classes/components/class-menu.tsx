'use client';

import { Loader2, RotateCcw, Wallet } from 'lucide-react';
import { useState } from 'react';

import RowMenu from '@/components/common/row-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/toast';
import {
  archiveClass,
  resetPackage,
  undoLesson,
} from '@/features/classes/actions';
import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import AddClassForm from './add-class-form';

export default function ClassMenu({
  data,
}: {
  data: ClassWithCount | PrivateClass;
}) {
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [pending, setPending] = useState(false);

  const enrollmentId = 'enrollmentId' in data ? data.enrollmentId : null;
  const lessonsDone = 'lessonsDone' in data ? data.lessonsDone : 0;

  async function handleUndo() {
    if (!enrollmentId) return;

    const result = await undoLesson({ enrollmentId });

    if (!result.success) {
      toast.add({
        title: 'Could not undo lesson',
        description: result.error?.message,
      });
      return;
    }

    toast.add({ title: 'Last lesson removed' });
  }

  async function handlePayment() {
    if (!enrollmentId) return;

    setPending(true);
    const result = await resetPackage({ enrollmentId });
    setPending(false);

    if (!result.success) {
      toast.add({
        title: 'Could not record payment',
        description: result.error?.message,
      });
      return;
    }

    toast.add({
      title: 'Payment recorded',
      description: 'A new package has started.',
    });
    setConfirmingPayment(false);
  }

  const lessonItems = enrollmentId ? (
    <>
      <DropdownMenuItem
        disabled={lessonsDone === 0}
        onClick={() => handleUndo()}
      >
        <RotateCcw className="size-4" aria-hidden />
        Undo last lesson
      </DropdownMenuItem>

      <DropdownMenuItem
        disabled={lessonsDone === 0}
        onClick={() => setTimeout(() => setConfirmingPayment(true), 0)}
      >
        <Wallet className="size-4" aria-hidden />
        Payment received
      </DropdownMenuItem>
    </>
  ) : null;

  return (
    <>
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
        extraItems={lessonItems}
      />

      <AlertDialog open={confirmingPayment} onOpenChange={setConfirmingPayment}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment received?</AlertDialogTitle>
            <AlertDialogDescription>
              {`${data.name}'s counter goes back to 0 and a new package of ${LESSONS_PER_PACKAGE} lessons starts. Past lessons are kept.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={(event) => {
                event.preventDefault();
                handlePayment();
              }}
            >
              {pending && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {pending ? 'Saving' : 'Confirm payment'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
