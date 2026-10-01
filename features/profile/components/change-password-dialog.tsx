'use client';

import { KeyRound } from 'lucide-react';
import { useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ChangePasswordForm from '@/features/profile/components/change-password-form';
import { cn } from '@/lib/utils';

export default function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'h-11 gap-2 rounded-xl px-5 text-[15px] font-semibold',
        )}
      >
        <KeyRound className="size-4" aria-hidden />
        Change
      </DialogTrigger>

      <DialogContent className="flex max-h-[90svh] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 px-6 pb-4 pt-6 text-left sm:px-8 sm:pt-7">
          <DialogTitle className="font-serif text-2xl font-medium tracking-tight">
            Change password
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 sm:px-7 sm:pb-7">
          {open && <ChangePasswordForm onSuccess={() => setOpen(false)} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
