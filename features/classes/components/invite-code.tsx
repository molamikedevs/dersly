'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    <div className="flex h-11 items-stretch overflow-hidden rounded-xl border border-border bg-muted">
      <span className="invite-code flex items-center px-3.5 text-sm font-semibold text-foreground">
        {code}
      </span>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy invite code ${code}`}
        className="flex w-11 items-center justify-center border-l border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {copied ? (
          <Check className="size-4 text-success" aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
      </button>

      <span className="sr-only" aria-live="polite">
        {copied ? 'Invite code copied' : ''}
      </span>
    </div>
  );
}
