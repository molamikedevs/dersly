'use client';

import { Plus } from 'lucide-react';
import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
} from 'react';

import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Props = {
  triggerLabel: string;
  title: string;
  description?: string;
  children: ReactElement<{ onSuccess?: () => void }>;
  triggerIcon?: React.ReactNode;
  triggerVariant?: 'default' | 'outline' | 'ghost';
  triggerSize?: 'default' | 'sm' | 'lg';
  contentClassName?: string;
};

export default function FormDialog({
  triggerLabel,
  title,
  description,
  children,
  triggerIcon,
  triggerVariant = 'default',
  triggerSize = 'default',
  contentClassName = 'sm:max-w-lg',
}: Props) {
  const [open, setOpen] = useState(false);

  const form = isValidElement(children)
    ? cloneElement(children, { onSuccess: () => setOpen(false) })
    : children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: triggerVariant, size: triggerSize }),
          'h-11 gap-2 rounded-xl px-5 text-[15px] font-semibold',
        )}
      >
        {triggerIcon ?? <Plus className="size-4" aria-hidden />}
        {triggerLabel}
      </DialogTrigger>

      <DialogContent
        className={cn(
          'flex max-h-[90svh] flex-col gap-0 overflow-hidden rounded-2xl p-0',
          contentClassName,
        )}
      >
        <DialogHeader className="shrink-0 gap-1.5 px-6 pb-4 pt-6 text-left sm:px-8 sm:pt-7">
          <DialogTitle className="font-serif text-2xl font-medium tracking-tight">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-[15px] text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 [scrollbar-gutter:stable_both-edges] [scrollbar-width:thin] sm:px-7 sm:pb-7">
          {form}
        </div>
      </DialogContent>
    </Dialog>
  );
}
