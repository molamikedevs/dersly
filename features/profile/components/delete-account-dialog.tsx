'use client';

import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deleteAccount } from '@/features/auth/actions';
import FormAlert from '@/features/auth/components/form-alert';

const CONFIRM_WORD = 'delete';

// Said plainly, so nobody is surprised by what goes
const REMOVED = [
  'Your profile and photo',
  'Your place in your classes and your lesson history',
  'Your level test results',
];

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const typed = confirm.trim().toLowerCase();
  const canDelete = typed === CONFIRM_WORD;

  function handleOpenChange(next: boolean) {
    // Stay open while the account is being deleted
    if (isPending) return;
    setOpen(next);
    if (!next) {
      setConfirm('');
      setError(null);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canDelete || isPending) return;

    setError(null);
    startTransition(async () => {
      // On success the action signs out and moves to the login page
      const result = await deleteAccount({ confirm: typed });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-11 touch-manipulation rounded-xl border-destructive/40 px-5 text-[15px] font-semibold text-destructive select-none hover:bg-destructive/10 hover:text-destructive active:scale-[0.97]"
      >
        Delete account
      </Button>

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="gap-5 rounded-2xl p-6 sm:max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <AlertDialogHeader className="gap-2 text-left">
              <AlertDialogTitle className="font-serif text-2xl font-medium tracking-tight">
                Delete your account?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[15px] leading-relaxed">
                This removes you from Dersly for good. It cannot be undone, and
                your teacher cannot bring it back.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                What is deleted
              </p>
              <ul className="flex flex-col gap-1.5 text-[15px] leading-snug text-foreground">
                {REMOVED.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirm-delete"
                className="text-sm font-medium text-foreground"
              >
                To confirm, type{' '}
                <span className="font-mono font-semibold">{CONFIRM_WORD}</span>
              </label>
              <Input
                id="confirm-delete"
                value={confirm}
                onChange={(event) => {
                  setConfirm(event.target.value);
                  setError(null);
                }}
                autoFocus
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="done"
                // readOnly, not disabled, so focus stays here if it fails
                readOnly={isPending}
                aria-describedby={error ? 'delete-error' : undefined}
                className="h-12 rounded-xl text-base md:text-base"
              />
            </div>

            {error && (
              <div id="delete-error">
                <FormAlert>{error}</FormAlert>
              </div>
            )}

            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel
                disabled={isPending}
                className="h-12 rounded-xl px-5 text-base font-semibold"
              >
                Keep my account
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={!canDelete || isPending}
                className="h-12 touch-manipulation rounded-xl bg-destructive px-5 text-base font-semibold text-white select-none hover:bg-destructive/90 active:scale-[0.97]"
              >
                {isPending && (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                )}
                {isPending ? 'Deleting' : 'Delete for good'}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
