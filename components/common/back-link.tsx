'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
      <Link href={href} className={cn(styles, className)}>
        <ArrowLeft className={icon} aria-hidden />
        {label}
      </Link>
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
