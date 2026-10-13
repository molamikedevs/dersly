'use client';

import { Copy, Loader2, RotateCcw, Wallet } from 'lucide-react';
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
import { useDerslyActions } from '@/features/app/actions-context';
import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import AddClassForm from './add-class-form';

export default function ClassMenu({
  data,
}: {
  data: ClassWithCount | PrivateClass;
}) {
  // The real actions in the app, local ones in the demo
  const { archiveClass, resetPackage, undoLesson } = useDerslyActions();
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [pending, setPending] = useState(false);

  const enrollmentId = 'enrollmentId' in data ? data.enrollmentId : null;
  const lessonsDone = 'lessonsDone' in data ? data.lessonsDone : 0;

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(data.inviteCode);
      toast.add({ title: 'Invite code copied', description: data.inviteCode });
    } catch {
      toast.add({
        title: 'Could not copy the code',
        description: `Type it by hand: ${data.inviteCode}`,
      });
    }
  }

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

  const extraItems = (
    <>
      {data.enrollmentOpen && (
        <DropdownMenuItem onClick={() => handleCopyCode()}>
          <Copy className="size-4" aria-hidden />
          Copy invite code
        </DropdownMenuItem>
      )}

      {enrollmentId && (
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
      )}
    </>
  );

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
        extraItems={extraItems}
      />

      <AlertDialog open={confirmingPayment} onOpenChange={setConfirmingPayment}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment received?</AlertDialogTitle>
            <AlertDialogDescription className="break-words">
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
