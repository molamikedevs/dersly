'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AppLink } from '@/features/app/app-mode';
import { cn } from '@/lib/utils';

type Props = {
  href?: string;
  label?: string;
  className?: string;
};

const styles =
  'group tap-row inline-flex items-center gap-2 rounded-md px-2 -ml-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground';

const icon =
  'size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5';

export default function BackLink({ href, label = 'Back', className }: Props) {
  const router = useRouter();

  if (href) {
    return (
      <AppLink href={href} className={cn(styles, className)}>
        <ArrowLeft className={icon} aria-hidden />
        {label}
      </AppLink>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(styles, className)}
    >
      <ArrowLeft className={icon} aria-hidden />
      {label}
    </button>
  );
}
