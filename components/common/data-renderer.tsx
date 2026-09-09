import { AlertCircle, Inbox, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { DEFAULT_ERROR } from '@/constants/states';

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
    title: string;
    message: string;
    icon?: LucideIcon;
    button?: StateAction;
  };
  render: (data: T[]) => ReactNode;
}

interface StateSkeletonProps {
  icon: LucideIcon;
  title: string;
  message: string;
  tone?: 'muted' | 'destructive';
  button?: StateAction;
}

const StateSkeleton = ({
  icon: Icon,
  title,
  message,
  tone = 'muted',
  button,
}: StateSkeletonProps) => (
  <div className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 text-center">
    <span
      className={
        tone === 'destructive' ? 'text-destructive' : 'text-muted-foreground'
      }
      aria-hidden
    >
      <Icon className="size-10" strokeWidth={1.5} />
    </span>

    <h2 className="mt-5 text-lg font-semibold text-foreground">{title}</h2>
    <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>

    {button && (
      <Button className="mt-6 h-11">
        <Link href={button.href}>{button.text}</Link>
      </Button>
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
        button={empty.button}
      />
    );
  }

  return <>{render(data)}</>;
}
