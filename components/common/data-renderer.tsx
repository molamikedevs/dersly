import { AlertCircle, Inbox, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { DEFAULT_ERROR } from '@/constants/states';
import { AppLink } from '@/features/app/app-mode';
import { cn } from '@/lib/utils';

type StateAction = {
  text: string;
  href: string;
};

interface Props<T> {
  success: boolean;
  error?: {
    message?: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty: {
    icon?: LucideIcon;
    title: string;
    message: string;
    button?: StateAction;
    action?: ReactNode;
  };
  render: (data: T[]) => ReactNode;
}

interface StateSkeletonProps {
  icon: LucideIcon;
  title: string;
  message: string;
  tone?: 'muted' | 'destructive';
  button?: StateAction;
  action?: ReactNode;
}

const StateSkeleton = ({
  icon: Icon,
  title,
  message,
  tone = 'muted',
  button,
  action,
}: StateSkeletonProps) => (
  <div className="surface-card flex w-full flex-col items-center justify-center rounded-2xl border-dashed border-border px-6 py-16 text-center">
    <span
      className={cn(
        'flex size-12 items-center justify-center rounded-2xl border',
        tone === 'destructive'
          ? 'border-destructive/25 bg-destructive-subtle text-destructive'
          : 'border-border-subtle bg-secondary text-muted-foreground',
      )}
      aria-hidden
    >
      <Icon className="size-6" strokeWidth={1.75} />
    </span>

    <h2 className="mt-5 text-lg font-semibold text-foreground">{title}</h2>
    <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
      {message}
    </p>
    {action}
    {button && !action && (
      <AppLink
        href={button.href}
        className={cn(buttonVariants(), 'mt-6 h-11 rounded-xl px-5')}
      >
        {button.text}
      </AppLink>
    )}
  </div>
);

export default function DataRenderer<T>({
  success,
  error,
  data,
  empty,
  render,
}: Props<T>) {
  if (!success) {
    return (
      <StateSkeleton
        icon={AlertCircle}
        tone="destructive"
        title={DEFAULT_ERROR.title}
        message={error?.message || DEFAULT_ERROR.message}
        button={empty.button ?? DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <StateSkeleton
        icon={empty.icon ?? Inbox}
        title={empty.title}
        message={empty.message}
        button={empty.action ? undefined : empty.button}
        action={empty.action}
      />
    );
  }

  return <>{render(data)}</>;
}
