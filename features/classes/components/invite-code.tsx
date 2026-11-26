'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const ICON =
  'col-start-1 row-start-1 size-3.5 transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]';
const ICON_HIDDEN = 'scale-50 opacity-0 blur-[2px]';

export default function InviteCode({ code }: { code: string }) {
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
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy invite code ${code}`}
      className="inline-flex h-8 w-fit shrink-0 touch-manipulation items-center gap-2 rounded-lg border border-border-subtle bg-secondary/80 pr-2.5 pl-3 text-muted-foreground transition-[scale,background-color,border-color] duration-150 ease-out select-none hover:border-input-border hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
    >
      <span className="invite-code text-xs font-semibold tracking-wider text-foreground">
        {code}
      </span>

      <span aria-hidden className="grid size-3.5 place-items-center">
        <Copy className={cn(ICON, copied && ICON_HIDDEN)} />
        <Check className={cn(ICON, 'text-primary', !copied && ICON_HIDDEN)} />
      </span>

      <span className="sr-only" aria-live="polite">
        {copied ? 'Invite code copied' : ''}
      </span>
    </button>
  );
}
