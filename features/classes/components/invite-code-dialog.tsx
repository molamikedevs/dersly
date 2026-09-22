'use client';

import { Check, Copy, Maximize2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
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
  code: string;
  enrollmentOpen: boolean;
};

export default function InviteCodeDialog({ code, enrollmentOpen }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        aria-label={`Show invite code ${code}`}
        className="group inline-flex h-11 items-center gap-3 rounded-xl border border-border bg-muted px-4 transition-colors hover:border-input-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="invite-code text-base font-semibold text-foreground">
          {code}
        </span>
        <Maximize2
          className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground"
          aria-hidden
        />
      </DialogTrigger>

      <DialogContent className="rounded-2xl p-6 sm:max-w-sm sm:p-8">
        <DialogHeader className="text-left">
          <DialogTitle className="font-serif text-2xl font-medium tracking-tight">
            Invite code
          </DialogTitle>
          <DialogDescription className="text-[15px]">
            {enrollmentOpen
              ? 'Students enter this code to join.'
              : 'Enrolment is closed. This code will not work.'}
          </DialogDescription>
        </DialogHeader>

        <p
          className={cn(
            'invite-code my-2 rounded-xl bg-muted py-8 text-center text-4xl font-semibold tracking-[0.3em]',
            enrollmentOpen ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {code}
        </p>

        <Button
          onClick={handleCopy}
          className="h-12 w-full gap-2 rounded-xl text-[15px] font-semibold"
        >
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? 'Copied' : 'Copy code'}
        </Button>

        <span className="sr-only" aria-live="polite">
          {copied ? 'Invite code copied' : ''}
        </span>
      </DialogContent>
    </Dialog>
  );
}
