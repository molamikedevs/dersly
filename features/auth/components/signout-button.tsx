'use client';

import { Button } from '@/components/ui/button';
import { signOut } from '@/features/auth/actions';
import { cn } from '@/lib/utils';
import { Loader2, LogOut } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton({ collapsed }: { collapsed?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      disabled={pending}
      aria-label={collapsed ? 'Sign out' : undefined}
      className={cn(
        'tap-row w-full gap-2 px-3 text-sm font-medium',
        'text-muted-foreground hover:text-foreground',
        collapsed ? 'justify-center px-0' : 'justify-start',
      )}
    >
      {pending ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <LogOut className="size-4 shrink-0" aria-hidden />
      )}
      <span className={cn('truncate', collapsed && 'sr-only')}>
        {pending ? 'Signing out' : 'Sign out'}
      </span>
    </Button>
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
