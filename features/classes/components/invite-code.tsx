'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 200);
    return clearTimeout(timer);
  }, [copied]);

  function handleCopy() {
    try {
      navigator.clipboard.writeText(code);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-stretch overflow-hidden rounded-md border bg-muted">
      <span className="px-3 py-2 font-mono text-sm tracking-widest">
        {code}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Code copied' : `Copy invite code ${code}`}
        className="border-l px-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {copied ? (
          <Check className="size-4 text-success" aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
