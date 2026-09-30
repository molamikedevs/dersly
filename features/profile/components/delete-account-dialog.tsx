'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { deleteAccount } from '@/features/auth/actions';

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [isPending, startTransition] = useTransition();

  const value = confirm.trim().toLowerCase();
  const canDelete = value === 'delete';

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setConfirm('');
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccount({ confirm: value });

      if (result?.error) {
        toast.add({
          title: 'Could not delete account',
          description: result.error,
        });
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={() => setOpen(true)}
        className="h-11 gap-2 rounded-xl px-4 text-sm font-semibold"
      >
        <Trash2 className="size-4" aria-hidden />
        Delete account
      </Button>

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              Your profile, class enrolment, lesson history and level test
              results will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirm-delete"
              className="text-sm font-medium text-foreground"
            >
              Type <span className="font-semibold">delete</span> to confirm
            </label>
            <Input
              id="confirm-delete"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              autoComplete="off"
              autoCapitalize="none"
              className="h-11 rounded-xl text-[15px]"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!canDelete || isPending}
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
            >
              {isPending && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {isPending ? 'Deleting' : 'Delete account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
