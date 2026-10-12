'use client';

import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PASSWORD_RULES } from '@/lib/validation/auth.schema';

type Props = {
  id: string;
  value: string;
};

// The rules are on screen before anything is typed, and each one ticks as it
// is met, so nobody has to fail once to learn what a password needs.
export default function PasswordRules({ id, value }: Props) {
  return (
    <ul
      id={id}
      aria-label="Your password needs"
      className="flex flex-wrap gap-x-5 gap-y-2 text-sm"
    >
      {PASSWORD_RULES.map(({ label, test }) => {
        const met = test(value);

        return (
          <li
            key={label}
            className={cn(
              'inline-flex items-center gap-2 transition-colors duration-150 ease-out',
              met ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ease-out',
                met
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input-border',
              )}
            >
              {met && <Check className="size-3" strokeWidth={3} />}
            </span>
            {label}
            <span className="sr-only">{met ? ', done' : ', not yet'}</span>
          </li>
        );
      })}
    </ul>
  );
}
