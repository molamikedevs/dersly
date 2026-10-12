import { AlertCircle, Info } from 'lucide-react';

import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  tone?: 'error' | 'info';
  className?: string;
};

// A message about the whole form, not one field: wrong email or password,
// no connection, an expired link. It sits right above the button, so it is
// read before the next try, and screen readers announce it when it appears.
export default function FormAlert({
  children,
  tone = 'error',
  className,
}: Props) {
  const Icon = tone === 'error' ? AlertCircle : Info;

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 rounded-xl px-4 py-3 text-[15px] leading-snug',
        tone === 'error'
          ? 'bg-destructive-subtle text-destructive-subtle-foreground'
          : 'bg-muted text-foreground',
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="min-w-0 wrap-break-word">{children}</p>
    </div>
  );
}
