'use client';

import { RotateCw } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Something went wrong
      </h1>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page could not load. Try again, and tell your teacher if it keeps
        happening.
      </p>

      {error.digest && (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          {error.digest}
        </p>
      )}

      <Button onClick={reset} className="mt-8 h-11">
        <RotateCw className="size-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}
