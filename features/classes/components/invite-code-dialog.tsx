'use client';

import { Check, Copy } from 'lucide-react';
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
      <DialogTrigger>
        <button
          type="button"
          className="rounded-md px-1.5 py-0.5 font-mono tracking-widest transition-colors hover:bg-muted hover:text-foreground"
        >
          {code}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Invite code</DialogTitle>
          <DialogDescription>
            {enrollmentOpen
              ? 'Students enter this code to join.'
              : 'Enrolment is closed. This code will not work.'}
          </DialogDescription>
        </DialogHeader>

        <p
          className={`py-6 text-center font-mono text-4xl tracking-[0.3em] ${
            enrollmentOpen ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {code}
        </p>

        <Button onClick={handleCopy} className="h-11 w-full">
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? 'Copied' : 'Copy code'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
