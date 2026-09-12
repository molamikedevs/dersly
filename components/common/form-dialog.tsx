'use client';

import { Plus } from 'lucide-react';
import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
} from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
      <DialogTrigger>
        <Button variant={triggerVariant} size={triggerSize} className="h-11">
          {triggerIcon ?? <Plus className="size-4" aria-hidden />}
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`flex max-h-[85svh] flex-col gap-0 p-0 ${contentClassName}`}
      >
        <DialogHeader className="shrink-0 space-y-1 px-5 pb-4 pt-5 text-left sm:px-6 sm:pt-6">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
          {form}
        </div>
      </DialogContent>
    </Dialog>
  );
}
