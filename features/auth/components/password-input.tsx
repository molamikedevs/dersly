'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * Wraps Input so every prop react-hook-form's Controller spreads (value,
 * onChange, onBlur, name, ref) passes straight through untouched. `type` is
 * owned by this component, so it is deliberately not accepted.
 */
type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>;

export default function PasswordInput({
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('pr-12', className)}
      />

      {/* Reachable by keyboard, so everyone can check what they typed.
          Pressing it with a mouse or finger keeps the cursor in the field. */}
      <button
        type="button"
        onPointerDown={(event) => event.preventDefault()}
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-controls={props.id}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex w-12 touch-manipulation items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
