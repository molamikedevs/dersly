'use client';

import { signOut } from '@/features/auth/actions';
import { cn } from '@/lib/utils';
import { Loader2, LogOut } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton({ collapsed }: { collapsed?: boolean }) {
  const { pending } = useFormStatus();

  const Icon = pending ? Loader2 : LogOut;

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={collapsed ? 'Sign out' : undefined}
      className={cn(
        'group inline-flex shrink-0 select-none items-center rounded-lg',
        'bg-transparent text-sm font-medium text-foreground',
        'transition-colors hover:bg-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-60',
        collapsed ? 'size-11 justify-center' : 'h-11 gap-2.5 px-2.5',
      )}
    >
      <Icon
        className={cn(
          'size-4 shrink-0 text-muted-foreground transition-transform',
          pending ? 'animate-spin' : 'group-hover:translate-x-0.5',
        )}
        aria-hidden
      />
      <span className={cn('truncate', collapsed && 'sr-only')}>
        {pending ? 'Signing out' : 'Sign out'}
      </span>
    </button>
  );
}

export default function SignOutButton({
  collapsed,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <form action={signOut} className={className}>
      <SubmitButton collapsed={collapsed} />
    </form>
  );
}
