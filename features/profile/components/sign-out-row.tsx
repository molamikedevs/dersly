'use client';

import { Loader2, LogOut } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { signOut } from '@/features/auth/actions';

function Submit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-14 w-full touch-manipulation items-center justify-between gap-4 rounded-b-2xl px-5 py-4 text-left text-base font-semibold text-foreground transition-colors select-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset disabled:cursor-default disabled:text-muted-foreground"
    >
      {pending ? 'Signing out' : 'Sign out'}
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <LogOut className="size-4 text-muted-foreground" aria-hidden />
      )}
    </button>
  );
}

// A row in the settings list, so signing out sits with the other account
// actions instead of floating under them
export default function SignOutRow() {
  return (
    <form action={signOut}>
      <Submit />
    </form>
  );
}
