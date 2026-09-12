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
        <Button variant={triggerVariant} size={triggerSize}>
          {triggerIcon ?? <Plus className="size-4" aria-hidden />}
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`max-h-[85svh] overflow-y-auto ${contentClassName}`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {form}
      </DialogContent>
    </Dialog>
  );
}
